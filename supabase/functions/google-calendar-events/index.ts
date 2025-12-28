import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

// Helper to refresh token
async function refreshAccessToken(refreshToken: string) {
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
  }
  
  if (!accessToken) {
    return { accessToken: null, error: "No access token available", needsReconnection: true };
  }
  
  return { accessToken, error: null, needsReconnection: false };
}

// Helper to make Google Calendar API requests with retry
async function makeCalendarRequest(
  url: string,
  options: RequestInit,
  accessToken: string,
  supabase: any,
  userId: string,
  tokenData: any
): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Handle 401 with retry
  if (response.status === 401 && tokenData.refresh_token) {
    const refreshResult = await refreshAccessToken(tokenData.refresh_token);
    
    if (refreshResult.access_token) {
      // Update token in DB
      const newExpiry = new Date();
      newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
      
      await supabase
        .from("user_google_tokens")
        .update({
          access_token: refreshResult.access_token,
          token_expiry: newExpiry.toISOString(),
        })
        .eq("user_id", userId);
      
      // Retry request
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshResult.access_token}`,
        },
      });
    }
  }

  return response;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Missing authorization header",
          needsReauth: true,
          errorCode: "MISSING_AUTH",
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Invalid token",
          needsReauth: true,
          errorCode: "INVALID_AUTH",
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user's Google tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_google_tokens")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (tokenError) {
      console.error("[google-calendar-events] Token query error:", tokenError.message);
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { action, startDate, endDate, event, eventId } = body;

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
    
    const accessToken = tokenResult.accessToken!;

    // Handle CREATE event
    if (action === "create") {
      const googleEvent = formatEventForGoogle(event);
      
      const response = await makeCalendarRequest(
        `${CALENDAR_API_BASE}/calendars/primary/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(googleEvent),
        },
        accessToken,
        supabase,
        user.id,
        tokenData
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[google-calendar-events] Create error:", errorData);
        return new Response(
          JSON.stringify({ error: errorData.error?.message || "Failed to create event" }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const createdEvent = await response.json();
      
      return new Response(
        JSON.stringify({ success: true, event: createdEvent }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle UPDATE event
    if (action === "update") {
      if (!eventId) {
        return new Response(
          JSON.stringify({ error: "Event ID required for update" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const googleEvent = formatEventForGoogle(event);
      
      const response = await makeCalendarRequest(
        `${CALENDAR_API_BASE}/calendars/primary/events/${eventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(googleEvent),
        },
        accessToken,
        supabase,
        user.id,
        tokenData
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[google-calendar-events] Update error:", errorData);
        return new Response(
          JSON.stringify({ error: errorData.error?.message || "Failed to update event" }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updatedEvent = await response.json();
      
      return new Response(
        JSON.stringify({ success: true, event: updatedEvent }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle DELETE event
    if (action === "delete") {
      if (!eventId) {
        return new Response(
          JSON.stringify({ error: "Event ID required for delete" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const response = await makeCalendarRequest(
        `${CALENDAR_API_BASE}/calendars/primary/events/${eventId}`,
        { method: "DELETE" },
        accessToken,
        supabase,
        user.id,
        tokenData
      );

      // Google returns 204 No Content on successful delete
      if (response.status !== 204 && !response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[google-calendar-events] Delete error:", errorData);
        return new Response(
          JSON.stringify({ error: errorData.error?.message || "Failed to delete event" }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default action: LIST events
    const calendarUrl = new URL(`${CALENDAR_API_BASE}/calendars/primary/events`);
    calendarUrl.searchParams.set("singleEvents", "true");
    calendarUrl.searchParams.set("orderBy", "startTime");
    calendarUrl.searchParams.set("maxResults", "100");
    
    if (startDate) {
      calendarUrl.searchParams.set("timeMin", new Date(startDate).toISOString());
    } else {
      calendarUrl.searchParams.set("timeMin", new Date().toISOString());
    }
    
    if (endDate) {
      calendarUrl.searchParams.set("timeMax", new Date(endDate).toISOString());
    }

    const calendarResponse = await makeCalendarRequest(
      calendarUrl.toString(),
      { method: "GET" },
      accessToken,
      supabase,
      user.id,
      tokenData
    );

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

// Helper to format event for Google Calendar API
function formatEventForGoogle(event: any) {
  const googleEvent: any = {
    summary: event.title || event.summary,
    description: event.description || "",
    location: event.location || "",
  };

  // Handle all-day events
  if (event.all_day || event.allDay) {
    const startDate = new Date(event.start_time || event.start);
    const endDate = event.end_time || event.end ? new Date(event.end_time || event.end) : new Date(startDate);
    
    // For all-day events, add one day to end date if same as start
    if (startDate.toDateString() === endDate.toDateString()) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    googleEvent.start = { date: formatDate(startDate) };
    googleEvent.end = { date: formatDate(endDate) };
  } else {
    googleEvent.start = { 
      dateTime: new Date(event.start_time || event.start).toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    googleEvent.end = { 
      dateTime: new Date(event.end_time || event.end || addHour(event.start_time || event.start)).toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  // Handle color
  if (event.colorId || event.color) {
    googleEvent.colorId = event.colorId || getGoogleColorId(event.color);
  }

  // Handle attendees
  if (event.attendees && event.attendees.length > 0) {
    googleEvent.attendees = event.attendees.map((email: string) => ({ email }));
  }

  // Handle reminders
  if (event.reminders) {
    googleEvent.reminders = {
      useDefault: false,
      overrides: event.reminders.map((r: any) => ({
        method: r.method || "popup",
        minutes: r.minutes,
      })),
    };
  }

  // Handle recurrence
  if (event.recurrence) {
    googleEvent.recurrence = event.recurrence;
  }

  // Handle Google Meet
  if (event.addGoogleMeet) {
    googleEvent.conferenceData = {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
  }

  return googleEvent;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addHour(dateStr: string): string {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 1);
  return date.toISOString();
}

function getGoogleColorId(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "1",
    green: "2",
    purple: "3",
    red: "4",
    yellow: "5",
    orange: "6",
    turquoise: "7",
    gray: "8",
    bold_blue: "9",
    bold_green: "10",
    bold_red: "11",
  };
  return colorMap[color] || "1";
}
