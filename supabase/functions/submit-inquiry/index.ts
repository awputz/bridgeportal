import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { createLogger } from "../_shared/logger.ts";
import { getCorrelationId, createResponseHeaders, getIpAddress } from "../_shared/context.ts";
import { checkRateLimit, getRateLimitConfig, getRateLimitIdentifier, rateLimitExceededResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-correlation-id",
};

// Input validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const isValidPhone = (phone: string | undefined): boolean => {
  if (!phone) return true;
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10 && phone.length <= 20;
};

const containsSpamPatterns = (text: string): boolean => {
  const spamPatterns = [
    /viagra|cialis|pharmacy/i,
    /crypto|bitcoin|forex/i,
    /click here|buy now/i,
    /(http|https):\/\/[^\s]+\.(ru|xyz|top)/i,
    /\$\$\$|💰|💵/,
  ];
  return spamPatterns.some(pattern => pattern.test(text));
};

const sanitizeInput = (input: string, maxLength: number): string => {
  return input.trim().slice(0, maxLength);
};

serve(async (req) => {
  const correlationId = getCorrelationId(req);
  const logger = createLogger('submit-inquiry', correlationId);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const endpoint = 'submit-inquiry';
  const identifier = getRateLimitIdentifier(req);

  try {
    logger.requestStart(req.method, '/submit-inquiry');

    // Check rate limit (database-backed)
    const rateLimitResult = await checkRateLimit(identifier, endpoint);
    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { identifier, endpoint });
      return rateLimitExceededResponse(rateLimitResult, getRateLimitConfig(endpoint), correlationId);
    }

    const inquiryData = await req.json();
    const { name, email, phone, notes, user_type } = inquiryData;

    // Validate required fields
    if (!name || !email) {
      logger.warn("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: createResponseHeaders(correlationId) }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      logger.warn(`Invalid email format: ${email}`);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: createResponseHeaders(correlationId) }
      );
    }

    // Validate phone if provided
    if (!isValidPhone(phone)) {
      logger.warn(`Invalid phone format: ${phone}`);
      return new Response(
        JSON.stringify({ error: "Invalid phone number format" }),
        { status: 400, headers: createResponseHeaders(correlationId) }
      );
    }

    // Check for spam patterns
    const textToCheck = `${name} ${email} ${notes || ''}`;
    if (containsSpamPatterns(textToCheck)) {
      logger.warn(`Spam pattern detected`, { email });
      return new Response(
        JSON.stringify({ error: "Invalid submission detected" }),
        { status: 400, headers: createResponseHeaders(correlationId) }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      ...inquiryData,
      name: sanitizeInput(name, 100),
      email: sanitizeInput(email, 255),
      phone: phone ? sanitizeInput(phone, 20) : null,
      notes: notes ? sanitizeInput(notes, 2000) : null,
      user_type: user_type ? sanitizeInput(user_type, 50) : null,
      property_address: inquiryData.property_address ? sanitizeInput(inquiryData.property_address, 500) : null,
      neighborhoods: inquiryData.neighborhoods ? sanitizeInput(inquiryData.neighborhoods, 500) : null,
      requirements: inquiryData.requirements ? sanitizeInput(inquiryData.requirements, 1000) : null,
      budget: inquiryData.budget ? sanitizeInput(inquiryData.budget, 100) : null,
      timeline: inquiryData.timeline ? sanitizeInput(inquiryData.timeline, 100) : null,
      timing: inquiryData.timing ? sanitizeInput(inquiryData.timing, 100) : null,
      assignment_type: inquiryData.assignment_type ? sanitizeInput(inquiryData.assignment_type, 100) : null,
      unit_count: inquiryData.unit_count ? sanitizeInput(inquiryData.unit_count, 50) : null,
    };

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    logger.info("Submitting validated inquiry", { email, inquiryType: inquiryData.inquiry_type });

    // Insert inquiry into database
    const { data, error } = await supabase
      .from("inquiries")
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      logger.error("Database error", new Error(error.message));
      throw error;
    }

    logger.info("Inquiry submitted successfully", { inquiryId: data.id });

    // Send notification email (non-blocking)
    supabase.functions.invoke('send-notification', {
      body: {
        type: 'new_inquiry',
        data: { ...data }
      }
    }).catch(err => logger.warn('Failed to send notification', { error: err }));

    // Log activity with correlation ID (non-blocking)
    supabase.functions.invoke('log-activity', {
      body: {
        action: 'inquiry_submitted',
        entity_type: 'inquiries',
        entity_id: data.id,
        details: { 
          inquiry_type: data.inquiry_type || 'general',
          source: 'website',
          correlation_id: correlationId,
        }
      }
    }).catch(err => logger.warn('Failed to log activity', { error: err }));

    logger.requestEnd(req.method, '/submit-inquiry', 200, { inquiryId: data.id });

    return new Response(
      JSON.stringify({ success: true, inquiryId: data.id, correlationId }),
      { 
        headers: { 
          ...createResponseHeaders(correlationId),
          ...rateLimitHeaders(rateLimitResult, getRateLimitConfig(endpoint)),
        } 
      }
    );
  } catch (error) {
    logger.error("Submit inquiry error", error instanceof Error ? error : new Error(String(error)));
    return new Response(
      JSON.stringify({ error: "Failed to submit inquiry. Please try again." }),
      { status: 500, headers: createResponseHeaders(correlationId) }
    );
  }
});
