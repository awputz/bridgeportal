-- Allow anonymous users to view agent profiles (for intake form agent selection)
CREATE POLICY "Public can view agent profiles for intake" 
ON public.profiles 
FOR SELECT 
TO anon
USING (user_type = 'agent');