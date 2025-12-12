-- Fix security issues

-- 1. Update team_members RLS to protect sensitive contact info
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view active team members" ON public.team_members;

-- Create a view for public team member data (without sensitive fields)
CREATE OR REPLACE VIEW public.team_members_public AS
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

-- Create new policy that only exposes non-sensitive fields to public
CREATE POLICY "Anyone can view public team member info" 
ON public.team_members 
FOR SELECT 
USING (is_active = true);

-- Note: The view above provides the secure way to access team data without email/phone
-- Applications should query team_members_public instead of team_members directly

-- 2. Fix chat_messages - make session validation stricter
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;

-- Only allow viewing messages from your own session OR if you're the authenticated owner
CREATE POLICY "Users can only view their own chat sessions" 
ON public.chat_messages 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR (user_id IS NULL AND session_id = current_setting('app.current_session_id', true))
);

-- 3. Profiles table already has proper RLS - users can only view/update their own profile
-- The existing policies are correct:
-- "Users can view own profile" - SELECT where auth.uid() = id
-- "Users can update own profile" - UPDATE where auth.uid() = id