-- Phase 5: Enhanced Activity Logs
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS correlation_id uuid;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS duration_ms integer;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS log_level text DEFAULT 'info';
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS stack_trace text;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS function_name text;

-- Index for correlation ID lookups
CREATE INDEX IF NOT EXISTS idx_activity_logs_correlation ON activity_logs(correlation_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_function ON activity_logs(function_name);
CREATE INDEX IF NOT EXISTS idx_activity_logs_level ON activity_logs(log_level);

-- Phase 6: Cache Entries Table
CREATE TABLE IF NOT EXISTS cache_entries (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  hit_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Index for cache expiry cleanup
CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache_entries(expires_at);

-- Enable RLS on cache_entries
ALTER TABLE cache_entries ENABLE ROW LEVEL SECURITY;

-- Cache is system-managed, only service role can access
CREATE POLICY "Service role can manage cache" ON cache_entries FOR ALL USING (true);

-- Phase 7: Rate Limits Table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Index for fast rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- Enable RLS on rate_limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limits are system-managed
CREATE POLICY "Service role can manage rate limits" ON rate_limits FOR ALL USING (true);

-- Cleanup function for old rate limit entries
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM rate_limits WHERE window_start < now() - interval '2 hours';
$$;

-- Cleanup function for expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM cache_entries WHERE expires_at < now();
$$;