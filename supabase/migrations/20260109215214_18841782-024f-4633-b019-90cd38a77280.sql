-- Enable realtime on staging_images table for live status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.staging_images;