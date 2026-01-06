import { DollarSign, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyCommissions, type CommissionStats } from "@/hooks/useMyCommissions";
import { useAgentTransactions } from "@/hooks/useAgentTransactions";
import { useAgentCommissions } from "@/hooks/useAgentCommissions";
import { formatFullCurrency } from "@/lib/formatters";
import { format } from "date-fns";

export const IncomeTab = () => {
  const { stats, isLoading: commissionsLoading } = useMyCommissions();
  const { data: transactions, isLoading: transactionsLoading } = useAgentTransactions();
  const commissions = useAgentCommissions(transactions);

  const isLoading = commissionsLoading || transactionsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">YTD Earnings</p>
                <p className="text-lg font-light text-foreground truncate">
                  {formatFullCurrency(stats.ytdEarnings)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-light text-foreground truncate">
                  {formatFullCurrency(stats.pendingPayments)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Under Review</p>
                <p className="text-lg font-light text-foreground truncate">
                  {formatFullCurrency(stats.underReview)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Total Deals</p>
                <p className="text-lg font-light text-foreground">
                  {commissions.totalDeals}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Income */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-light text-base">Recent Income</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.paidRequests.length === 0 && stats.pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No commission requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Show pending first, then paid */}
              {[...stats.pendingRequests, ...stats.paidRequests.slice(0, 5)].map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {req.property_address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.deal_type} • {format(new Date(req.closing_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        req.status === "paid"
                          ? "default"
                          : req.status === "approved"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        req.status === "paid"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : req.status === "approved"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : ""
                      }
                    >
                      {req.status}
                    </Badge>
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      {formatFullCurrency(req.commission_amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History Summary */}
      {transactions && transactions.length > 0 && (
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-light text-base">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tx.property_address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.division} • {tx.deal_type}
                      {tx.closing_date && ` • ${format(new Date(tx.closing_date), "MMM d, yyyy")}`}
                    </p>
                  </div>
                  {tx.commission && (
                    <span className="text-sm font-medium text-emerald-400 whitespace-nowrap">
                      {formatFullCurrency(tx.commission)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
