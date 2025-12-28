-- Drop and recreate with all needed public-facing columns
DROP VIEW IF EXISTS public.team_members_public;

-- Create a public view for team_members 
-- Including email/phone as these are business contact details for agents shown on listings
CREATE VIEW public.team_members_public AS
SELECT 
  id,
  name,
  title,
  bio,
  email,
  phone,
  image_url,
  category,
  is_active,
  display_order,
  slug,
  instagram_url,
  linkedin_url
FROM public.team_members
WHERE is_active = true;

-- Grant public access to the view
GRANT SELECT ON public.team_members_public TO anon, authenticated;