import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  closing_date: string | null;
  agent_name: string;
  deal_type: string;
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
}

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });
};
