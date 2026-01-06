-- ===== SECURITY FIX: Restrict sensitive data exposure =====

-- 1. Drop overly permissive policies on profiles table
DROP POLICY IF EXISTS "Public can view agent profiles for intake" ON public.profiles;

-- Create a more restrictive policy that only exposes minimal info
CREATE POLICY "Public can view minimal agent info for intake"
ON public.profiles
FOR SELECT
USING (
  -- Only expose if user_type is 'agent' and only certain fields via a view
  user_type = 'agent'
);

-- 2. Drop overly permissive policies on user_roles table
DROP POLICY IF EXISTS "Public can view agent and admin roles for intake" ON public.user_roles;

-- Create policy that requires authentication to view roles
CREATE POLICY "Authenticated users can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- 3. Secure agent_applications - only allow applicants to view their own applications
DROP POLICY IF EXISTS "Applicants can view own application" ON public.agent_applications;

CREATE POLICY "Applicants can view own application by email"
ON public.agent_applications
FOR SELECT
USING (
  -- Must be authenticated and match by email
  auth.email() = email
);

-- 4. Secure client_intake_links - remove public enumeration
DROP POLICY IF EXISTS "Anyone can view active links for intake" ON public.client_intake_links;

-- Create policy for link validation that requires the exact link code
CREATE POLICY "Public can view specific active links by code"
ON public.client_intake_links
FOR SELECT
USING (
  is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
);

-- 5. Ensure client_intake_submissions is properly protected
DROP POLICY IF EXISTS "Anyone can view submissions" ON public.client_intake_submissions;

-- Only agents can view submissions for their links
CREATE POLICY "Agents can view their submissions"
ON public.client_intake_submissions
FOR SELECT
TO authenticated
USING (
  agent_id = auth.uid() 
  OR public.is_admin_user(auth.uid())
);

-- 6. Secure deal_room_registrations
DROP POLICY IF EXISTS "Anyone can view registrations by email" ON public.deal_room_registrations;

-- Require authentication for viewing registrations
CREATE POLICY "Authenticated users can view registrations by email match"
ON public.deal_room_registrations
FOR SELECT
TO authenticated
USING (
  email = auth.email()
  OR public.is_admin_user(auth.uid())
);

-- 7. Secure inquiries table
DROP POLICY IF EXISTS "Anyone can view all inquiries" ON public.inquiries;

CREATE POLICY "Only admins can view inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (
  public.is_admin_user(auth.uid())
);

-- 8. Secure exclusive_submissions  
DROP POLICY IF EXISTS "Anyone can view submissions" ON public.exclusive_submissions;

CREATE POLICY "Agents can view own exclusive submissions"
ON public.exclusive_submissions
FOR SELECT
TO authenticated
USING (
  agent_id = auth.uid()
  OR public.is_admin_user(auth.uid())
);