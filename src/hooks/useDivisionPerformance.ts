import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { withRetry } from '@/lib/supabaseRetry';

export interface DivisionPerformance {
  division: string;
  total_deals: number;
  won_deals: number;
  total_pipeline_value: number;
  active_agents: number;
  total_contacts: number;
}

export const useDivisionPerformance = () => {
  return useQuery({
    queryKey: ['division-performance'],
    queryFn: async () => {
      const { data, error } = await withRetry(
        async () => supabase
          .from('division_performance_live')
          .select('*'),
        { maxAttempts: 3 }
      );

      if (error) {
        console.warn('Division performance view query failed:', error.message);
        return [];
      }

      return data as DivisionPerformance[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
  });
};
