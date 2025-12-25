import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AgentTransaction {
  id: string;
  property_address: string;
  deal_type: string;
  division: string;
  sale_price: number | null;
  monthly_rent: number | null;
  total_lease_value: number | null;
  closing_date: string | null;
  agent_name: string;
  neighborhood: string | null;
  borough: string | null;
  asset_type: string | null;
  units: number | null;
  gross_square_feet: number | null;
  commission: number | null;
}

// Fetch transactions for the current logged-in agent based on their profile name
export const useAgentTransactions = () => {
  return useQuery({
    queryKey: ['agent-transactions'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get the user's profile to match agent_name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      if (!profile) return [];

      // Build search patterns for agent matching
      const searchPatterns: string[] = [];
      
      if (profile.full_name) {
        searchPatterns.push(profile.full_name);
        // Also try first name + last name variations
        const nameParts = profile.full_name.split(' ');
        if (nameParts.length >= 2) {
          searchPatterns.push(`${nameParts[0]} ${nameParts[nameParts.length - 1]}`);
          // Add last name only for matching "Smith, Jones" style entries
          searchPatterns.push(nameParts[nameParts.length - 1]);
        }
      }
      
      // Extract name from email (before @)
      if (profile.email) {
        const emailName = profile.email.split('@')[0];
        const formattedName = emailName
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
        searchPatterns.push(formattedName);
      }

      // Query transactions matching any of the patterns
      let allTransactions: AgentTransaction[] = [];
      
      for (const pattern of searchPatterns) {
        const { data, error } = await supabase
          .from('transactions')
          .select('id, property_address, deal_type, division, sale_price, monthly_rent, total_lease_value, closing_date, agent_name, neighborhood, borough, asset_type, units, gross_square_feet, commission')
          .ilike('agent_name', `%${pattern}%`)
          .order('closing_date', { ascending: false });
        
        if (!error && data) {
          const existingIds = new Set(allTransactions.map(t => t.id));
          const newTransactions = data.filter(t => !existingIds.has(t.id));
          allTransactions = [...allTransactions, ...newTransactions];
        }
      }

      return allTransactions;
    },
  });
};
