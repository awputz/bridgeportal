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
  bio: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  category: string | null;
}

export interface InvestmentListing {
  id: string;
  property_address: string;
  neighborhood: string | null;
  borough: string | null;
  asset_class: string;
  units: number | null;
  asking_price: number | null;
  cap_rate: number | null;
  gross_sf: number | null;
  year_built: number | null;
  description: string | null;
  image_url: string | null;
  om_url: string | null;
  deal_room_password: string;
  listing_agent_id: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
  agents?: ListingAgent[];
}

export const useInvestmentListings = () => {
  return useQuery({
    queryKey: ["investment-listings"],
    queryFn: async () => {
      // First get listings
      const { data: listings, error: listingsError } = await supabase
        .from("investment_listings")
        .select("*")
        .eq("is_active", true)
        .order("asking_price", { ascending: false, nullsFirst: false });

      if (listingsError) throw listingsError;
      if (!listings) return [];

      // Get all listing agents with their team member info
      const listingIds = listings.map(l => l.id);
      const { data: listingAgents, error: agentsError } = await supabase
        .from("investment_listing_agents")
        .select(`
          listing_id,
          display_order,
          agent:team_members_public(id, name, title, email, phone, image_url, slug, bio, instagram_url, linkedin_url, category)
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
      })) as InvestmentListing[];
    },
  });
};

export const useInvestmentListing = (id: string) => {
  return useQuery({
    queryKey: ["investment-listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Get agents for this listing
      const { data: listingAgents } = await supabase
        .from("investment_listing_agents")
        .select(`
          agent:team_members_public(id, name, title, email, phone, image_url, slug, bio, instagram_url, linkedin_url, category)
        `)
        .eq("listing_id", id)
        .order("display_order", { ascending: true });

      const agents = listingAgents?.map(la => la.agent as unknown as ListingAgent).filter(Boolean) || [];

      return { ...data, agents } as InvestmentListing;
    },
    enabled: !!id,
  });
};
