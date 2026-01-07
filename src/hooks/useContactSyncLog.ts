import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContactSyncEntry {
  id: string;
  agent_id: string;
  google_contact_id: string;
  crm_contact_id: string | null;
  sync_direction: string;
  sync_status: string;
  google_etag: string | null;
  last_synced_at: string;
  created_at: string;
}

export const useContactSyncLog = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['contact-sync-log', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('contact_sync_log')
        .select('*')
        .eq('agent_id', user.id)
        .order('last_sync_at', { ascending: false })
        .limit(100);

      if (error) {
        console.warn('Contact sync log query failed:', error.message);
        return [];
      }
      return data as ContactSyncEntry[];
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });
};

export const useUpdateSyncStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      googleContactId, 
      crmContactId, 
      status 
    }: { 
      googleContactId: string; 
      crmContactId: string | null;
      status: ContactSyncEntry['sync_status'];
    }) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('contact_sync_log')
        .upsert({
          agent_id: user.id,
          google_contact_id: googleContactId,
          crm_contact_id: crmContactId,
          sync_status: status,
          last_synced_at: new Date().toISOString(),
        }, { 
          onConflict: 'agent_id,google_contact_id' 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-sync-log', user?.id] });
    },
  });
};
