-- Fix RLS policy on profiles table for intake agent selection
-- The old policy checked user_type = 'agent' but that column is always null
-- This new policy checks the user_roles table instead

DROP POLICY IF EXISTS "Public can view agent profiles for intake" ON profiles;

CREATE POLICY "Public can view agent profiles for intake"
ON profiles FOR SELECT TO anon
USING (
  id IN (
    SELECT user_id FROM user_roles 
    WHERE role IN ('agent', 'admin')
  )
);