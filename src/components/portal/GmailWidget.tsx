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
import { differenceInMinutes, format } from "date-fns";
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
      <CardHeader className="px-3 py-2.5 pb-2">
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

      <CardContent className="p-0">
        <ScrollArea className="h-[340px] pr-2">
          <div className="pl-3 pr-2 py-2">
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

            {/* Loading state - 3 line skeleton */}
            {isLoading && (
              <div className="space-y-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="px-2.5 py-2 rounded-md border border-border/30 bg-muted/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-1.5 w-1.5 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-10 ml-auto" />
                    </div>
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-2.5 w-3/4" />
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

            {/* Messages list - Gmail-style 3-line layout */}
            {isConnected && !isLoading && messages.length > 0 && (
              <div className="space-y-1.5">
                {messages.map((message) => (
                  <a
                    key={message.id}
                    href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "block px-2.5 py-2 rounded-md border border-border/30",
                      "hover:bg-muted/50 hover:border-border/50 transition-colors group cursor-pointer",
                      message.isUnread ? "bg-primary/5 border-primary/20" : "bg-muted/5"
                    )}
                    tabIndex={0}
                    role="button"
                    aria-label={`Email from ${message.from.name || message.from.email}: ${message.subject}`}
                  >
                    {/* Line 1: Unread dot + Sender + Star + Date */}
                    <div className="flex items-center justify-between mb-px">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {/* Unread indicator dot */}
                        {message.isUnread ? (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" aria-hidden="true">
                            <span className="sr-only">Unread</span>
                          </div>
                        ) : (
                          <div className="w-1.5 h-1.5 flex-shrink-0" aria-hidden="true" />
                        )}
                        
                        {/* Sender name */}
                        <span className={cn(
                          "text-xs truncate",
                          message.isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                          {message.from.name || message.from.email}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {/* Star icon - visible on hover or if starred */}
                        <button 
                          onClick={(e) => handleStar(message.id, message.isStarred, e)} 
                          className={cn(
                            "p-0.5 rounded transition-all",
                            message.isStarred 
                              ? "opacity-100" 
                              : "opacity-0 group-hover:opacity-100"
                          )}
                          title={message.isStarred ? "Unstar" : "Star"}
                        >
                          <Star className={cn(
                            "h-3 w-3 transition-colors",
                            message.isStarred 
                              ? "fill-amber-400 text-amber-400" 
                              : "text-muted-foreground hover:text-amber-400"
                          )} />
                        </button>
                        
                        {/* Date/Time */}
                        <time 
                          dateTime={message.date}
                          className="text-[10px] text-muted-foreground whitespace-nowrap"
                        >
                          {formatRelativeTime(new Date(message.date))}
                        </time>
                      </div>
                    </div>

                    {/* Line 2: Subject */}
                    <p className={cn(
                      "text-xs truncate mb-px",
                      message.isUnread ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {message.subject || "(No subject)"}
                    </p>

                    {/* Line 3: Snippet/Preview */}
                    <p className="text-[11px] text-muted-foreground/80 truncate">
                      {message.snippet || ""}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
