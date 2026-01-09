-- Phase 4: Active Agent Management System

-- 1. Create active_agents table
CREATE TABLE public.active_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hr_agent_id UUID REFERENCES public.hr_agents(id) ON DELETE SET NULL,
  user_id UUID,
  
  -- Employee Information
  employee_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  division TEXT NOT NULL,
  
  -- Employment Details
  hire_date DATE NOT NULL,
  start_date DATE,
  contract_id UUID REFERENCES public.hr_contracts(id) ON DELETE SET NULL,
  commission_split TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'onboarding',
  onboarding_completed_at TIMESTAMPTZ,
  
  -- Performance
  ytd_production DECIMAL(15,2) DEFAULT 0,
  deals_closed INTEGER DEFAULT 0,
  last_deal_date DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID
);

-- 2. Create agent_onboarding table (10-item checklist)
CREATE TABLE public.agent_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_agent_id UUID NOT NULL REFERENCES public.active_agents(id) ON DELETE CASCADE,
  
  -- Item 1: Contract
  contract_signed BOOLEAN DEFAULT false,
  contract_signed_at TIMESTAMPTZ,
  
  -- Item 2: License
  license_verified BOOLEAN DEFAULT false,
  license_verified_at TIMESTAMPTZ,
  license_number TEXT,
  license_expiry DATE,
  
  -- Item 3: Background Check
  background_check_passed BOOLEAN DEFAULT false,
  background_check_at TIMESTAMPTZ,
  
  -- Item 4: W9
  w9_submitted BOOLEAN DEFAULT false,
  w9_submitted_at TIMESTAMPTZ,
  
  -- Item 5: Direct Deposit
  direct_deposit_setup BOOLEAN DEFAULT false,
  direct_deposit_at TIMESTAMPTZ,
  
  -- Item 6: Email Account
  email_account_created BOOLEAN DEFAULT false,
  email_account_at TIMESTAMPTZ,
  company_email TEXT,
  
  -- Item 7: CRM Access
  crm_access_granted BOOLEAN DEFAULT false,
  crm_access_at TIMESTAMPTZ,
  
  -- Item 8: Training
  training_completed BOOLEAN DEFAULT false,
  training_completed_at TIMESTAMPTZ,
  
  -- Item 9: Headshot
  headshot_uploaded BOOLEAN DEFAULT false,
  headshot_url TEXT,
  headshot_at TIMESTAMPTZ,
  
  -- Item 10: Bio
  bio_submitted BOOLEAN DEFAULT false,
  bio_text TEXT,
  bio_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(active_agent_id)
);

-- 3. Create agent_compliance table
CREATE TABLE public.agent_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_agent_id UUID NOT NULL REFERENCES public.active_agents(id) ON DELETE CASCADE,
  
  -- License Details
  license_type TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_state TEXT NOT NULL DEFAULT 'NY',
  issue_date DATE,
  expiry_date DATE NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active',
  renewal_reminder_sent BOOLEAN DEFAULT false,
  
  -- Document
  document_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.active_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_compliance ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for active_agents (using existing is_hr_admin function)
CREATE POLICY "HR admins can view all active agents"
  ON public.active_agents FOR SELECT
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can insert active agents"
  ON public.active_agents FOR INSERT
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update active agents"
  ON public.active_agents FOR UPDATE
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can delete active agents"
  ON public.active_agents FOR DELETE
  USING (public.is_hr_admin(auth.uid()));

-- 6. RLS Policies for agent_onboarding
CREATE POLICY "HR admins can view all onboarding"
  ON public.agent_onboarding FOR SELECT
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can insert onboarding"
  ON public.agent_onboarding FOR INSERT
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update onboarding"
  ON public.agent_onboarding FOR UPDATE
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can delete onboarding"
  ON public.agent_onboarding FOR DELETE
  USING (public.is_hr_admin(auth.uid()));

-- 7. RLS Policies for agent_compliance
CREATE POLICY "HR admins can view all compliance"
  ON public.agent_compliance FOR SELECT
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can insert compliance"
  ON public.agent_compliance FOR INSERT
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update compliance"
  ON public.agent_compliance FOR UPDATE
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can delete compliance"
  ON public.agent_compliance FOR DELETE
  USING (public.is_hr_admin(auth.uid()));

-- 8. Create indexes
CREATE INDEX idx_active_agents_status ON public.active_agents(status);
CREATE INDEX idx_active_agents_division ON public.active_agents(division);
CREATE INDEX idx_active_agents_hr_agent_id ON public.active_agents(hr_agent_id);
CREATE INDEX idx_agent_compliance_expiry ON public.agent_compliance(expiry_date);
CREATE INDEX idx_agent_compliance_status ON public.agent_compliance(status);

-- 9. Update triggers
CREATE TRIGGER update_active_agents_updated_at
  BEFORE UPDATE ON public.active_agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_onboarding_updated_at
  BEFORE UPDATE ON public.agent_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_compliance_updated_at
  BEFORE UPDATE ON public.agent_compliance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();