import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
}

export const useCommercialListings = () => {
  return useQuery({
    queryKey: ["commercial-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commercial_listings")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as CommercialListing[];
    },
  });
};

export const useCommercialListingsByType = (type: "office" | "retail") => {
  return useQuery({
    queryKey: ["commercial-listings", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commercial_listings")
        .select("*")
        .eq("is_active", true)
        .eq("listing_type", type)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as CommercialListing[];
    },
  });
};
