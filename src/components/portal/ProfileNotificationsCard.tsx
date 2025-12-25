import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Trash2, DollarSign, FileText, ClipboardCheck, Megaphone, TrendingUp, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// Notification type icons and colors
const notificationConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  commission_approved: { icon: DollarSign, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  commission_paid: { icon: DollarSign, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  commission_rejected: { icon: AlertCircle, color: "text-red-400", bgColor: "bg-red-500/20" },
  commission_under_review: { icon: Clock, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  request_completed: { icon: CheckCheck, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  request_rejected: { icon: AlertCircle, color: "text-red-400", bgColor: "bg-red-500/20" },
  request_in_progress: { icon: Clock, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  transaction_added: { icon: TrendingUp, color: "text-purple-400", bgColor: "bg-purple-500/20" },
  announcement: { icon: Megaphone, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  deal_update: { icon: ClipboardCheck, color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
  default: { icon: Bell, color: "text-muted-foreground", bgColor: "bg-white/10" },
};

const ProfileNotificationsCard = () => {
  const navigate = useNavigate();
  const { data: notifications, isLoading, refetch } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Real-time subscription for new notifications
  useEffect(() => {
    const channel = supabase
      .channel('profile-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          refetch();
          const newNotif = payload.new as any;
          toast.success(newNotif.title, {
            description: newNotif.message,
            action: newNotif.action_url ? {
              label: "View",
              onClick: () => navigate(newNotif.action_url)
            } : undefined
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, navigate]);

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotification.mutate(notificationId);
  };

  const filteredNotifications = notifications?.filter((n) => 
    filter === "all" ? true : !n.is_read
  ) || [];

  const getNotificationConfig = (type: string) => {
    return notificationConfig[type] || notificationConfig.default;
  };

  // Calculate stats
  const stats = {
    total: notifications?.length || 0,
    unread: unreadCount || 0,
    approvals: notifications?.filter(n => n.type.includes('approved') || n.type.includes('completed')).length || 0,
    pending: notifications?.filter(n => n.type.includes('under_review') || n.type.includes('in_progress')).length || 0,
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-5 w-5" />
              {stats.unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-primary-foreground">
                  {stats.unread > 9 ? '9+' : stats.unread}
                </span>
              )}
            </div>
            <div>
              <CardTitle className="font-light">Activity & Notifications</CardTitle>
              <CardDescription>Updates on your requests and approvals</CardDescription>
            </div>
          </div>
          {stats.unread > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs gap-1"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <p className="text-lg font-light text-foreground">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-2 bg-primary/10 rounded-lg">
            <p className="text-lg font-light text-primary">{stats.unread}</p>
            <p className="text-[10px] text-muted-foreground">Unread</p>
          </div>
          <div className="text-center p-2 bg-emerald-500/10 rounded-lg">
            <p className="text-lg font-light text-emerald-400">{stats.approvals}</p>
            <p className="text-[10px] text-muted-foreground">Approved</p>
          </div>
          <div className="text-center p-2 bg-amber-500/10 rounded-lg">
            <p className="text-lg font-light text-amber-400">{stats.pending}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            className="text-xs"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "secondary" : "ghost"}
            size="sm"
            className="text-xs"
            onClick={() => setFilter("unread")}
          >
            Unread ({stats.unread})
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="text-sm text-muted-foreground/70">
              You'll receive updates when your requests are processed
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-2">
            <div className="space-y-2">
              {filteredNotifications.map((notification) => {
                const config = getNotificationConfig(notification.type);
                const Icon = config.icon;
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "group relative p-3 rounded-lg cursor-pointer transition-all",
                      "hover:bg-white/10",
                      notification.is_read ? "bg-white/5" : "bg-primary/10 border-l-2 border-primary"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", config.bgColor)}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm truncate",
                            notification.is_read ? "text-foreground" : "text-foreground font-medium"
                          )}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        {notification.message && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                        )}
                        {notification.action_url && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-primary">
                            <ExternalLink className="h-2.5 w-2.5" />
                            View details
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Hover actions */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead.mutate(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDelete(e, notification.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Quick Links */}
        <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
          <Link
            to="/portal/my-commission-requests"
            className="flex items-center justify-between p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-foreground">Commission Requests</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </Link>
          <Link
            to="/portal/requests"
            className="flex items-center justify-between p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-foreground">My Requests</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileNotificationsCard;
