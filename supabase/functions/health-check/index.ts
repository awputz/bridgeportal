import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: { status: string; latencyMs: number };
    storage: { status: string };
    auth: { status: string };
  };
  metrics?: {
    transactionCount: number;
    activeAgents: number;
    activeListings: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[Health Check] Starting health check...');

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    checks: {
      database: { status: 'unknown', latencyMs: 0 },
      storage: { status: 'unknown' },
      auth: { status: 'unknown' },
    },
  };

  try {
    // Check database connectivity and measure latency
    const dbStart = performance.now();
    const { data: dbCheck, error: dbError } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true });
    
    const dbLatency = Math.round(performance.now() - dbStart);
    
    if (dbError) {
      result.checks.database = { status: 'error', latencyMs: dbLatency };
      result.status = 'degraded';
      console.error('[Health Check] Database check failed:', dbError.message);
    } else {
      result.checks.database = { 
        status: dbLatency > 1000 ? 'slow' : 'healthy', 
        latencyMs: dbLatency 
      };
      console.log(`[Health Check] Database healthy, latency: ${dbLatency}ms`);
    }

    // Check storage connectivity
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets();
    
    if (storageError) {
      result.checks.storage = { status: 'error' };
      result.status = 'degraded';
      console.error('[Health Check] Storage check failed:', storageError.message);
    } else {
      result.checks.storage = { status: 'healthy' };
      console.log(`[Health Check] Storage healthy, ${buckets?.length || 0} buckets`);
    }

    // Check auth service
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError && !authError.message.includes('session')) {
      result.checks.auth = { status: 'error' };
      result.status = 'degraded';
      console.error('[Health Check] Auth check failed:', authError.message);
    } else {
      result.checks.auth = { status: 'healthy' };
      console.log('[Health Check] Auth service healthy');
    }

    // Collect basic metrics (optional, only if all checks pass)
    if (result.status === 'healthy') {
      const [transactionCount, agentCount, listingCount] = await Promise.all([
        supabase.from('transactions').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('investment_listings').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      result.metrics = {
        transactionCount: transactionCount.count || 0,
        activeAgents: agentCount.count || 0,
        activeListings: listingCount.count || 0,
      };
      console.log('[Health Check] Metrics collected:', result.metrics);
    }

    // Determine final status
    const checkStatuses = Object.values(result.checks).map(c => c.status);
    if (checkStatuses.some(s => s === 'error')) {
      result.status = 'unhealthy';
    } else if (checkStatuses.some(s => s === 'slow')) {
      result.status = 'degraded';
    }

    console.log(`[Health Check] Complete - Status: ${result.status}`);

    return new Response(JSON.stringify(result), {
      status: result.status === 'unhealthy' ? 503 : 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Health Check] Critical error:', error);
    
    return new Response(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: result.checks,
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
