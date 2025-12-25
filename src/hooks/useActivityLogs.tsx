import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type ActivityLog = Tables<"activity_logs">;

export function useActivityLogs(limit: number = 100) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["admin-activity-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ActivityLog[];
    },
  });

  return { logs, isLoading };
}

export function useRecentActivity(limit: number = 10) {
  const { data: recentActivity, isLoading } = useQuery({
    queryKey: ["admin-recent-activity", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ActivityLog[];
    },
  });

  return { recentActivity, isLoading };
}
