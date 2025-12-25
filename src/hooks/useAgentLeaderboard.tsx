import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  agent_id: string;
  agent_name: string;
  agent_image: string | null;
  total_volume: number;
  deals_closed: number;
  contacts_added: number;
  activities_completed: number;
}

// Fetch leaderboard data by aggregating from agent_metrics and joining with team_members
export const useAgentLeaderboard = (period: 'all-time' | 'ytd' | 'monthly' = 'ytd') => {
  return useQuery({
    queryKey: ['agent-leaderboard', period],
    queryFn: async () => {
      // Calculate date range based on period
      const now = new Date();
      let startDate: string | null = null;
      
      if (period === 'ytd') {
        startDate = `${now.getFullYear()}-01-01`;
      } else if (period === 'monthly') {
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      }

      // Get metrics from agent_metrics table
      let metricsQuery = supabase
        .from('agent_metrics')
        .select('*');
      
      if (startDate) {
        metricsQuery = metricsQuery.gte('period_start', startDate);
      }

      const { data: metrics, error: metricsError } = await metricsQuery;
      
      if (metricsError) throw metricsError;

      // Get team members for names and images
      const { data: teamMembers, error: teamError } = await supabase
        .from('team_members')
        .select('id, name, image_url')
        .eq('is_active', true);
      
      if (teamError) throw teamError;

      // Aggregate metrics by agent
      const agentAggregates: Record<string, {
        total_volume: number;
        deals_closed: number;
        contacts_added: number;
        activities_completed: number;
      }> = {};

      (metrics || []).forEach(metric => {
        if (!agentAggregates[metric.agent_id]) {
          agentAggregates[metric.agent_id] = {
            total_volume: 0,
            deals_closed: 0,
            contacts_added: 0,
            activities_completed: 0,
          };
        }
        agentAggregates[metric.agent_id].total_volume += Number(metric.total_volume || 0);
        agentAggregates[metric.agent_id].deals_closed += Number(metric.deals_closed || 0);
        agentAggregates[metric.agent_id].contacts_added += Number(metric.contacts_added || 0);
        agentAggregates[metric.agent_id].activities_completed += Number(metric.activities_completed || 0);
      });

      // Create team member lookup
      const teamLookup: Record<string, { name: string; image_url: string | null }> = {};
      (teamMembers || []).forEach(member => {
        teamLookup[member.id] = { name: member.name, image_url: member.image_url };
      });

      // Build leaderboard entries
      const leaderboard: LeaderboardEntry[] = Object.entries(agentAggregates).map(([agent_id, stats]) => ({
        agent_id,
        agent_name: teamLookup[agent_id]?.name || 'Unknown Agent',
        agent_image: teamLookup[agent_id]?.image_url || null,
        ...stats,
      }));

      // If no metrics exist, show team members with zero stats
      if (leaderboard.length === 0 && teamMembers) {
        return teamMembers.slice(0, 10).map(member => ({
          agent_id: member.id,
          agent_name: member.name,
          agent_image: member.image_url,
          total_volume: 0,
          deals_closed: 0,
          contacts_added: 0,
          activities_completed: 0,
        }));
      }

      return leaderboard;
    },
  });
};
