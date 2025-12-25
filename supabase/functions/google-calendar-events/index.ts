import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  console.log("[google-calendar-events] Request received:", req.method);
  
  // Handle CORS preflight
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

    // Get user from token
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

    // Get user's Google tokens - use maybeSingle to handle no rows gracefully
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_google_tokens")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (tokenError) {
      console.log("[google-calendar-events] Token query error:", tokenError.message);
    }

    if (!tokenData) {
      console.log("[google-calendar-events] No token data found for user");
      return new Response(
        JSON.stringify({ error: "Google Calendar not connected", needsConnection: true }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("[google-calendar-events] Token data found, calendar_enabled:", tokenData.calendar_enabled);

    // Check if token is expired and refresh if needed
    let accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const tokenExpiry = tokenData.token_expiry ? new Date(tokenData.token_expiry) : null;
    
    if (tokenExpiry && tokenExpiry < new Date() && refreshToken) {
      // Token expired, refresh it
      const refreshResult = await refreshAccessToken(refreshToken);
      
      if (refreshResult.error) {
        return new Response(
          JSON.stringify({ error: "Failed to refresh token. Please reconnect Google Calendar.", needsConnection: true }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      accessToken = refreshResult.access_token;
      
      // Update token in database
      const newExpiry = new Date();
      newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
      
      await supabase
        .from("user_google_tokens")
        .update({
          access_token: refreshResult.access_token,
          token_expiry: newExpiry.toISOString(),
        })
        .eq("user_id", user.id);
    }

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "No access token available", needsConnection: true }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body for date range
    const body = await req.json().catch(() => ({}));
    const { startDate, endDate } = body;

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

    const calendarResponse = await fetch(calendarUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json();
      console.error("Calendar API error:", errorData);
      
      // If 401, token might be invalid
      if (calendarResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: "Calendar access token expired", needsConnection: true }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to fetch calendar events" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const calendarData = await calendarResponse.json();

    return new Response(
      JSON.stringify({ events: calendarData.items || [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

async function refreshAccessToken(refreshToken: string) {
  try {
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
      return { error: data.error };
    }

    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: message };
  }
}