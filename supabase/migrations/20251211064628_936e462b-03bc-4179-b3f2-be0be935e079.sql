-- Create bridge_buildings table for Residential building directory
CREATE TABLE public.bridge_buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  borough text,
  neighborhood text,
  unit_count integer,
  description text,
  tags text[],
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bridge_buildings ENABLE ROW LEVEL SECURITY;

-- Public can view active buildings
CREATE POLICY "Anyone can view active buildings"
ON public.bridge_buildings
FOR SELECT
USING (is_active = true);

-- Admins can manage buildings
CREATE POLICY "Admins can manage buildings"
ON public.bridge_buildings
FOR ALL
USING (is_admin_or_agent(auth.uid()));