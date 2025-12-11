-- Create bridge_calculators table for CMS-managed calculator configurations
CREATE TABLE public.bridge_calculators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  service_slug TEXT NOT NULL,
  calculator_type TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  input_config JSONB,
  output_description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bridge_calculators ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active calculators" 
ON public.bridge_calculators 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage calculators" 
ON public.bridge_calculators 
FOR ALL 
USING (is_admin_or_agent(auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_bridge_calculators_updated_at
BEFORE UPDATE ON public.bridge_calculators
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();