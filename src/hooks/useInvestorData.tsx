import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface InvestorTransaction {
  id: string;
  property_address: string;
  borough: string | null;
  sale_price: number | null;
  closing_date: string | null;
  division: string | null;
  deal_type: string | null;
  agent_name: string | null;
  commission: number | null;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  image_url: string | null;
  category: string | null;
  is_active: boolean | null;
}

export interface InvestorMetrics {
  totalVolume: number;
  totalTransactions: number;
  totalCommissions: number;
  avgDealSize: number;
  activeAgents: number;
  activeListings: number;
  ytdVolume: number;
  ytdTransactions: number;
  prevYearVolume: number;
  prevYearTransactions: number;
}

export interface DivisionBreakdown {
  name: string;
  volume: number;
  count: number;
  commission: number;
}

export interface MonthlyData {
  month: string;
  volume: number;
  count: number;
  commission: number;
}

// Fetch all transactions for investor view
export const useInvestorTransactions = (filters?: {
  division?: string;
  year?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["investor-transactions", filters],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("id, property_address, borough, sale_price, closing_date, division, deal_type, agent_name, commission")
        .order("closing_date", { ascending: false });

      if (filters?.division && filters.division !== "all") {
        query = query.eq("division", filters.division);
      }

      if (filters?.year) {
        const startDate = `${filters.year}-01-01`;
        const endDate = `${filters.year}-12-31`;
        query = query.gte("closing_date", startDate).lte("closing_date", endDate);
      }

      if (filters?.search) {
        query = query.ilike("property_address", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as InvestorTransaction[];
    },
  });
};

// Fetch aggregate metrics
export const useInvestorMetrics = () => {
  return useQuery({
    queryKey: ["investor-metrics"],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      const prevYear = currentYear - 1;

      // Fetch all transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("sale_price, closing_date, commission");

      // Fetch team members count
      const { count: agentCount } = await supabase
        .from("team_members")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

      // Fetch active listings
      const { count: investmentListingsCount } = await supabase
        .from("investment_listings")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

      const { count: commercialListingsCount } = await supabase
        .from("commercial_listings")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

      // Calculate metrics
      const totalVolume = transactions?.reduce((sum, t) => sum + (t.sale_price || 0), 0) || 0;
      const totalTransactions = transactions?.length || 0;
      const totalCommissions = transactions?.reduce((sum, t) => sum + (t.commission || 0), 0) || 0;
      const avgDealSize = totalTransactions > 0 ? totalVolume / totalTransactions : 0;

      // YTD metrics
      const ytdTransactions = transactions?.filter(t => {
        if (!t.closing_date) return false;
        return new Date(t.closing_date).getFullYear() === currentYear;
      }) || [];
      const ytdVolume = ytdTransactions.reduce((sum, t) => sum + (t.sale_price || 0), 0);

      // Previous year metrics
      const prevYearTransactions = transactions?.filter(t => {
        if (!t.closing_date) return false;
        return new Date(t.closing_date).getFullYear() === prevYear;
      }) || [];
      const prevYearVolume = prevYearTransactions.reduce((sum, t) => sum + (t.sale_price || 0), 0);

      return {
        totalVolume,
        totalTransactions,
        totalCommissions,
        avgDealSize,
        activeAgents: agentCount || 0,
        activeListings: (investmentListingsCount || 0) + (commercialListingsCount || 0),
        ytdVolume,
        ytdTransactions: ytdTransactions.length,
        prevYearVolume,
        prevYearTransactions: prevYearTransactions.length,
      } as InvestorMetrics;
    },
  });
};

// Fetch team members
export const useInvestorTeam = (divisionFilter?: string) => {
  return useQuery({
    queryKey: ["investor-team", divisionFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, title, email, phone, image_url, category, is_active")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;

      let filtered = (data || []) as TeamMember[];
      
      if (divisionFilter && divisionFilter !== "all") {
        filtered = filtered.filter(member =>
          member.category?.toLowerCase().includes(divisionFilter.toLowerCase())
        );
      }

      return filtered;
    },
  });
};

// Division breakdown analytics
export const useDivisionBreakdown = () => {
  return useQuery({
    queryKey: ["investor-division-breakdown"],
    queryFn: async () => {
      const { data: transactions } = await supabase
        .from("transactions")
        .select("sale_price, division, commission");

      const divisionMap = new Map<string, { volume: number; count: number; commission: number }>();

      transactions?.forEach(t => {
        const division = t.division || "Other";
        const existing = divisionMap.get(division) || { volume: 0, count: 0, commission: 0 };
        divisionMap.set(division, {
          volume: existing.volume + (t.sale_price || 0),
          count: existing.count + 1,
          commission: existing.commission + (t.commission || 0),
        });
      });

      return Array.from(divisionMap.entries())
        .map(([name, data]) => ({
          name,
          volume: data.volume,
          count: data.count,
          commission: data.commission,
        }))
        .sort((a, b) => b.volume - a.volume) as DivisionBreakdown[];
    },
  });
};

