import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AgentDashboardStats {
  agent_id: string;
  agent_name: string | null;
  agent_email: string | null;
  division: string | null;
  active_deals: number;
  won_deals: number;
  lost_deals: number;
  pipeline_value: number;
  avg_deal_size: number;
  total_contacts: number;
  upcoming_tasks: number;
  overdue_tasks: number;
  total_commissions_paid: number;
  pending_commissions: number;
  last_deal_update: string | null;
  last_contact_update: string | null;
  refreshed_at: string;
}

export const useAgentDashboardStats = (agentId?: string) => {
  const { user } = useAuth();
  const targetAgentId = agentId || user?.id;

  return useQuery({
    queryKey: ['agent-dashboard-stats', targetAgentId],
    queryFn: async () => {
      if (!targetAgentId) throw new Error('No agent ID provided');

      const { data, error } = await supabase
        .from('agent_dashboard_stats')
        .select('*')
        .eq('agent_id', targetAgentId)
        .single();

      if (error) {
        // Fallback to regular queries if materialized view not available
        console.warn('Materialized view query failed, using fallback:', error.message);
        return null;
      }

      return data as AgentDashboardStats;
    },
    enabled: !!targetAgentId,
    staleTime: 5 * 60 * 1000, // 5 minutes - view is refreshed daily
  });
};
