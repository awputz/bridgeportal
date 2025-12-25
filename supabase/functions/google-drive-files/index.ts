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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, query, pageToken, folderId, fileId } = await req.json();
    console.log(`Drive files action: ${action} for user: ${user.id}`);

    // Get user's Drive tokens
    const { data: tokenData } = await supabase
      .from('user_google_tokens')
      .select('drive_access_token, drive_refresh_token')
      .eq('user_id', user.id)
      .single();

    if (!tokenData?.drive_access_token) {
      return new Response(
        JSON.stringify({ error: 'Drive not connected' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let accessToken = tokenData.drive_access_token;
    const refreshToken = tokenData.drive_refresh_token;

    // Helper to refresh token if needed
    async function refreshTokenIfNeeded(response: Response) {
      if (response.status === 401 && refreshToken) {
        console.log('Refreshing Drive access token...');
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
          await supabase
            .from('user_google_tokens')
            .update({ drive_access_token: accessToken })
            .eq('user_id', user!.id);
          return true;
        }
      }
      return false;
    }

    if (action === 'list') {
      let q = "trashed=false";
      if (query) {
        q += ` and name contains '${query}'`;
      }
      if (folderId) {
        q += ` and '${folderId}' in parents`;
      }

      const params = new URLSearchParams({
        q,
        fields: 'nextPageToken,files(id,name,mimeType,size,thumbnailLink,webViewLink,webContentLink,createdTime,modifiedTime,parents)',
        pageSize: '50',
        orderBy: 'modifiedTime desc',
      });
      if (pageToken) params.set('pageToken', pageToken);

      let response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 401 && await refreshTokenIfNeeded(response)) {
        response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('Drive API error:', data.error);
        return new Response(
          JSON.stringify({ error: data.error.message }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get') {
      if (!fileId) {
        return new Response(
          JSON.stringify({ error: 'fileId required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,thumbnailLink,webViewLink,webContentLink,createdTime,modifiedTime`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 401 && await refreshTokenIfNeeded(response)) {
        response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,thumbnailLink,webViewLink,webContentLink,createdTime,modifiedTime`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }

      const data = await response.json();
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Drive files error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
