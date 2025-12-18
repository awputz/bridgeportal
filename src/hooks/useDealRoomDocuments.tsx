import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DealRoomDocument {
  id: string;
  listing_id: string;
  category: string;
  document_name: string;
  document_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

export const useDealRoomDocuments = (listingId: string) => {
  return useQuery({
    queryKey: ["deal-room-documents", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_documents")
        .select("*")
        .eq("listing_id", listingId)
        .eq("is_active", true)
        .order("category")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as DealRoomDocument[];
    },
    enabled: !!listingId,
  });
};

export const groupDocumentsByCategory = (documents: DealRoomDocument[]) => {
  return documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DealRoomDocument[]>);
};
