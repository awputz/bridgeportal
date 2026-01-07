-- Phase 1: Fix RLS Policies for CRM Tables
-- This migration simplifies overly-restrictive division-based policies

-- ============================================
-- 1. DROP existing complex CRM policies
-- ============================================

-- crm_contacts policies
DROP POLICY IF EXISTS "division_contacts_select" ON public.crm_contacts;
DROP POLICY IF EXISTS "division_contacts_insert" ON public.crm_contacts;
DROP POLICY IF EXISTS "division_contacts_update" ON public.crm_contacts;
DROP POLICY IF EXISTS "division_contacts_delete" ON public.crm_contacts;

-- crm_deals policies
DROP POLICY IF EXISTS "division_deals_select" ON public.crm_deals;
DROP POLICY IF EXISTS "division_deals_insert" ON public.crm_deals;
DROP POLICY IF EXISTS "division_deals_update" ON public.crm_deals;
DROP POLICY IF EXISTS "division_deals_delete" ON public.crm_deals;

-- crm_activities policies
DROP POLICY IF EXISTS "division_activities_select" ON public.crm_activities;
DROP POLICY IF EXISTS "division_activities_insert" ON public.crm_activities;
DROP POLICY IF EXISTS "division_activities_update" ON public.crm_activities;
DROP POLICY IF EXISTS "division_activities_delete" ON public.crm_activities;

-- ============================================
-- 2. CREATE simplified CRM policies
-- ============================================

-- crm_contacts: agents see their own, admins see all
CREATE POLICY "agents_own_contacts_select" ON public.crm_contacts
  FOR SELECT USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_contacts_insert" ON public.crm_contacts
  FOR INSERT WITH CHECK (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_contacts_update" ON public.crm_contacts
  FOR UPDATE USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_contacts_delete" ON public.crm_contacts
  FOR DELETE USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

-- crm_deals: agents see their own, admins see all
CREATE POLICY "agents_own_deals_select" ON public.crm_deals
  FOR SELECT USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_deals_insert" ON public.crm_deals
  FOR INSERT WITH CHECK (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_deals_update" ON public.crm_deals
  FOR UPDATE USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_deals_delete" ON public.crm_deals
  FOR DELETE USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

-- crm_activities: agents see their own, admins see all
CREATE POLICY "agents_own_activities_select" ON public.crm_activities
  FOR SELECT USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_activities_insert" ON public.crm_activities
  FOR INSERT WITH CHECK (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_activities_update" ON public.crm_activities
  FOR UPDATE USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "agents_own_activities_delete" ON public.crm_activities
  FOR DELETE USING (agent_id = auth.uid() OR public.is_admin_user(auth.uid()));

-- ============================================
-- 3. ADD performance indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_crm_contacts_agent_id ON public.crm_contacts(agent_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_agent_id ON public.crm_deals(agent_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_agent_id ON public.crm_activities(agent_id);

-- ============================================
-- 4. FIX high-risk "RLS Always True" warnings
-- ============================================

-- deal_room_activity
DROP POLICY IF EXISTS "Authenticated users can view activity" ON public.deal_room_activity;
DROP POLICY IF EXISTS "Authenticated users can create activity" ON public.deal_room_activity;
CREATE POLICY "agents_view_deal_room_activity" ON public.deal_room_activity
  FOR SELECT USING (public.is_admin_or_agent(auth.uid()));
CREATE POLICY "agents_create_deal_room_activity" ON public.deal_room_activity
  FOR INSERT WITH CHECK (public.is_admin_or_agent(auth.uid()));

-- deal_room_comments
DROP POLICY IF EXISTS "Authenticated users can view comments" ON public.deal_room_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.deal_room_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.deal_room_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.deal_room_comments;
CREATE POLICY "agents_view_deal_room_comments" ON public.deal_room_comments
  FOR SELECT USING (public.is_admin_or_agent(auth.uid()));
CREATE POLICY "agents_create_deal_room_comments" ON public.deal_room_comments
  FOR INSERT WITH CHECK (public.is_admin_or_agent(auth.uid()));
CREATE POLICY "agents_update_own_comments" ON public.deal_room_comments
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin_user(auth.uid()));
CREATE POLICY "agents_delete_own_comments" ON public.deal_room_comments
  FOR DELETE USING (user_id = auth.uid() OR public.is_admin_user(auth.uid()));

-- deal_room_interests
DROP POLICY IF EXISTS "Authenticated users can view interests" ON public.deal_room_interests;
DROP POLICY IF EXISTS "Authenticated users can create interests" ON public.deal_room_interests;
CREATE POLICY "agents_view_deal_room_interests" ON public.deal_room_interests
  FOR SELECT USING (public.is_admin_or_agent(auth.uid()));
CREATE POLICY "agents_create_deal_room_interests" ON public.deal_room_interests
  FOR INSERT WITH CHECK (public.is_admin_or_agent(auth.uid()));

-- deal_room_files
DROP POLICY IF EXISTS "Authenticated users can view files" ON public.deal_room_files;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON public.deal_room_files;
CREATE POLICY "agents_view_deal_room_files" ON public.deal_room_files
  FOR SELECT USING (public.is_admin_or_agent(auth.uid()));
CREATE POLICY "agents_upload_deal_room_files" ON public.deal_room_files
  FOR INSERT WITH CHECK (public.is_admin_or_agent(auth.uid()));