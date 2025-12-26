/**
 * Request Context Manager
 * Extracts and manages request context including correlation IDs and user info
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface RequestContext {
  correlationId: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  method: string;
  path: string;
  startTime: number;
}

/**
 * Extract correlation ID from request headers or generate new one
 */
export function getCorrelationId(req: Request): string {
  return req.headers.get('x-correlation-id') || 
         req.headers.get('x-request-id') || 
         crypto.randomUUID();
}

/**
 * Extract IP address from request
 */
export function getIpAddress(req: Request): string | undefined {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || undefined;
}

/**
 * Extract user info from JWT token
 */
export async function getUserFromRequest(req: Request): Promise<{ userId?: string; email?: string }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {};
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return {};
    }

    return {
      userId: user.id,
      email: user.email,
    };
  } catch {
    return {};
  }
}

/**
 * Build complete request context
 */
export async function buildRequestContext(req: Request): Promise<RequestContext> {
  const url = new URL(req.url);
  const userInfo = await getUserFromRequest(req);

  return {
    correlationId: getCorrelationId(req),
    userId: userInfo.userId,
    userEmail: userInfo.email,
    ipAddress: getIpAddress(req),
    userAgent: req.headers.get('user-agent') || undefined,
    method: req.method,
    path: url.pathname,
    startTime: Date.now(),
  };
}

/**
 * Create CORS headers with correlation ID
 */
export function createCorsHeaders(correlationId: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-correlation-id',
    'Access-Control-Expose-Headers': 'x-correlation-id',
    'X-Correlation-Id': correlationId,
  };
}

/**
 * Create standard response headers
 */
export function createResponseHeaders(correlationId: string, contentType = 'application/json'): HeadersInit {
  return {
    ...createCorsHeaders(correlationId),
    'Content-Type': contentType,
  };
}
