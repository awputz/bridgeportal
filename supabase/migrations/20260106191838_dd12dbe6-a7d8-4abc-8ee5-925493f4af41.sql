-- Drop the broken policy that checks user_type column
DROP POLICY IF EXISTS "Public can view minimal agent info for intake" ON public.profiles;

-- Create new policy that uses user_roles table (the source of truth for agent status)
CREATE POLICY "Public can view agent profiles for intake"
  ON public.profiles
  FOR SELECT
  TO public
  USING (
    id IN (
      SELECT user_id FROM public.user_roles 
      WHERE role IN ('agent', 'admin')
    )
  );