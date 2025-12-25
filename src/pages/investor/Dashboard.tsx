import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, DollarSign, Users, TrendingUp, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Metrics {
  totalVolume: number;
  totalTransactions: number;
  activeAgents: number;
  activeListings: number;
  monthlyData: { month: string; volume: number; count: number }[];
  divisionData: { name: string; value: number }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(45, 93%, 47%)', 'hsl(173, 58%, 39%)', 'hsl(220, 70%, 50%)'];

const InvestorDashboard = () => {
  const [userName, setUserName] = useState("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .maybeSingle();
        
        setUserName(profile?.full_name?.split(" ")[0] || "");
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 border border-amber-500/20">
        <h1 className="text-2xl md:text-3xl font-light text-foreground">
          Welcome back, <span className="text-amber-500 font-normal">{userName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of Bridge Advisory Group's performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Volume
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.totalVolume || 0)}</div>
            <p className="text-xs text-muted-foreground">All-time transaction volume</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">Closed deals</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Agents
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeAgents || 0}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Listings
            </CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeListings || 0}</div>
            <p className="text-xs text-muted-foreground">Current properties</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Volume Chart */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg font-medium">Monthly Volume</CardTitle>
            </div>
            <CardDescription>Transaction volume over the last 12 months (in millions)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `$${value}M`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}M`, 'Volume']}
                  />
                  <Bar dataKey="volume" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Division Breakdown */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Division Breakdown</CardTitle>
            <CardDescription>Volume by division</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics?.divisionData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
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
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {metrics?.divisionData?.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Notice */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            This is a read-only dashboard. For detailed reports or questions, please contact Bridge Advisory Group directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorDashboard;
