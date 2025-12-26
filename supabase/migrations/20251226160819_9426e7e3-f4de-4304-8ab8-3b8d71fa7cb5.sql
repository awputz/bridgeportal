-- Add RLS policies for investor read-only access to key tables

-- Investors can view all transactions (read-only)
CREATE POLICY "Investors can view transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'investor'::app_role));

-- Investors can view active team members (read-only)
CREATE POLICY "Investors can view team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'investor'::app_role) AND is_active = true);

-- Investors can view active investment listings (read-only)
CREATE POLICY "Investors can view investment listings"
ON public.investment_listings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'investor'::app_role) AND is_active = true);

-- Investors can view active commercial listings (read-only)
CREATE POLICY "Investors can view commercial listings"
ON public.commercial_listings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'investor'::app_role) AND is_active = true);

-- Investors can view agent metrics (read-only)
CREATE POLICY "Investors can view agent metrics"
ON public.agent_metrics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'investor'::app_role));