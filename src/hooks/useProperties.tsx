import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  title: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  property_type: string | null;
  listing_type: string | null;
  status: string | null;
  featured: boolean | null;
  images: string[] | null;
  amenities: string[] | null;
  latitude: number | null;
  longitude: number | null;
  year_built: number | null;
  created_at: string | null;
  updated_at: string | null;
  is_represented_building: boolean | null;
  cap_rate: number | null;
  gross_square_feet: number | null;
  units: number | null;
  asset_type: string | null;
  offering_status: string | null;
  price_on_request: boolean | null;
  brief_highlights: string | null;
}

export const useProperties = (filters?: {
  listing_type?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
}) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.listing_type && filters.listing_type !== "all") {
        query = query.eq("listing_type", filters.listing_type);
      }

      if (filters?.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }

      if (filters?.min_price) {
        query = query.gte("price", filters.min_price);
      }

      if (filters?.max_price) {
        query = query.lte("price", filters.max_price);
      }

      if (filters?.bedrooms) {
        query = query.gte("bedrooms", filters.bedrooms);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Property[];
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Property | null;
    },
    enabled: !!id,
  });
};
