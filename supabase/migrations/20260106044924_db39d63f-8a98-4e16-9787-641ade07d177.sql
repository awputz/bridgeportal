-- Fix RLS policies to handle agents without assigned_division
-- The issue is agents with NULL assigned_division can't see any data

-- Drop the overly strict policies
DROP POLICY IF EXISTS "agents_see_own_division_deals" ON public.crm_deals;
DROP POLICY IF EXISTS "agents_create_own_division_deals" ON public.crm_deals;
DROP POLICY IF EXISTS "agents_update_own_division_deals" ON public.crm_deals;
DROP POLICY IF EXISTS "agents_delete_own_division_deals" ON public.crm_deals;

DROP POLICY IF EXISTS "agents_see_own_division_contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "agents_create_own_division_contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "agents_update_own_division_contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "agents_delete_own_division_contacts" ON public.crm_contacts;

DROP POLICY IF EXISTS "agents_see_own_division_activities" ON public.crm_activities;
DROP POLICY IF EXISTS "agents_create_own_division_activities" ON public.crm_activities;
DROP POLICY IF EXISTS "agents_update_own_division_activities" ON public.crm_activities;
DROP POLICY IF EXISTS "agents_delete_own_division_activities" ON public.crm_activities;

-- CRM DEALS: Admins see all, agents see own division OR own deals if no division assigned
CREATE POLICY "division_deals_select" ON public.crm_deals
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_deals_insert" ON public.crm_deals
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_deals_update" ON public.crm_deals
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_deals_delete" ON public.crm_deals
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

-- CRM CONTACTS: Same pattern
CREATE POLICY "division_contacts_select" ON public.crm_contacts
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_contacts_insert" ON public.crm_contacts
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_contacts_update" ON public.crm_contacts
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_contacts_delete" ON public.crm_contacts
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

-- CRM ACTIVITIES: Same pattern
CREATE POLICY "division_activities_select" ON public.crm_activities
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_activities_insert" ON public.crm_activities
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_activities_update" ON public.crm_activities
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );

CREATE POLICY "division_activities_delete" ON public.crm_activities
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid() AND (
        public.get_user_division(auth.uid()) IS NULL 
        OR division = public.get_user_division(auth.uid())
      )
    )
  );