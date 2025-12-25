import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables, TablesUpdate } from "@/integrations/supabase/types";

type AgentRequest = Tables<"agent_requests">;

export interface AgentRequestWithProfile extends AgentRequest {
  agent_name: string | null;
  agent_email: string | null;
}

export function useAgentRequestsAdmin() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-agent-requests"],
    queryFn: async () => {
      // Fetch agent requests
      const { data: requestsData, error: requestsError } = await supabase
        .from("agent_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (requestsError) throw requestsError;

      // Get unique agent IDs
      const agentIds = [...new Set(requestsData.map(r => r.agent_id))];

      // Fetch profiles for all agents
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", agentIds);

      // Create a map of agent_id -> profile
      const profileMap = new Map(
        profiles?.map(p => [p.id, { full_name: p.full_name, email: p.email }]) || []
      );

      // Merge profiles with requests
      return requestsData.map(request => ({
        ...request,
        agent_name: profileMap.get(request.agent_id)?.full_name || null,
        agent_email: profileMap.get(request.agent_id)?.email || null,
      })) as AgentRequestWithProfile[];
    },
  });

  const updateRequest = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"agent_requests">) => {
      const { error } = await supabase
        .from("agent_requests")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agent-requests"] });
      toast({ title: "Request updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("agent_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agent-requests"] });
      toast({ title: "Request deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  return {
    requests,
    isLoading,
    updateRequest,
    deleteRequest,
  };
}
