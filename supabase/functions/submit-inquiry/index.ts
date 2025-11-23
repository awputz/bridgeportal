import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting cache (in-memory, resets on function restart)
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 3;

// Input validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const isValidPhone = (phone: string | undefined): boolean => {
  if (!phone) return true; // Phone is optional
  // Allow various formats: (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10 && phone.length <= 20;
};

const containsSpamPatterns = (text: string): boolean => {
  const spamPatterns = [
    /viagra|cialis|pharmacy/i,
    /crypto|bitcoin|forex/i,
    /click here|buy now/i,
    /(http|https):\/\/[^\s]+\.(ru|xyz|top)/i, // Suspicious TLDs
    /\$\$\$|💰|💵/,
  ];
  return spamPatterns.some(pattern => pattern.test(text));
};

const sanitizeInput = (input: string, maxLength: number): string => {
  return input.trim().slice(0, maxLength);
};

const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const record = rateLimitCache.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitCache.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (record.count >= MAX_SUBMISSIONS_PER_HOUR) {
    console.warn(`Rate limit exceeded for: ${identifier}`);
    return false;
  }

  record.count++;
  return true;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiryData = await req.json();
    
    // Extract required fields
    const { name, email, phone, notes, user_type } = inquiryData;

    // Validate required fields
    if (!name || !email) {
      console.warn("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.warn(`Invalid email format: ${email}`);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate phone if provided
    if (!isValidPhone(phone)) {
      console.warn(`Invalid phone format: ${phone}`);
      return new Response(
        JSON.stringify({ error: "Invalid phone number format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for spam patterns
    const textToCheck = `${name} ${email} ${notes || ''}`;
    if (containsSpamPatterns(textToCheck)) {
      console.warn(`Spam pattern detected in submission from: ${email}`);
      return new Response(
        JSON.stringify({ error: "Invalid submission detected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting by email
    if (!checkRateLimit(email.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    console.log("Submitting validated inquiry from:", email);

    // Insert inquiry into database
    const { data, error } = await supabase
      .from("inquiries")
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Inquiry submitted successfully:", data.id);

    // Clean up old rate limit entries (basic memory management)
    if (rateLimitCache.size > 10000) {
      const now = Date.now();
      for (const [key, value] of rateLimitCache.entries()) {
        if (now > value.resetAt) {
          rateLimitCache.delete(key);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, inquiryId: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Submit inquiry error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to submit inquiry. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
