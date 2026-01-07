-- Create deal_room_photos table for managing property images
CREATE TABLE public.deal_room_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  category VARCHAR(50) DEFAULT 'exterior',
  is_primary BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_deal_photos_deal ON public.deal_room_photos(deal_id, display_order);
CREATE INDEX idx_deal_photos_primary ON public.deal_room_photos(deal_id, is_primary) WHERE is_primary = true;

-- Enable RLS
ALTER TABLE public.deal_room_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_room_photos
CREATE POLICY "Authenticated users can view photos"
  ON public.deal_room_photos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Deal owners can insert photos"
  ON public.deal_room_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.crm_deals 
      WHERE id = deal_room_photos.deal_id 
      AND agent_id = auth.uid()
    )
  );

CREATE POLICY "Deal owners can update photos"
  ON public.deal_room_photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.crm_deals 
      WHERE id = deal_room_photos.deal_id 
      AND agent_id = auth.uid()
    )
  );

CREATE POLICY "Deal owners can delete photos"
  ON public.deal_room_photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.crm_deals 
      WHERE id = deal_room_photos.deal_id 
      AND agent_id = auth.uid()
    )
  );

-- Add primary_image_url column to crm_deals for quick thumbnail display
ALTER TABLE public.crm_deals
ADD COLUMN IF NOT EXISTS primary_image_url TEXT;

-- Create storage bucket for deal room photos
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('deal-room-photos', 'deal-room-photos', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Anyone can view deal room photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'deal-room-photos');

CREATE POLICY "Authenticated users can upload deal room photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'deal-room-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own deal room photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'deal-room-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own deal room photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'deal-room-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );