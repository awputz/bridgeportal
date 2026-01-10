-- Allow anonymous users to view active team members for intake form (photos)
CREATE POLICY "Public can view active team members for intake"
ON public.team_members
FOR SELECT
TO public
USING (is_active = true);