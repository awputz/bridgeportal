import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ResidentialTransaction {
  id: string;
  property_address: string;
  neighborhood: string | null;
  borough: string | null;
  property_type: string | null;
  monthly_rent: number | null;
  agent_name: string;
  closing_date: string | null;
  deal_type: string;
}

export const useResidentialTransactions = (limit?: number) => {
  return useQuery({
    queryKey: ["residential-transactions", limit],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("id, property_address, neighborhood, borough, property_type, monthly_rent, agent_name, closing_date, deal_type")
        .eq("deal_type", "Residential")
        .order("monthly_rent", { ascending: false, nullsFirst: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ResidentialTransaction[];
    },
  });
};
