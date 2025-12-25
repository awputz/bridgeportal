import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CommissionRequest } from "./useCommissionRequests";

export interface CommissionRequestWithAgent extends CommissionRequest {
  agent_name?: string;
  agent_email?: string;
}

export const useAllCommissionRequests = () => {
  return useQuery({
    queryKey: ["commission-requests", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commission_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Get agent info for each request
      const requestsWithAgents = await Promise.all(
        (data as CommissionRequest[]).map(async (request) => {
          // Try to get from team_members first
          const { data: teamMember } = await supabase
            .from("team_members")
            .select("name, email")
            .eq("email", (await supabase.auth.admin?.getUserById?.(request.agent_id))?.data?.user?.email || "")
            .maybeSingle();
          
          // If not found, get from auth user
          const { data: authUser } = await supabase.auth.admin?.getUserById?.(request.agent_id) || {};
          
          return {
            ...request,
            agent_name: teamMember?.name || authUser?.user?.email?.split("@")[0] || "Unknown",
            agent_email: teamMember?.email || authUser?.user?.email || "",
          } as CommissionRequestWithAgent;
        })
      );
      
      return requestsWithAgents;
    },
  });
};

export const usePendingCommissionRequestsCount = () => {
  return useQuery({
    queryKey: ["commission-requests", "pending-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("commission_requests")
        .select("id", { count: "exact" })
        .in("status", ["pending", "under_review"]);

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useUpdateCommissionRequestAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      admin_notes 
    }: { 
      id: string; 
      status: CommissionRequest["status"]; 
      admin_notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updates: Partial<CommissionRequest> = {
        status,
        admin_notes,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      };

      if (status === "paid") {
        updates.paid_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("commission_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["commission-requests"] });
      toast({
        title: "Request Updated",
        description: `Status changed to ${variables.status}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCommissionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("commission_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-requests"] });
      toast({
        title: "Request Deleted",
        description: "The commission request has been deleted.",
      });
    },
  });
};
