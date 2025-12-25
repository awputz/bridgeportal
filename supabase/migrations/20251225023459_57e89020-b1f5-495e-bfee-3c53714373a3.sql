-- ================================================================
-- BRIDGE CRM SYSTEM - Complete Database Schema
-- ================================================================

-- CRM Deal Stages (configurable per division)
CREATE TABLE public.crm_deal_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  division text NOT NULL CHECK (division IN ('investment-sales', 'commercial-leasing', 'residential')),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#6b7280',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- CRM Contacts
CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  company text,
  contact_type text NOT NULL DEFAULT 'prospect' CHECK (contact_type IN ('owner', 'buyer', 'tenant', 'landlord', 'investor', 'attorney', 'lender', 'broker', 'prospect', 'other')),
  source text CHECK (source IN ('referral', 'cold-call', 'website', 'open-house', 'networking', 'repeat-client', 'marketing', 'other')),
  division text NOT NULL CHECK (division IN ('investment-sales', 'commercial-leasing', 'residential')),
  tags text[] DEFAULT '{}',
  notes text,
  address text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- CRM Deals (pipeline)
CREATE TABLE public.crm_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  stage_id uuid REFERENCES public.crm_deal_stages(id) ON DELETE SET NULL,
  property_address text NOT NULL,
  deal_type text NOT NULL CHECK (deal_type IN ('sale', 'acquisition', 'lease', 'sublease', 'renewal')),
  division text NOT NULL CHECK (division IN ('investment-sales', 'commercial-leasing', 'residential')),
  value numeric,
  expected_close date,
  probability integer DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  notes text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_active boolean DEFAULT true,
  won boolean DEFAULT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- CRM Activities
CREATE TABLE public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'tour', 'showing', 'proposal', 'follow-up', 'note', 'task')),
  title text NOT NULL,
  description text,
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  is_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Agent Metrics (performance tracking)
CREATE TABLE public.agent_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  division text NOT NULL CHECK (division IN ('investment-sales', 'commercial-leasing', 'residential')),
  deals_closed integer DEFAULT 0,
  total_volume numeric DEFAULT 0,
  contacts_added integer DEFAULT 0,
  activities_completed integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.crm_deal_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_deal_stages (admin managed, everyone can view)
CREATE POLICY "Anyone can view deal stages" ON public.crm_deal_stages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage deal stages" ON public.crm_deal_stages
  FOR ALL USING (is_admin_or_agent(auth.uid()));

-- RLS Policies for crm_contacts
CREATE POLICY "Agents can view their own contacts" ON public.crm_contacts
  FOR SELECT USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can create contacts" ON public.crm_contacts
  FOR INSERT WITH CHECK (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can update their own contacts" ON public.crm_contacts
  FOR UPDATE USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can delete their own contacts" ON public.crm_contacts
  FOR DELETE USING (is_admin_or_agent(auth.uid()));

-- RLS Policies for crm_deals
CREATE POLICY "Agents can view deals" ON public.crm_deals
  FOR SELECT USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can create deals" ON public.crm_deals
  FOR INSERT WITH CHECK (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can update deals" ON public.crm_deals
  FOR UPDATE USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can delete deals" ON public.crm_deals
  FOR DELETE USING (is_admin_or_agent(auth.uid()));

-- RLS Policies for crm_activities
CREATE POLICY "Agents can view activities" ON public.crm_activities
  FOR SELECT USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can create activities" ON public.crm_activities
  FOR INSERT WITH CHECK (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can update activities" ON public.crm_activities
  FOR UPDATE USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can delete activities" ON public.crm_activities
  FOR DELETE USING (is_admin_or_agent(auth.uid()));

-- RLS Policies for agent_metrics
CREATE POLICY "Agents can view metrics" ON public.agent_metrics
  FOR SELECT USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Admins can manage metrics" ON public.agent_metrics
  FOR ALL USING (is_admin_or_agent(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_crm_deal_stages_updated_at
  BEFORE UPDATE ON public.crm_deal_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_deals_updated_at
  BEFORE UPDATE ON public.crm_deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default deal stages for each division
-- Investment Sales stages
INSERT INTO public.crm_deal_stages (division, name, color, display_order) VALUES
  ('investment-sales', 'Lead', '#6b7280', 1),
  ('investment-sales', 'Pitch', '#3b82f6', 2),
  ('investment-sales', 'Listing', '#8b5cf6', 3),
  ('investment-sales', 'Marketing', '#f59e0b', 4),
  ('investment-sales', 'Offers', '#ec4899', 5),
  ('investment-sales', 'Contract', '#14b8a6', 6),
  ('investment-sales', 'Due Diligence', '#6366f1', 7),
  ('investment-sales', 'Closing', '#22c55e', 8);

-- Commercial Leasing stages
INSERT INTO public.crm_deal_stages (division, name, color, display_order) VALUES
  ('commercial-leasing', 'Inquiry', '#6b7280', 1),
  ('commercial-leasing', 'Requirements', '#3b82f6', 2),
  ('commercial-leasing', 'Space Tour', '#8b5cf6', 3),
  ('commercial-leasing', 'Proposal', '#f59e0b', 4),
  ('commercial-leasing', 'Negotiation', '#ec4899', 5),
  ('commercial-leasing', 'LOI', '#14b8a6', 6),
  ('commercial-leasing', 'Lease Execution', '#22c55e', 7);

-- Residential stages
INSERT INTO public.crm_deal_stages (division, name, color, display_order) VALUES
  ('residential', 'Inquiry', '#6b7280', 1),
  ('residential', 'Showing', '#3b82f6', 2),
  ('residential', 'Application', '#8b5cf6', 3),
  ('residential', 'Negotiation', '#f59e0b', 4),
  ('residential', 'Contract', '#14b8a6', 5),
  ('residential', 'Closing', '#22c55e', 6);

-- Create indexes for performance
CREATE INDEX idx_crm_contacts_agent ON public.crm_contacts(agent_id);
CREATE INDEX idx_crm_contacts_division ON public.crm_contacts(division);
CREATE INDEX idx_crm_deals_agent ON public.crm_deals(agent_id);
CREATE INDEX idx_crm_deals_stage ON public.crm_deals(stage_id);
CREATE INDEX idx_crm_deals_division ON public.crm_deals(division);
CREATE INDEX idx_crm_activities_contact ON public.crm_activities(contact_id);
CREATE INDEX idx_crm_activities_deal ON public.crm_activities(deal_id);
CREATE INDEX idx_crm_activities_due_date ON public.crm_activities(due_date) WHERE is_completed = false;