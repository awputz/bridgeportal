-- Add assigned_division to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS assigned_division TEXT 
CHECK (assigned_division IS NULL OR assigned_division IN ('investment-sales', 'commercial-leasing', 'residential'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_assigned_division 
ON public.user_roles(assigned_division);

-- Create helper function to get user division (SECURITY DEFINER to avoid RLS recursion)
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

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id uuid)
RETURNS boolean
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

-- Drop existing policies on crm_deals
DROP POLICY IF EXISTS "Agents can view deals" ON public.crm_deals;
DROP POLICY IF EXISTS "Agents can create deals" ON public.crm_deals;
DROP POLICY IF EXISTS "Agents can update deals" ON public.crm_deals;
DROP POLICY IF EXISTS "Agents can delete deals" ON public.crm_deals;

-- Create new division-enforced policies for crm_deals
CREATE POLICY "agents_see_own_division_deals" ON public.crm_deals
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR
    division = public.get_user_division(auth.uid())
  );

CREATE POLICY "agents_create_own_division_deals" ON public.crm_deals
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR
    division = public.get_user_division(auth.uid())
  );

CREATE POLICY "agents_update_own_division_deals" ON public.crm_deals
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR
    division = public.get_user_division(auth.uid())
  );

CREATE POLICY "agents_delete_own_division_deals" ON public.crm_deals
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR
    division = public.get_user_division(auth.uid())
  );

-- Drop existing policies on crm_contacts
DROP POLICY IF EXISTS "Agents can view their own contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Agents can create their own contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Agents can update their own contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Agents can delete their own contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.crm_contacts;

-- Create new division-enforced policies for crm_contacts
CREATE POLICY "agents_see_own_division_contacts" ON public.crm_contacts
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR
    (agent_id = auth.uid() AND division = public.get_user_division(auth.uid()))
  );

CREATE POLICY "agents_create_own_division_contacts" ON public.crm_contacts
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR
    (agent_id = auth.uid() AND division = public.get_user_division(auth.uid()))
  );

CREATE POLICY "agents_update_own_division_contacts" ON public.crm_contacts
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR
    (agent_id = auth.uid() AND division = public.get_user_division(auth.uid()))
  );

CREATE POLICY "agents_delete_own_division_contacts" ON public.crm_contacts
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR
    (agent_id = auth.uid() AND division = public.get_user_division(auth.uid()))
  );

-- Drop existing policies on crm_activities
DROP POLICY IF EXISTS "Agents can view activities" ON public.crm_activities;
DROP POLICY IF EXISTS "Agents can create activities" ON public.crm_activities;
DROP POLICY IF EXISTS "Agents can update activities" ON public.crm_activities;
DROP POLICY IF EXISTS "Agents can delete activities" ON public.crm_activities;

-- Create new division-enforced policies for crm_activities
CREATE POLICY "agents_see_own_division_activities" ON public.crm_activities
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR
    division = public.get_user_division(auth.uid())
  );

CREATE POLICY "agents_create_own_division_activities" ON public.crm_activities
  FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR
    division = public.get_user_division(auth.uid())
  );

CREATE POLICY "agents_update_own_division_activities" ON public.crm_activities
  FOR UPDATE
  USING (
    public.is_admin_user(auth.uid())
    OR
    division = public.get_user_division(auth.uid())
  );

CREATE POLICY "agents_delete_own_division_activities" ON public.crm_activities
  FOR DELETE
  USING (
    public.is_admin_user(auth.uid())
    OR
    division = public.get_user_division(auth.uid())
  );

-- Function to auto-assign division on insert
CREATE OR REPLACE FUNCTION public.auto_assign_user_division()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.division IS NULL THEN
    NEW.division := public.get_user_division(auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply triggers for auto-assignment
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