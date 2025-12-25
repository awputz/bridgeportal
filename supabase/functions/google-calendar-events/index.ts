import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Helper to refresh token
async function refreshAccessToken(refreshToken: string) {
  console.log("[google-calendar-events] Refreshing access token...");
  
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error("[google-calendar-events] Token refresh failed:", data.error);
    return { error: data.error_description || data.error };
  }

  console.log("[google-calendar-events] Token refresh successful");
  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
  };
}

// Helper to ensure valid token (pre-emptive refresh)
async function ensureValidToken(
  supabase: any,
  userId: string,
  tokenData: any
): Promise<{ accessToken: string | null; error: string | null; needsReconnection: boolean }> {
  let accessToken = tokenData?.access_token;
  const refreshToken = tokenData?.refresh_token;
  const tokenExpiry = tokenData?.token_expiry ? new Date(tokenData.token_expiry) : null;
  
  if (!accessToken && !refreshToken) {
    return { accessToken: null, error: "Calendar not connected", needsReconnection: true };
  }
  
  // Check if token is expired or will expire in next 5 minutes
  const now = new Date();
  const bufferMs = 5 * 60 * 1000; // 5 minutes buffer
  const isExpired = tokenExpiry && (tokenExpiry.getTime() - now.getTime()) < bufferMs;
  
  if (isExpired && refreshToken) {
    console.log("[google-calendar-events] Token expired or expiring soon, refreshing...");
    
    const refreshResult = await refreshAccessToken(refreshToken);
    
    if (refreshResult.error) {
      return { accessToken: null, error: "Token expired. Please reconnect Google Calendar.", needsReconnection: true };
    }
    
    accessToken = refreshResult.access_token;
    
    // Update token in database
    const newExpiry = new Date();
    newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
    
    await supabase
      .from("user_google_tokens")
      .update({
        access_token: accessToken,
        token_expiry: newExpiry.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
    
    console.log("[google-calendar-events] Token updated in database");
  }
  
  if (!accessToken) {
    return { accessToken: null, error: "No access token available", needsReconnection: true };
  }
  
  return { accessToken, error: null, needsReconnection: false };
}

Deno.serve(async (req) => {
  console.log("[google-calendar-events] Request received:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    console.log("[google-calendar-events] Auth header present:", !!authHeader);
    
    if (!authHeader) {
      console.log("[google-calendar-events] Missing auth header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.log("[google-calendar-events] Invalid user token:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("[google-calendar-events] User authenticated:", user.id);

    // Get user's Google tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_google_tokens")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (tokenError) {
      console.log("[google-calendar-events] Token query error:", tokenError.message);
    }

    console.log("[google-calendar-events] Token data found:", !!tokenData, "calendar_enabled:", tokenData?.calendar_enabled);

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { action, startDate, endDate } = body;

    // Handle check-connection action
    if (action === "check-connection") {
      if (!tokenData) {
        return new Response(
          JSON.stringify({ connected: false, reason: "no_tokens" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Validate token by attempting refresh if expired
      const tokenResult = await ensureValidToken(supabase, user.id, tokenData);
      
      if (tokenResult.needsReconnection) {
        return new Response(
          JSON.stringify({ connected: false, reason: "token_expired", message: tokenResult.error }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ connected: true, calendar_enabled: tokenData.calendar_enabled }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!tokenData) {
      console.log("[google-calendar-events] No token data found for user");
      return new Response(
        JSON.stringify({ error: "Google Calendar not connected", needsConnection: true }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure valid token for data operations
    const tokenResult = await ensureValidToken(supabase, user.id, tokenData);
    
    if (tokenResult.error) {
      return new Response(
        JSON.stringify({ error: tokenResult.error, needsConnection: tokenResult.needsReconnection }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    let accessToken = tokenResult.accessToken!;

    // Fetch calendar events
    const calendarUrl = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    calendarUrl.searchParams.set("singleEvents", "true");
    calendarUrl.searchParams.set("orderBy", "startTime");
    calendarUrl.searchParams.set("maxResults", "50");
    
    if (startDate) {
      calendarUrl.searchParams.set("timeMin", new Date(startDate).toISOString());
    } else {
      calendarUrl.searchParams.set("timeMin", new Date().toISOString());
    }
    
    if (endDate) {
      calendarUrl.searchParams.set("timeMax", new Date(endDate).toISOString());
    }

    console.log("[google-calendar-events] Fetching events from:", calendarUrl.toString());

    let calendarResponse = await fetch(calendarUrl.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Handle 401 with retry
    if (calendarResponse.status === 401 && tokenData.refresh_token) {
      console.log("[google-calendar-events] Got 401, attempting token refresh...");
      
      const refreshResult = await refreshAccessToken(tokenData.refresh_token);
      
      if (refreshResult.access_token) {
        accessToken = refreshResult.access_token;
        
        // Update token in DB
        const newExpiry = new Date();
        newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
        
        await supabase
          .from("user_google_tokens")
          .update({
            access_token: accessToken,
            token_expiry: newExpiry.toISOString(),
          })
          .eq("user_id", user.id);
        
        // Retry request
        calendarResponse = await fetch(calendarUrl.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    }

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json();
      console.error("[google-calendar-events] Calendar API error:", calendarResponse.status, errorData);
      
      const status = calendarResponse.status;
      if (status === 401 || status === 403) {
        return new Response(
          JSON.stringify({ 
            error: status === 403 ? "Insufficient permissions. Please reconnect with proper scopes." : "Token expired. Please reconnect.",
            needsConnection: true,
            errorCode: status === 403 ? "INSUFFICIENT_PERMISSIONS" : "TOKEN_EXPIRED"
          }),
          { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to fetch calendar events" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const calendarData = await calendarResponse.json();
    console.log(`[google-calendar-events] Fetched ${calendarData.items?.length || 0} events`);

    return new Response(
      JSON.stringify({ events: calendarData.items || [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("[google-calendar-events] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
