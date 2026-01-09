import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductionSummary {
  active_agent_id: string;
  full_name: string;
  division: string;
  hire_date: string;
  status: string;
  total_deals: number;
  total_volume: number;
  total_commission: number;
  last_deal_date: string | null;
  deals_since_hire: number;
  volume_since_hire: number;
  commission_since_hire: number;
}

export interface ProductionSync {
  id: string;
  active_agent_id: string;
  transaction_id: string;
  match_method: string;
  matched_at: string;
  verified_by: string | null;
}

// Get production summary for all agents (from materialized view)
export const useProductionSummary = () => {
  return useQuery({
    queryKey: ["hr-production-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hr_production_summary")
        .select("*")
        .order("total_volume", { ascending: false });

      if (error) throw error;
      return data as ProductionSummary[];
    },
  });
};

// Get production for a single agent
export const useAgentProduction = (activeAgentId: string | undefined) => {
  return useQuery({
    queryKey: ["agent-production", activeAgentId],
    queryFn: async () => {
      if (!activeAgentId) return null;

      const { data, error } = await supabase
        .from("hr_production_summary")
        .select("*")
        .eq("active_agent_id", activeAgentId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as ProductionSummary | null;
    },
    enabled: !!activeAgentId,
  });
};

// Get matched transactions for an agent
export const useAgentTransactionHistory = (activeAgentId: string | undefined) => {
  return useQuery({
    queryKey: ["agent-transaction-history", activeAgentId],
    queryFn: async () => {
      if (!activeAgentId) return [];

      const { data, error } = await supabase
        .from("agent_production_sync")
        .select(`
          id,
          match_method,
          matched_at,
          transaction_id,
          transactions (
            id,
            property_address,
            closing_date,
            sale_price,
            total_lease_value,
            commission,
            deal_type,
            division
          )
        `)
        .eq("active_agent_id", activeAgentId)
        .order("matched_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!activeAgentId,
  });
};

// Sync transactions for an agent using the database function
export const useSyncAgentTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activeAgentId: string) => {
      const { data, error } = await supabase
        .rpc("sync_agent_transactions_by_name", { p_active_agent_id: activeAgentId });

      if (error) throw error;
      return data as number;
    },
    onSuccess: (matchedCount, activeAgentId) => {
      queryClient.invalidateQueries({ queryKey: ["agent-production", activeAgentId] });
      queryClient.invalidateQueries({ queryKey: ["agent-transaction-history", activeAgentId] });
      queryClient.invalidateQueries({ queryKey: ["hr-production-summary"] });
      toast.success(`Matched ${matchedCount} new transaction(s)`);
    },
    onError: (error) => {
      toast.error("Failed to sync transactions");
      console.error(error);
    },
  });
};

// Manually link a transaction to an agent
export const useManualTransactionMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activeAgentId,
      transactionId,
    }: {
      activeAgentId: string;
      transactionId: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("agent_production_sync")
        .insert({
          active_agent_id: activeAgentId,
          transaction_id: transactionId,
          match_method: "manual",
          verified_by: user?.user?.id,
        });

      if (error) throw error;
    },
    onSuccess: (_, { activeAgentId }) => {
      queryClient.invalidateQueries({ queryKey: ["agent-production", activeAgentId] });
      queryClient.invalidateQueries({ queryKey: ["agent-transaction-history", activeAgentId] });
      queryClient.invalidateQueries({ queryKey: ["hr-production-summary"] });
      toast.success("Transaction matched successfully");
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("Transaction already matched to this agent");
      } else {
        toast.error("Failed to match transaction");
      }
      console.error(error);
    },
  });
};

// Remove a transaction match
export const useRemoveTransactionMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (syncId: string) => {
      const { error } = await supabase
        .from("agent_production_sync")
        .delete()
        .eq("id", syncId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-production"] });
      queryClient.invalidateQueries({ queryKey: ["agent-transaction-history"] });
      queryClient.invalidateQueries({ queryKey: ["hr-production-summary"] });
      toast.success("Transaction match removed");
    },
    onError: (error) => {
      toast.error("Failed to remove match");
      console.error(error);
    },
  });
};

// Get leaderboard with filtering
export const useProductionLeaderboard = (filters?: {
  division?: string;
  status?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["production-leaderboard", filters],
    queryFn: async () => {
      let query = supabase
        .from("hr_production_summary")
        .select("*")
        .order("total_volume", { ascending: false });

      if (filters?.division) {
        query = query.eq("division", filters.division);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProductionSummary[];
    },
  });
};

// Refresh the materialized view
export const useRefreshProductionSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("refresh_hr_production_summary");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-production-summary"] });
      queryClient.invalidateQueries({ queryKey: ["production-leaderboard"] });
      toast.success("Production data refreshed");
    },
    onError: (error) => {
      toast.error("Failed to refresh data");
      console.error(error);
    },
  });
};
