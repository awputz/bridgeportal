import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AgentMetrics {
  agent_id: string;
  agent_name: string;
  agent_email: string;
  deals_closed: number;
  deals_active: number;
  pipeline_value: number;
  contacts_count: number;
  contacts_added_30d: number;
  activities_total: number;
  activities_completed: number;
  completion_rate: number;
}

export const useAgentMetrics = () => {
  return useQuery({
    queryKey: ["agent-metrics"],
    queryFn: async (): Promise<AgentMetrics[]> => {
      // Get all agents (users with agent role)
      const { data: agentRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "agent");

      if (rolesError) throw rolesError;
      
      const agentIds = agentRoles?.map(r => r.user_id) || [];
      
      if (agentIds.length === 0) return [];

      // Get profiles for agents
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", agentIds);

      if (profilesError) throw profilesError;

      // Get all deals
      const { data: deals, error: dealsError } = await supabase
        .from("crm_deals")
        .select("agent_id, won, is_active, value")
        .eq("is_active", true);

      if (dealsError) throw dealsError;

      // Get all contacts
      const { data: contacts, error: contactsError } = await supabase
        .from("crm_contacts")
        .select("agent_id, created_at")
        .eq("is_active", true);

      if (contactsError) throw contactsError;

      // Get all activities
      const { data: activities, error: activitiesError } = await supabase
        .from("crm_activities")
        .select("agent_id, is_completed");

      if (activitiesError) throw activitiesError;

      // Calculate 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Build metrics for each agent
      const metrics: AgentMetrics[] = (profiles || []).map(profile => {
        const agentDeals = deals?.filter(d => d.agent_id === profile.id) || [];
        const agentContacts = contacts?.filter(c => c.agent_id === profile.id) || [];
        const agentActivities = activities?.filter(a => a.agent_id === profile.id) || [];

        const dealsClosedCount = agentDeals.filter(d => d.won === true).length;
        const activeDeals = agentDeals.filter(d => d.won !== true);
        const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
        
        const contactsAdded30d = agentContacts.filter(c => {
          const createdAt = new Date(c.created_at || "");
          return createdAt >= thirtyDaysAgo;
        }).length;

        const completedActivities = agentActivities.filter(a => a.is_completed).length;
        const completionRate = agentActivities.length > 0 
          ? Math.round((completedActivities / agentActivities.length) * 100) 
          : 0;

        return {
          agent_id: profile.id,
          agent_name: profile.full_name || profile.email?.split("@")[0] || "Unknown",
          agent_email: profile.email || "",
          deals_closed: dealsClosedCount,
          deals_active: activeDeals.length,
          pipeline_value: pipelineValue,
          contacts_count: agentContacts.length,
          contacts_added_30d: contactsAdded30d,
          activities_total: agentActivities.length,
          activities_completed: completedActivities,
          completion_rate: completionRate,
        };
      });

      // Sort by pipeline value descending
      return metrics.sort((a, b) => b.pipeline_value - a.pipeline_value);
    },
  });
};

// Hook to get list of agents for filtering
export const useAgentsList = () => {
  return useQuery({
    queryKey: ["agents-list"],
    queryFn: async () => {
      const { data: agentRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["agent", "admin"]);

      if (rolesError) throw rolesError;
      
      const agentIds = agentRoles?.map(r => r.user_id) || [];
      
      if (agentIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", agentIds);

      if (profilesError) throw profilesError;

      return (profiles || []).map(p => ({
        id: p.id,
        name: p.full_name || p.email?.split("@")[0] || "Unknown",
        email: p.email || "",
      }));
    },
  });
};
