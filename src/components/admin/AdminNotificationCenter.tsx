import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, CheckCheck, DollarSign, ClipboardList, Mail, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  useAdminNotifications, 
  useUnreadAdminNotificationsCount, 
  useMarkAdminNotificationRead,
  useMarkAllAdminNotificationsRead,
  useDeleteAdminNotification,
  AdminNotification 
} from "@/hooks/useAdminNotifications";
import { formatDistanceToNow } from "date-fns";

const notificationIcons: Record<string, typeof Bell> = {
  commission_request: DollarSign,
  agent_request: ClipboardList,
  inquiry: Mail,
};

const priorityColors: Record<AdminNotification["priority"], string> = {
  normal: "",
  high: "border-l-2 border-l-amber-500",
  urgent: "border-l-2 border-l-red-500 bg-red-500/5",
};

export function AdminNotificationCenter() {
  const [open, setOpen] = useState(false);
  const { data: notifications } = useAdminNotifications();
  const { data: unreadCount } = useUnreadAdminNotificationsCount();
  const markAsRead = useMarkAdminNotificationRead();
  const markAllAsRead = useMarkAllAdminNotificationsRead();
  const deleteNotification = useDeleteAdminNotification();

  const handleNotificationClick = async (notification: AdminNotification) => {
    if (!notification.is_read) {
      await markAsRead.mutateAsync(notification.id);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount && unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              className="text-xs h-7"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {!notifications?.length ? (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Bell;
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-colors ${priorityColors[notification.priority]} ${
                      !notification.is_read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === "commission_request" 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : "bg-primary/20 text-primary"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-medium ${!notification.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                            </p>
                            {notification.message && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
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
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification.mutate(notification.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                          
                          {notification.action_url && (
                            <Link
                              to={notification.action_url}
                              onClick={() => handleNotificationClick(notification)}
                              className="text-xs text-primary hover:underline"
                            >
                              View →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
