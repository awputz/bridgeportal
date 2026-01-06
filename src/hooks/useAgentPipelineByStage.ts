import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { withRetry } from '@/lib/supabaseRetry';

export interface PipelineStage {
  agent_id: string;
  division: string;
  stage_name: string;
  stage_id: string;
  stage_color: string;
  display_order: number;
  deal_count: number;
  stage_value: number;
}

export const useAgentPipelineByStage = (agentId?: string, division?: string) => {
  const { user } = useAuth();
  const targetAgentId = agentId || user?.id;

  return useQuery({
    queryKey: ['agent-pipeline-by-stage', targetAgentId, division],
    queryFn: async () => {
      if (!targetAgentId) throw new Error('No agent ID provided');

      const { data, error } = await withRetry(
        async () => {
          let query = supabase
            .from('agent_pipeline_by_stage')
            .select('*')
            .eq('agent_id', targetAgentId);

          if (division) {
            query = query.eq('division', division);
          }

          return query.order('display_order', { ascending: true });
        },
        { maxAttempts: 3 }
      );

      if (error) {
        console.warn('Pipeline by stage view query failed:', error.message);
        return [];
      }

      return data as PipelineStage[];
    },
    enabled: !!targetAgentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
  });
};
