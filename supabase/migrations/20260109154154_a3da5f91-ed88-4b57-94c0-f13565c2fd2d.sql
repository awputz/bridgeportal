-- Phase 1: Create unified agents table for HR-BRIDGE sync
-- This replaces both hr_agents and active_agents with a single source of truth

-- Step 1: Create the unified agents table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  home_address TEXT,
  date_of_birth DATE,
  
  -- Employment lifecycle status
  -- Values: candidate, recruited, onboarding, active, on_leave, terminated
  employment_status TEXT NOT NULL DEFAULT 'candidate',
  
  -- Recruitment fields (used during candidate/recruited phase)
  recruitment_status TEXT DEFAULT 'cold',
  current_brokerage TEXT,
  poachability_score INTEGER CHECK (poachability_score >= 1 AND poachability_score <= 10),
  annual_production DECIMAL(12,2),
  years_experience INTEGER,
  last_contacted_at TIMESTAMPTZ,
  next_action TEXT,
  source TEXT,
  notes TEXT,
  linkedin_url TEXT,
  
  -- Employment fields (used when active)
  employee_id TEXT,
  hire_date DATE,
  start_date DATE,
  division TEXT,
  commission_split TEXT,
  
  -- License & Compliance
  license_number TEXT,
  license_state TEXT DEFAULT 'NY',
  license_expiration DATE,
  
  -- Contract reference
  contract_id UUID,
  
  -- Link to original hr_agent_id for migration tracking
  hr_agent_id UUID,
  
  -- Performance metrics (auto-updated from deals)
  ytd_commission DECIMAL(12,2) DEFAULT 0,
  ytd_deals INTEGER DEFAULT 0,
  ytd_volume DECIMAL(14,2) DEFAULT 0,
  onboarding_completed_at TIMESTAMPTZ,
  last_deal_date DATE,
  
  -- Linked to auth user when active
  user_id UUID,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID
);

-- Step 2: Create indexes for performance
CREATE INDEX idx_agents_email ON public.agents(email);
CREATE INDEX idx_agents_employment_status ON public.agents(employment_status);
CREATE INDEX idx_agents_recruitment_status ON public.agents(recruitment_status);
CREATE INDEX idx_agents_division ON public.agents(division);
CREATE INDEX idx_agents_user_id ON public.agents(user_id);

-- Step 3: Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- HR admins can manage ALL agents
CREATE POLICY "HR admins can manage all agents"
ON public.agents FOR ALL TO authenticated
USING (public.is_admin_user(auth.uid()));

-- Active agents can view other active/onboarding agents
CREATE POLICY "Active agents can view active agents"
ON public.agents FOR SELECT TO authenticated
USING (
  employment_status IN ('active', 'onboarding')
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'agent')
  )
);

-- Agents can update their own profile
CREATE POLICY "Agents can update own profile"
ON public.agents FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Step 5: Create updated_at trigger
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 6: Migrate data from hr_agents (candidates/recruited)
INSERT INTO public.agents (
  id,
  full_name,
  email,
  phone,
  photo_url,
  employment_status,
  recruitment_status,
  current_brokerage,
  poachability_score,
  annual_production,
  years_experience,
  last_contacted_at,
  next_action,
  source,
  notes,
  linkedin_url,
  division,
  created_at,
  updated_at,
  created_by
)
SELECT 
  id,
  full_name,
  email,
  phone,
  photo_url,
  CASE 
    WHEN recruitment_status = 'hired' THEN 'recruited'
    ELSE 'candidate'
  END as employment_status,
  recruitment_status,
  current_brokerage,
  poachability_score,
  annual_production,
  years_experience,
  last_contacted_at,
  next_action,
  source,
  notes,
  linkedin_url,
  division,
  created_at,
  updated_at,
  created_by
FROM public.hr_agents
ON CONFLICT (id) DO NOTHING;

-- Step 7: Migrate data from active_agents (active employees)
INSERT INTO public.agents (
  id,
  full_name,
  email,
  phone,
  employment_status,
  employee_id,
  hire_date,
  start_date,
  division,
  commission_split,
  contract_id,
  hr_agent_id,
  ytd_commission,
  ytd_deals,
  onboarding_completed_at,
  last_deal_date,
  user_id,
  created_at,
  updated_at,
  created_by
)
SELECT 
  id,
  full_name,
  email,
  phone,
  CASE 
    WHEN status = 'active' THEN 'active'
    WHEN status = 'onboarding' THEN 'onboarding'
    WHEN status = 'on_leave' THEN 'on_leave'
    WHEN status = 'terminated' THEN 'terminated'
    ELSE 'active'
  END as employment_status,
  employee_id,
  hire_date,
  start_date,
  division,
  commission_split,
  contract_id,
  hr_agent_id,
  ytd_production as ytd_commission,
  deals_closed as ytd_deals,
  onboarding_completed_at,
  last_deal_date,
  user_id,
  created_at,
  updated_at,
  created_by
FROM public.active_agents
ON CONFLICT (id) DO NOTHING;

-- Step 8: Add HR audit logging trigger
CREATE TRIGGER log_agents_changes
AFTER INSERT OR UPDATE OR DELETE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.log_hr_changes();

-- Step 9: Create view for team directory (replaces team_members query for active agents)
CREATE OR REPLACE VIEW public.agents_directory AS
SELECT 
  id,
  full_name,
  email,
  phone,
  photo_url,
  bio,
  division,
  linkedin_url,
  license_number,
  employee_id,
  hire_date,
  start_date
FROM public.agents
WHERE employment_status = 'active';

-- Step 10: Create function to auto-generate employee ID
CREATE OR REPLACE FUNCTION public.generate_agent_employee_id()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
  division_prefix TEXT;
BEGIN
  -- Only generate if transitioning to active and no employee_id exists
  IF NEW.employment_status = 'active' AND NEW.employee_id IS NULL 
     AND (OLD IS NULL OR OLD.employment_status != 'active') THEN
    
    -- Get division prefix
    division_prefix := CASE NEW.division
      WHEN 'residential' THEN 'RES'
      WHEN 'investment-sales' THEN 'INV'
      WHEN 'commercial-leasing' THEN 'COM'
      ELSE 'AGT'
    END;
    
    -- Get next number
    SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM public.agents
    WHERE employee_id LIKE division_prefix || '%';
    
    NEW.employee_id := division_prefix || LPAD(next_num::TEXT, 4, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER generate_employee_id_trigger
BEFORE INSERT OR UPDATE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.generate_agent_employee_id();