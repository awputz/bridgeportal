import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

async function refreshAccessToken(supabase: any, userId: string, refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const tokens = await response.json();
  
  if (tokens.error) {
    throw new Error(tokens.error_description || tokens.error);
  }

  // Update both unified and service-specific columns
  await supabase
    .from('user_google_tokens')
    .update({
      access_token: tokens.access_token,
      gmail_access_token: tokens.access_token,
      token_expiry: new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return tokens.access_token;
}

async function getValidAccessToken(supabase: any, userId: string) {
  const { data: tokenData, error } = await supabase
    .from('user_google_tokens')
    .select('access_token, refresh_token, gmail_access_token, gmail_refresh_token, gmail_enabled')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching tokens:', error);
    throw new Error('Failed to fetch tokens');
  }

  if (!tokenData) {
    throw new Error('Gmail not connected');
  }

  // Use unified token or fallback to service-specific
  const accessToken = tokenData.access_token || tokenData.gmail_access_token;
  const refreshToken = tokenData.refresh_token || tokenData.gmail_refresh_token;

  if (!accessToken) {
    throw new Error('Gmail not connected');
  }

  // Test if token is valid
  const testResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (testResponse.ok) {
    return accessToken;
  }

  // Token expired, try to refresh
  if (refreshToken) {
    console.log('Token expired, refreshing...');
    return await refreshAccessToken(supabase, userId, refreshToken);
  }

  throw new Error('Gmail access token expired and no refresh token available');
}

serve(async (req) => {
  console.log("[gmail-labels] Request received:", req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const authHeader = req.headers.get('Authorization');
    console.log("[gmail-labels] Auth header present:", !!authHeader);

    if (!authHeader) {
      console.log("[gmail-labels] Missing auth header");
      return new Response(
        JSON.stringify({
          error: 'No authorization header',
          needsReauth: true,
          errorCode: 'MISSING_AUTH',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.log("[gmail-labels] Invalid user token:", userError?.message);
      return new Response(
        JSON.stringify({
          error: 'Invalid token',
          needsReauth: true,
          errorCode: 'INVALID_AUTH',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log("[gmail-labels] User authenticated:", user.id);

    const accessToken = await getValidAccessToken(supabase, user.id);

    // Get all labels
    const labelsResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/labels',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const labelsData = await labelsResponse.json();
    
    if (labelsData.error) {
      console.error('Gmail labels error:', labelsData.error);
      return new Response(JSON.stringify({ error: labelsData.error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get details for each label (including unread counts)
    const systemLabels = ['INBOX', 'SENT', 'DRAFT', 'STARRED', 'TRASH', 'SPAM'];
    const labels = await Promise.all(
      (labelsData.labels || [])
        .filter((label: any) => systemLabels.includes(label.id) || label.type === 'user')
        .map(async (label: any) => {
          try {
            const labelResponse = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/labels/${label.id}`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const labelDetail = await labelResponse.json();
            
            return {
              id: label.id,
              name: label.name,
              type: label.type,
              messagesTotal: labelDetail.messagesTotal || 0,
              messagesUnread: labelDetail.messagesUnread || 0,
              threadsTotal: labelDetail.threadsTotal || 0,
              threadsUnread: labelDetail.threadsUnread || 0,
            };
          } catch (e) {
            return {
              id: label.id,
              name: label.name,
              type: label.type,
              messagesTotal: 0,
              messagesUnread: 0,
              threadsTotal: 0,
              threadsUnread: 0,
            };
          }
        })
    );

    // Sort: system labels first, then user labels
    const sortOrder: Record<string, number> = { INBOX: 0, STARRED: 1, SENT: 2, DRAFT: 3, TRASH: 4, SPAM: 5 };
    labels.sort((a, b) => {
      const aOrder = sortOrder[a.id] ?? 100;
      const bOrder = sortOrder[b.id] ?? 100;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });

    console.log(`Fetched ${labels.length} Gmail labels for user:`, user.id);

    return new Response(JSON.stringify({ labels }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gmail labels error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
