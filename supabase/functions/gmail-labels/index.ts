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

  const testResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${tokenData.gmail_access_token}` },
  });

  if (testResponse.ok) {
    return tokenData.gmail_access_token;
  }

  if (tokenData.gmail_refresh_token) {
    return await refreshAccessToken(supabase, userId, tokenData.gmail_refresh_token);
  }

  throw new Error('Gmail access token expired');
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
