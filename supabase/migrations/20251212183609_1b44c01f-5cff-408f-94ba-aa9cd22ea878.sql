-- Fix the security definer view issue by making it SECURITY INVOKER (default)
DROP VIEW IF EXISTS public.team_members_public;

-- Recreate the view explicitly as SECURITY INVOKER
CREATE VIEW public.team_members_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  name,
  title,
  bio,
  image_url,
  category,
  display_order,
  slug,
  linkedin_url,
  instagram_url
FROM public.team_members
WHERE is_active = true;

-- Grant SELECT on the view to anon and authenticated
GRANT SELECT ON public.team_members_public TO anon, authenticated;