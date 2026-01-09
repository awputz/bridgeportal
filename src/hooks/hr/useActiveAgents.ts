import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ActiveAgentStatus = "onboarding" | "active" | "on_leave" | "terminated";

export interface ActiveAgent {
  id: string;
  hr_agent_id: string | null;
  user_id: string | null;
  employee_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  division: string;
  hire_date: string;
  start_date: string | null;
  contract_id: string | null;
  commission_split: string | null;
  status: ActiveAgentStatus;
  onboarding_completed_at: string | null;
  ytd_production: number;
  deals_closed: number;
  last_deal_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ActiveAgentInsert {
  hr_agent_id?: string | null;
  user_id?: string | null;
  employee_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  division: string;
  hire_date: string;
  start_date?: string | null;
  contract_id?: string | null;
  commission_split?: string | null;
  status?: ActiveAgentStatus;
}

export interface ActiveAgentFilters {
  status?: ActiveAgentStatus;
  division?: string;
  search?: string;
}

export const useActiveAgents = (filters?: ActiveAgentFilters) => {
  return useQuery({
    queryKey: ["active-agents", filters],
    queryFn: async () => {
      let query = supabase
        .from("active_agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.division) {
        query = query.eq("division", filters.division);
      }
      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ActiveAgent[];
    },
  });
};

export const useActiveAgent = (id: string | undefined) => {
  return useQuery({
    queryKey: ["active-agent", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("active_agents")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as ActiveAgent;
    },
    enabled: !!id,
  });
};

export const useCreateActiveAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agent: ActiveAgentInsert) => {
      // Generate employee ID
      const year = new Date().getFullYear();
      const { count } = await supabase
        .from("active_agents")
        .select("*", { count: "exact", head: true });
      const employeeId = `BRG-${year}-${String((count || 0) + 1).padStart(3, "0")}`;

      const { data, error } = await supabase
        .from("active_agents")
        .insert({ ...agent, employee_id: employeeId })
        .select()
        .single();

      if (error) throw error;

      // Create onboarding record
      await supabase.from("agent_onboarding").insert({
        active_agent_id: data.id,
        contract_signed: !!agent.contract_id,
        contract_signed_at: agent.contract_id ? new Date().toISOString() : null,
      });

      return data as ActiveAgent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-agents"] });
      toast.success("Active agent created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create active agent: ${error.message}`);
    },
  });
};

export const useUpdateActiveAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ActiveAgent> & { id: string }) => {
      const { data, error } = await supabase
        .from("active_agents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ActiveAgent;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["active-agents"] });
      queryClient.invalidateQueries({ queryKey: ["active-agent", data.id] });
      toast.success("Agent updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update agent: ${error.message}`);
    },
  });
};

export const useActiveAgentStats = () => {
  return useQuery({
    queryKey: ["active-agent-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("active_agents").select("status, division");
      if (error) throw error;

      const agents = data as Pick<ActiveAgent, "status" | "division">[];
      return {
        total: agents.length,
        onboarding: agents.filter((a) => a.status === "onboarding").length,
        active: agents.filter((a) => a.status === "active").length,
        onLeave: agents.filter((a) => a.status === "on_leave").length,
        terminated: agents.filter((a) => a.status === "terminated").length,
        byDivision: {
          residential: agents.filter((a) => a.division === "residential").length,
          commercial: agents.filter((a) => a.division === "commercial").length,
          investment_sales: agents.filter((a) => a.division === "investment_sales").length,
        },
      };
    },
  });
};

// Status utilities
export const statusConfig: Record<ActiveAgentStatus, { label: string; color: string }> = {
  onboarding: { label: "Onboarding", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  on_leave: { label: "On Leave", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  terminated: { label: "Terminated", color: "bg-red-500/10 text-red-500 border-red-500/20" },
};
