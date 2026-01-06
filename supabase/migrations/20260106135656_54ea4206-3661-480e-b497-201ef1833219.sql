-- =============================================
-- PHASE 6: DIVISION TEAM CHAT
-- =============================================

-- 1. Create division_channels table (one channel per division)
CREATE TABLE IF NOT EXISTS public.division_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create division_messages table
CREATE TABLE IF NOT EXISTS public.division_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.division_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  reply_to UUID REFERENCES public.division_messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create message_reactions table
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.division_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_division_messages_channel ON public.division_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_division_messages_created ON public.division_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_division_messages_user ON public.division_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_division_messages_reply_to ON public.division_messages(reply_to);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON public.message_reactions(message_id);

-- 5. Pre-populate channels for each division
INSERT INTO public.division_channels (division, name, description) VALUES
  ('investment-sales', 'Investment Sales Team', 'Collaboration space for the Investment Sales division'),
  ('commercial-leasing', 'Commercial Leasing Team', 'Collaboration space for the Commercial Leasing division'),
  ('residential', 'Residential Team', 'Collaboration space for the Residential division')
ON CONFLICT (division) DO NOTHING;

-- 6. Create security definer function to check channel access
CREATE OR REPLACE FUNCTION public.can_access_channel(_user_id UUID, _channel_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    -- Admins can access all channels
    public.is_admin_user(_user_id)
    OR
    -- Agents can access their division's channel
    EXISTS (
      SELECT 1 FROM public.division_channels dc
      WHERE dc.id = _channel_id
      AND dc.division = public.get_user_division(_user_id)
    )
$$;

-- 7. Create security definer function to get user's channel ID
CREATE OR REPLACE FUNCTION public.get_user_channel_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT dc.id 
  FROM public.division_channels dc
  WHERE dc.division = public.get_user_division(_user_id)
  LIMIT 1
$$;

-- 8. Enable RLS on all chat tables
ALTER TABLE public.division_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.division_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for division_channels
CREATE POLICY "Users can view accessible channels"
  ON public.division_channels
  FOR SELECT
  USING (public.can_access_channel(auth.uid(), id));

-- 10. RLS Policies for division_messages
CREATE POLICY "Users can view messages in accessible channels"
  ON public.division_messages
  FOR SELECT
  USING (public.can_access_channel(auth.uid(), channel_id));

CREATE POLICY "Users can insert messages in their division channel"
  ON public.division_messages
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND (
      public.is_admin_user(auth.uid())
      OR channel_id = public.get_user_channel_id(auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.division_messages
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
  ON public.division_messages
  FOR DELETE
  USING (user_id = auth.uid());

-- 11. RLS Policies for message_reactions
CREATE POLICY "Users can view reactions on accessible messages"
  ON public.message_reactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.division_messages dm
      WHERE dm.id = message_id
      AND public.can_access_channel(auth.uid(), dm.channel_id)
    )
  );

CREATE POLICY "Users can add reactions"
  ON public.message_reactions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own reactions"
  ON public.message_reactions
  FOR DELETE
  USING (user_id = auth.uid());

-- 12. Enable real-time for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.division_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;

-- 13. Add updated_at trigger for division_channels
CREATE TRIGGER update_division_channels_updated_at
  BEFORE UPDATE ON public.division_channels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();