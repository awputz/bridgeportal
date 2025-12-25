import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CommissionRequest } from "./useCommissionRequests";

export interface CommissionRequestWithAgent extends CommissionRequest {
  agent_name: string | null;
  agent_email: string | null;
}

export const useAllCommissionRequests = () => {
  return useQuery({
    queryKey: ["commission-requests", "all"],
    queryFn: async () => {
      // Fetch commission requests
      const { data: requestsData, error } = await supabase
        .from("commission_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Get unique agent IDs
      const agentIds = [...new Set(requestsData.map(r => r.agent_id))];

      // Fetch profiles for all agents in a single query
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", agentIds);

      // Also try to get names from team_members as a fallback
      const { data: teamMembers } = await supabase
        .from("team_members")
        .select("email, name")
        .eq("is_active", true);

      // Create maps for quick lookup
      const profileMap = new Map(
        profiles?.map(p => [p.id, { full_name: p.full_name, email: p.email }]) || []
      );
      
      const teamMemberMap = new Map(
        teamMembers?.map(t => [t.email, t.name]) || []
      );
      
      // Merge profiles with requests
      return requestsData.map(request => {
        const profile = profileMap.get(request.agent_id);
        const teamMemberName = profile?.email ? teamMemberMap.get(profile.email) : null;
        
        return {
          ...request,
          agent_name: teamMemberName || profile?.full_name || profile?.email?.split("@")[0] || "Unknown Agent",
          agent_email: profile?.email || null,
        } as CommissionRequestWithAgent;
      });
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
