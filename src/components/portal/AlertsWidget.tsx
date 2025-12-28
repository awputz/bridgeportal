import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  DollarSign,
  Bell,
  CalendarClock,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStats } from "@/hooks/useTasks";
import { useMyCommissions } from "@/hooks/useMyCommissions";
import { usePinnedAnnouncements } from "@/hooks/useAnnouncements";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AlertItem {
  id: string;
  type: "overdue" | "today" | "commission" | "announcement";
  title: string;
  subtitle?: string;
  link: string;
  icon: typeof AlertTriangle;
  color: string;
}

export const AlertsWidget = () => {
  const queryClient = useQueryClient();
  const { data: taskStats, isLoading: isLoadingTasks, isFetching: isFetchingTasks } = useTaskStats();
  const { stats: commissionStats, isLoading: isLoadingCommissions } = useMyCommissions();
  const { data: announcements, isLoading: isLoadingAnnouncements } = usePinnedAnnouncements(3);

  const isLoading = isLoadingTasks || isLoadingCommissions || isLoadingAnnouncements;
  const isRefreshing = isFetchingTasks && !isLoadingTasks;

  // Subscribe to realtime updates for tasks, commissions, and announcements
  useEffect(() => {
    const channel = supabase
      .channel('alerts-widget-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crm_activities' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['task-stats'] });
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'commission_requests' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['my-commission-requests'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'company_announcements' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['announcements'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Build alerts list
  const alerts: AlertItem[] = [];

  // Overdue tasks
  if (taskStats?.overdue && taskStats.overdue > 0) {
    alerts.push({
      id: "overdue-tasks",
      type: "overdue",
      title: `${taskStats.overdue} overdue task${taskStats.overdue > 1 ? "s" : ""}`,
      subtitle: "Needs immediate attention",
      link: "/portal/tasks?filter=overdue",
      icon: AlertTriangle,
      color: "text-red-400 bg-red-500/20",
    });
  }

  // Tasks due today
  if (taskStats?.today && taskStats.today > 0) {
    alerts.push({
      id: "today-tasks",
      type: "today",
      title: `${taskStats.today} task${taskStats.today > 1 ? "s" : ""} due today`,
      subtitle: "Due by end of day",
      link: "/portal/tasks?filter=today",
      icon: Clock,
      color: "text-amber-400 bg-amber-500/20",
    });
  }

  // Pending commission requests
  const pendingCommissions = commissionStats?.pendingRequests?.length || 0;
  if (pendingCommissions > 0) {
    alerts.push({
      id: "pending-commissions",
      type: "commission",
      title: `${pendingCommissions} commission request${pendingCommissions > 1 ? "s" : ""} pending`,
      subtitle: "Awaiting review or payment",
      link: "/portal/my-commission-requests",
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-500/20",
    });
  }

  // Recent announcements (show as single item if any exist)
  const unreadAnnouncementsCount = announcements?.length || 0;
  if (unreadAnnouncementsCount > 0) {
    alerts.push({
      id: "announcements",
      type: "announcement",
      title: `${unreadAnnouncementsCount} company announcement${unreadAnnouncementsCount > 1 ? "s" : ""}`,
      subtitle: announcements?.[0]?.title || "New updates available",
      link: "/portal/announcements",
      icon: Bell,
      color: "text-blue-400 bg-blue-500/20",
    });
  }

  const totalAlerts = alerts.length;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5 text-primary" />
            Priorities
            {isRefreshing && (
              <RefreshCw className="h-3 w-3 text-muted-foreground animate-spin" />
            )}
            {totalAlerts > 0 && !isRefreshing && (
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 text-xs">
                {totalAlerts}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[260px]">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">You're all caught up!</p>
              <p className="text-xs text-muted-foreground">No pending tasks or alerts</p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <Link
                    key={alert.id}
                    to={alert.link}
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
                        alert.color.split(" ")[1]
                      )}>
                        <Icon className={cn("h-4.5 w-4.5", alert.color.split(" ")[0])} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {alert.title}
                        </p>
                        {alert.subtitle && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {alert.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}

              {/* Quick summary at bottom */}
              {taskStats && (
                <div className="pt-3 mt-2 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{taskStats.thisWeek || 0}</p>
                      <p className="text-xs text-muted-foreground">This week</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{taskStats.completed || 0}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
