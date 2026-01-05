import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AgentRequest {
  id: string;
  request_type: string;
  property_address: string | null;
  client_name: string | null;
  priority: string;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useMyAgentRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-agent-requests", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("agent_requests")
        .select("id, request_type, property_address, client_name, priority, notes, status, created_at, updated_at")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AgentRequest[];
    },
    enabled: !!user?.id,
  });
};
