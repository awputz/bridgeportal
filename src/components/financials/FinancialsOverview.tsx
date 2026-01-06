import { DollarSign, TrendingUp, TrendingDown, Receipt, Calculator, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyCommissions } from "@/hooks/useMyCommissions";
import { useExpenseStats } from "@/hooks/useExpenses";
import { useAgentTransactions } from "@/hooks/useAgentTransactions";
import { useAgentCommissions } from "@/hooks/useAgentCommissions";
import { formatFullCurrency } from "@/lib/formatters";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { ExpenseCharts } from "./ExpenseCharts";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Fallback colors if chart vars don't exist
const FALLBACK_COLORS = ["#a855f7", "#3b82f6", "#ec4899", "#22c55e", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6"];

export const FinancialsOverview = () => {
  const { stats: commissionStats, isLoading: commissionsLoading } = useMyCommissions();
  const { stats: expenseStats, isLoading: expensesLoading } = useExpenseStats();
  const { data: transactions, isLoading: transactionsLoading } = useAgentTransactions();
  const { data: categories = [] } = useExpenseCategories();
  const commissions = useAgentCommissions(transactions);

  const isLoading = commissionsLoading || expensesLoading || transactionsLoading;

  // Calculate net profit
  const totalIncome = commissionStats.ytdEarnings;
  const totalExpenses = expenseStats.ytdExpenses;
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  // Prepare pie chart data
  const pieData = expenseStats.categoryBreakdown.slice(0, 6).map((item, index) => ({
    name: item.category.split(" ")[0], // Just first word for brevity
    value: item.amount,
    fullName: item.category,
    color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">YTD Income</p>
                <p className="text-lg font-light text-foreground truncate">
                  {formatFullCurrency(totalIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Receipt className="h-5 w-5 text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">YTD Expenses</p>
                <p className="text-lg font-light text-foreground truncate">
                  {formatFullCurrency(totalExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${netProfit >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"} flex items-center justify-center flex-shrink-0`}>
                {netProfit >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Net Profit</p>
                <p className={`text-lg font-light truncate ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {formatFullCurrency(netProfit)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Calculator className="h-5 w-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Profit Margin</p>
                <p className="text-lg font-light text-foreground">
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <ExpenseCharts expensesTrend={expenseStats.monthlyTrend} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Stats */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-light text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Deals</span>
                <span className="text-sm font-medium text-foreground">{commissions.totalDeals}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">This Month Expenses</span>
                <span className="text-sm font-medium text-foreground">
                  {formatFullCurrency(expenseStats.monthlyExpenses)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Tax Deductible (YTD)</span>
                <span className="text-sm font-medium text-emerald-400">
                  {formatFullCurrency(expenseStats.taxDeductibleTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Pending Payments</span>
                <span className="text-sm font-medium text-amber-400">
                  {formatFullCurrency(commissionStats.pendingPayments)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-light text-base flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No expense data yet
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatFullCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend
                      formatter={(value, entry: any) => (
                        <span className="text-xs text-muted-foreground">{value}</span>
                      )}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
