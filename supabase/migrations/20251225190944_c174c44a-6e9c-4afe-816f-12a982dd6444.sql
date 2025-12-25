-- Fix security definer view warning by making it security invoker
DROP VIEW IF EXISTS public.public_investment_listings;

CREATE VIEW public.public_investment_listings 
WITH (security_invoker = true) AS
SELECT 
  id,
  property_address,
  neighborhood,
  borough,
  asset_class,
  description,
  asking_price,
  cap_rate,
  units,
  gross_sf,
  year_built,
  image_url,
  om_url,
  listing_agent_id,
  display_order,
  created_at,
  updated_at,
  is_active
FROM public.investment_listings
WHERE is_active = true;

-- Grant access to the view
GRANT SELECT ON public.public_investment_listings TO anon, authenticated;