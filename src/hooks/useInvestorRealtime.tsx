import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to subscribe to real-time updates for investor data
 * Automatically invalidates queries when changes occur in key tables
 */
export const useInvestorRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to transactions changes
    const transactionsChannel = supabase
      .channel("investor-transactions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        (payload) => {
          console.log("Transaction change:", payload);
          // Invalidate all investor-related queries
          queryClient.invalidateQueries({ queryKey: ["investor-transactions"] });
          queryClient.invalidateQueries({ queryKey: ["investor-metrics"] });
          queryClient.invalidateQueries({ queryKey: ["investor-division-breakdown"] });
          queryClient.invalidateQueries({ queryKey: ["investor-monthly-trends"] });
          queryClient.invalidateQueries({ queryKey: ["investor-commission-insights"] });
          queryClient.invalidateQueries({ queryKey: ["investor-agent-performance"] });
        }
      )
      .subscribe();

    // Subscribe to agent requests changes
    const agentRequestsChannel = supabase
      .channel("investor-agent-requests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "agent_requests",
        },
        (payload) => {
          console.log("Agent request change:", payload);
          queryClient.invalidateQueries({ queryKey: ["investor-agent-requests"] });
          queryClient.invalidateQueries({ queryKey: ["pending-counts"] });
        }
      )
      .subscribe();

    // Subscribe to commission requests changes
    const commissionRequestsChannel = supabase
      .channel("investor-commission-requests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "commission_requests",
        },
        (payload) => {
          console.log("Commission request change:", payload);
          queryClient.invalidateQueries({ queryKey: ["investor-commission-requests"] });
          queryClient.invalidateQueries({ queryKey: ["pending-counts"] });
        }
      )
      .subscribe();

    // Subscribe to investment listings changes
    const investmentListingsChannel = supabase
      .channel("investor-investment-listings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "investment_listings",
        },
        (payload) => {
          console.log("Investment listing change:", payload);
          queryClient.invalidateQueries({ queryKey: ["investor-listings"] });
          queryClient.invalidateQueries({ queryKey: ["investor-metrics"] });
          queryClient.invalidateQueries({ queryKey: ["pending-counts"] });
        }
      )
      .subscribe();

    // Subscribe to commercial listings changes
    const commercialListingsChannel = supabase
      .channel("investor-commercial-listings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "commercial_listings",
        },
        (payload) => {
          console.log("Commercial listing change:", payload);
          queryClient.invalidateQueries({ queryKey: ["investor-listings"] });
          queryClient.invalidateQueries({ queryKey: ["investor-metrics"] });
        }
      )
      .subscribe();

    // Subscribe to team members changes
    const teamMembersChannel = supabase
      .channel("investor-team-members-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_members",
        },
        (payload) => {
          console.log("Team member change:", payload);
          queryClient.invalidateQueries({ queryKey: ["investor-team"] });
          queryClient.invalidateQueries({ queryKey: ["investor-metrics"] });
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(agentRequestsChannel);
      supabase.removeChannel(commissionRequestsChannel);
      supabase.removeChannel(investmentListingsChannel);
      supabase.removeChannel(commercialListingsChannel);
      supabase.removeChannel(teamMembersChannel);
    };
  }, [queryClient]);
};