// Monthly trends
export const useMonthlyTrends = (months: number = 12) => {
  return useQuery({
    queryKey: ["investor-monthly-trends", months],
    queryFn: async () => {
      const { data: transactions } = await supabase
        .from("transactions")
        .select("sale_price, closing_date, commission");

      const monthlyMap = new Map<string, { volume: number; count: number; commission: number }>();
      const now = new Date();

      // Initialize months
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        monthlyMap.set(key, { volume: 0, count: 0, commission: 0 });
      }

      // Populate data
      transactions?.forEach(t => {
        if (t.closing_date) {
          const date = new Date(t.closing_date);
          const key = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          if (monthlyMap.has(key)) {
            const current = monthlyMap.get(key)!;
            monthlyMap.set(key, {
              volume: current.volume + (t.sale_price || 0),
              count: current.count + 1,
              commission: current.commission + (t.commission || 0),
            });
          }
        }
      });

      return Array.from(monthlyMap.entries()).map(([month, data]) => ({
        month,
        volume: data.volume,
        count: data.count,
        commission: data.commission,
      })) as MonthlyData[];
    },
  });
};

// Commission insights
export const useCommissionInsights = () => {
  return useQuery({
    queryKey: ["investor-commission-insights"],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();

      const { data: transactions } = await supabase
        .from("transactions")
        .select("sale_price, closing_date, commission, division, agent_name");

      const allCommissions = transactions?.filter(t => t.commission && t.commission > 0) || [];
      
      const totalCommissions = allCommissions.reduce((sum, t) => sum + (t.commission || 0), 0);
      const avgCommission = allCommissions.length > 0 ? totalCommissions / allCommissions.length : 0;

      // YTD commissions
      const ytdCommissions = allCommissions
        .filter(t => t.closing_date && new Date(t.closing_date).getFullYear() === currentYear)
        .reduce((sum, t) => sum + (t.commission || 0), 0);

      // Commission by division
      const byDivision = new Map<string, number>();
      allCommissions.forEach(t => {
        const division = t.division || "Other";
        byDivision.set(division, (byDivision.get(division) || 0) + (t.commission || 0));
      });

      // Top earners (by total commission)
      const byAgent = new Map<string, number>();
      allCommissions.forEach(t => {
        if (t.agent_name) {
          byAgent.set(t.agent_name, (byAgent.get(t.agent_name) || 0) + (t.commission || 0));
        }
      });

      const topEarners = Array.from(byAgent.entries())
        .map(([name, commission]) => ({ name, commission }))
        .sort((a, b) => b.commission - a.commission)
        .slice(0, 10);

      return {
        totalCommissions,
        avgCommission,
        ytdCommissions,
        byDivision: Array.from(byDivision.entries()).map(([name, commission]) => ({ name, commission })),
        topEarners,
      };
    },
  });
};

// Agent performance for investor view
export const useInvestorAgentPerformance = () => {
  return useQuery({
    queryKey: ["investor-agent-performance"],
    queryFn: async () => {
      const { data: transactions } = await supabase
        .from("transactions")
        .select("agent_name, sale_price, commission, division, closing_date");

      const agentMap = new Map<string, {
        deals: number;
        volume: number;
        commission: number;
        divisions: Set<string>;
      }>();

      transactions?.forEach(t => {
        if (!t.agent_name) return;
        const existing = agentMap.get(t.agent_name) || {
          deals: 0,
          volume: 0,
          commission: 0,
          divisions: new Set<string>(),
        };
        existing.deals += 1;
        existing.volume += t.sale_price || 0;
        existing.commission += t.commission || 0;
        if (t.division) existing.divisions.add(t.division);
        agentMap.set(t.agent_name, existing);
      });

      return Array.from(agentMap.entries())
        .map(([name, data]) => ({
          name,
          deals: data.deals,
          volume: data.volume,
          commission: data.commission,
          divisions: Array.from(data.divisions),
          avgDealSize: data.deals > 0 ? data.volume / data.deals : 0,
        }))
        .sort((a, b) => b.volume - a.volume);
    },
  });
};
