import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClientError {
  id: string;
  error_message: string;
  stack_trace: string | null;
  component_stack: string | null;
  section: string | null;
  url: string | null;
  user_agent: string | null;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface UseClientErrorsOptions {
  limit?: number;
  since?: Date;
}

/**
 * Fetch recent client errors for admin dashboard
 */
export function useClientErrors(options?: UseClientErrorsOptions) {
  const { limit = 100, since } = options || {};

  return useQuery({
    queryKey: ["admin-client-errors", { limit, since: since?.toISOString() }],
    queryFn: async () => {
      let query = supabase
        .from("client_errors")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (since) {
        query = query.gte("created_at", since.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ClientError[];
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 15000,
  });
}

interface ErrorStats {
  totalErrors: number;
  uniqueUsersAffected: number;
  bySection: Record<string, number>;
  byHour: { hour: string; count: number }[];
}

/**
 * Get aggregated error statistics for the last 24 hours
 */
export function useErrorStats() {
  return useQuery({
    queryKey: ["admin-error-stats"],
    queryFn: async (): Promise<ErrorStats> => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from("client_errors")
        .select("id, section, user_id, created_at")
        .gte("created_at", yesterday.toISOString());

      if (error) throw error;

      // Calculate unique users
      const userIds = new Set(data?.map((e) => e.user_id).filter(Boolean));

      // Group by section
      const bySection = (data || []).reduce(
        (acc, e) => {
          const section = e.section || "unknown";
          acc[section] = (acc[section] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Group by hour for timeline
      const byHourMap = new Map<string, number>();
      for (let i = 23; i >= 0; i--) {
        const hourDate = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourKey = hourDate.toISOString().slice(0, 13);
        byHourMap.set(hourKey, 0);
      }

      (data || []).forEach((e) => {
        const hourKey = e.created_at.slice(0, 13);
        if (byHourMap.has(hourKey)) {
          byHourMap.set(hourKey, (byHourMap.get(hourKey) || 0) + 1);
        }
      });

      const byHour = Array.from(byHourMap.entries()).map(([hour, count]) => ({
        hour: new Date(hour + ":00:00Z").toLocaleTimeString([], { hour: "2-digit" }),
        count,
      }));

      return {
        totalErrors: data?.length || 0,
        uniqueUsersAffected: userIds.size,
        bySection,
        byHour,
      };
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

/**
 * Get the top sections with most errors
 */
export function useTopErrorSections(limit = 5) {
  const { data: stats } = useErrorStats();

  if (!stats?.bySection) return [];

  return Object.entries(stats.bySection)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([section, count]) => ({ section, count }));
}
