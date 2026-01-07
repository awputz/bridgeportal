-- Fix crm_deal_history RLS policy to require authentication for INSERT/UPDATE
-- Currently allows any INSERT with `true`, which should require authenticated user

-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert deal history" ON public.crm_deal_history;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.crm_deal_history;

-- Create a new secure INSERT policy that requires the user to be an admin or agent
CREATE POLICY "Authenticated agents can insert deal history" 
ON public.crm_deal_history 
FOR INSERT 
TO authenticated
WITH CHECK (
  is_admin_or_agent(auth.uid())
);