-- Phase 1: Security Hardening

-- 1.1 Fix activity_logs: Require authentication for INSERT
DROP POLICY IF EXISTS "Anyone can insert activity logs" ON public.activity_logs;

CREATE POLICY "Authenticated users can insert activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 1.2 Fix deal_room_registrations: Restrict SELECT to own registrations (by email) or admin
DROP POLICY IF EXISTS "Anyone can check their own registration" ON public.deal_room_registrations;
DROP POLICY IF EXISTS "Anyone can update their own registration" ON public.deal_room_registrations;

CREATE POLICY "Users can view their own registration by email"
ON public.deal_room_registrations
FOR SELECT
USING (
  (email = (auth.jwt()->>'email'))
  OR is_admin_or_agent(auth.uid())
);

CREATE POLICY "Users can update their own registration by email"
ON public.deal_room_registrations
FOR UPDATE
USING (
  (email = (auth.jwt()->>'email'))
  OR is_admin_or_agent(auth.uid())
);

-- 1.3 Create a secure view for public investment listings (without password)
CREATE OR REPLACE VIEW public.public_investment_listings AS
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

-- 1.4 Add onboarding columns to profiles table for Phase 3
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step integer DEFAULT 0;