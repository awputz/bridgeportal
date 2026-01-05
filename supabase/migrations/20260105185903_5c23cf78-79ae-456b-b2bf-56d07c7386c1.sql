-- Allow public/anon to read user_roles for agent/admin identification
CREATE POLICY "Public can view agent and admin roles for intake" 
ON public.user_roles FOR SELECT TO anon
USING (role IN ('agent', 'admin'));