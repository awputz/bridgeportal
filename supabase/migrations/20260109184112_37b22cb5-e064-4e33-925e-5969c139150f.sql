-- =============================================
-- MARKETING CENTER DATABASE SCHEMA
-- Phase 1: Foundation Tables
-- =============================================

-- 1. MARKETING TEMPLATES (Pre-populated with sample templates)
CREATE TABLE public.marketing_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'digital', 'print', 'pitch', 'email'
  type TEXT NOT NULL, -- 'social-post', 'flyer', 'email', 'presentation', etc.
  thumbnail_url TEXT,
  design_data JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MARKETING PROJECTS (Agent's created designs)
CREATE TABLE public.marketing_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  template_id UUID REFERENCES public.marketing_templates(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'completed', 'published'
  design_data JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  output_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. MARKETING ASSETS (Agent's brand assets)
CREATE TABLE public.marketing_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'logo', 'headshot', 'signature', 'color-palette'
  file_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. EMAIL CAMPAIGNS (Bulk email campaigns)
CREATE TABLE public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  content TEXT,
  template_id UUID REFERENCES public.marketing_templates(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. EMAIL CAMPAIGN RECIPIENTS (Individual recipient tracking)
CREATE TABLE public.email_campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'opened', 'clicked', 'bounced', 'unsubscribed'
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. MARKETING ANALYTICS (Agent-level aggregate stats)
CREATE TABLE public.marketing_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  projects_created INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  social_posts INTEGER DEFAULT 0,
  flyers_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id, period, period_start)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_marketing_projects_agent ON public.marketing_projects(agent_id);
CREATE INDEX idx_marketing_projects_status ON public.marketing_projects(status);
CREATE INDEX idx_marketing_projects_type ON public.marketing_projects(type);
CREATE INDEX idx_marketing_templates_category ON public.marketing_templates(category);
CREATE INDEX idx_marketing_templates_featured ON public.marketing_templates(is_featured);
CREATE INDEX idx_marketing_assets_agent ON public.marketing_assets(agent_id);
CREATE INDEX idx_email_campaigns_agent ON public.email_campaigns(agent_id);
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX idx_email_recipients_campaign ON public.email_campaign_recipients(campaign_id);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.marketing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_analytics ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Templates: Public read for authenticated users
CREATE POLICY "Templates are viewable by all authenticated users"
ON public.marketing_templates FOR SELECT TO authenticated USING (true);

-- Templates: Admin-only write
CREATE POLICY "Only admins can manage templates"
ON public.marketing_templates FOR ALL TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));

-- Projects: Agent owns their projects
CREATE POLICY "Agents can manage their own projects"
ON public.marketing_projects FOR ALL TO authenticated
USING (agent_id = auth.uid())
WITH CHECK (agent_id = auth.uid());

-- Projects: Admins can view all
CREATE POLICY "Admins can view all projects"
ON public.marketing_projects FOR SELECT TO authenticated
USING (public.is_admin_user(auth.uid()));

-- Assets: Agent owns their assets
CREATE POLICY "Agents can manage their own assets"
ON public.marketing_assets FOR ALL TO authenticated
USING (agent_id = auth.uid())
WITH CHECK (agent_id = auth.uid());

-- Email campaigns: Agent owns their campaigns
CREATE POLICY "Agents can manage their own campaigns"
ON public.email_campaigns FOR ALL TO authenticated
USING (agent_id = auth.uid())
WITH CHECK (agent_id = auth.uid());

-- Recipients: Access via campaign ownership
CREATE POLICY "Agents can manage recipients of their campaigns"
ON public.email_campaign_recipients FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.email_campaigns
    WHERE id = campaign_id AND agent_id = auth.uid()
  )
);

-- Analytics: Agent sees their own
CREATE POLICY "Agents can view their own analytics"
ON public.marketing_analytics FOR SELECT TO authenticated
USING (agent_id = auth.uid());

-- Analytics: Admins see all
CREATE POLICY "Admins can view all analytics"
ON public.marketing_analytics FOR SELECT TO authenticated
USING (public.is_admin_user(auth.uid()));

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_marketing_templates_updated_at
  BEFORE UPDATE ON public.marketing_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketing_projects_updated_at
  BEFORE UPDATE ON public.marketing_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- STORAGE BUCKET FOR MARKETING ASSETS
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-assets', 'marketing-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for marketing-assets bucket
CREATE POLICY "Public read access for marketing assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketing-assets');

CREATE POLICY "Authenticated users can upload marketing assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'marketing-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own marketing assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'marketing-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own marketing assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'marketing-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- SEED 13 MARKETING TEMPLATES
-- =============================================

INSERT INTO public.marketing_templates (name, description, category, type, is_featured) VALUES
-- Digital Templates (5)
('Instagram Property Post', 'Eye-catching property showcase for Instagram feed', 'digital', 'social-post', true),
('Facebook Listing Carousel', 'Multi-image carousel for Facebook property listings', 'digital', 'social-post', false),
('LinkedIn Market Update', 'Professional market insights post for LinkedIn', 'digital', 'social-post', true),
('Just Listed Story', 'Instagram/Facebook story template for new listings', 'digital', 'social-post', false),
('Open House Announcement', 'Social media graphic for open house events', 'digital', 'social-post', false),

-- Print Templates (3)
('Property Flyer - Modern', 'Clean, modern single-page property flyer', 'print', 'flyer', true),
('Just Sold Postcard', 'Postcard template for just sold announcements', 'print', 'flyer', false),
('Neighborhood Report', 'Multi-page market report for neighborhoods', 'print', 'report', false),

-- Pitch Templates (3)
('Listing Presentation', 'Comprehensive seller pitch deck', 'pitch', 'presentation', true),
('Buyer Consultation', 'Buyer onboarding presentation template', 'pitch', 'presentation', false),
('Investment Property Analysis', 'Investment opportunity pitch deck', 'pitch', 'presentation', false),

-- Email Templates (2)
('New Listing Email', 'Email template for announcing new listings', 'email', 'email-blast', true),
('Monthly Newsletter', 'Agent newsletter template with market updates', 'email', 'newsletter', false);