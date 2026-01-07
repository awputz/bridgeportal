import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Handshake, ArrowRight, Building2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useDealRoomDeals, useDealRoomStats } from "@/hooks/useDealRoom";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import { formatDistanceToNow } from "date-fns";

const formatValue = (value: number | null) => {
  if (!value) return "—";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

export function DealRoomWidget() {
  const { data: deals, isLoading: dealsLoading, error: dealsError, refetch } = useDealRoomDeals();
  const { data: stats, isLoading: statsLoading } = useDealRoomStats();

  const latestDeals = deals?.slice(0, 5) || [];
  const isLoading = dealsLoading || statsLoading;

  // Use stats from hook (already calculated)
  const newThisWeek = stats?.newThisWeek || 0;
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Handshake className="h-4 w-4 text-cyan-500 flex-shrink-0" />
            Deal Room
          </CardTitle>
          <Link 
            to="/portal/deal-room" 
            className="text-xs text-muted-foreground hover:text-cyan-500 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-0">
        {/* Quick Stats */}
        <div className="flex gap-3 mb-4">
        <div className="flex-1 rounded-lg bg-muted/50 p-2.5 text-center">
            {isLoading ? (
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
            ) : (
              <p className="text-lg font-semibold text-foreground">{stats?.total || 0}</p>
            )}
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
          </div>
          <div className="flex-1 rounded-lg bg-cyan-500/10 p-2.5 text-center">
            {isLoading ? (
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
            ) : (
              <p className="text-lg font-semibold text-cyan-500">{newThisWeek}</p>
            )}
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">New</p>
          </div>
        </div>

        {/* Deals List */}
        <ScrollArea className="flex-1 -mx-2 px-2">
          {dealsError ? (
            <QueryErrorState
              error={dealsError}
              onRetry={() => refetch()}
              title="Failed to load deals"
              compact
            />
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg border border-border/50 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : latestDeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No deals shared yet</p>
              <Link 
                to="/portal/deal-room" 
                className="text-xs text-cyan-500 hover:underline mt-1"
              >
                Share the first one →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {latestDeals.map((deal) => (
                <Link
                  key={deal.id}
                  to={`/portal/deal-room?deal=${deal.id}`}
                  className="block p-3 rounded-lg border border-border/50 hover:border-cyan-500/50 hover:bg-accent/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-cyan-500 transition-colors">
                        {deal.property_address}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground capitalize">
                          {deal.property_type || "Property"}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-medium text-foreground">
                          {formatValue(deal.value)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {deal.last_deal_room_update 
                          ? formatDistanceToNow(new Date(deal.last_deal_room_update), { addSuffix: false })
                          : "—"}
                      </span>
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={deal.agent?.avatar_url || undefined} />
                        <AvatarFallback className="text-[8px] bg-muted">
                          {deal.agent?.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
