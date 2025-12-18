import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
}

export const useInvestmentListings = () => {
  return useQuery({
    queryKey: ["investment-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_listings")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as InvestmentListing[];
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
      return data as InvestmentListing;
    },
    enabled: !!id,
  });
};
