-- Add mentioned_users column to deal_room_comments
ALTER TABLE public.deal_room_comments
ADD COLUMN IF NOT EXISTS mentioned_users uuid[] DEFAULT '{}';