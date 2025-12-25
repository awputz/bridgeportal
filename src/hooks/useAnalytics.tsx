import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PipelineStage {
  stage_id: string;
  stage_name: string;
  stage_color: string;
  count: number;
  value: number;
}

export interface DealMetrics {
  totalDeals: number;
  totalValue: number;
  avgDealSize: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number;
  avgCycleTime: number;
}

export interface CommissionForecast {
  month: string;
  projected: number;
  actual: number;
}

export const usePipelineAnalytics = (division?: string) => {
  return useQuery({
    queryKey: ["pipeline-analytics", division],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get stages
      let stagesQuery = supabase
        .from("crm_deal_stages")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (division) {
        stagesQuery = stagesQuery.eq("division", division);
      }

      const { data: stages } = await stagesQuery;

      // Get deals
      let dealsQuery = supabase
        .from("crm_deals")
        .select("*")
        .eq("agent_id", user.id)
        .eq("is_active", true);

      if (division) {
        dealsQuery = dealsQuery.eq("division", division);
      }

      const { data: deals } = await dealsQuery;

      // Calculate pipeline by stage
      const pipelineByStage: PipelineStage[] = (stages || []).map((stage) => {
        const stageDeals = (deals || []).filter((d) => d.stage_id === stage.id);
        return {
          stage_id: stage.id,
          stage_name: stage.name,
          stage_color: stage.color,
          count: stageDeals.length,
          value: stageDeals.reduce((sum, d) => sum + (d.value || 0), 0),
        };
      });

      return pipelineByStage;
    },
  });
};

export const useDealMetrics = (division?: string) => {
  return useQuery({
    queryKey: ["deal-metrics", division],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("crm_deals")
        .select("*")
        .eq("agent_id", user.id);

      if (division) {
        query = query.eq("division", division);
      }

      const { data: deals } = await query;

      if (!deals || deals.length === 0) {
        return {
          totalDeals: 0,
          totalValue: 0,
          avgDealSize: 0,
          wonDeals: 0,
          lostDeals: 0,
          winRate: 0,
          avgCycleTime: 0,
        };
      }

      const activeDeals = deals.filter((d) => d.is_active);
      const wonDeals = deals.filter((d) => d.won === true);
      const lostDeals = deals.filter((d) => d.won === false);
      const closedDeals = [...wonDeals, ...lostDeals];

      // Calculate average cycle time (days from creation to close)
      let avgCycleTime = 0;
      if (closedDeals.length > 0) {
        const totalDays = closedDeals.reduce((sum, deal) => {
          const created = new Date(deal.created_at);
          const updated = new Date(deal.updated_at);
          return sum + Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        }, 0);
        avgCycleTime = Math.round(totalDays / closedDeals.length);
      }

      const totalValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
      const winRate = closedDeals.length > 0 
        ? Math.round((wonDeals.length / closedDeals.length) * 100) 
        : 0;

      return {
        totalDeals: activeDeals.length,
        totalValue,
        avgDealSize: activeDeals.length > 0 ? Math.round(totalValue / activeDeals.length) : 0,
        wonDeals: wonDeals.length,
        lostDeals: lostDeals.length,
        winRate,
        avgCycleTime,
      };
    },
  });
};

export const useCommissionForecast = () => {
  return useQuery({
    queryKey: ["commission-forecast"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get deals with expected close dates
      const { data: deals } = await supabase
        .from("crm_deals")
        .select("*")
        .eq("agent_id", user.id)
        .eq("is_active", true)
        .not("expected_close", "is", null);

      // Get closed transactions for actual commissions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("closing_date, commission")
        .eq("agent_name", user.id) // This might need adjustment based on your data model
        .gte("closing_date", new Date(new Date().getFullYear(), 0, 1).toISOString());

      // Group by month
      const months = [];
      const now = new Date();
      for (let i = 0; i < 6; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const monthKey = month.toISOString().slice(0, 7);
        const monthName = month.toLocaleDateString("en-US", { month: "short", year: "numeric" });

        // Calculate projected from deals
        const projected = (deals || [])
          .filter((d) => d.expected_close?.startsWith(monthKey))
          .reduce((sum, d) => sum + ((d.commission || 0) * (d.probability || 50) / 100), 0);

        // Calculate actual from transactions
        const actual = (transactions || [])
          .filter((t) => t.closing_date?.startsWith(monthKey))
          .reduce((sum, t) => sum + (t.commission || 0), 0);

        months.push({
          month: monthName,
          projected: Math.round(projected),
          actual: Math.round(actual),
        });
      }

      return months as CommissionForecast[];
    },
  });
};

export const useActivityMetrics = () => {
  return useQuery({
    queryKey: ["activity-metrics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [weekActivities, monthActivities, completedThisWeek] = await Promise.all([
        supabase
          .from("crm_activities")
          .select("id", { count: "exact" })
          .eq("agent_id", user.id)
          .gte("created_at", weekAgo.toISOString()),
        supabase
          .from("crm_activities")
          .select("id", { count: "exact" })
          .eq("agent_id", user.id)
          .gte("created_at", monthAgo.toISOString()),
        supabase
          .from("crm_activities")
          .select("id", { count: "exact" })
          .eq("agent_id", user.id)
          .eq("is_completed", true)
          .gte("completed_at", weekAgo.toISOString()),
      ]);

      return {
        activitiesThisWeek: weekActivities.count || 0,
        activitiesThisMonth: monthActivities.count || 0,
        completedThisWeek: completedThisWeek.count || 0,
        avgPerDay: Math.round((weekActivities.count || 0) / 7),
      };
    },
  });
};
