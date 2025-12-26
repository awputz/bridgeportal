import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  Clock, 
  FileSearch, 
  TrendingUp, 
  ArrowRight,
  Plus,
  Calendar
} from "lucide-react";
import { useMyCommissions } from "@/hooks/useMyCommissions";
import { useCRMRealtime } from "@/hooks/useCRMRealtime";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
};

const formatCurrencyFull = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  paid: { label: "Paid", variant: "default" },
  approved: { label: "Approved", variant: "secondary" },
  pending: { label: "Pending", variant: "outline" },
  under_review: { label: "Under Review", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export default function MyCommissions() {
  const { stats, requests, isLoading } = useMyCommissions();
  
  // Subscribe to real-time updates
  useCRMRealtime();

  const chartData = stats.monthlyEarnings.map(item => ({
    ...item,
    monthLabel: format(new Date(item.month + "-01"), "MMM"),
  }));

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">
              My Earnings
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your commissions and payment status
            </p>
          </div>
          <Button asChild>
            <Link to="/portal/commission-request">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* YTD Earnings */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatCurrency(stats.ytdEarnings)}
                  </p>
                  <p className="text-sm text-muted-foreground">YTD Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatCurrency(stats.pendingPayments)}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Under Review */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FileSearch className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatCurrency(stats.underReview)}
                  </p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Chart */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-light">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              Monthly Earnings (Last 12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="monthLabel" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [formatCurrencyFull(value), 'Earnings']}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-light">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Recent Requests
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/portal/my-commission-requests" className="text-sm text-muted-foreground hover:text-foreground">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!requests || requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No commission requests yet</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/portal/commission-request">
                    Submit Your First Request
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 5).map((request) => {
                  const statusInfo = statusBadge[request.status] || statusBadge.pending;
                  
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {request.property_address}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{request.deal_type}</span>
                          <span>•</span>
                          <span>{format(new Date(request.closing_date), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="font-semibold text-foreground">
                          {formatCurrencyFull(request.commission_amount)}
                        </span>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
