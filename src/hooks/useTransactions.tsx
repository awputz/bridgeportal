import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  closing_date: string | null;
  agent_name: string;
  deal_type: string;
  division: string | null;
  property_address: string;
  property_type: string | null;
  monthly_rent: number | null;
  lease_term_months: number | null;
  total_lease_value: number | null;
  borough: string | null;
  neighborhood: string | null;
  building_id: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  price_per_unit: number | null;
  price_per_sf: number | null;
  role: string | null;
  year: number | null;
  gross_square_feet: number | null;
  units: number | null;
  sale_price: number | null;
  asset_type: string | null;
  image_url: string | null;
}

export const useTransactions = (dealType?: string) => {
  return useQuery({
    queryKey: ["transactions", dealType],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("*");

      if (dealType) {
        query = query.eq("deal_type", dealType);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Sort by deal size (sale_price or total_lease_value), largest first
      const sorted = (data as Transaction[]).sort((a, b) => {
        const aValue = a.sale_price || a.total_lease_value || 0;
        const bValue = b.sale_price || b.total_lease_value || 0;
        return bValue - aValue;
      });
      
      return sorted;
    },
  });
};
