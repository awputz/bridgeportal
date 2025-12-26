-- Fix crm_contacts RLS policies to ensure agents only see their OWN contacts
-- First drop the existing overly-permissive policies

DROP POLICY IF EXISTS "Agents can view their own contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Agents can update their own contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Agents can delete their own contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Agents can create contacts" ON public.crm_contacts;

-- Create new properly-scoped policies
CREATE POLICY "Agents can view their own contacts"
ON public.crm_contacts
FOR SELECT
USING (auth.uid() = agent_id);

CREATE POLICY "Agents can create their own contacts"
ON public.crm_contacts
FOR INSERT
WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update their own contacts"
ON public.crm_contacts
FOR UPDATE
USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete their own contacts"
ON public.crm_contacts
FOR DELETE
USING (auth.uid() = agent_id);

-- Admins can view all contacts for admin panel purposes
CREATE POLICY "Admins can view all contacts"
ON public.crm_contacts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));