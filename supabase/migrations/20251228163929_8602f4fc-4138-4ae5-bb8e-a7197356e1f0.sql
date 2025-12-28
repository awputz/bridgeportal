-- Drop existing view first
DROP VIEW IF EXISTS public.team_members_public;

-- Create a public view for team_members that only exposes non-sensitive fields
CREATE VIEW public.team_members_public AS
SELECT 
  id,
  name,
  title,
  bio,
  image_url,
  category,
  is_active,
  display_order,
  slug
FROM public.team_members
WHERE is_active = true;

-- Grant public access to the view
GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- Update deal_room_registrations RLS to require authentication
-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can register for deal room" ON public.deal_room_registrations;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.deal_room_registrations;
DROP POLICY IF EXISTS "Admins can manage registrations" ON public.deal_room_registrations;

-- Create new secure policies
CREATE POLICY "Anyone can register for deal room"
ON public.deal_room_registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view registrations matching their email"
ON public.deal_room_registrations
FOR SELECT
USING (
  email = (current_setting('request.jwt.claims', true)::json ->> 'email')
  OR is_admin_or_agent(auth.uid())
);

CREATE POLICY "Admins can update registrations"
ON public.deal_room_registrations
FOR UPDATE
USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Admins can delete registrations"
ON public.deal_room_registrations
FOR DELETE
USING (has_role(auth.uid(), 'admin'));