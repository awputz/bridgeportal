-- =====================================================
-- SECURITY HARDENING: RLS Policy Updates (Fixed)
-- =====================================================

-- PHASE 1: Lock down team_members table (remove public access to PII)
DROP POLICY IF EXISTS "Anyone can view public team member info" ON public.team_members;
DROP POLICY IF EXISTS "Anyone can view active team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated users can view team members" ON public.team_members;

-- Only authenticated users can view team members
CREATE POLICY "Authenticated users can view team members"
  ON public.team_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- PHASE 2: Lock down transactions table (contains sensitive financial data)
DROP POLICY IF EXISTS "Anyone can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Agents and admins can view transactions" ON public.transactions;
-- Keep existing investor policy

-- Only agents/admins can view transactions
CREATE POLICY "Agents and admins can view transactions"
  ON public.transactions FOR SELECT
  USING (public.is_admin_or_agent(auth.uid()));

-- PHASE 3: Lock down deal_room_registrations table
DROP POLICY IF EXISTS "Users can view own registration" ON public.deal_room_registrations;
DROP POLICY IF EXISTS "Anyone can submit registration" ON public.deal_room_registrations;
DROP POLICY IF EXISTS "Admins can view all deal room registrations" ON public.deal_room_registrations;
DROP POLICY IF EXISTS "Anyone can submit deal room registration" ON public.deal_room_registrations;

-- Only admins/agents can view all registrations
CREATE POLICY "Admins can view all deal room registrations"
  ON public.deal_room_registrations FOR SELECT
  USING (public.is_admin_or_agent(auth.uid()));

-- Keep ability for anyone to submit (public form)
CREATE POLICY "Anyone can submit deal room registration"
  ON public.deal_room_registrations FOR INSERT
  WITH CHECK (true);

-- PHASE 4: Fix notification injection - admin_notifications
DROP POLICY IF EXISTS "System can insert notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Only service role can insert admin notifications" ON public.admin_notifications;

-- Only triggers/service role can insert (clients cannot)
CREATE POLICY "Only service role can insert admin notifications"
  ON public.admin_notifications FOR INSERT
  WITH CHECK (false);

-- PHASE 5: Fix notification injection - user notifications  
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Only service role can insert notifications" ON public.notifications;

-- Only triggers/service role can insert (clients cannot)
CREATE POLICY "Only service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (false);

-- PHASE 6: Fix activity log poisoning
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Only service role can insert activity logs" ON public.activity_logs;

-- Only service role can insert activity logs (via edge functions)
CREATE POLICY "Only service role can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (false);