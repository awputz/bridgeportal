-- Create commercial_listings table
CREATE TABLE public.commercial_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  building_name TEXT,
  neighborhood TEXT,
  borough TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('office', 'retail')),
  square_footage INTEGER NOT NULL,
  asking_rent NUMERIC,
  rent_per_sf NUMERIC,
  lease_term TEXT,
  possession TEXT,
  ceiling_height_ft NUMERIC,
  features TEXT[],
  description TEXT,
  image_url TEXT,
  flyer_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.commercial_listings ENABLE ROW LEVEL SECURITY;

-- Public can view active listings
CREATE POLICY "Anyone can view active commercial listings"
ON public.commercial_listings
FOR SELECT
USING (is_active = true);

-- Admins/agents can manage listings
CREATE POLICY "Admins can manage commercial listings"
ON public.commercial_listings
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_commercial_listings_updated_at
BEFORE UPDATE ON public.commercial_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the two real listings
INSERT INTO public.commercial_listings (property_address, neighborhood, borough, listing_type, square_footage, asking_rent, rent_per_sf, lease_term, possession, ceiling_height_ft, features, description) VALUES
('39 W 56th Street', 'Midtown', 'Manhattan', 'office', 2500, 162500, 65, '3-10 Years', 'Immediate', 12, ARRAY['Natural Light', 'High Ceilings', 'Modern Finishes', 'Central Location'], 'Prime Midtown office space with excellent natural light and high-end finishes. Ideal for professional services or creative firms.'),
('32-31 Greenpoint Ave', 'Greenpoint', 'Brooklyn', 'retail', 700, 38500, 55, '5-10 Years', 'Immediate', 14, ARRAY['Street Frontage', 'High Ceilings', 'Open Layout', 'Growing Neighborhood'], 'Charming retail space in the heart of Greenpoint with excellent foot traffic and visibility.');