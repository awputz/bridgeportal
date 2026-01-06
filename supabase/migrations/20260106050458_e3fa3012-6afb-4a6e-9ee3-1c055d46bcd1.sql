-- =============================================
-- Division-Based Access Control System
-- =============================================

-- 1. Ensure assigned_division column exists with proper constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles' 
    AND column_name = 'assigned_division'
  ) THEN
    ALTER TABLE public.user_roles 
    ADD COLUMN assigned_division TEXT 
    CHECK (assigned_division IS NULL OR assigned_division IN ('investment-sales', 'commercial-leasing', 'residential'));
  END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_assigned_division 
ON public.user_roles(assigned_division);

-- 2. Create/Update helper function to get user division
CREATE OR REPLACE FUNCTION public.get_user_division(_user_id uuid)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT assigned_division 
  FROM public.user_roles 
  WHERE user_id = _user_id 
  LIMIT 1
$$;

-- 3. Create/Update helper function to check if user is admin (only 'admin' role exists)
CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id uuid)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role = 'admin'
  )
$$;

-- =============================================
-- CRM DEALS - Division-Enforced RLS Policies
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view deals" ON public.crm_deals;
DROP POLICY IF EXISTS "Users can insert deals" ON public.crm_deals;
DROP POLICY IF EXISTS "Users can update deals" ON public.crm_deals;
DROP POLICY IF EXISTS "Users can delete deals" ON public.crm_deals;
DROP POLICY IF EXISTS "division_deals_select" ON public.crm_deals;
DROP POLICY IF EXISTS "division_deals_insert" ON public.crm_deals;
DROP POLICY IF EXISTS "division_deals_update" ON public.crm_deals;
DROP POLICY IF EXISTS "division_deals_delete" ON public.crm_deals;
DROP POLICY IF EXISTS "agents_see_own_division_deals" ON public.crm_deals;
DROP POLICY IF EXISTS "agents_create_own_division_deals" ON public.crm_deals;
DROP POLICY IF EXISTS "agents_update_own_division_deals" ON public.crm_deals;
DROP POLICY IF EXISTS "agents_delete_own_division_deals" ON public.crm_deals;

-- Create strict division-enforced policies for crm_deals
CREATE POLICY "division_deals_select" ON public.crm_deals
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

CREATE POLICY "division_deals_insert" ON public.crm_deals
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND (division IS NULL OR division = public.get_user_division(auth.uid()))
    )
  );

CREATE POLICY "division_deals_update" ON public.crm_deals
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

CREATE POLICY "division_deals_delete" ON public.crm_deals
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

-- =============================================
-- CRM CONTACTS - Division-Enforced RLS Policies
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Users can insert contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Users can update contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Users can delete contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Users can view own contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "division_contacts_select" ON public.crm_contacts;
DROP POLICY IF EXISTS "division_contacts_insert" ON public.crm_contacts;
DROP POLICY IF EXISTS "division_contacts_update" ON public.crm_contacts;
DROP POLICY IF EXISTS "division_contacts_delete" ON public.crm_contacts;
DROP POLICY IF EXISTS "agents_see_own_division_contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "agents_create_own_division_contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "agents_update_own_division_contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "agents_delete_own_division_contacts" ON public.crm_contacts;

-- Create strict division-enforced policies for crm_contacts
CREATE POLICY "division_contacts_select" ON public.crm_contacts
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

CREATE POLICY "division_contacts_insert" ON public.crm_contacts
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND (division IS NULL OR division = public.get_user_division(auth.uid()))
    )
  );

CREATE POLICY "division_contacts_update" ON public.crm_contacts
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

CREATE POLICY "division_contacts_delete" ON public.crm_contacts
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

-- =============================================
-- CRM ACTIVITIES - Division-Enforced RLS Policies
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view activities" ON public.crm_activities;
DROP POLICY IF EXISTS "Users can insert activities" ON public.crm_activities;
DROP POLICY IF EXISTS "Users can update activities" ON public.crm_activities;
DROP POLICY IF EXISTS "Users can delete activities" ON public.crm_activities;
DROP POLICY IF EXISTS "division_activities_select" ON public.crm_activities;
DROP POLICY IF EXISTS "division_activities_insert" ON public.crm_activities;
DROP POLICY IF EXISTS "division_activities_update" ON public.crm_activities;
DROP POLICY IF EXISTS "division_activities_delete" ON public.crm_activities;
DROP POLICY IF EXISTS "agents_see_own_division_activities" ON public.crm_activities;
DROP POLICY IF EXISTS "agents_create_own_division_activities" ON public.crm_activities;
DROP POLICY IF EXISTS "agents_update_own_division_activities" ON public.crm_activities;
DROP POLICY IF EXISTS "agents_delete_own_division_activities" ON public.crm_activities;

-- Create strict division-enforced policies for crm_activities
CREATE POLICY "division_activities_select" ON public.crm_activities
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

CREATE POLICY "division_activities_insert" ON public.crm_activities
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND (division IS NULL OR division = public.get_user_division(auth.uid()))
    )
  );

CREATE POLICY "division_activities_update" ON public.crm_activities
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

CREATE POLICY "division_activities_delete" ON public.crm_activities
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR (
      agent_id = auth.uid()
      AND public.get_user_division(auth.uid()) IS NOT NULL
      AND division = public.get_user_division(auth.uid())
    )
  );

-- =============================================
-- Auto-Assignment Triggers
-- =============================================

-- Create function to auto-assign division on insert
CREATE OR REPLACE FUNCTION public.auto_assign_user_division()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.division IS NULL THEN
    NEW.division := public.get_user_division(auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply triggers to CRM tables
DROP TRIGGER IF EXISTS auto_assign_division_deals ON public.crm_deals;
CREATE TRIGGER auto_assign_division_deals
  BEFORE INSERT ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_user_division();

DROP TRIGGER IF EXISTS auto_assign_division_contacts ON public.crm_contacts;
CREATE TRIGGER auto_assign_division_contacts
  BEFORE INSERT ON public.crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_user_division();

DROP TRIGGER IF EXISTS auto_assign_division_activities ON public.crm_activities;
CREATE TRIGGER auto_assign_division_activities
  BEFORE INSERT ON public.crm_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_user_division();