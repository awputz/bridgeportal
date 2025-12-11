-- Create bridge_resources table for residential resources
CREATE TABLE IF NOT EXISTS public.bridge_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  short_description text,
  body_content text,
  external_url text,
  metadata jsonb,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bridge_resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active resources" 
ON public.bridge_resources 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage resources" 
ON public.bridge_resources 
FOR ALL 
USING (is_admin_or_agent(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_bridge_resources_updated_at
BEFORE UPDATE ON public.bridge_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();