-- Allow admins to read all agent expenses
CREATE POLICY "Admins can view all expenses"
  ON public.agent_expenses FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));