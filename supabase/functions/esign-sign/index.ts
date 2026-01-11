/**
 * eSign Document Signing Edge Function
 * Handles secure document signing for external recipients via access token
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorrelationId, getIpAddress, createCorsHeaders, createResponseHeaders } from "../_shared/context.ts";
import { createSuccessResponse, createErrorResponse, HttpErrors } from "../_shared/secureResponse.ts";
import { parseAndValidate, ValidationError, validationErrorResponse } from "../_shared/validation.ts";

// Request schema
const signRequestSchema = z.object({
  documentId: z.string().uuid("Invalid document ID"),
  token: z.string().min(1, "Token is required"),
  fieldValues: z.record(z.string(), z.string()).optional(),
});

// Response for fetching document (GET)
const fetchRequestSchema = z.object({
  documentId: z.string().uuid("Invalid document ID"),
  token: z.string().min(1, "Token is required"),
});

Deno.serve(async (req: Request) => {
  const correlationId = getCorrelationId(req);
  const headers = createResponseHeaders(correlationId);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: createCorsHeaders(correlationId) });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const ipAddress = getIpAddress(req);
    const userAgent = req.headers.get("user-agent") || undefined;

    // GET - Fetch document for signing
    if (req.method === "GET") {
      const documentId = url.searchParams.get("documentId");
      const token = url.searchParams.get("token");

      if (!documentId || !token) {
        return HttpErrors.badRequest(correlationId, "Missing documentId or token");
      }

      // Validate recipient by token
      const { data: recipient, error: recipientError } = await supabase
        .from("esign_recipients")
        .select("*")
        .eq("document_id", documentId)
        .eq("access_token", token)
        .single();

      if (recipientError || !recipient) {
        return HttpErrors.unauthorized(correlationId, "Invalid or expired signing link");
      }

      // Check token expiration
      if (new Date(recipient.token_expires_at) < new Date()) {
        return createErrorResponse("This signing link has expired", correlationId, 410, undefined);
      }

      // Fetch document
      const { data: document, error: docError } = await supabase
        .from("esign_documents")
        .select("id, title, description, status, original_file_url, total_signers, signed_count")
        .eq("id", documentId)
        .single();

      if (docError || !document) {
        return HttpErrors.notFound(correlationId, "Document not found");
      }

      // Check document status
      if (document.status === "voided") {
        return createErrorResponse("This document has been voided", correlationId, 410, undefined);
      }

      if (document.status === "completed") {
        return createSuccessResponse({
          document,
          recipient: { ...recipient, access_token: undefined },
          fields: [],
          isComplete: true,
        }, correlationId);
      }

      // Get signed URL for the document
      const filePath = document.original_file_url.replace(/^.*\/esign-documents\//, "");
      const { data: signedUrlData } = await supabase.storage
        .from("esign-documents")
        .createSignedUrl(filePath, 3600); // 1 hour

      // Fetch fields for this recipient
      const { data: fields } = await supabase
        .from("esign_fields")
        .select("*")
        .eq("document_id", documentId)
        .eq("recipient_id", recipient.id);

      // Mark as viewed if not already
      if (recipient.status === "pending" || recipient.status === "sent") {
        await supabase
          .from("esign_recipients")
          .update({ 
            status: "viewed", 
            viewed_at: new Date().toISOString() 
          })
          .eq("id", recipient.id);

        // Audit log
        await supabase.from("esign_audit_log").insert({
          document_id: documentId,
          recipient_id: recipient.id,
          action: "document_viewed",
          actor_email: recipient.email,
          actor_name: recipient.name,
          ip_address: ipAddress,
          user_agent: userAgent,
        });
      }

      return createSuccessResponse({
        document: {
          ...document,
          signedFileUrl: signedUrlData?.signedUrl || document.original_file_url,
        },
        recipient: {
          id: recipient.id,
          name: recipient.name,
          email: recipient.email,
          status: recipient.status === "pending" || recipient.status === "sent" ? "viewed" : recipient.status,
        },
        fields: fields || [],
        isComplete: recipient.status === "signed",
      }, correlationId);
    }

    // POST - Submit signature
    if (req.method === "POST") {
      const body = await parseAndValidate(req, signRequestSchema);
      const { documentId, token, fieldValues } = body;

      // Validate recipient
      const { data: recipient, error: recipientError } = await supabase
        .from("esign_recipients")
        .select("*")
        .eq("document_id", documentId)
        .eq("access_token", token)
        .single();

      if (recipientError || !recipient) {
        return HttpErrors.unauthorized(correlationId, "Invalid signing link");
      }

      // Check token expiration
      if (new Date(recipient.token_expires_at) < new Date()) {
        return createErrorResponse("This signing link has expired", correlationId, 410, undefined);
      }

      // Check if already signed
      if (recipient.status === "signed") {
        return createErrorResponse("You have already signed this document", correlationId, 409, undefined);
      }

      if (recipient.status === "declined") {
        return createErrorResponse("You have declined to sign this document", correlationId, 409, undefined);
      }

      // Fetch document
      const { data: document, error: docError } = await supabase
        .from("esign_documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (docError || !document) {
        return HttpErrors.notFound(correlationId, "Document not found");
      }

      if (document.status === "voided") {
        return createErrorResponse("This document has been voided", correlationId, 410, undefined);
      }

      // Get recipient's fields
      const { data: fields } = await supabase
        .from("esign_fields")
        .select("*")
        .eq("document_id", documentId)
        .eq("recipient_id", recipient.id);

      // Validate required fields
      const requiredFields = (fields || []).filter((f: { required: boolean }) => f.required);
      const missingFields = requiredFields.filter(
        (f: { id: string }) => !fieldValues || !fieldValues[f.id]
      );

      if (missingFields.length > 0) {
        return HttpErrors.badRequest(correlationId, `Missing ${missingFields.length} required field(s)`);
      }

      // Update all field values
      if (fieldValues && fields) {
        for (const field of fields) {
          if (fieldValues[field.id]) {
            await supabase
              .from("esign_fields")
              .update({
                value: fieldValues[field.id],
                filled_at: new Date().toISOString(),
              })
              .eq("id", field.id);
          }
        }
      }

      // Update recipient status
      await supabase
        .from("esign_recipients")
        .update({
          status: "signed",
          signed_at: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
        })
        .eq("id", recipient.id);

      // Update document signed count and status
      const newSignedCount = document.signed_count + 1;
      const isComplete = newSignedCount >= document.total_signers;

      await supabase
        .from("esign_documents")
        .update({
          signed_count: newSignedCount,
          status: isComplete ? "completed" : "in_progress",
          completed_at: isComplete ? new Date().toISOString() : null,
        })
        .eq("id", documentId);

      // Audit log
      await supabase.from("esign_audit_log").insert({
        document_id: documentId,
        recipient_id: recipient.id,
        action: "document_signed",
        action_details: {
          fields_signed: fields?.length || 0,
          is_complete: isComplete,
        },
        actor_email: recipient.email,
        actor_name: recipient.name,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

      return createSuccessResponse({
        success: true,
        message: "Document signed successfully",
        isComplete,
        signedCount: newSignedCount,
        totalSigners: document.total_signers,
      }, correlationId);
    }

    return HttpErrors.methodNotAllowed(correlationId);

  } catch (error) {
    console.error("Error in esign-sign:", error);

    if (error instanceof ValidationError) {
      return validationErrorResponse(error, correlationId, headers);
    }

    return createErrorResponse(
      "An unexpected error occurred",
      correlationId,
      500,
      undefined
    );
  }
});
