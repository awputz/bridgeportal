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
  console.log('[gmail-messages] Refreshing access token...');
  
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
    console.error('[gmail-messages] Token refresh error:', tokens.error);
    return { error: tokens.error_description || tokens.error };
  }

  console.log('[gmail-messages] Token refresh successful');
  return {
    access_token: tokens.access_token,
    expires_in: tokens.expires_in,
  };
}

// Helper to ensure valid token (pre-emptive refresh)
async function ensureValidToken(
  supabase: any,
  userId: string,
  tokenData: any
): Promise<{ accessToken: string | null; error: string | null; needsReconnection: boolean }> {
  // Use service-specific token or fall back to unified token
  let accessToken = tokenData?.gmail_access_token || tokenData?.access_token;
  const refreshToken = tokenData?.gmail_refresh_token || tokenData?.refresh_token;
  const tokenExpiry = tokenData?.token_expiry ? new Date(tokenData.token_expiry) : null;
  
  if (!accessToken && !refreshToken) {
    return { accessToken: null, error: 'Gmail not connected', needsReconnection: true };
  }
  
  // Check if token is expired or will expire in next 5 minutes
  const now = new Date();
  const bufferMs = 5 * 60 * 1000; // 5 minutes buffer
  const isExpired = tokenExpiry && (tokenExpiry.getTime() - now.getTime()) < bufferMs;
  
  if (isExpired && refreshToken) {
    console.log('[gmail-messages] Token expired or expiring soon, refreshing...');
    
    const refreshResult = await refreshAccessToken(refreshToken);
    
    if (refreshResult.error) {
      return { accessToken: null, error: 'Token expired. Please reconnect Gmail.', needsReconnection: true };
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
    if (tokenData?.gmail_access_token) {
      updateData.gmail_access_token = accessToken;
    } else {
      updateData.access_token = accessToken;
    }
    
    await supabase
      .from('user_google_tokens')
      .update(updateData)
      .eq('user_id', userId);
    
    console.log('[gmail-messages] Token updated in database');
  }
  
  // If we still don't have an access token but have refresh, try immediate refresh
  if (!accessToken && refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken);
    
    if (refreshResult.error) {
      return { accessToken: null, error: 'Failed to get access token. Please reconnect Gmail.', needsReconnection: true };
    }
    
    accessToken = refreshResult.access_token;
    
    const newExpiry = new Date();
    newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
    
    const updateData: Record<string, any> = {
      token_expiry: newExpiry.toISOString(),
    };
    if (tokenData?.gmail_access_token !== undefined) {
      updateData.gmail_access_token = accessToken;
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

function parseEmailAddress(header: string): { name: string; email: string } {
  const match = header.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].trim().replace(/"/g, ''), email: match[2] };
  }
  return { name: header, email: header };
}

function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

function extractBody(payload: any): { html: string; text: string } {
  let html = '';
  let text = '';

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    text = decodeBase64Url(payload.body.data);
  } else if (payload.mimeType === 'text/html' && payload.body?.data) {
    html = decodeBase64Url(payload.body.data);
  } else if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        text = decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        html = decodeBase64Url(part.body.data);
      } else if (part.parts) {
        const nested = extractBody(part);
        if (nested.html) html = nested.html;
        if (nested.text) text = nested.text;
      }
    }
  }

  return { html, text };
}

