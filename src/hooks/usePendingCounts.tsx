import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PendingCounts {
  agentRequests: number;
  commissionRequests: number;
  pipelineValue: number;
}

export const usePendingCounts = () => {
  return useQuery({
    queryKey: ["pending-counts"],
    queryFn: async () => {
      const [agentRequestsResult, commissionRequestsResult, listingsResult] = await Promise.all([
        supabase
          .from("agent_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("commission_requests")
          .select("id", { count: "exact", head: true })
          .in("status", ["pending", "under_review"]),
        supabase
          .from("investment_listings")
          .select("asking_price")
          .eq("is_active", true),
      ]);

      const pipelineValue = listingsResult.data?.reduce(
        (sum, listing) => sum + (listing.asking_price || 0),
        0
      ) || 0;

      return {
        agentRequests: agentRequestsResult.count || 0,
        commissionRequests: commissionRequestsResult.count || 0,
        pipelineValue,
      } as PendingCounts;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};
