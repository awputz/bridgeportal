-- Investors can view agent requests (read-only)
CREATE POLICY "Investors can view agent requests"
ON public.agent_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'investor'::app_role));

-- Investors can view commission requests (read-only)
CREATE POLICY "Investors can view commission requests"
ON public.commission_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'investor'::app_role));