serve(async (req) => {
  console.log("[gmail-messages] Request received:", req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const authHeader = req.headers.get('Authorization');
    console.log("[gmail-messages] Auth header present:", !!authHeader);

    if (!authHeader) {
      console.log("[gmail-messages] Missing auth header");
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
      console.log("[gmail-messages] Invalid user token:", userError?.message);
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
    
    console.log("[gmail-messages] User authenticated:", user.id);

    const body = await req.json();
    const { action, messageId, query, pageToken, labelIds, maxResults = 20 } = body;
    console.log("[gmail-messages] Action:", action);

    // Get user's tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_google_tokens')
      .select('gmail_access_token, gmail_refresh_token, gmail_enabled, access_token, refresh_token, token_expiry')
      .eq('user_id', user.id)
      .maybeSingle();

    if (tokenError) {
      console.error("[gmail-messages] Token query error:", tokenError);
    }

    console.log("[gmail-messages] Token data found:", !!tokenData, "gmail_enabled:", tokenData?.gmail_enabled);

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
        JSON.stringify({ connected: true, gmail_enabled: tokenData.gmail_enabled }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure valid token
    const tokenResult = await ensureValidToken(supabase, user.id, tokenData);
    
    if (tokenResult.error) {
      return new Response(JSON.stringify({ error: tokenResult.error, needsConnection: tokenResult.needsReconnection }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    let accessToken = tokenResult.accessToken!;

    // Helper to retry with fresh token on 401
    async function fetchWithRetry(url: string, options: RequestInit) {
      let response = await fetch(url, options);
      
      if (response.status === 401) {
        console.log('[gmail-messages] Got 401, attempting token refresh...');
        const refreshToken = tokenData?.gmail_refresh_token || tokenData?.refresh_token;
        
        if (refreshToken) {
          const refreshResult = await refreshAccessToken(refreshToken);
          
          if (refreshResult.access_token) {
            accessToken = refreshResult.access_token;
            
            // Update token in DB
            const newExpiry = new Date();
            newExpiry.setSeconds(newExpiry.getSeconds() + refreshResult.expires_in);
            
            const updateData: Record<string, any> = { token_expiry: newExpiry.toISOString() };
            if (tokenData?.gmail_access_token) {
              updateData.gmail_access_token = accessToken;
            } else {
              updateData.access_token = accessToken;
            }
            await supabase.from('user_google_tokens').update(updateData).eq('user_id', user!.id);
            
            // Retry request
            response = await fetch(url, {
              ...options,
              headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
            });
          }
        }
      }
      
      return response;
    }

    if (action === 'list') {
      const params = new URLSearchParams({
        maxResults: maxResults.toString(),
      });
      
      if (pageToken) params.set('pageToken', pageToken);
      if (query) params.set('q', query);
      if (labelIds && labelIds.length > 0) {
        labelIds.forEach((id: string) => params.append('labelIds', id));
      }

      const listResponse = await fetchWithRetry(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const listData = await listResponse.json();
      
      if (listData.error) {
        console.error('[gmail-messages] Gmail list error:', listData.error);
        
        const status = listResponse.status;
        if (status === 401 || status === 403) {
          return new Response(JSON.stringify({ 
            error: status === 403 ? 'Insufficient permissions. Please reconnect.' : 'Token expired. Please reconnect.',
            needsConnection: true,
            errorCode: status === 403 ? 'INSUFFICIENT_PERMISSIONS' : 'TOKEN_EXPIRED'
          }), {
            status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ error: listData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch details for each message
      const messages = await Promise.all(
        (listData.messages || []).map(async (msg: { id: string }) => {
          const msgResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const msgData = await msgResponse.json();
          
          const headers = msgData.payload?.headers || [];
          const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';
          
          const fromParsed = parseEmailAddress(getHeader('From'));
          
          return {
            id: msgData.id,
            threadId: msgData.threadId,
            snippet: msgData.snippet,
            labelIds: msgData.labelIds || [],
            isUnread: (msgData.labelIds || []).includes('UNREAD'),
            isStarred: (msgData.labelIds || []).includes('STARRED'),
            hasAttachments: (msgData.payload?.parts || []).some((p: any) => p.filename && p.filename.length > 0),
            subject: getHeader('Subject'),
            from: fromParsed,
            to: getHeader('To'),
            date: getHeader('Date'),
            internalDate: msgData.internalDate,
          };
        })
      );

      console.log(`[gmail-messages] Listed ${messages.length} messages`);

      return new Response(JSON.stringify({
        messages,
        nextPageToken: listData.nextPageToken,
        resultSizeEstimate: listData.resultSizeEstimate,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get') {
      const msgResponse = await fetchWithRetry(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const msgData = await msgResponse.json();
      
      if (msgData.error) {
        console.error('[gmail-messages] Gmail get error:', msgData.error);
        return new Response(JSON.stringify({ error: msgData.error.message, needsConnection: msgResponse.status === 401 }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const headers = msgData.payload?.headers || [];
      const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';
      const fromParsed = parseEmailAddress(getHeader('From'));
      const body = extractBody(msgData.payload);

      const attachments: any[] = [];
      const extractAttachments = (parts: any[]) => {
        for (const part of parts || []) {
          if (part.filename && part.filename.length > 0) {
            attachments.push({
              id: part.body?.attachmentId,
              filename: part.filename,
              mimeType: part.mimeType,
              size: part.body?.size || 0,
            });
          }
          if (part.parts) {
            extractAttachments(part.parts);
          }
        }
      };
      extractAttachments(msgData.payload?.parts);

      console.log('[gmail-messages] Fetched message:', messageId);

      return new Response(JSON.stringify({
        id: msgData.id,
        threadId: msgData.threadId,
        snippet: msgData.snippet,
        labelIds: msgData.labelIds || [],
        isUnread: (msgData.labelIds || []).includes('UNREAD'),
        isStarred: (msgData.labelIds || []).includes('STARRED'),
        subject: getHeader('Subject'),
        from: fromParsed,
        to: getHeader('To'),
        cc: getHeader('Cc'),
        bcc: getHeader('Bcc'),
        date: getHeader('Date'),
        internalDate: msgData.internalDate,
        bodyHtml: body.html,
        bodyText: body.text,
        attachments,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'modify') {
      const { addLabelIds, removeLabelIds } = body;
      
      const modifyResponse = await fetchWithRetry(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ addLabelIds, removeLabelIds }),
        }
      );

      const modifyData = await modifyResponse.json();
      
      if (modifyData.error) {
        console.error('[gmail-messages] Gmail modify error:', modifyData.error);
        return new Response(JSON.stringify({ error: modifyData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('[gmail-messages] Modified message:', messageId);

      return new Response(JSON.stringify({ success: true, message: modifyData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'trash') {
      const trashResponse = await fetchWithRetry(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const trashData = await trashResponse.json();
      
      if (trashData.error) {
        console.error('[gmail-messages] Gmail trash error:', trashData.error);
        return new Response(JSON.stringify({ error: trashData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('[gmail-messages] Trashed message:', messageId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[gmail-messages] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
