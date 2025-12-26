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

// Helper to refresh token
async function refreshAccessToken(refreshToken: string) {
  console.log('[google-contacts-list] Refreshing access token...');
  
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
  
  const data = await response.json();
  
  if (data.error) {
    console.error('[google-contacts-list] Token refresh failed:', data.error);
    return { error: data.error_description || data.error };
  }
  
  console.log('[google-contacts-list] Token refresh successful');
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
  // Use service-specific token or fall back to unified token
  let accessToken = tokenData?.contacts_access_token || tokenData?.access_token;
  const refreshToken = tokenData?.contacts_refresh_token || tokenData?.refresh_token;
  const tokenExpiry = tokenData?.token_expiry ? new Date(tokenData.token_expiry) : null;
  
  if (!accessToken && !refreshToken) {
    return { accessToken: null, error: 'Contacts not connected', needsReconnection: true };
  }
  
  // Check if token is expired or will expire in next 5 minutes
  const now = new Date();
  const bufferMs = 5 * 60 * 1000; // 5 minutes buffer
  const isExpired = tokenExpiry && (tokenExpiry.getTime() - now.getTime()) < bufferMs;
  
  if (isExpired && refreshToken) {
    console.log('[google-contacts-list] Token expired or expiring soon, refreshing...');
    
    const refreshResult = await refreshAccessToken(refreshToken);
    
    if (refreshResult.error) {
      return { accessToken: null, error: 'Token expired. Please reconnect Google Contacts.', needsReconnection: true };
    }
    
    accessToken = refreshResult.access_token;
    
    // Update token in database
    const newExpiry = new Date();
    newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
    
    const updateData: Record<string, any> = {
      token_expiry: newExpiry.toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Update the appropriate token column
    if (tokenData?.contacts_access_token) {
      updateData.contacts_access_token = accessToken;
    } else {
      updateData.access_token = accessToken;
    }
    
    await supabase
      .from('user_google_tokens')
      .update(updateData)
      .eq('user_id', userId);
    
    console.log('[google-contacts-list] Token updated in database');
  }
  
  // If we still don't have an access token but have refresh, try immediate refresh
  if (!accessToken && refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken);
    
    if (refreshResult.error) {
      return { accessToken: null, error: 'Failed to get access token. Please reconnect.', needsReconnection: true };
    }
    
    accessToken = refreshResult.access_token;
    
    const newExpiry = new Date();
    newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
    
    const updateData: Record<string, any> = {
      token_expiry: newExpiry.toISOString(),
    };
    if (tokenData?.contacts_access_token !== undefined) {
      updateData.contacts_access_token = accessToken;
    } else {
      updateData.access_token = accessToken;
    }
    
    await supabase
      .from('user_google_tokens')
      .update(updateData)
      .eq('user_id', userId);
  }
  
  if (!accessToken) {
    return { accessToken: null, error: 'No access token available', needsReconnection: true };
  }
  
  return { accessToken, error: null, needsReconnection: false };
}

