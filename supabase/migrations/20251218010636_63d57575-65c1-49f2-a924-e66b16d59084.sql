-- Create investment_listings table
CREATE TABLE public.investment_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  neighborhood TEXT,
  borough TEXT,
  asset_class TEXT NOT NULL,
  units INTEGER,
  asking_price NUMERIC,
  cap_rate NUMERIC,
  gross_sf INTEGER,
  year_built INTEGER,
  description TEXT,
  image_url TEXT,
  om_url TEXT,
  deal_room_password TEXT NOT NULL DEFAULT 'bridge2024',
  listing_agent_id UUID REFERENCES public.team_members(id),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create deal_room_documents table
CREATE TABLE public.deal_room_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.investment_listings(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investment_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_room_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investment_listings
CREATE POLICY "Anyone can view active listings"
ON public.investment_listings
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage listings"
ON public.investment_listings
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- RLS Policies for deal_room_documents
CREATE POLICY "Anyone can view active documents"
ON public.deal_room_documents
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage documents"
ON public.deal_room_documents
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Create updated_at trigger for investment_listings
CREATE TRIGGER update_investment_listings_updated_at
BEFORE UPDATE ON public.investment_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();