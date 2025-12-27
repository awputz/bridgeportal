import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Full calendar scope for read/write access
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

Deno.serve(async (req) => {
  console.log("[google-calendar-auth] Request received:", req.method);
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    // If this is a callback with code, handle the OAuth callback
    if (code && state) {
      console.log("[google-calendar-auth] OAuth callback received for user:", state);
      return handleOAuthCallback(code, state);
    }

    // Otherwise, handle API requests
    const authHeader = req.headers.get("Authorization");
    console.log("[google-calendar-auth] Auth header present:", !!authHeader);
    
    if (!authHeader) {
      console.log("[google-calendar-auth] Missing auth header");
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

    if (action === "get-auth-url") {
      if (!GOOGLE_CLIENT_ID) {
        return new Response(
          JSON.stringify({ error: "Google Calendar integration not configured. Please add GOOGLE_CLIENT_ID secret." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Build the redirect URI - use the function URL for callback
      const functionUrl = `${SUPABASE_URL}/functions/v1/google-calendar-auth`;
      const redirectUri = functionUrl;

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      // Use full calendar scope for read/write access
      authUrl.searchParams.set("scope", CALENDAR_SCOPE);
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
      authUrl.searchParams.set("state", user.id); // Pass user ID in state

      return new Response(
        JSON.stringify({ url: authUrl.toString() }),
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

async function handleOAuthCallback(code: string, userId: string) {
  try {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return createHtmlResponse("error", "Google Calendar integration not configured");
    }

    const functionUrl = `${SUPABASE_URL}/functions/v1/google-calendar-auth`;

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: functionUrl,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      console.error("Token error:", tokens);
      return createHtmlResponse("error", tokens.error_description || tokens.error);
    }

    // Save tokens to database
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expires_in);

    const { error: upsertError } = await supabase
      .from("user_google_tokens")
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: expiryDate.toISOString(),
        calendar_enabled: true,
      });

    if (upsertError) {
      console.error("Database error:", upsertError);
      return createHtmlResponse("error", "Failed to save connection");
    }

    return createHtmlResponse("success", "Google Calendar connected with full access!");
  } catch (error: unknown) {
    console.error("Callback error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return createHtmlResponse("error", message);
  }
}

function createHtmlResponse(status: "success" | "error", message: string) {
  const isSuccess = status === "success";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Google Calendar Connection</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #0a0a0a;
            color: #fff;
          }
          .container {
            text-align: center;
            padding: 2rem;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          .message {
            font-size: 1.25rem;
            margin-bottom: 1rem;
          }
          .hint {
            color: #888;
            font-size: 0.875rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">${isSuccess ? "✅" : "❌"}</div>
          <div class="message">${message}</div>
          <div class="hint">You can close this window and return to the app.</div>
          <script>
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
