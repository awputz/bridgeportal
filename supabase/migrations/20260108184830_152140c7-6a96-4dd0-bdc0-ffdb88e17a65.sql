-- Create junction table for campaign-agent relationships
CREATE TABLE public.hr_campaign_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.hr_campaigns(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.hr_agents(id) ON DELETE CASCADE,
  email_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (email_status IN ('pending', 'sent', 'opened', 'clicked', 'replied', 'bounced')),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, agent_id)
);

-- Enable RLS
ALTER TABLE public.hr_campaign_agents ENABLE ROW LEVEL SECURITY;

-- RLS Policy for HR admins
CREATE POLICY "HR admins can manage campaign agents" ON public.hr_campaign_agents
  FOR ALL TO authenticated
  USING (public.is_hr_admin(auth.uid()));

-- Add index for faster lookups
CREATE INDEX idx_hr_campaign_agents_campaign ON public.hr_campaign_agents(campaign_id);
CREATE INDEX idx_hr_campaign_agents_agent ON public.hr_campaign_agents(agent_id);
CREATE INDEX idx_hr_campaign_agents_status ON public.hr_campaign_agents(email_status);