-- Create hr_agents table for recruitment targets
CREATE TABLE public.hr_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  current_brokerage TEXT,
  division TEXT CHECK (division IN ('investment-sales', 'commercial-leasing', 'residential', 'capital-advisory')),
  years_experience INTEGER,
  annual_production BIGINT,
  linkedin_url TEXT,
  photo_url TEXT,
  poachability_score INTEGER CHECK (poachability_score >= 1 AND poachability_score <= 100),
  recruitment_status TEXT NOT NULL DEFAULT 'cold' CHECK (recruitment_status IN ('cold', 'contacted', 'warm', 'qualified', 'hot', 'offer-made', 'hired', 'lost')),
  last_contacted_at TIMESTAMPTZ,
  next_action TEXT,
  notes TEXT,
  source TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create hr_interactions table
CREATE TABLE public.hr_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.hr_agents(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email', 'call', 'meeting', 'linkedin', 'text', 'other')),
  interaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  outcome TEXT CHECK (outcome IN ('positive', 'neutral', 'negative')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create hr_campaigns table
CREATE TABLE public.hr_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  division TEXT,
  email_template TEXT,
  email_subject TEXT,
  target_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create hr_offers table
CREATE TABLE public.hr_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.hr_agents(id) ON DELETE CASCADE,
  division TEXT NOT NULL,
  commission_split TEXT,
  signing_bonus DECIMAL(12,2),
  start_date DATE,
  special_terms TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'declined', 'expired')),
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create hr_interviews table
CREATE TABLE public.hr_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.hr_agents(id) ON DELETE CASCADE,
  interviewer_name TEXT NOT NULL,
  interview_date TIMESTAMPTZ NOT NULL,
  interview_type TEXT DEFAULT 'in-person' CHECK (interview_type IN ('in-person', 'video', 'phone')),
  scorecard JSONB,
  decision TEXT CHECK (decision IN ('strong-hire', 'hire', 'maybe', 'pass')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hr_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_interviews ENABLE ROW LEVEL SECURITY;

-- Create helper function for HR admin check
CREATE OR REPLACE FUNCTION public.is_hr_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
    AND role = 'hr_admin'
  )
$$;

-- RLS Policies for hr_agents
CREATE POLICY "HR admins can view agents" ON public.hr_agents
  FOR SELECT TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can insert agents" ON public.hr_agents
  FOR INSERT TO authenticated
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update agents" ON public.hr_agents
  FOR UPDATE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can delete agents" ON public.hr_agents
  FOR DELETE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

-- RLS Policies for hr_interactions
CREATE POLICY "HR admins can view interactions" ON public.hr_interactions
  FOR SELECT TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can insert interactions" ON public.hr_interactions
  FOR INSERT TO authenticated
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update interactions" ON public.hr_interactions
  FOR UPDATE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can delete interactions" ON public.hr_interactions
  FOR DELETE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

-- RLS Policies for hr_campaigns
CREATE POLICY "HR admins can view campaigns" ON public.hr_campaigns
  FOR SELECT TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can insert campaigns" ON public.hr_campaigns
  FOR INSERT TO authenticated
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update campaigns" ON public.hr_campaigns
  FOR UPDATE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can delete campaigns" ON public.hr_campaigns
  FOR DELETE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

-- RLS Policies for hr_offers
CREATE POLICY "HR admins can view offers" ON public.hr_offers
  FOR SELECT TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can insert offers" ON public.hr_offers
  FOR INSERT TO authenticated
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update offers" ON public.hr_offers
  FOR UPDATE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can delete offers" ON public.hr_offers
  FOR DELETE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

-- RLS Policies for hr_interviews
CREATE POLICY "HR admins can view interviews" ON public.hr_interviews
  FOR SELECT TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can insert interviews" ON public.hr_interviews
  FOR INSERT TO authenticated
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update interviews" ON public.hr_interviews
  FOR UPDATE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can delete interviews" ON public.hr_interviews
  FOR DELETE TO authenticated
  USING (public.is_hr_admin(auth.uid()));

-- Auto-update triggers for updated_at
CREATE TRIGGER update_hr_agents_updated_at
  BEFORE UPDATE ON public.hr_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_campaigns_updated_at
  BEFORE UPDATE ON public.hr_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_offers_updated_at
  BEFORE UPDATE ON public.hr_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for hr_agents
ALTER PUBLICATION supabase_realtime ADD TABLE public.hr_agents;