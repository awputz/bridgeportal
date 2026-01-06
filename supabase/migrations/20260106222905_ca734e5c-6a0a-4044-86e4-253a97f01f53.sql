-- Fix agent_notes RLS - CRITICAL SECURITY FIX
-- Current policy allows ANY agent to access ALL notes

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Agents can manage their own notes" ON agent_notes;

-- Create proper SELECT policy (agent sees own + admin sees all)
CREATE POLICY "Agents can view own notes"
ON agent_notes FOR SELECT
USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

-- Create proper INSERT policy (agent can only create for themselves)
CREATE POLICY "Agents can create own notes"
ON agent_notes FOR INSERT
WITH CHECK (agent_id = auth.uid());

-- Create proper UPDATE policy
CREATE POLICY "Agents can update own notes"
ON agent_notes FOR UPDATE
USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()))
WITH CHECK (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

-- Create proper DELETE policy
CREATE POLICY "Agents can delete own notes"
ON agent_notes FOR DELETE
USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

-- Restrict user_roles visibility (defense in depth)
DROP POLICY IF EXISTS "Users can view user_roles" ON user_roles;
CREATE POLICY "Users can view own role or admin sees all"
ON user_roles FOR SELECT
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));