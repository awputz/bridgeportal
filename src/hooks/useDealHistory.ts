import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DealHistoryEntry {
  id: string;
  deal_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  old_stage_id: string | null;
  new_stage_id: string | null;
  changed_by: string;
  changed_at: string;
  notes: string | null;
  old_stage?: {
    name: string;
    color: string;
  } | null;
  new_stage?: {
    name: string;
    color: string;
  } | null;
  changed_by_user?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useDealHistory = (dealId: string) => {
  return useQuery({
    queryKey: ['deal-history', dealId],
    queryFn: async () => {
      // First get the history entries
      const { data: history, error: historyError } = await supabase
        .from('crm_deal_history')
        .select('*')
        .eq('deal_id', dealId)
        .order('changed_at', { ascending: false });

      if (historyError) {
        console.warn('Deal history query failed:', historyError.message);
        return [];
      }

      if (!history || history.length === 0) return [];

      // Get stage info for each entry
      const stageIds = [
        ...new Set([
          ...history.filter(h => h.old_stage_id).map(h => h.old_stage_id),
          ...history.filter(h => h.new_stage_id).map(h => h.new_stage_id),
        ].filter(Boolean))
      ];

      const { data: stages } = await supabase
        .from('crm_deal_stages')
        .select('id, name, color')
        .in('id', stageIds);

      const stageMap = new Map(stages?.map(s => [s.id, s]) || []);

      // Get user info for each entry
      const userIds = [...new Set(history.map(h => h.changed_by))];
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const userMap = new Map(users?.map(u => [u.id, u]) || []);

      // Combine the data
      return history.map(entry => ({
        ...entry,
        old_stage: entry.old_stage_id ? stageMap.get(entry.old_stage_id) : null,
        new_stage: entry.new_stage_id ? stageMap.get(entry.new_stage_id) : null,
        changed_by_user: userMap.get(entry.changed_by) || null,
      })) as DealHistoryEntry[];
    },
    enabled: !!dealId,
  });
};
