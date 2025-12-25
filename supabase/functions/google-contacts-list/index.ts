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
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.log("[google-contacts-list] Invalid user token:", authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("[google-contacts-list] User authenticated:", user.id);

    const { action, pageToken, query } = await req.json();
    console.log("[google-contacts-list] Action:", action);

    // Get user's tokens - use maybeSingle to handle no rows gracefully
    const { data: tokenData } = await supabase
      .from('user_google_tokens')
      .select('contacts_access_token, contacts_refresh_token, contacts_enabled, access_token, refresh_token')
      .eq('user_id', user.id)
      .maybeSingle();

    if (action === 'check-connection') {
      // Check if either service-specific or unified tokens exist
      const hasServiceToken = tokenData?.contacts_enabled && !!tokenData?.contacts_access_token;
      const hasUnifiedToken = !!tokenData?.access_token && tokenData?.contacts_enabled !== false;
      return new Response(
        JSON.stringify({ connected: hasServiceToken || hasUnifiedToken }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service-specific token or fall back to unified token
    let accessToken = tokenData?.contacts_access_token || tokenData?.access_token;
    let refreshToken = tokenData?.contacts_refresh_token || tokenData?.refresh_token;

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'Contacts not connected', needsConnection: true }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Helper to refresh token if needed
    async function refreshTokenIfNeeded(response: Response) {
      if (response.status === 401 && refreshToken) {
        console.log('Refreshing Contacts access token...');
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID!,
            client_secret: GOOGLE_CLIENT_SECRET!,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          }),
        });
        
        const refreshData = await refreshResponse.json();
        if (refreshData.access_token) {
          accessToken = refreshData.access_token;
          // Update the appropriate token column
          const updateData = tokenData?.contacts_access_token 
            ? { contacts_access_token: accessToken }
            : { access_token: accessToken };
          await supabase
            .from('user_google_tokens')
            .update(updateData)
            .eq('user_id', user!.id);
          return true;
        }
      }
      return false;
    }

    if (action === 'list') {
      const params = new URLSearchParams({
        personFields: 'names,emailAddresses,phoneNumbers,organizations,addresses,photos',
        pageSize: '100',
        sortOrder: 'LAST_MODIFIED_DESCENDING',
      });
      if (pageToken) params.set('pageToken', pageToken);

      let response = await fetch(`https://people.googleapis.com/v1/people/me/connections?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 401 && await refreshTokenIfNeeded(response)) {
        response = await fetch(`https://people.googleapis.com/v1/people/me/connections?${params}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('People API error:', data.error);
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
      let response = await fetch(
        `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(query)}&readMask=names,emailAddresses,phoneNumbers,organizations,photos&pageSize=30`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 401 && await refreshTokenIfNeeded(response)) {
        response = await fetch(
          `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(query)}&readMask=names,emailAddresses,phoneNumbers,organizations,photos&pageSize=30`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }

      const data = await response.json();
      
      const contacts = (data.results || []).map((result: any) => ({
        resourceName: result.person.resourceName,
        etag: result.person.etag,
        name: result.person.names?.[0]?.displayName || '',
        email: result.person.emailAddresses?.[0]?.value || '',
        phone: result.person.phoneNumbers?.[0]?.value || '',
        company: result.person.organizations?.[0]?.name || '',
        photoUrl: result.person.photos?.[0]?.url || '',
      }));

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
    console.error('Contacts list error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});