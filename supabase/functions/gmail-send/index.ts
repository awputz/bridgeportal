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

function encodeBase64Url(str: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createRawEmail(to: string, cc: string, bcc: string, subject: string, body: string, replyToMessageId?: string, threadId?: string): string {
  const boundary = '----=_Part_' + Math.random().toString(36).substring(2);
  
  let email = '';
  email += `To: ${to}\r\n`;
  if (cc) email += `Cc: ${cc}\r\n`;
  if (bcc) email += `Bcc: ${bcc}\r\n`;
  email += `Subject: ${subject}\r\n`;
  email += `MIME-Version: 1.0\r\n`;
  
  if (replyToMessageId) {
    email += `In-Reply-To: ${replyToMessageId}\r\n`;
    email += `References: ${replyToMessageId}\r\n`;
  }
  
  email += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;
  
  // Plain text version
  email += `--${boundary}\r\n`;
  email += `Content-Type: text/plain; charset="UTF-8"\r\n\r\n`;
  email += body.replace(/<[^>]*>/g, '') + '\r\n\r\n';
  
  // HTML version
  email += `--${boundary}\r\n`;
  email += `Content-Type: text/html; charset="UTF-8"\r\n\r\n`;
  email += `<html><body>${body}</body></html>\r\n\r\n`;
  
  email += `--${boundary}--`;
  
  return encodeBase64Url(email);
}

serve(async (req) => {
  console.log("[gmail-send] Request received:", req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const authHeader = req.headers.get('Authorization');
    console.log("[gmail-send] Auth header present:", !!authHeader);
    
    if (!authHeader) {
      console.log("[gmail-send] Missing auth header");
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.log("[gmail-send] Invalid user token:", userError?.message);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log("[gmail-send] User authenticated:", user.id);

    const { action, to, cc, bcc, subject, body, replyToMessageId, threadId } = await req.json();
    const accessToken = await getValidAccessToken(supabase, user.id);

    if (action === 'send') {
      const raw = createRawEmail(to, cc || '', bcc || '', subject, body, replyToMessageId, threadId);
      
      const sendPayload: any = { raw };
      if (threadId) {
        sendPayload.threadId = threadId;
      }

      const sendResponse = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendPayload),
        }
      );

      const sendData = await sendResponse.json();
      
      if (sendData.error) {
        console.error('Gmail send error:', sendData.error);
        return new Response(JSON.stringify({ error: sendData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Sent Gmail message:', sendData.id, 'for user:', user.id);

      return new Response(JSON.stringify({
        success: true,
        messageId: sendData.id,
        threadId: sendData.threadId,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'save-draft') {
      const raw = createRawEmail(to || '', cc || '', bcc || '', subject || '', body || '');
      
      const draftResponse = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/drafts',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: { raw, threadId },
          }),
        }
      );

      const draftData = await draftResponse.json();
      
      if (draftData.error) {
        console.error('Gmail draft error:', draftData.error);
        return new Response(JSON.stringify({ error: draftData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Saved Gmail draft:', draftData.id, 'for user:', user.id);

      return new Response(JSON.stringify({
        success: true,
        draftId: draftData.id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gmail send error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
