-- Fix team_members_public view SECURITY DEFINER issue
DROP VIEW IF EXISTS public.team_members_public;

CREATE VIEW public.team_members_public 
WITH (security_invoker = true)
AS
SELECT 
  id, name, title, bio, email, phone, 
  image_url, category, is_active, display_order, 
  slug, instagram_url, linkedin_url
FROM team_members
WHERE is_active = true;

GRANT SELECT ON public.team_members_public TO anon, authenticated;