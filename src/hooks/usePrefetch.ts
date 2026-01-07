import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Prefetch common dashboard data for faster navigation
 */
export function usePrefetchDashboardData() {
  const queryClient = useQueryClient();

  const prefetchCRMStats = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Prefetch CRM deals summary
    await queryClient.prefetchQuery({
      queryKey: ["crm-deals", undefined],
      queryFn: async () => {
        const { data } = await supabase
          .from("crm_deals")
          .select("id, property_address, stage_id, value, division")
          .eq("agent_id", user.id)
          .eq("is_active", true)
          .is("deleted_at", null)
          .order("updated_at", { ascending: false })
          .limit(50);
        return data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Prefetch contacts count
    await queryClient.prefetchQuery({
      queryKey: ["crm-contacts", undefined],
      queryFn: async () => {
        const { count } = await supabase
          .from("crm_contacts")
          .select("id", { count: "exact", head: true })
          .eq("agent_id", user.id)
          .eq("is_active", true)
          .is("deleted_at", null);
        return { count };
      },
      staleTime: 2 * 60 * 1000,
    });
  }, [queryClient]);

  const prefetchTasks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await queryClient.prefetchQuery({
      queryKey: ["tasks", { completed: false }],
      queryFn: async () => {
        const { data } = await supabase
          .from("crm_activities")
          .select("id, title, due_date, is_completed, priority")
          .eq("agent_id", user.id)
          .eq("is_completed", false)
          .is("deleted_at", null)
          .order("due_date", { ascending: true })
          .limit(20);
        return data;
      },
      staleTime: 2 * 60 * 1000,
    });
  }, [queryClient]);

  const prefetchAll = useCallback(async () => {
    await Promise.all([
      prefetchCRMStats(),
      prefetchTasks(),
    ]);
  }, [prefetchCRMStats, prefetchTasks]);

  return {
    prefetchCRMStats,
    prefetchTasks,
    prefetchAll,
  };
}

/**
 * Prefetch data on hover for faster perceived navigation
 */
export function usePrefetchOnHover() {
  const { prefetchCRMStats, prefetchTasks } = usePrefetchDashboardData();

  const onCRMHover = useCallback(() => {
    // Debounce prefetch - only trigger if user hovers for 100ms
    const timeout = setTimeout(() => {
      prefetchCRMStats();
    }, 100);
    return () => clearTimeout(timeout);
  }, [prefetchCRMStats]);

  const onTasksHover = useCallback(() => {
    const timeout = setTimeout(() => {
      prefetchTasks();
    }, 100);
    return () => clearTimeout(timeout);
  }, [prefetchTasks]);

  return {
    onCRMHover,
    onTasksHover,
  };
}
