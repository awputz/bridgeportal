import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, X, ExternalLink } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
const notificationTypeIcons = {
  task: "📋",
  deal: "🏢",
  contact: "👤",
  reminder: "⏰",
  alert: "⚠️",
  success: "✅",
  info: "ℹ️"
};
export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {
    data: notifications,
    isLoading
  } = useNotifications();
  const {
    data: unreadCount
  } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  const handleNotificationClick = (notification: typeof notifications extends (infer T)[] ? T : never) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
      setIsOpen(false);
    }
  };
  return <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-background/95 backdrop-blur-xl border-border" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-light text-foreground">Notifications</h3>
          {(unreadCount || 0) > 0 && <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => markAllAsRead.mutate()} disabled={markAllAsRead.isPending}>
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>}
        </div>

        <ScrollArea className="h-80">
          {isLoading ? <div className="p-4 text-center text-muted-foreground text-sm">
              Loading...
            </div> : !notifications || notifications.length === 0 ? <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div> : <div className="divide-y divide-border">
              {notifications.map(notification => <div key={notification.id} className={cn("p-4 hover:bg-white/5 transition-colors cursor-pointer relative group", !notification.is_read && "bg-primary/5")} onClick={() => handleNotificationClick(notification)}>
                  <div className="flex gap-3">
                    <span className="text-lg flex-shrink-0">
                      {notificationTypeIcons[notification.type as keyof typeof notificationTypeIcons] || "📬"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm", !notification.is_read ? "text-foreground font-medium" : "text-foreground/80")}>
                          {notification.title}
                        </p>
                        {!notification.is_read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                      </div>
                      {notification.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>}
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true
                  })}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {!notification.is_read && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => {
                e.stopPropagation();
                markAsRead.mutate(notification.id);
              }}>
                        <Check className="h-3 w-3" />
                      </Button>}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={e => {
                e.stopPropagation();
                deleteNotification.mutate(notification.id);
              }}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>)}
            </div>}
        </ScrollArea>
      </PopoverContent>
    </Popover>;
};