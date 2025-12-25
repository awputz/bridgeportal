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

// Create HTML response for OAuth callback
function createHtmlResponse(status: 'success' | 'error', message: string) {
  const bgColor = status === 'success' ? '#10b981' : '#ef4444';
  const icon = status === 'success' ? '✓' : '✕';
  
  return new Response(
    `<!DOCTYPE html>
<html>
<head>
  <title>Gmail ${status === 'success' ? 'Connected' : 'Connection Failed'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0a0a0a;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-size: 32px;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #888; margin-bottom: 1.5rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${icon}</div>
    <h1>${status === 'success' ? 'Gmail Connected!' : 'Connection Failed'}</h1>
    <p>${message}</p>
    <p>This window will close automatically...</p>
  </div>
  <script>
    setTimeout(() => window.close(), 2000);
  </script>
</body>
</html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

// Handle OAuth callback
async function handleOAuthCallback(code: string, userId: string) {
  console.log('Handling Gmail OAuth callback for user:', userId);
  
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
  const redirectUri = `${SUPABASE_URL}/functions/v1/gmail-auth`;
  
  try {
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

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      console.error('Gmail token exchange error:', tokens.error);
      return createHtmlResponse('error', tokens.error_description || tokens.error);
    }

    // Get user email from Google
    let googleEmail = null;
    try {
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const profile = await profileResponse.json();
      googleEmail = profile.email;
    } catch (e) {
      console.error('Failed to get Google email:', e);
    }

    // Check if row exists
    const { data: existing } = await supabase
      .from('user_google_tokens')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      // Update existing row
      const { error: updateError } = await supabase
        .from('user_google_tokens')
        .update({
          gmail_access_token: tokens.access_token,
          gmail_refresh_token: tokens.refresh_token || null,
          gmail_enabled: true,
          google_email: googleEmail,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating Gmail tokens:', updateError);
        return createHtmlResponse('error', 'Failed to save tokens');
      }
    } else {
      // Insert new row
      const { error: insertError } = await supabase
        .from('user_google_tokens')
        .insert({
          user_id: userId,
          gmail_access_token: tokens.access_token,
          gmail_refresh_token: tokens.refresh_token || null,
          gmail_enabled: true,
          google_email: googleEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting Gmail tokens:', insertError);
        return createHtmlResponse('error', 'Failed to save tokens');
      }
    }

    console.log('Gmail tokens stored successfully for user:', userId);
    return createHtmlResponse('success', 'Your Gmail account has been connected.');
    
  } catch (error) {
    console.error('Gmail OAuth callback error:', error);
    return createHtmlResponse('error', 'An unexpected error occurred');
  }
}

serve(async (req) => {
  console.log("[gmail-auth] Request received:", req.method);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Check for OAuth callback (code and state in query params)
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // state contains user_id
    
    if (code && state) {
      console.log("[gmail-auth] OAuth callback received for user:", state);
      return await handleOAuthCallback(code, state);
    }

    // API request handling
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    console.log("[gmail-auth] Auth header present:", !!authHeader);
    
    if (!authHeader) {
      console.log("[gmail-auth] Missing auth header");
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action } = await req.json();

    if (action === 'get-auth-url') {
      // Generate Gmail OAuth URL with backend callback
      const scopes = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.labels',
        'https://www.googleapis.com/auth/userinfo.email',
      ];

      const redirectUri = `${SUPABASE_URL}/functions/v1/gmail-auth`;
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID!);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', scopes.join(' '));
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', user.id);

      console.log('Generated Gmail auth URL for user:', user.id);

      return new Response(JSON.stringify({ url: authUrl.toString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'disconnect') {
      // Check if row exists first
      const { data: existing } = await supabase
        .from('user_google_tokens')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_google_tokens')
          .update({
            gmail_access_token: null,
            gmail_refresh_token: null,
            gmail_enabled: false,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error disconnecting Gmail:', error);
          return new Response(JSON.stringify({ error: 'Failed to disconnect' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      console.log('Gmail disconnected for user:', user.id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gmail auth error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
