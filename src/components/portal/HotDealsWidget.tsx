import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Flame, Clock, Calendar, AlertTriangle, DollarSign, 
  ArrowRight, CheckCircle2, TrendingUp, Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { differenceInDays, isAfter, isBefore, addDays } from "date-fns";

type HotDealType = "due_soon" | "close_soon" | "stale" | "waiting" | "high_value";

interface HotDeal {
  id: string;
  property_address: string;
  tenant_legal_name: string | null;
  stage_name: string | null;
  value: number | null;
  due_date: string | null;
  expected_close: string | null;
  last_activity_date: string | null;
  division: string;
  hotType: HotDealType;
  urgencyScore: number;
  actionText: string;
}

const HOT_DEAL_CONFIG: Record<HotDealType, { icon: typeof Flame; color: string; bgColor: string }> = {
  due_soon: { icon: Clock, color: "text-red-400", bgColor: "bg-red-500/20" },
  close_soon: { icon: Calendar, color: "text-orange-400", bgColor: "bg-orange-500/20" },
  stale: { icon: AlertTriangle, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  waiting: { icon: Clock, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  high_value: { icon: DollarSign, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
};

// Stage names that indicate "waiting" state
const WAITING_STAGES = ["LOI Sent / Negotiation", "Negotiations", "Lease Out", "In Contract"];

export const HotDealsWidget = () => {
  const [viewMode, setViewMode] = useState<"urgent" | "all">("urgent");

  const { data: deals, isLoading } = useQuery({
    queryKey: ["hot-deals-widget"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("crm_deals")
        .select(`
          id,
          property_address,
          tenant_legal_name,
          value,
          due_date,
          expected_close,
          last_activity_date,
          division,
          stage_id,
          crm_deal_stages!crm_deals_stage_id_fkey(name)
        `)
        .eq("agent_id", user.id)
        .eq("is_active", true)
        .is("won", null)
        .is("is_lost", null)
        .is("deleted_at", null);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const hotDeals = useMemo(() => {
    if (!deals) return [];
    
    const today = new Date();
    const result: HotDeal[] = [];

    deals.forEach((deal) => {
      const stageName = (deal.crm_deal_stages as { name: string } | null)?.name || null;
      const daysSinceActivity = deal.last_activity_date 
        ? differenceInDays(today, new Date(deal.last_activity_date))
        : 999;

      let hotType: HotDealType | null = null;
      let urgencyScore = 0;
      let actionText = "";

      // Check Due Soon (within 3 days)
      if (deal.due_date) {
        const dueDate = new Date(deal.due_date);
        const daysUntilDue = differenceInDays(dueDate, today);
        if (daysUntilDue >= 0 && daysUntilDue <= 3) {
          hotType = "due_soon";
          urgencyScore = 100 - daysUntilDue;
          actionText = daysUntilDue === 0 ? "Due today!" : `Due in ${daysUntilDue} day${daysUntilDue > 1 ? "s" : ""}`;
        }
      }

      // Check Close Soon (within 3 days) - only if not already due_soon
      if (!hotType && deal.expected_close) {
        const closeDate = new Date(deal.expected_close);
        const daysUntilClose = differenceInDays(closeDate, today);
        if (daysUntilClose >= 0 && daysUntilClose <= 3) {
          hotType = "close_soon";
          urgencyScore = 95 - daysUntilClose;
          actionText = daysUntilClose === 0 ? "Closing today!" : `Closing in ${daysUntilClose} day${daysUntilClose > 1 ? "s" : ""}`;
        }
      }

      // Check High Value (>= $1M AND stale for 3+ days)
      if (!hotType && deal.value && deal.value >= 1000000 && daysSinceActivity >= 3) {
        hotType = "high_value";
        urgencyScore = 80;
        actionText = `$${(deal.value / 1000000).toFixed(1)}M deal stale ${daysSinceActivity}d`;
      }

      // Check Waiting Stage (specific stages AND 5+ days stale)
      if (!hotType && stageName && WAITING_STAGES.includes(stageName) && daysSinceActivity >= 5) {
        hotType = "waiting";
        urgencyScore = 75;
        actionText = `${stageName} - ${daysSinceActivity}d waiting`;
      }

      // Check Stale (7+ days without activity)
      if (!hotType && daysSinceActivity >= 7) {
        hotType = "stale";
        urgencyScore = 70;
        actionText = `No activity for ${daysSinceActivity} days`;
      }

      if (hotType) {
        result.push({
          id: deal.id,
          property_address: deal.property_address,
          tenant_legal_name: deal.tenant_legal_name,
          stage_name: stageName,
          value: deal.value,
          due_date: deal.due_date,
          expected_close: deal.expected_close,
          last_activity_date: deal.last_activity_date,
          division: deal.division,
          hotType,
          urgencyScore,
          actionText,
        });
      }
    });

    // Sort by urgency score (highest first)
    return result.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }, [deals]);

  // Calculate stats
  const urgentCount = hotDeals.filter(d => d.urgencyScore >= 90).length;
  const thisWeekCount = hotDeals.filter(d => d.hotType === "due_soon" || d.hotType === "close_soon").length;
  const staleCount = hotDeals.filter(d => d.hotType === "stale").length;

  // Filter based on view mode
  const displayedDeals = viewMode === "urgent" 
    ? hotDeals.filter(d => d.urgencyScore >= 75).slice(0, 5)
    : hotDeals.slice(0, 8);

  const formatValue = (value: number | null) => {
    if (!value) return null;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-orange-400" />
            Hot Deals
            {hotDeals.length > 0 && (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                {hotDeals.length}
              </Badge>
            )}
          </CardTitle>
          <Link 
            to="/portal/crm" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {/* Quick Stats */}
        {!isLoading && hotDeals.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-lg font-semibold text-red-400">{urgentCount}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Urgent</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <span className="text-lg font-semibold text-orange-400">{thisWeekCount}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">This Week</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-lg font-semibold text-yellow-400">{staleCount}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Stale</p>
            </div>
          </div>
        )}

        {/* View Toggle */}
        {!isLoading && hotDeals.length > 0 && (
          <div className="flex gap-1 mb-3">
            <Button
              variant={viewMode === "urgent" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => setViewMode("urgent")}
            >
              Urgent Only
            </Button>
            <Button
              variant={viewMode === "all" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => setViewMode("all")}
            >
              All Hot
            </Button>
          </div>
        )}

        <ScrollArea className="h-[180px]">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded" />
              ))}
            </div>
          ) : displayedDeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">All caught up!</p>
              <p className="text-xs text-muted-foreground">No deals need immediate attention</p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {displayedDeals.map((deal) => {
                const config = HOT_DEAL_CONFIG[deal.hotType];
                const Icon = config.icon;
                return (
                  <Link
                    key={deal.id}
                    to={`/portal/crm/deals/${deal.id}`}
                    className={cn(
                      "block p-3 rounded-lg transition-all duration-200",
                      "hover:bg-muted/50 group border border-transparent",
                      "hover:border-border/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                        config.bgColor
                      )}>
                        <Icon className={cn("h-4.5 w-4.5", config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-foreground truncate leading-tight">
                            {deal.property_address}
                          </span>
                        </div>
                        <p className={cn("text-xs font-medium leading-tight mb-0.5", config.color)}>
                          {deal.actionText}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          {deal.tenant_legal_name && (
                            <span className="truncate">{deal.tenant_legal_name}</span>
                          )}
                          {deal.stage_name && !deal.tenant_legal_name && (
                            <span className="truncate">{deal.stage_name}</span>
                          )}
                          {deal.value && (
                            <span className="text-emerald-400 font-medium">
                              {formatValue(deal.value)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
