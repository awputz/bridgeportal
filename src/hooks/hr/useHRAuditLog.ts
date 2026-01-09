import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HRAuditLogEntry {
  id: string;
  user_id: string | null;
  action: 'create' | 'update' | 'delete';
  table_name: string;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AuditLogFilters {
  tableName?: string;
  recordId?: string;
  action?: 'create' | 'update' | 'delete';
  limit?: number;
}

export function useHRAuditLog(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ['hr-audit-log', filters],
    queryFn: async () => {
      let query = supabase
        .from('hr_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(filters?.limit || 100);

      if (filters?.tableName) {
        query = query.eq('table_name', filters.tableName);
      }
      if (filters?.recordId) {
        query = query.eq('record_id', filters.recordId);
      }
      if (filters?.action) {
        query = query.eq('action', filters.action);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HRAuditLogEntry[];
    },
  });
}

export function useAgentAuditLog(agentId: string | undefined) {
  return useHRAuditLog(
    agentId
      ? { tableName: 'hr_agents', recordId: agentId }
      : undefined
  );
}
