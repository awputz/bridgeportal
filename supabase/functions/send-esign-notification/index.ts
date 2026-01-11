import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  documentId: string;
  recipientId: string;
  type: "signing_request" | "reminder" | "completed" | "voided";
}

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card { background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .logo { text-align: center; margin-bottom: 32px; }
  .logo img { height: 48px; }
  h1 { color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; }
  p { color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; }
  .btn { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; }
  .btn-container { text-align: center; margin: 32px 0; }
  .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
  .footer p { font-size: 14px; color: #94a3b8; }
  .highlight { color: #1e293b; font-weight: 500; }
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, recipientId, type }: NotificationRequest = await req.json();

    if (!documentId || !recipientId || !type) {
      throw new Error("Missing required fields: documentId, recipientId, type");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch document with creator profile
    const { data: document, error: docError } = await supabase
      .from("esign_documents")
      .select("id, title, created_by, profiles!created_by(full_name, email)")
      .eq("id", documentId)
      .single();

    if (docError || !document) {
      console.error("Document fetch error:", docError);
      throw new Error("Document not found");
    }

    // Fetch recipient
    const { data: recipient, error: recipientError } = await supabase
      .from("esign_recipients")
      .select("*")
      .eq("id", recipientId)
      .single();

    if (recipientError || !recipient) {
      console.error("Recipient fetch error:", recipientError);
      throw new Error("Recipient not found");
    }

    const siteUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://bridgenyre.com";
    const signingUrl = `${siteUrl}/sign/${documentId}?token=${recipient.access_token}`;
    const senderProfile = document.profiles as { full_name?: string; email?: string } | null;
    const senderName = senderProfile?.full_name || "Someone at Bridge";

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "signing_request":
        subject = `${senderName} has sent you "${document.title}" to sign`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head><style>${emailStyles}</style></head>
          <body>
            <div class="container">
              <div class="card">
                <h1>You have a document to sign</h1>
                <p>Hi <span class="highlight">${recipient.name}</span>,</p>
                <p><span class="highlight">${senderName}</span> has sent you "<span class="highlight">${document.title}</span>" for your signature.</p>
                <div class="btn-container">
                  <a href="${signingUrl}" class="btn">Review & Sign Document</a>
                </div>
                <div class="footer">
                  <p>This link expires in 30 days. If you have questions, please contact ${senderName}.</p>
                  <p>Powered by Bridge eSign</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case "reminder":
        subject = `Reminder: Please sign "${document.title}"`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head><style>${emailStyles}</style></head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Reminder: Document awaiting your signature</h1>
                <p>Hi <span class="highlight">${recipient.name}</span>,</p>
                <p>This is a friendly reminder that "<span class="highlight">${document.title}</span>" is still waiting for your signature.</p>
                <div class="btn-container">
                  <a href="${signingUrl}" class="btn">Sign Now</a>
                </div>
                <div class="footer">
                  <p>Powered by Bridge eSign</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case "completed":
        subject = `"${document.title}" has been completed`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head><style>${emailStyles}</style></head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Document Completed ✓</h1>
                <p>Hi <span class="highlight">${recipient.name}</span>,</p>
                <p>All parties have signed "<span class="highlight">${document.title}</span>". A copy has been sent to all participants.</p>
                <div class="footer">
                  <p>Powered by Bridge eSign</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case "voided":
        subject = `"${document.title}" has been voided`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head><style>${emailStyles}</style></head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Document Voided</h1>
                <p>Hi <span class="highlight">${recipient.name}</span>,</p>
                <p>"<span class="highlight">${document.title}</span>" has been voided by the sender and no longer requires your signature.</p>
                <div class="footer">
                  <p>Powered by Bridge eSign</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Bridge eSign <esign@resend.dev>",
      to: [recipient.email],
      subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Update recipient sent_at if signing request
    if (type === "signing_request" && recipient.status === "pending") {
      await supabase
        .from("esign_recipients")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", recipientId);
    }

    // Audit log
    await supabase.from("esign_audit_log").insert({
      document_id: documentId,
      recipient_id: recipientId,
      action: `email_${type}_sent`,
      action_details: { email: recipient.email, type },
    });

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-esign-notification:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
