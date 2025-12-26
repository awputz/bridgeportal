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

// Fetch aggregate metrics using optimized database view (single query)
export const useInvestorMetrics = () => {
  return useQuery({
    queryKey: ["investor-metrics"],
    queryFn: async () => {
      // Use the optimized database view for a single-query fetch
      const { data, error } = await supabase
        .from("investor_dashboard_stats")
        .select("*")
        .single();

      if (error) {
        console.error("[useInvestorMetrics] View query failed, falling back to manual calculation:", error);
        // Fallback to manual calculation if view fails
        return fallbackMetricsCalculation();
      }

      return {
        totalVolume: Number(data.total_volume) || 0,
        totalTransactions: Number(data.total_transactions) || 0,
        totalCommissions: Number(data.total_commissions) || 0,
        avgDealSize: Number(data.avg_deal_size) || 0,
        activeAgents: Number(data.active_agents) || 0,
        activeListings: Number(data.active_listings) || 0,
        ytdVolume: Number(data.ytd_volume) || 0,
        ytdTransactions: Number(data.ytd_transactions) || 0,
        prevYearVolume: Number(data.prev_year_volume) || 0,
        prevYearTransactions: Number(data.prev_year_transactions) || 0,
      } as InvestorMetrics;
    },
    staleTime: 30000, // Cache for 30 seconds
  });
};

