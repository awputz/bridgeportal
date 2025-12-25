-- Create company_announcements table for news and updates
CREATE TABLE public.company_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT NOT NULL DEFAULT 'general',
  is_pinned BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.company_announcements ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active announcements
CREATE POLICY "Anyone can view active announcements"
ON public.company_announcements
FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admins can manage all announcements
CREATE POLICY "Admins can manage announcements"
ON public.company_announcements
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_company_announcements_updated_at
BEFORE UPDATE ON public.company_announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for common queries
CREATE INDEX idx_company_announcements_active ON public.company_announcements (is_active, is_pinned, created_at DESC);