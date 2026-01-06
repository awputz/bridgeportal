import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, 
  ExternalLink,
  Inbox,
  Star,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, differenceInMinutes } from "date-fns";
import { useGmailConnection, useGmailMessages, useConnectGmail, useModifyMessage } from "@/hooks/useGmail";
import { useQueryClient } from "@tanstack/react-query";

// Format relative time helper
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMins = differenceInMinutes(now, date);
  
  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d`;
  
  return format(date, "MMM d");
};

export const GmailWidget = () => {
  const queryClient = useQueryClient();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Gmail connection and data
  const { data: gmailConnection, isLoading: gmailConnectionLoading } = useGmailConnection();
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages, isRefetching } = useGmailMessages({
    labelIds: ["INBOX"],
    maxResults: 5,
    enabled: gmailConnection?.isConnected ?? false,
    refetchInterval: 300000, // 5 minutes
  });
  
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: modifyMessage } = useModifyMessage();
  
  const messages = messagesData?.messages || [];
  const unreadCount = messages.filter(m => m.isUnread).length;
  const isConnected = gmailConnection?.isConnected ?? false;
  const isLoading = gmailConnectionLoading || (isConnected && messagesLoading);

  // Update last sync time when data loads
  useEffect(() => {
    if (!messagesLoading && isConnected) {
      setLastSyncTime(new Date());
    }
  }, [messagesLoading, isConnected]);

  const handleRefresh = async () => {
    await refetchMessages();
    setLastSyncTime(new Date());
  };

  const handleStar = (messageId: string, isStarred: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isStarred) {
      modifyMessage({ messageId, removeLabelIds: ["STARRED"] });
    } else {
      modifyMessage({ messageId, addLabelIds: ["STARRED"] });
    }
  };

  const getSyncStatusText = () => {
    if (isRefetching) return 'Syncing...';
    if (!lastSyncTime) return '';
    const mins = differenceInMinutes(new Date(), lastSyncTime);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return format(lastSyncTime, 'h:mm a');
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card h-full">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-red-400" />
            <span className="text-sm font-semibold">Gmail</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isConnected && (
              <>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {getSyncStatusText()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleRefresh}
                  disabled={isRefetching}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5 text-muted-foreground", isRefetching && "animate-spin")} />
                </Button>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-1.5 py-1 rounded hover:bg-muted/50 transition-colors"
                >
                  <span className="hidden sm:inline">View All</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <div className="relative">
          <ScrollArea className="max-h-[280px]">
            {/* Not connected state */}
            {!isConnected && !isLoading && (
              <div className="flex flex-col items-center justify-center py-6 bg-red-500/5 rounded-lg border border-red-500/10">
                <div className="h-9 w-9 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                  <Mail className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-xs text-muted-foreground text-center mb-2">
                  Connect Gmail to see your inbox
                </p>
                <Button 
                  size="sm" 
                  onClick={() => connectGmail()} 
                  disabled={isConnecting}
                  className="bg-red-500 hover:bg-red-600 text-white h-8 text-xs px-3"
                >
                  {isConnecting ? "Connecting..." : "Connect Gmail"}
                </Button>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="space-y-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-2 p-2 bg-muted/30 rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {isConnected && !isLoading && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 bg-muted/20 rounded-lg">
                <Inbox className="h-7 w-7 text-muted-foreground mb-1.5" />
                <p className="text-xs text-muted-foreground">No new emails</p>
              </div>
            )}

            {/* Messages list */}
            {isConnected && !isLoading && messages.length > 0 && (
              <div className="space-y-1">
                {messages.map((message) => (
                  <a
                    key={message.id}
                    href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "relative flex items-start gap-2 p-2 rounded-lg transition-all group",
                      "hover:bg-muted/50 border border-transparent hover:border-border/50",
                      message.isUnread && "bg-red-500/5 border-red-500/10"
                    )}
                  >
                    {/* Unread indicator */}
                    {message.isUnread && (
                      <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-red-500" />
                    )}
                    
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold",
                      message.isUnread 
                        ? "bg-red-500/20 text-red-400" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {message.from.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={cn(
                          "text-xs truncate",
                          message.isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                          {message.from.name || message.from.email}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {formatRelativeTime(new Date(message.date))}
                        </span>
                      </div>
                      <p className={cn(
                        "text-xs truncate",
                        message.isUnread ? "text-foreground/80" : "text-muted-foreground"
                      )}>
                        {message.subject || "(No subject)"}
                      </p>
                    </div>
                    
                    {/* Star action - Desktop only */}
                    <div className="hidden sm:flex items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleStar(message.id, message.isStarred, e)} 
                        className="p-1 hover:bg-muted rounded transition-colors"
                        title={message.isStarred ? "Unstar" : "Star"}
                      >
                        <Star className={cn(
                          "h-3.5 w-3.5 transition-colors",
                          message.isStarred ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-400"
                        )} />
                      </button>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {/* Scroll fade indicator */}
          {isConnected && messages.length > 4 && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
