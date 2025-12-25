-- Fix security definer views by recreating them with SECURITY INVOKER
-- First drop and recreate team_members_public view
DROP VIEW IF EXISTS public.team_members_public;
CREATE VIEW public.team_members_public 
WITH (security_invoker = true)
AS SELECT 
    id,
    name,
    title,
    bio,
    image_url,
    category,
    display_order,
    slug,
    linkedin_url,
    instagram_url,
    email,
    phone,
    license_number
FROM team_members
WHERE is_active = true;

-- Recreate public_investment_listings view with security invoker
DROP VIEW IF EXISTS public.public_investment_listings;
CREATE VIEW public.public_investment_listings 
WITH (security_invoker = true)
AS SELECT 
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
FROM investment_listings
WHERE is_active = true;

-- Grant SELECT on views to authenticated and anon users
GRANT SELECT ON public.team_members_public TO authenticated, anon;
GRANT SELECT ON public.public_investment_listings TO authenticated, anon;