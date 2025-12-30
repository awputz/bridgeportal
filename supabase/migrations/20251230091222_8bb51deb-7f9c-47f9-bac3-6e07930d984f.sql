-- Create table for linking emails to deals
CREATE TABLE public.email_deal_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  email_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  deal_id UUID NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  email_subject TEXT,
  email_from TEXT,
  linked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id, email_id, deal_id)
);

-- Create table for linking emails to contacts
CREATE TABLE public.email_contact_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  email_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  email_subject TEXT,
  email_from TEXT,
  linked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id, email_id, contact_id)
);

-- Create table for snoozed emails
CREATE TABLE public.snoozed_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  email_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  email_subject TEXT,
  email_from TEXT,
  snooze_until TIMESTAMP WITH TIME ZONE NOT NULL,
  snoozed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id, email_id)
);

-- Enable RLS
ALTER TABLE public.email_deal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_contact_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snoozed_emails ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_deal_links
CREATE POLICY "Agents can view their own email deal links"
  ON public.email_deal_links FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can create their own email deal links"
  ON public.email_deal_links FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can delete their own email deal links"
  ON public.email_deal_links FOR DELETE
  USING (agent_id = auth.uid());

-- RLS policies for email_contact_links
CREATE POLICY "Agents can view their own email contact links"
  ON public.email_contact_links FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can create their own email contact links"
  ON public.email_contact_links FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can delete their own email contact links"
  ON public.email_contact_links FOR DELETE
  USING (agent_id = auth.uid());

-- RLS policies for snoozed_emails
CREATE POLICY "Agents can manage their own snoozed emails"
  ON public.snoozed_emails FOR ALL
  USING (agent_id = auth.uid());