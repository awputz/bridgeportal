-- Create commercial_listing_documents table (similar to deal_room_documents for investment)
CREATE TABLE public.commercial_listing_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.commercial_listings(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.commercial_listing_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for commercial_listing_documents
CREATE POLICY "Admins can manage commercial documents"
ON public.commercial_listing_documents
FOR ALL
USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Anyone can view active commercial documents"
ON public.commercial_listing_documents
FOR SELECT
USING (is_active = true);

-- Create index for faster lookups
CREATE INDEX idx_commercial_listing_documents_listing_id ON public.commercial_listing_documents(listing_id);
CREATE INDEX idx_deal_room_documents_listing_id ON public.deal_room_documents(listing_id);