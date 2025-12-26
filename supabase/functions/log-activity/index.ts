import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createLogger } from "../_shared/logger.ts";
import { getCorrelationId, createResponseHeaders, getIpAddress } from "../_shared/context.ts";
import { checkRateLimit, getRateLimitConfig, getRateLimitIdentifier, rateLimitExceededResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-correlation-id",
};

interface ActivityLogRequest {
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  log_level?: string;
}

serve(async (req: Request): Promise<Response> => {
  const correlationId = getCorrelationId(req);
  const logger = createLogger('log-activity', correlationId);
  const startTime = Date.now();

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const endpoint = 'log-activity';
  const identifier = getRateLimitIdentifier(req);

  try {
    logger.requestStart(req.method, '/log-activity');

    // Check rate limit
    const rateLimitResult = await checkRateLimit(identifier, endpoint);
    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { identifier, endpoint });
      return rateLimitExceededResponse(rateLimitResult, getRateLimitConfig(endpoint), correlationId);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, entity_type, entity_id, details, log_level }: ActivityLogRequest = await req.json();

    if (!action) {
      logger.warn("Missing required field: action");
      return new Response(
        JSON.stringify({ error: "Missing required field: action" }),
        { status: 400, headers: createResponseHeaders(correlationId) }
      );
    }

    const userAgent = req.headers.get("user-agent") || null;
    const ipAddress = getIpAddress(req);
    const durationMs = Date.now() - startTime;

    logger.info(`Logging activity: ${action}`, { entity_type, entity_id });

    const { data, error } = await supabase
      .from("activity_logs")
      .insert({
        action,
        entity_type: entity_type || null,
        entity_id: entity_id || null,
        details: details || {},
        ip_address: ipAddress,
        user_agent: userAgent,
        correlation_id: correlationId,
        duration_ms: durationMs,
        log_level: log_level || 'info',
        function_name: 'log-activity',
      })
      .select()
      .single();

    if (error) {
      logger.error("Error inserting activity log", new Error(error.message));
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: createResponseHeaders(correlationId) }
      );
    }

    logger.requestEnd(req.method, '/log-activity', 200, { activityId: data.id });

    return new Response(
      JSON.stringify({ success: true, id: data.id, correlationId }),
      { 
        status: 200, 
        headers: { 
          ...createResponseHeaders(correlationId),
          ...rateLimitHeaders(rateLimitResult, getRateLimitConfig(endpoint)),
        } 
      }
    );
  } catch (error: unknown) {
    logger.error("Error in log-activity function", error instanceof Error ? error : new Error(String(error)));
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: createResponseHeaders(correlationId) }
    );
  }
});
