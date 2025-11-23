import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "./useProperties";

export const useInvestmentOfferings = (filters?: {
  asset_type?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  offering_status?: string;
}) => {
  return useQuery({
    queryKey: ["investment_offerings", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.asset_type && filters.asset_type !== "all") {
        query = query.eq("asset_type", filters.asset_type);
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

      if (filters?.offering_status) {
        query = query.eq("offering_status", filters.offering_status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Property[];
    },
  });
};