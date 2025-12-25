import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === "store-tokens") {
      // Get the provider token from the user's session
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Check if user has provider tokens in their identity
      const googleIdentity = user.identities?.find(i => i.provider === 'google');
      
      if (!googleIdentity) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "No Google identity found. User may not have signed in with Google." 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get email from user metadata or identity
      const email = user.email || user.user_metadata?.email || googleIdentity.identity_data?.email;

      // Check if we already have tokens for this user
      const { data: existingTokens } = await supabase
        .from("user_google_tokens")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingTokens?.access_token) {
        // User already has tokens - return success
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Google services already connected",
            email: existingTokens.email || email,
            services: {
              gmail: existingTokens.gmail_enabled,
              calendar: existingTokens.calendar_enabled,
              drive: existingTokens.drive_enabled,
              contacts: existingTokens.contacts_enabled,
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // For new OAuth login with extended scopes, we need to check provider_token
      // The provider_token is only available right after OAuth login
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "User authenticated with Google. Services will be connected on next OAuth flow.",
          email,
          needsReauth: !existingTokens?.access_token
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "check-services") {
      // Check which Google services are connected
      const { data: tokens } = await supabase
        .from("user_google_tokens")
        .select("gmail_enabled, calendar_enabled, drive_enabled, contacts_enabled, google_email")
        .eq("user_id", user.id)
        .maybeSingle();

      return new Response(
        JSON.stringify({
          connected: !!tokens?.gmail_enabled || !!tokens?.calendar_enabled || !!tokens?.drive_enabled || !!tokens?.contacts_enabled,
          services: {
            gmail: tokens?.gmail_enabled || false,
            calendar: tokens?.calendar_enabled || false,
            drive: tokens?.drive_enabled || false,
            contacts: tokens?.contacts_enabled || false,
          },
          email: tokens?.google_email || user.email
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
