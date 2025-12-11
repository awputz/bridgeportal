-- =============================================
-- PHASE 1: Create new Bridge CMS tables
-- =============================================

-- BridgeSettings: Global company settings
CREATE TABLE public.bridge_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- BridgePages: Page content blocks
CREATE TABLE public.bridge_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_key text NOT NULL,
  title text,
  content text,
  metadata jsonb,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- BridgeServices: Service divisions
CREATE TABLE public.bridge_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  path text NOT NULL,
  tagline text,
  description text,
  icon text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- BridgeMarkets: Borough and asset type data
CREATE TABLE public.bridge_markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  metadata jsonb,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- BridgeListingLinks: External listing portals
CREATE TABLE public.bridge_listing_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  url text NOT NULL,
  parent_id uuid REFERENCES public.bridge_listing_links(id),
  is_external boolean DEFAULT true,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- PHASE 2: Enable RLS on all new tables
-- =============================================

ALTER TABLE public.bridge_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_listing_links ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PHASE 3: Create RLS Policies
-- =============================================

-- BridgeSettings policies
CREATE POLICY "Anyone can view settings" ON public.bridge_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.bridge_settings FOR ALL USING (is_admin_or_agent(auth.uid()));

-- BridgePages policies
CREATE POLICY "Anyone can view active pages" ON public.bridge_pages FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage pages" ON public.bridge_pages FOR ALL USING (is_admin_or_agent(auth.uid()));

-- BridgeServices policies
CREATE POLICY "Anyone can view active services" ON public.bridge_services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.bridge_services FOR ALL USING (is_admin_or_agent(auth.uid()));

-- BridgeMarkets policies
CREATE POLICY "Anyone can view active markets" ON public.bridge_markets FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage markets" ON public.bridge_markets FOR ALL USING (is_admin_or_agent(auth.uid()));

-- BridgeListingLinks policies
CREATE POLICY "Anyone can view active listing links" ON public.bridge_listing_links FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage listing links" ON public.bridge_listing_links FOR ALL USING (is_admin_or_agent(auth.uid()));

-- =============================================
-- PHASE 4: Create updated_at triggers
-- =============================================

CREATE TRIGGER update_bridge_settings_updated_at
  BEFORE UPDATE ON public.bridge_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bridge_pages_updated_at
  BEFORE UPDATE ON public.bridge_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bridge_services_updated_at
  BEFORE UPDATE ON public.bridge_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bridge_markets_updated_at
  BEFORE UPDATE ON public.bridge_markets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bridge_listing_links_updated_at
  BEFORE UPDATE ON public.bridge_listing_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();