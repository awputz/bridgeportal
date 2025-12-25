-- Create agent_applications table for new agent signups
CREATE TABLE public.agent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  mailing_address TEXT,
  date_of_birth DATE,
  license_number TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  divisions TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  headshot_url TEXT,
  id_photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Onboarding checklist progress
  cultural_values_acknowledged BOOLEAN DEFAULT false,
  contract_signed BOOLEAN DEFAULT false,
  w9_submitted BOOLEAN DEFAULT false,
  CONSTRAINT agent_applications_email_key UNIQUE (email)
);

-- Enable RLS
ALTER TABLE public.agent_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (public form)
CREATE POLICY "Anyone can submit application"
  ON public.agent_applications
  FOR INSERT
  WITH CHECK (true);

-- Applicants can view their own application by email
CREATE POLICY "Applicants can view own application"
  ON public.agent_applications
  FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR is_admin_or_agent(auth.uid()));

-- Only admins can update applications
CREATE POLICY "Admins can update applications"
  ON public.agent_applications
  FOR UPDATE
  USING (is_admin_or_agent(auth.uid()));

-- Only admins can delete applications
CREATE POLICY "Admins can delete applications"
  ON public.agent_applications
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create updated_at trigger
CREATE TRIGGER update_agent_applications_updated_at
  BEFORE UPDATE ON public.agent_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add onboarding checklist fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_checklist JSONB DEFAULT '{
  "agent_form_submitted": false,
  "cultural_values_reviewed": false,
  "contract_signed": false,
  "w9_submitted": false,
  "email_setup": false,
  "gdrive_access": false,
  "crm_tutorial": false,
  "business_card_requested": false
}'::jsonb;

-- Create storage bucket for agent application files
INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-applications', 'agent-applications', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for agent applications bucket
CREATE POLICY "Anyone can upload application files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'agent-applications');

CREATE POLICY "Anyone can view application files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'agent-applications');

CREATE POLICY "Admins can delete application files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'agent-applications' AND is_admin_or_agent(auth.uid()));