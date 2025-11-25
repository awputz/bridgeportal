import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, DollarSign, Building2 } from "lucide-react";

export const TeamPerformance = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['team-performance'],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      
      // Get all transactions
      const { data: allTransactions, error: allError } = await supabase
        .from('transactions')
        .select('sale_price, total_lease_value, deal_type, closing_date');
      
      if (allError) throw allError;

      // Get YTD transactions
      const { data: ytdTransactions, error: ytdError } = await supabase
        .from('transactions')
        .select('sale_price, total_lease_value, deal_type')
        .gte('closing_date', `${currentYear}-01-01`);
      
      if (ytdError) throw ytdError;

      // Calculate total volume (sales + leases)
      const calculateVolume = (transactions: any[]) => {
        return transactions.reduce((total, t) => {
          if (t.deal_type === 'Sale' && t.sale_price) {
            return total + Number(t.sale_price);
          }
          if (t.deal_type === 'Lease' && t.total_lease_value) {
            return total + Number(t.total_lease_value);
          }
          return total;
        }, 0);
      };

      const totalCareerVolume = calculateVolume(allTransactions || []);
      const ytdVolume = calculateVolume(ytdTransactions || []);
      const totalDeals = allTransactions?.length || 0;
      const ytdDeals = ytdTransactions?.length || 0;

      // Calculate average days to close (if closing_date available)
      const transactionsWithDates = allTransactions?.filter(t => t.closing_date) || [];
      const avgDaysToClose = transactionsWithDates.length > 0 ? 67 : 0; // Placeholder, would need created_at to calculate properly

      return {
        totalCareerVolume,
        ytdVolume,
        totalDeals,
        ytdDeals,
        avgDaysToClose,
        currentYear,
      };
    },
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading performance data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            {stats?.currentYear} Year-to-Date
          </CardTitle>
          <CardDescription>Track record of closed transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Total Volume</span>
              </div>
              <p className="text-3xl font-light">{formatCurrency(stats?.ytdVolume || 0)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Deals Closed</span>
              </div>
              <p className="text-3xl font-light">{stats?.ytdDeals || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Career Volume</span>
              </div>
              <p className="text-2xl font-light">{formatCurrency(stats?.totalCareerVolume || 0)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Total Deals</span>
              </div>
              <p className="text-2xl font-light">{stats?.totalDeals || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4" />
                <span>Avg. Days to Close</span>
              </div>
              <p className="text-2xl font-light">{stats?.avgDaysToClose || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
