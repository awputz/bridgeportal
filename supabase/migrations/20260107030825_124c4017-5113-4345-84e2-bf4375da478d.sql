-- =============================================================================
-- PHASE 1: AGENT DEAL ROOM DATABASE INFRASTRUCTURE
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ADD OFF-MARKET COLUMNS TO crm_deals
-- -----------------------------------------------------------------------------
ALTER TABLE public.crm_deals
ADD COLUMN IF NOT EXISTS is_off_market BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS om_file_url TEXT,
ADD COLUMN IF NOT EXISTS om_file_name TEXT,
ADD COLUMN IF NOT EXISTS deal_room_notes TEXT,
ADD COLUMN IF NOT EXISTS deal_room_visibility TEXT DEFAULT 'team' CHECK (deal_room_visibility IN ('private', 'team', 'public')),
ADD COLUMN IF NOT EXISTS last_deal_room_update TIMESTAMP WITH TIME ZONE;

-- Create partial index for deal room queries
CREATE INDEX IF NOT EXISTS idx_crm_deals_off_market 
ON public.crm_deals(is_off_market, deal_room_visibility, agent_id, updated_at DESC)
WHERE is_off_market = true AND is_active = true AND deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- 2. CREATE deal_room_files TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deal_room_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deal_room_files_deal ON public.deal_room_files(deal_id);

-- Enable RLS
ALTER TABLE public.deal_room_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_room_files
CREATE POLICY "Authenticated users can view deal room files"
ON public.deal_room_files FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can upload files to their deals"
ON public.deal_room_files FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.crm_deals 
    WHERE id = deal_id AND agent_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their uploaded files"
ON public.deal_room_files FOR DELETE
TO authenticated
USING (uploaded_by = auth.uid());

-- -----------------------------------------------------------------------------
-- 3. CREATE deal_room_comments TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deal_room_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT true,
  parent_id UUID REFERENCES public.deal_room_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deal_room_comments_deal ON public.deal_room_comments(deal_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_room_comments_user ON public.deal_room_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_comments_parent ON public.deal_room_comments(parent_id) WHERE parent_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.deal_room_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_room_comments
CREATE POLICY "Authenticated users can view comments"
ON public.deal_room_comments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create comments"
ON public.deal_room_comments FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments"
ON public.deal_room_comments FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
ON public.deal_room_comments FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_deal_room_comments_updated_at
BEFORE UPDATE ON public.deal_room_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 4. CREATE deal_room_interests TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deal_room_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_type TEXT NOT NULL CHECK (interest_type IN ('interested', 'watching', 'co-broke-request')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(deal_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_deal_room_interests_deal ON public.deal_room_interests(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_interests_user ON public.deal_room_interests(user_id);

-- Enable RLS
ALTER TABLE public.deal_room_interests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_room_interests
CREATE POLICY "Authenticated users can view interests"
ON public.deal_room_interests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can express interest"
ON public.deal_room_interests FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their interest"
ON public.deal_room_interests FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their interest"
ON public.deal_room_interests FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 5. CREATE deal_room_activity TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deal_room_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('shared', 'updated', 'om_uploaded', 'file_uploaded', 'comment_added', 'interest_expressed', 'removed')),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deal_room_activity_deal ON public.deal_room_activity(deal_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_room_activity_user ON public.deal_room_activity(user_id);

-- Enable RLS
ALTER TABLE public.deal_room_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_room_activity
CREATE POLICY "Authenticated users can view activity"
ON public.deal_room_activity FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can log their activity"
ON public.deal_room_activity FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 6. CREATE STORAGE BUCKET FOR DEAL ROOM FILES
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('deal-room-files', 'deal-room-files', false, 26214400)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for deal-room-files bucket
CREATE POLICY "Authenticated users can view deal room files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'deal-room-files');

CREATE POLICY "Authenticated users can upload deal room files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'deal-room-files');

CREATE POLICY "Users can delete their own deal room files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'deal-room-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- -----------------------------------------------------------------------------
-- 7. ENABLE REALTIME FOR DEAL ROOM TABLES
-- -----------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.deal_room_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deal_room_interests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deal_room_activity;