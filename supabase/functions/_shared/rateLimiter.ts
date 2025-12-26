/**
 * Rate Limiter for Edge Functions
 * Sliding window rate limiting with per-user and per-IP limits
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
  bypassRoles?: string[];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}

// Rate limit configurations by endpoint
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'ai-chat': { windowSeconds: 60, maxRequests: 15 },
  'notes-ai': { windowSeconds: 60, maxRequests: 20 },
  'gmail-send': { windowSeconds: 60, maxRequests: 30 },
  'gmail-messages': { windowSeconds: 60, maxRequests: 60 },
  'gmail-labels': { windowSeconds: 60, maxRequests: 30 },
  'gmail-auth': { windowSeconds: 60, maxRequests: 10 },
  'google-calendar-auth': { windowSeconds: 60, maxRequests: 10 },
  'google-calendar-events': { windowSeconds: 60, maxRequests: 60 },
  'google-contacts-auth': { windowSeconds: 60, maxRequests: 10 },
  'google-contacts-list': { windowSeconds: 60, maxRequests: 60 },
  'google-contacts-import': { windowSeconds: 60, maxRequests: 10 },
  'google-drive-auth': { windowSeconds: 60, maxRequests: 10 },
  'google-drive-files': { windowSeconds: 60, maxRequests: 60 },
  'google-unified-auth': { windowSeconds: 60, maxRequests: 20 },
  'submit-inquiry': { windowSeconds: 3600, maxRequests: 5 },
  'send-notification': { windowSeconds: 60, maxRequests: 30 },
  'log-activity': { windowSeconds: 60, maxRequests: 100 },
  'health-check': { windowSeconds: 60, maxRequests: 60 },
  'create-agent-accounts': { windowSeconds: 60, maxRequests: 5, bypassRoles: ['admin'] },
  'create-investor-accounts': { windowSeconds: 60, maxRequests: 5, bypassRoles: ['admin'] },
  'default': { windowSeconds: 60, maxRequests: 100 },
};

/**
 * Get Supabase client with service role for rate limit operations
 */
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Get the rate limit configuration for an endpoint
 */
export function getRateLimitConfig(endpoint: string): RateLimitConfig {
  return RATE_LIMITS[endpoint] || RATE_LIMITS['default'];
}

/**
 * Check and update rate limit for an identifier
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string
): Promise<RateLimitResult> {
  const config = getRateLimitConfig(endpoint);
  const supabase = getSupabaseClient();
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowSeconds * 1000);

  try {
    // Get current request count in window
    const { data: existing, error: selectError } = await supabase
      .from('rate_limits')
      .select('request_count, window_start')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .order('window_start', { ascending: false })
      .limit(1)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // Error other than "no rows"
      console.error('Rate limit check error:', selectError);
      // On error, allow the request but log it
      return { allowed: true, remaining: config.maxRequests, resetAt: now };
    }

    let currentCount = 0;
    let resetAt = new Date(now.getTime() + config.windowSeconds * 1000);

    if (existing) {
      currentCount = existing.request_count;
      resetAt = new Date(new Date(existing.window_start).getTime() + config.windowSeconds * 1000);
    }

    // Check if limit exceeded
    if (currentCount >= config.maxRequests) {
      const retryAfter = Math.ceil((resetAt.getTime() - now.getTime()) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter: Math.max(1, retryAfter),
      };
    }

    // Increment counter
    if (existing) {
      await supabase
        .from('rate_limits')
        .update({ request_count: currentCount + 1 })
        .eq('identifier', identifier)
        .eq('endpoint', endpoint)
        .eq('window_start', existing.window_start);
    } else {
      await supabase.from('rate_limits').insert({
        identifier,
        endpoint,
        request_count: 1,
        window_start: now.toISOString(),
      });
    }

    return {
      allowed: true,
      remaining: config.maxRequests - currentCount - 1,
      resetAt,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow the request
    return { allowed: true, remaining: config.maxRequests, resetAt: now };
  }
}

/**
 * Create rate limit response headers
 */
export function rateLimitHeaders(result: RateLimitResult, config: RateLimitConfig): HeadersInit {
  const headers: HeadersInit = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(result.resetAt.getTime() / 1000).toString(),
  };

  if (!result.allowed && result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Create a 429 Too Many Requests response
 */
export function rateLimitExceededResponse(
  result: RateLimitResult,
  config: RateLimitConfig,
  correlationId: string
): Response {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please retry after ${result.retryAfter} seconds.`,
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-correlation-id',
        'X-Correlation-Id': correlationId,
        ...rateLimitHeaders(result, config),
      },
    }
  );
}

/**
 * Get identifier for rate limiting (user ID or IP)
 */
export function getRateLimitIdentifier(req: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return `ip:${forwardedFor.split(',')[0].trim()}`;
  }

  return `ip:${req.headers.get('x-real-ip') || 'unknown'}`;
}

/**
 * Cleanup old rate limit entries (call periodically)
 */
export async function cleanupRateLimits(): Promise<number> {
  try {
    const supabase = getSupabaseClient();
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('rate_limits')
      .delete()
      .lt('window_start', twoHoursAgo.toISOString())
      .select('id');

    if (error) {
      console.error('Rate limit cleanup error:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Rate limit cleanup error:', error);
    return 0;
  }
}