serve(async (req) => {
  console.log("[google-contacts-list] Request received:", req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    console.log("[google-contacts-list] Auth header present:", !!authHeader);

    if (!authHeader) {
      console.log("[google-contacts-list] Missing auth header");
      return new Response(
        JSON.stringify({
          error: 'Missing authorization header',
          needsReauth: true,
          errorCode: 'MISSING_AUTH',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log("[google-contacts-list] Invalid user token:", authError?.message);
      return new Response(
        JSON.stringify({
          error: 'Invalid token',
          needsReauth: true,
          errorCode: 'INVALID_AUTH',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("[google-contacts-list] User authenticated:", user.id);

    const body = await req.json();
    const { action, pageToken, query } = body;
    console.log("[google-contacts-list] Action:", action);

    // Get user's tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_google_tokens')
      .select('contacts_access_token, contacts_refresh_token, contacts_enabled, access_token, refresh_token, token_expiry')
      .eq('user_id', user.id)
      .maybeSingle();

    if (tokenError) {
      console.error("[google-contacts-list] Token query error:", tokenError);
    }

    console.log("[google-contacts-list] Token data found:", !!tokenData, "contacts_enabled:", tokenData?.contacts_enabled);

    // Handle check-connection action
    if (action === 'check-connection') {
      if (!tokenData) {
        return new Response(
          JSON.stringify({ connected: false, reason: 'no_tokens' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate token by attempting refresh if expired
      const tokenResult = await ensureValidToken(supabase, user.id, tokenData);
      
      if (tokenResult.needsReconnection) {
        return new Response(
          JSON.stringify({ connected: false, reason: 'token_expired', message: tokenResult.error }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ connected: true, contacts_enabled: tokenData.contacts_enabled }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure valid token for data operations
    const tokenResult = await ensureValidToken(supabase, user.id, tokenData);
    
    if (tokenResult.error) {
      return new Response(
        JSON.stringify({ error: tokenResult.error, needsConnection: tokenResult.needsReconnection }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let accessToken = tokenResult.accessToken!;

    // Helper to retry with fresh token on 401
    async function fetchWithRetry(url: string) {
      let response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (response.status === 401) {
        console.log('[google-contacts-list] Got 401, attempting token refresh...');
        const refreshToken = tokenData?.contacts_refresh_token || tokenData?.refresh_token;
        
        if (refreshToken) {
          const refreshResult = await refreshAccessToken(refreshToken);
          
          if (refreshResult.access_token) {
            accessToken = refreshResult.access_token;
            
            // Update token in DB
            const newExpiry = new Date();
            newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
            
            const updateData: Record<string, any> = { token_expiry: newExpiry.toISOString() };
            if (tokenData?.contacts_access_token) {
              updateData.contacts_access_token = accessToken;
            } else {
              updateData.access_token = accessToken;
            }
            await supabase.from('user_google_tokens').update(updateData).eq('user_id', user!.id);
            
            // Retry request
            response = await fetch(url, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          }
        }
      }
      
      return response;
    }

    if (action === 'list') {
      const params = new URLSearchParams({
        personFields: 'names,emailAddresses,phoneNumbers,organizations,addresses,photos',
        pageSize: '100',
        sortOrder: 'LAST_MODIFIED_DESCENDING',
      });
      if (pageToken) params.set('pageToken', pageToken);

      const response = await fetchWithRetry(`https://people.googleapis.com/v1/people/me/connections?${params}`);
      const data = await response.json();
      
      if (data.error) {
        console.error('[google-contacts-list] People API error:', data.error);
        
        const status = response.status;
        if (status === 401 || status === 403) {
          return new Response(
            JSON.stringify({ 
              error: status === 403 ? 'Insufficient permissions. Please reconnect.' : 'Token expired. Please reconnect.',
              needsConnection: true,
              errorCode: status === 403 ? 'INSUFFICIENT_PERMISSIONS' : 'TOKEN_EXPIRED'
            }),
            { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: data.error.message }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Transform to simpler format
      const contacts = (data.connections || []).map((person: any) => ({
        resourceName: person.resourceName,
        etag: person.etag,
        name: person.names?.[0]?.displayName || '',
        email: person.emailAddresses?.[0]?.value || '',
        phone: person.phoneNumbers?.[0]?.value || '',
        company: person.organizations?.[0]?.name || '',
        title: person.organizations?.[0]?.title || '',
        photoUrl: person.photos?.[0]?.url || '',
        address: person.addresses?.[0]?.formattedValue || '',
      }));

      console.log(`[google-contacts-list] Listed ${contacts.length} contacts`);

      return new Response(
        JSON.stringify({ 
          contacts, 
          nextPageToken: data.nextPageToken,
          totalItems: data.totalItems 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'search' && query) {
      const response = await fetchWithRetry(
        `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(query)}&readMask=names,emailAddresses,phoneNumbers,organizations,photos&pageSize=30`
      );

      const data = await response.json();
      
      if (data.error) {
        console.error('[google-contacts-list] Search error:', data.error);
        return new Response(
          JSON.stringify({ error: data.error.message, needsConnection: response.status === 401 }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const contacts = (data.results || []).map((result: any) => ({
        resourceName: result.person.resourceName,
        etag: result.person.etag,
        name: result.person.names?.[0]?.displayName || '',
        email: result.person.emailAddresses?.[0]?.value || '',
        phone: result.person.phoneNumbers?.[0]?.value || '',
        company: result.person.organizations?.[0]?.name || '',
        photoUrl: result.person.photos?.[0]?.url || '',
      }));

      console.log(`[google-contacts-list] Search returned ${contacts.length} contacts`);

      return new Response(
        JSON.stringify({ contacts }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('[google-contacts-list] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
