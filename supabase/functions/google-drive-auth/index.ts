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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    // If this is a callback with code
    if (code && state) {
      return await handleOAuthCallback(code, state);
    }

    // Otherwise, this is an API request
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
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action } = await req.json();
    console.log(`Drive auth action: ${action} for user: ${user.id}`);

    if (action === 'get-auth-url') {
      const redirectUri = `${SUPABASE_URL}/functions/v1/google-drive-auth`;
      const scope = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file';
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID!);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', scope);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', user.id);

      return new Response(
        JSON.stringify({ url: authUrl.toString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'check-connection') {
      const { data: tokenData } = await supabase
        .from('user_google_tokens')
        .select('drive_enabled, drive_access_token')
        .eq('user_id', user.id)
        .maybeSingle();

      return new Response(
        JSON.stringify({ connected: !!tokenData?.drive_enabled && !!tokenData?.drive_access_token }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'disconnect') {
      await supabase
        .from('user_google_tokens')
        .update({ 
          drive_enabled: false,
          drive_access_token: null,
          drive_refresh_token: null
        })
        .eq('user_id', user.id);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Drive auth error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleOAuthCallback(code: string, userId: string) {
  console.log(`Handling Drive OAuth callback for user: ${userId}`);
  
  try {
    const redirectUri = `${SUPABASE_URL}/functions/v1/google-drive-auth`;
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      console.error('Token exchange error:', tokenData);
      return createHtmlResponse('error', tokenData.error_description || tokenData.error);
    }

    console.log('Drive tokens received successfully');

    // Save tokens to database
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const { error: upsertError } = await supabase
      .from('user_google_tokens')
      .upsert({
        user_id: userId,
        drive_enabled: true,
        drive_access_token: tokenData.access_token,
        drive_refresh_token: tokenData.refresh_token || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (upsertError) {
      console.error('Error saving tokens:', upsertError);
      return createHtmlResponse('error', 'Failed to save connection');
    }

    return createHtmlResponse('success', 'Google Drive connected successfully!');
  } catch (error: unknown) {
    console.error('OAuth callback error:', error);
    return createHtmlResponse('error', error instanceof Error ? error.message : 'Unknown error');
  }
}

function createHtmlResponse(status: 'success' | 'error', message: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${status === 'success' ? 'Connected!' : 'Error'}</title>
        <style>
          body { font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0a0a0a; color: white; }
          .container { text-align: center; padding: 2rem; }
          .icon { font-size: 4rem; margin-bottom: 1rem; }
          .message { font-size: 1.25rem; color: ${status === 'success' ? '#22c55e' : '#ef4444'}; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">${status === 'success' ? '✓' : '✕'}</div>
          <div class="message">${message}</div>
          <p>This window will close automatically...</p>
        </div>
        <script>setTimeout(() => window.close(), 3000);</script>
      </body>
    </html>
  `;
  return new Response(html, { 
    headers: { ...corsHeaders, 'Content-Type': 'text/html' } 
  });
}
