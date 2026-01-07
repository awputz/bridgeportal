import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { withRetry } from '@/lib/supabaseRetry';

export interface MonthlyPerformance {
  agent_id: string;
  division: string | null;
  month: string;
  deals_created: number;
  deals_won: number;
  revenue: number;
  commissions_earned: number;
}

export const useMonthlyPerformance = (agentId?: string, division?: string) => {
  const { user } = useAuth();
  const targetAgentId = agentId || user?.id;

  return useQuery({
    queryKey: ['monthly-performance', targetAgentId, division],
    queryFn: async () => {
      if (!targetAgentId) throw new Error('No agent ID provided');

      let query = supabase
        .from('agent_monthly_performance')
        .select('*')
        .eq('agent_id', targetAgentId);

      if (division) {
        query = query.eq('division', division);
      }

      const { data, error } = await withRetry(
        async () => query.order('month', { ascending: false }).limit(12),
        { maxAttempts: 3 }
      );

      if (error) {
        console.warn('Monthly performance query failed:', error.message);
        return [];
      }

      return data as MonthlyPerformance[];
    },
    enabled: !!targetAgentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const err = error as { code?: string };
      if (err?.code === '42501' || err?.code === 'PGRST116') return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
