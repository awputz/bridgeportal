import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, DollarSign, Users, TrendingUp, BarChart3, HelpCircle, FileQuestion, Wallet, ArrowUp, ArrowDown, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useInvestorMetrics } from "@/hooks/useInvestorData";
import { usePendingCounts } from "@/hooks/usePendingCounts";
import { DataFreshnessIndicator } from "@/components/investor/DataFreshnessIndicator";

interface Metrics {
  totalVolume: number;
  totalTransactions: number;
  activeAgents: number;
  activeListings: number;
  monthlyData: { month: string; volume: number; count: number }[];
  divisionData: { name: string; value: number }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(199, 89%, 48%)', 'hsl(173, 58%, 39%)', 'hsl(220, 70%, 50%)'];

const InvestorDashboard = () => {
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch investor metrics with YoY data and pending counts
  const { data: investorMetrics, dataUpdatedAt, isRefetching } = useInvestorMetrics();
  const { data: pendingCounts } = usePendingCounts();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .maybeSingle();
        
        setUserName(profile?.full_name?.split(" ")[0] || "");
        setUserAvatar(profile?.avatar_url || null);
      }

      // Fetch transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("sale_price, closing_date, division")
        .order("closing_date", { ascending: false });

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

      // Monthly data for chart (last 12 months)
      const monthlyMap = new Map<string, { volume: number; count: number }>();
      const now = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        monthlyMap.set(key, { volume: 0, count: 0 });
      }

      transactions?.forEach(t => {
        if (t.closing_date) {
          const date = new Date(t.closing_date);
          const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          if (monthlyMap.has(key)) {
            const current = monthlyMap.get(key)!;
            monthlyMap.set(key, {
              volume: current.volume + (t.sale_price || 0),
              count: current.count + 1
            });
          }
        }
      });

      const monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
        month,
        volume: data.volume / 1000000, // Convert to millions
        count: data.count
      }));

      // Division breakdown
      const divisionMap = new Map<string, number>();
      transactions?.forEach(t => {
        const division = t.division || 'Other';
        divisionMap.set(division, (divisionMap.get(division) || 0) + (t.sale_price || 0));
      });

      const divisionData = Array.from(divisionMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);

      setMetrics({
        totalVolume,
        totalTransactions,
        activeAgents: agentCount || 0,
        activeListings: (investmentListingsCount || 0) + (commercialListingsCount || 0),
        monthlyData,
        divisionData
      });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Calculate YoY change percentage
  const calculateYoYChange = (current: number, previous: number): { percent: number; isPositive: boolean } => {
    if (previous === 0) return { percent: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { percent: Math.abs(change), isPositive: change >= 0 };
  };

  const volumeYoY = investorMetrics 
    ? calculateYoYChange(investorMetrics.ytdVolume, investorMetrics.prevYearVolume)
    : { percent: 0, isPositive: true };

  const transactionsYoY = investorMetrics
    ? calculateYoYChange(investorMetrics.ytdTransactions, investorMetrics.prevYearTransactions)
    : { percent: 0, isPositive: true };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Header */}
      <div className="rounded-xl bg-gradient-to-r from-sky-400/10 via-sky-400/5 to-transparent p-4 md:p-6 border border-sky-400/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-14 w-14 md:h-16 md:w-16 border-2 border-sky-400/30">
              <AvatarImage src={userAvatar || undefined} alt={userName} />
              <AvatarFallback className="bg-sky-400/20 text-sky-400 text-lg md:text-xl font-medium">
                {userName?.charAt(0)?.toUpperCase() || "I"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-foreground">
                Welcome back, <span className="text-sky-400 font-normal">{userName}</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm md:text-base text-muted-foreground">
                  Bridge Advisory Group performance overview
                </p>
                <DataFreshnessIndicator dataUpdatedAt={dataUpdatedAt} isRefetching={isRefetching} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <img 
              src="/lovable-uploads/hpg-logo-white.png" 
              alt="HPG" 
              className="h-10 md:h-12 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Quick Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link to="/investor/agent-requests">
          <Card className="bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20">
                <FileQuestion className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">{pendingCounts?.agentRequests || 0}</p>
                <p className="text-xs text-muted-foreground">Agent Requests Pending</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/investor/commission-requests">
          <Card className="bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                <Wallet className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-500">{pendingCounts?.commissionRequests || 0}</p>
                <p className="text-xs text-muted-foreground">Commission Reviews</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/investor/listings">
          <Card className="bg-sky-400/10 border-sky-400/30 hover:border-sky-400/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-400/20">
                <Building2 className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-400">{formatCurrency(pendingCounts?.pipelineValue || 0)}</p>
                <p className="text-xs text-muted-foreground">Active Pipeline Value</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Key Metrics */}
      <TooltipProvider>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total Volume
                </CardTitle>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="text-xs">Combined dollar value of all closed transactions across all divisions.</p>
                  </TooltipContent>
                </TooltipUI>
              </div>
              <DollarSign className="h-3.5 w-3.5 md:h-4 md:w-4 text-sky-400" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{formatCurrency(metrics?.totalVolume || 0)}</div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] md:text-xs text-muted-foreground">YTD: {formatCurrency(investorMetrics?.ytdVolume || 0)}</p>
                {volumeYoY.percent > 0 && (
                  <Badge variant="outline" className={`text-[10px] px-1 py-0 ${volumeYoY.isPositive ? 'text-green-500 border-green-500/30' : 'text-red-500 border-red-500/30'}`}>
                    {volumeYoY.isPositive ? <ArrowUp className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDown className="h-2.5 w-2.5 mr-0.5" />}
                    {volumeYoY.percent.toFixed(0)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Transactions
                </CardTitle>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="text-xs">Total number of completed deals including sales, leases, and rentals.</p>
                  </TooltipContent>
                </TooltipUI>
              </div>
              <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{metrics?.totalTransactions || 0}</div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] md:text-xs text-muted-foreground">YTD: {investorMetrics?.ytdTransactions || 0}</p>
                {transactionsYoY.percent > 0 && (
                  <Badge variant="outline" className={`text-[10px] px-1 py-0 ${transactionsYoY.isPositive ? 'text-green-500 border-green-500/30' : 'text-red-500 border-red-500/30'}`}>
                    {transactionsYoY.isPositive ? <ArrowUp className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDown className="h-2.5 w-2.5 mr-0.5" />}
                    {transactionsYoY.percent.toFixed(0)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Active Agents
                </CardTitle>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="text-xs">Number of licensed agents currently active on the team roster.</p>
                  </TooltipContent>
                </TooltipUI>
              </div>
              <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{metrics?.activeAgents || 0}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Team members</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Active Listings
                </CardTitle>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="text-xs">Properties currently listed for sale or lease across Investment Sales and Commercial Leasing.</p>
                  </TooltipContent>
                </TooltipUI>
              </div>
              <Building2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{metrics?.activeListings || 0}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Current properties</p>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>

      {/* Charts */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Volume Chart */}
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-sky-400" />
              <CardTitle className="text-base md:text-lg font-medium">Monthly Volume</CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm">Transaction volume over 12 months (millions)</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="h-[200px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.monthlyData || []} margin={{ left: -20, right: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `$${value}M`}
                    width={45}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}M`, 'Volume']}
                  />
                  <Bar dataKey="volume" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Division Breakdown */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg font-medium">Division Breakdown</CardTitle>
            <CardDescription className="text-xs md:text-sm">Volume by division</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="h-[180px] md:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics?.divisionData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metrics?.divisionData?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend - stacked on mobile */}
            <div className="mt-3 md:mt-4 grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-2">
              {metrics?.divisionData?.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                    <div 
                      className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                  </div>
                  <span className="font-medium ml-1 shrink-0">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Notice */}
      <Card className="bg-sky-400/5 border-sky-400/20">
        <CardContent className="p-4 md:pt-6">
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            This is a read-only dashboard. For detailed reports or questions, please contact Bridge Advisory Group directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorDashboard;
