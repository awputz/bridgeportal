-- =============================================
-- PHASE 1-2: SECURITY HARDENING & CLEANUP
-- =============================================

-- 1. Create profiles_public view for minimal public access
CREATE OR REPLACE VIEW profiles_public AS
SELECT id, full_name, avatar_url 
FROM profiles
WHERE id IN (SELECT user_id FROM user_roles WHERE role IN ('agent', 'admin'));

-- Grant public read access to minimal view only
GRANT SELECT ON profiles_public TO anon;
GRANT SELECT ON profiles_public TO authenticated;

-- 2. Revoke anon access from agent_dashboard_stats (internal only)
REVOKE SELECT ON agent_dashboard_stats FROM anon;

-- 3. Clean up duplicate RLS policies on deal_room_registrations
DROP POLICY IF EXISTS "Anyone can submit deal room registration" ON deal_room_registrations;
DROP POLICY IF EXISTS "Anyone can register for deal room access" ON deal_room_registrations;
-- Keep only "Anyone can register for deal room" which should exist

-- 4. Update agent_applications to be more secure
-- Drop the email-based policy if it exists
DROP POLICY IF EXISTS "Applicants can view own application by email" ON agent_applications;

-- Ensure only admins and authenticated users (for their own apps) can view
DROP POLICY IF EXISTS "Admins view all applications" ON agent_applications;
CREATE POLICY "Admins view all applications"
ON agent_applications FOR SELECT
USING (public.is_admin_user(auth.uid()));

-- 5. Create client_errors table for error telemetry
CREATE TABLE IF NOT EXISTS client_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  section TEXT,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  component_stack TEXT,
  user_agent TEXT,
  url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_errors_created ON client_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_errors_user ON client_errors(user_id);

ALTER TABLE client_errors ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated) to insert errors for debugging
CREATE POLICY "Anyone can insert errors"
ON client_errors FOR INSERT
WITH CHECK (true);

-- Only admins can view errors
CREATE POLICY "Admins view all errors"
ON client_errors FOR SELECT
USING (public.is_admin_user(auth.uid()));