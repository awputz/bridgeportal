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
  console.log('Refreshing Gmail access token for user:', userId);
  
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
    console.error('Token refresh error:', tokens.error);
    throw new Error(tokens.error_description || tokens.error);
  }

  // Update access token in database
  await supabase
    .from('user_google_tokens')
    .update({
      gmail_access_token: tokens.access_token,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return tokens.access_token;
}

async function getValidAccessToken(supabase: any, userId: string) {
  const { data: tokenData, error } = await supabase
    .from('user_google_tokens')
    .select('gmail_access_token, gmail_refresh_token, gmail_enabled')
    .eq('user_id', userId)
    .single();

  if (error || !tokenData || !tokenData.gmail_enabled) {
    throw new Error('Gmail not connected');
  }

  // Try the current access token first
  const testResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${tokenData.gmail_access_token}` },
  });

  if (testResponse.ok) {
    return tokenData.gmail_access_token;
  }

  // Token expired, refresh it
  if (tokenData.gmail_refresh_token) {
    return await refreshAccessToken(supabase, userId, tokenData.gmail_refresh_token);
  }

  throw new Error('Gmail access token expired and no refresh token available');
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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

    const { action, messageId, query, pageToken, labelIds, maxResults = 20 } = await req.json();
    const accessToken = await getValidAccessToken(supabase, user.id);

    if (action === 'list') {
      // List messages from inbox
      const params = new URLSearchParams({
        maxResults: maxResults.toString(),
      });
      
      if (pageToken) params.set('pageToken', pageToken);
      if (query) params.set('q', query);
      if (labelIds && labelIds.length > 0) {
        labelIds.forEach((id: string) => params.append('labelIds', id));
      }

      const listResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const listData = await listResponse.json();
      
      if (listData.error) {
        console.error('Gmail list error:', listData.error);
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

      console.log(`Listed ${messages.length} Gmail messages for user:`, user.id);

      return new Response(JSON.stringify({
        messages,
        nextPageToken: listData.nextPageToken,
        resultSizeEstimate: listData.resultSizeEstimate,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get') {
      // Get full message details
      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const msgData = await msgResponse.json();
      
      if (msgData.error) {
        console.error('Gmail get error:', msgData.error);
        return new Response(JSON.stringify({ error: msgData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const headers = msgData.payload?.headers || [];
      const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';
      const fromParsed = parseEmailAddress(getHeader('From'));
      const body = extractBody(msgData.payload);

      // Get attachments info
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

      console.log('Fetched Gmail message:', messageId, 'for user:', user.id);

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
      // Modify message labels (read/unread, star/unstar, archive, trash)
      const { addLabelIds, removeLabelIds } = await req.json();
      
      const modifyResponse = await fetch(
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
        console.error('Gmail modify error:', modifyData.error);
        return new Response(JSON.stringify({ error: modifyData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Modified Gmail message:', messageId, 'for user:', user.id);

      return new Response(JSON.stringify({ success: true, message: modifyData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'trash') {
      const trashResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const trashData = await trashResponse.json();
      
      if (trashData.error) {
        console.error('Gmail trash error:', trashData.error);
        return new Response(JSON.stringify({ error: trashData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Trashed Gmail message:', messageId, 'for user:', user.id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gmail messages error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
