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
  year: number | null;
  price_per_sf: number | null;
  role: string | null;
  notes: string | null;
}

// Fetch transactions for the current logged-in agent using optimized database function
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

      const agentEmail = profile.email || user.email || '';
      const agentFullName = profile.full_name || '';

      // Try using the optimized database function first
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_agent_transactions', {
          p_agent_email: agentEmail,
          p_agent_full_name: agentFullName,
        });

      if (!functionError && functionData) {
        return functionData as AgentTransaction[];
      }

      // Fallback to manual pattern matching if function fails
      return fallbackAgentTransactionSearch(profile);
    },
    staleTime: 60000, // Cache for 1 minute
  });
};

// Fallback function for agent transaction matching
async function fallbackAgentTransactionSearch(profile: { full_name: string | null; email: string | null }): Promise<AgentTransaction[]> {
  const searchPatterns: string[] = [];
  
  if (profile.full_name) {
    searchPatterns.push(profile.full_name);
    const nameParts = profile.full_name.split(' ');
    if (nameParts.length >= 2) {
      searchPatterns.push(`${nameParts[0]} ${nameParts[nameParts.length - 1]}`);
      searchPatterns.push(nameParts[nameParts.length - 1]);
    }
  }
  
  if (profile.email) {
    const emailName = profile.email.split('@')[0];
    const formattedName = emailName
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
    searchPatterns.push(formattedName);
  }

  // Query with OR conditions in a single query using ilike
  if (searchPatterns.length === 0) return [];

  // Build a single query with multiple patterns
  const orConditions = searchPatterns.map(p => `agent_name.ilike.%${p}%`).join(',');
  
  const { data, error } = await supabase
    .from('transactions')
    .select('id, property_address, deal_type, division, sale_price, monthly_rent, total_lease_value, closing_date, agent_name, neighborhood, borough, asset_type, units, gross_square_feet, commission, year, price_per_sf, role, notes')
    .or(orConditions)
    .order('closing_date', { ascending: false });
  
  if (error) {
    return [];
  }

  // Deduplicate by ID
  const uniqueTransactions = new Map<string, AgentTransaction>();
  (data || []).forEach(t => {
    if (!uniqueTransactions.has(t.id)) {
      uniqueTransactions.set(t.id, t as AgentTransaction);
    }
  });

  return Array.from(uniqueTransactions.values());
}
