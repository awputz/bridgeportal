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

    const { property_id, user_id, view_type, session_id, metadata } = await req.json();

    const referrer = req.headers.get('referer') || req.headers.get('referrer') || 'direct';

    console.log(`Tracking view: ${view_type} for property ${property_id}`);

    // Insert analytics record
    const { data, error } = await supabaseClient
      .from('property_analytics')
      .insert({
        property_id,
        user_id: user_id || null,
        view_type: view_type || 'page_view',
        session_id: session_id || null,
        referrer,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`View tracked: ${data.id}`);

    return new Response(
      JSON.stringify({ success: true, analytics_id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in track-view:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