// Fallback function for metrics if view is unavailable
async function fallbackMetricsCalculation(): Promise<InvestorMetrics> {
  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;

  const [transactionsResult, agentCountResult, investmentListingsResult, commercialListingsResult] = 
    await Promise.all([
      supabase.from("transactions").select("sale_price, closing_date, commission"),
      supabase.from("team_members").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("investment_listings").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("commercial_listings").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

  const transactions = transactionsResult.data || [];
  const totalVolume = transactions.reduce((sum, t) => sum + (t.sale_price || 0), 0);
  const totalTransactions = transactions.length;
  const totalCommissions = transactions.reduce((sum, t) => sum + (t.commission || 0), 0);
  const avgDealSize = totalTransactions > 0 ? totalVolume / totalTransactions : 0;

  const ytdTransactions = transactions.filter(t => 
    t.closing_date && new Date(t.closing_date).getFullYear() === currentYear
  );
  const ytdVolume = ytdTransactions.reduce((sum, t) => sum + (t.sale_price || 0), 0);

  const prevYearTransactionsList = transactions.filter(t => 
    t.closing_date && new Date(t.closing_date).getFullYear() === prevYear
  );
  const prevYearVolume = prevYearTransactionsList.reduce((sum, t) => sum + (t.sale_price || 0), 0);

  return {
    totalVolume,
    totalTransactions,
    totalCommissions,
    avgDealSize,
    activeAgents: agentCountResult.count || 0,
    activeListings: (investmentListingsResult.count || 0) + (commercialListingsResult.count || 0),
    ytdVolume,
    ytdTransactions: ytdTransactions.length,
    prevYearVolume,
    prevYearTransactions: prevYearTransactionsList.length,
  };
}

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

// Division breakdown analytics using optimized view
export const useDivisionBreakdown = () => {
  return useQuery({
    queryKey: ["investor-division-breakdown"],
    queryFn: async () => {
      // Use optimized database view
      const { data, error } = await supabase
        .from("division_breakdown_stats")
        .select("*");

      if (error) {
        console.error("[useDivisionBreakdown] View query failed:", error);
        throw error;
      }

      return (data || []).map(d => ({
        name: d.division_name,
        volume: Number(d.total_volume) || 0,
        count: Number(d.transaction_count) || 0,
        commission: Number(d.total_commission) || 0,
      })) as DivisionBreakdown[];
    },
    staleTime: 30000,
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

// Agent performance for investor view using optimized view
export const useInvestorAgentPerformance = () => {
  return useQuery({
    queryKey: ["investor-agent-performance"],
    queryFn: async () => {
      // Use optimized database view
      const { data, error } = await supabase
        .from("agent_performance_stats")
        .select("*");

      if (error) {
        console.error("[useInvestorAgentPerformance] View query failed:", error);
        throw error;
      }

      return (data || []).map(d => ({
        name: d.agent_name || 'Unknown',
        deals: Number(d.deal_count) || 0,
        volume: Number(d.total_volume) || 0,
        commission: Number(d.total_commission) || 0,
        divisions: d.divisions || [],
        avgDealSize: Number(d.avg_deal_size) || 0,
      }));
    },
    staleTime: 30000,
  });
};

// Agent requests for investor view
export interface InvestorAgentRequest {
  id: string;
  agent_id: string;
  agent_name?: string;
  request_type: string;
  client_name: string | null;
  property_address: string | null;
  status: string;
  priority: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useInvestorAgentRequests = (filters?: {
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["investor-agent-requests", filters],
    queryFn: async () => {
      // Get agent requests
      const { data: requests, error } = await supabase
        .from("agent_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get team members to map agent names
      const { data: teamMembers } = await supabase
        .from("team_members")
        .select("id, name, email");

      // Get profiles to map agent IDs to emails
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email");

      // Build email to name map
      const emailToName = new Map<string, string>();
      teamMembers?.forEach(tm => {
        if (tm.email) emailToName.set(tm.email, tm.name);
      });

      // Build agent_id to email map
      const idToEmail = new Map<string, string>();
      profiles?.forEach(p => {
        if (p.email) idToEmail.set(p.id, p.email);
      });

      let enrichedRequests = (requests || []).map(req => ({
        ...req,
        agent_name: emailToName.get(idToEmail.get(req.agent_id) || "") || "Unknown Agent",
      })) as InvestorAgentRequest[];

      // Apply filters
      if (filters?.status && filters.status !== "all") {
        enrichedRequests = enrichedRequests.filter(r => r.status === filters.status);
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        enrichedRequests = enrichedRequests.filter(r =>
          r.agent_name?.toLowerCase().includes(search) ||
          r.client_name?.toLowerCase().includes(search) ||
          r.property_address?.toLowerCase().includes(search) ||
          r.request_type.toLowerCase().includes(search)
        );
      }

      return enrichedRequests;
    },
  });
};

// Commission requests for investor view
export interface InvestorCommissionRequest {
  id: string;
  agent_id: string;
  agent_name?: string;
  property_address: string;
  commission_amount: number;
  deal_type: string;
  closing_date: string;
  status: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
}

export const useInvestorCommissionRequests = (filters?: {
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["investor-commission-requests", filters],
    queryFn: async () => {
      const { data: requests, error } = await supabase
        .from("commission_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get team members and profiles for name mapping
      const { data: teamMembers } = await supabase
        .from("team_members")
        .select("id, name, email");

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email");

      const emailToName = new Map<string, string>();
      teamMembers?.forEach(tm => {
        if (tm.email) emailToName.set(tm.email, tm.name);
      });

      const idToEmail = new Map<string, string>();
      profiles?.forEach(p => {
        if (p.email) idToEmail.set(p.id, p.email);
      });

      let enrichedRequests = (requests || []).map(req => ({
        ...req,
        agent_name: emailToName.get(idToEmail.get(req.agent_id) || "") || "Unknown Agent",
      })) as InvestorCommissionRequest[];

      if (filters?.status && filters.status !== "all") {
        enrichedRequests = enrichedRequests.filter(r => r.status === filters.status);
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        enrichedRequests = enrichedRequests.filter(r =>
          r.agent_name?.toLowerCase().includes(search) ||
          r.property_address.toLowerCase().includes(search)
        );
      }

      return enrichedRequests;
    },
  });
};

// Listings for investor view
export interface InvestorInvestmentListing {
  id: string;
  property_address: string;
  borough: string | null;
  neighborhood: string | null;
  asset_class: string;
  asking_price: number | null;
  units: number | null;
  gross_sf: number | null;
  cap_rate: number | null;
  is_active: boolean | null;
}

export interface InvestorCommercialListing {
  id: string;
  property_address: string;
  borough: string | null;
  neighborhood: string | null;
  listing_type: string;
  square_footage: number;
  asking_rent: number | null;
  rent_per_sf: number | null;
  is_active: boolean | null;
}

export const useInvestorListings = () => {
  return useQuery({
    queryKey: ["investor-listings"],
    queryFn: async () => {
      const [investmentResult, commercialResult] = await Promise.all([
        supabase
          .from("investment_listings")
          .select("id, property_address, borough, neighborhood, asset_class, asking_price, units, gross_sf, cap_rate, is_active")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("commercial_listings")
          .select("id, property_address, borough, neighborhood, listing_type, square_footage, asking_rent, rent_per_sf, is_active")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
      ]);

      if (investmentResult.error) throw investmentResult.error;
      if (commercialResult.error) throw commercialResult.error;

      return {
        investment: (investmentResult.data || []) as InvestorInvestmentListing[],
        commercial: (commercialResult.data || []) as InvestorCommercialListing[],
      };
    },
  });
};
