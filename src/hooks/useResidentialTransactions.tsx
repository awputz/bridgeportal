import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ResidentialTransaction {
  id: string;
  property_address: string;
  neighborhood: string | null;
  borough: string | null;
  property_type: string | null;
  monthly_rent: number | null;
  lease_term_months: number | null;
  total_lease_value: number | null;
  agent_name: string;
  closing_date: string | null;
  deal_type: string;
}

export const useResidentialTransactions = (limit?: number, dealType?: string) => {
  return useQuery({
    queryKey: ["residential-transactions", limit, dealType],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("id, property_address, neighborhood, borough, property_type, monthly_rent, lease_term_months, total_lease_value, agent_name, closing_date, deal_type")
        .in("deal_type", dealType ? [dealType] : ["Residential", "Commercial"]);

      const { data, error } = await query;

      if (error) throw error;
      
      // Sort by deal size (total_lease_value or monthly_rent), largest first
      const sorted = (data as ResidentialTransaction[]).sort((a, b) => {
        const aValue = a.total_lease_value || (a.monthly_rent || 0) * (a.lease_term_months || 12);
        const bValue = b.total_lease_value || (b.monthly_rent || 0) * (b.lease_term_months || 12);
        return bValue - aValue;
      });
      
      return limit ? sorted.slice(0, limit) : sorted;
    },
  });
};
