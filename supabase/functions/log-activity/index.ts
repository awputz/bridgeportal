import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, entity_type, entity_id, details, user_id } = await req.json();

    // Get request metadata
    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';

    console.log(`Logging activity: ${action} on ${entity_type}/${entity_id}`);

    // Insert activity log
    const { data, error } = await supabaseClient
      .from('activity_logs')
      .insert({
        user_id: user_id || null,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        user_agent
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`Activity logged: ${data.id}`);

    return new Response(
      JSON.stringify({ success: true, log_id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in log-activity:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
