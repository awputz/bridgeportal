import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ExclusiveListing {
  id: string;
  property_address: string;
  neighborhood: string | null;
  borough: string | null;
  image_url: string | null;
  asking_price?: number | null;
  asking_rent?: number | null;
  units?: number | null;
  gross_sf?: number | null;
  square_footage?: number;
  cap_rate?: number | null;
  asset_class?: string;
  listing_type?: string;
  om_url?: string | null;
  flyer_url?: string | null;
  description?: string | null;
  division: "Investment Sales" | "Commercial";
  agentRole?: string;
}

export interface ListingDocument {
  id: string;
  listing_id: string;
  category: string;
  document_name: string;
  document_url: string | null;
  display_order: number | null;
}

// Fetch investment exclusives for an agent
export const useAgentInvestmentExclusives = (agentId: string | undefined) => {
  return useQuery({
    queryKey: ["agent-investment-exclusives", agentId],
    queryFn: async () => {
      if (!agentId) return [];

      const { data, error } = await supabase
        .from("investment_listing_agents")
        .select(`
          role,
          listing:investment_listings (
            id,
            property_address,
            neighborhood,
            borough,
            image_url,
            asking_price,
            units,
            gross_sf,
            cap_rate,
            asset_class,
            om_url,
            description
          )
        `)
        .eq("agent_id", agentId);

      if (error) throw error;

      return (data || [])
        .filter((item) => item.listing)
        .map((item) => ({
          ...item.listing,
          division: "Investment Sales" as const,
          agentRole: item.role,
        }));
    },
    enabled: !!agentId,
  });
};

// Fetch commercial exclusives for an agent
export const useAgentCommercialExclusives = (agentId: string | undefined) => {
  return useQuery({
    queryKey: ["agent-commercial-exclusives", agentId],
    queryFn: async () => {
      if (!agentId) return [];

      const { data, error } = await supabase
        .from("commercial_listing_agents")
        .select(`
          role,
          listing:commercial_listings (
            id,
            property_address,
            neighborhood,
            borough,
            image_url,
            asking_rent,
            square_footage,
            listing_type,
            flyer_url,
            description
          )
        `)
        .eq("agent_id", agentId);

      if (error) throw error;

      return (data || [])
        .filter((item) => item.listing)
        .map((item) => ({
          ...item.listing,
          division: "Commercial" as const,
          agentRole: item.role,
        }));
    },
    enabled: !!agentId,
  });
};

// Fetch all exclusives for an agent (combined)
export const useAgentAllExclusives = (agentId: string | undefined) => {
  const { data: investmentExclusives, isLoading: investmentLoading } = useAgentInvestmentExclusives(agentId);
  const { data: commercialExclusives, isLoading: commercialLoading } = useAgentCommercialExclusives(agentId);

  const allExclusives: ExclusiveListing[] = [
    ...(investmentExclusives || []),
    ...(commercialExclusives || []),
  ];

  return {
    data: allExclusives,
    investmentExclusives: investmentExclusives || [],
    commercialExclusives: commercialExclusives || [],
    isLoading: investmentLoading || commercialLoading,
    investmentCount: investmentExclusives?.length || 0,
    commercialCount: commercialExclusives?.length || 0,
    totalCount: allExclusives.length,
  };
};

// Fetch documents for an investment listing
export const useInvestmentListingDocuments = (listingId: string | undefined) => {
  return useQuery({
    queryKey: ["investment-listing-documents", listingId],
    queryFn: async () => {
      if (!listingId) return [];

      const { data, error } = await supabase
        .from("deal_room_documents")
        .select("*")
        .eq("listing_id", listingId)
        .eq("is_active", true)
        .order("category")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ListingDocument[];
    },
    enabled: !!listingId,
  });
};

// Fetch documents for a commercial listing
export const useCommercialListingDocuments = (listingId: string | undefined) => {
  return useQuery({
    queryKey: ["commercial-listing-documents", listingId],
    queryFn: async () => {
      if (!listingId) return [];

      const { data, error } = await supabase
        .from("commercial_listing_documents")
        .select("*")
        .eq("listing_id", listingId)
        .eq("is_active", true)
        .order("category")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ListingDocument[];
    },
    enabled: !!listingId,
  });
};

// Helper to group documents by category
export const groupDocumentsByCategory = (documents: ListingDocument[]) => {
  return documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, ListingDocument[]>);
};
