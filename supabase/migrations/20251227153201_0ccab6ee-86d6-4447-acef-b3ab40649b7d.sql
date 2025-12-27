-- Create client intake links table
CREATE TABLE public.client_intake_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  link_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  division TEXT, -- null means all divisions
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create client intake submissions table
CREATE TABLE public.client_intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.client_intake_links(id) ON DELETE SET NULL,
  agent_id UUID NOT NULL,
  division TEXT NOT NULL,
  -- Client info
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_company TEXT,
  -- Criteria stored as JSONB for flexibility across divisions
  criteria JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new',
  contacted_at TIMESTAMP WITH TIME ZONE,
  -- CRM integration
  converted_contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  converted_deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_intake_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_intake_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_intake_links
CREATE POLICY "Agents can view their own links"
  ON public.client_intake_links FOR SELECT
  USING (agent_id = auth.uid() OR is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can create their own links"
  ON public.client_intake_links FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update their own links"
  ON public.client_intake_links FOR UPDATE
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can delete their own links"
  ON public.client_intake_links FOR DELETE
  USING (agent_id = auth.uid());

-- Public can view active links (for intake form)
CREATE POLICY "Anyone can view active links for intake"
  ON public.client_intake_links FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- RLS Policies for client_intake_submissions
CREATE POLICY "Agents can view their own submissions"
  ON public.client_intake_submissions FOR SELECT
  USING (agent_id = auth.uid() OR is_admin_or_agent(auth.uid()));

CREATE POLICY "Anyone can create submissions"
  ON public.client_intake_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Agents can update their own submissions"
  ON public.client_intake_submissions FOR UPDATE
  USING (agent_id = auth.uid() OR is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can delete their own submissions"
  ON public.client_intake_submissions FOR DELETE
  USING (agent_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_intake_links_agent ON public.client_intake_links(agent_id);
CREATE INDEX idx_intake_links_code ON public.client_intake_links(link_code);
CREATE INDEX idx_intake_submissions_agent ON public.client_intake_submissions(agent_id);
CREATE INDEX idx_intake_submissions_status ON public.client_intake_submissions(status);
CREATE INDEX idx_intake_submissions_division ON public.client_intake_submissions(division);

-- Updated at trigger
CREATE TRIGGER update_intake_links_updated_at
  BEFORE UPDATE ON public.client_intake_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intake_submissions_updated_at
  BEFORE UPDATE ON public.client_intake_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for submissions
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_intake_submissions;