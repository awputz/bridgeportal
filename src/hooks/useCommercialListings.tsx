import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ListingAgent {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string | null;
  image_url: string | null;
  slug: string | null;
}

export interface CommercialListing {
  id: string;
  property_address: string;
  building_name: string | null;
  neighborhood: string | null;
  borough: string | null;
  listing_type: "office" | "retail";
  square_footage: number;
  asking_rent: number | null;
  rent_per_sf: number | null;
  lease_term: string | null;
  possession: string | null;
  ceiling_height_ft: number | null;
  features: string[] | null;
  description: string | null;
  image_url: string | null;
  flyer_url: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
  agents?: ListingAgent[];
}

export const useCommercialListings = () => {
  return useQuery({
    queryKey: ["commercial-listings"],
    queryFn: async () => {
      // First get listings
      const { data: listings, error: listingsError } = await supabase
        .from("commercial_listings")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (listingsError) throw listingsError;
      if (!listings) return [];

      // Get all listing agents with their team member info
      const listingIds = listings.map(l => l.id);
      const { data: listingAgents, error: agentsError } = await supabase
        .from("commercial_listing_agents")
        .select(`
          listing_id,
          display_order,
          agent:team_members_public(id, name, title, email, phone, image_url, slug)
        `)
        .in("listing_id", listingIds)
        .order("display_order", { ascending: true });

      if (agentsError) throw agentsError;

      // Map agents to listings
      const agentsByListing = new Map<string, ListingAgent[]>();
      listingAgents?.forEach((la) => {
        const agent = la.agent as unknown as ListingAgent;
        if (agent) {
          const existing = agentsByListing.get(la.listing_id) || [];
          existing.push(agent);
          agentsByListing.set(la.listing_id, existing);
        }
      });

      return listings.map((listing) => ({
        ...listing,
        agents: agentsByListing.get(listing.id) || [],
      })) as CommercialListing[];
    },
  });
};

export const useCommercialListingsByType = (type: "office" | "retail") => {
  return useQuery({
    queryKey: ["commercial-listings", type],
    queryFn: async () => {
      const { data: listings, error: listingsError } = await supabase
        .from("commercial_listings")
        .select("*")
        .eq("is_active", true)
        .eq("listing_type", type)
        .order("display_order", { ascending: true });

      if (listingsError) throw listingsError;
      if (!listings) return [];

      // Get all listing agents with their team member info
      const listingIds = listings.map(l => l.id);
      if (listingIds.length === 0) return listings as CommercialListing[];

      const { data: listingAgents, error: agentsError } = await supabase
        .from("commercial_listing_agents")
        .select(`
          listing_id,
          display_order,
          agent:team_members_public(id, name, title, email, phone, image_url, slug)
        `)
        .in("listing_id", listingIds)
        .order("display_order", { ascending: true });

      if (agentsError) throw agentsError;

      // Map agents to listings
      const agentsByListing = new Map<string, ListingAgent[]>();
      listingAgents?.forEach((la) => {
        const agent = la.agent as unknown as ListingAgent;
        if (agent) {
          const existing = agentsByListing.get(la.listing_id) || [];
          existing.push(agent);
          agentsByListing.set(la.listing_id, existing);
        }
      });

      return listings.map((listing) => ({
        ...listing,
        agents: agentsByListing.get(listing.id) || [],
      })) as CommercialListing[];
    },
  });
};
