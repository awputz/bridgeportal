import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables, TablesUpdate } from "@/integrations/supabase/types";

type AgentRequest = Tables<"agent_requests">;

export function useAgentRequestsAdmin() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-agent-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AgentRequest[];
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
