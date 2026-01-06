-- Phase 4: Clean up duplicate user_roles SELECT policy
-- The old permissive policy overrides the restrictive one from Phase 3

DROP POLICY IF EXISTS "Authenticated users can view roles" ON user_roles;