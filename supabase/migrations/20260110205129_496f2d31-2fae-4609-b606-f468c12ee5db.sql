-- Phase 2: Security Hardening - Update agent_templates RLS policies

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view active templates" ON agent_templates;
DROP POLICY IF EXISTS "Admins can manage templates" ON agent_templates;

-- New: Division-filtered viewing
-- Users can only view templates in their assigned division, marketing templates, or all if admin
CREATE POLICY "Users view templates by division" ON agent_templates
  FOR SELECT USING (
    is_active = true 
    AND (
      public.is_admin_user(auth.uid())
      OR division = public.get_user_division(auth.uid())
      OR division = 'marketing'
    )
  );

-- New: Only admins can manage templates (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins manage templates" ON agent_templates
  FOR ALL USING (public.is_admin_user(auth.uid()));