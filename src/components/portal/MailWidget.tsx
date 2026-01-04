import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Mail, 
  ExternalLink, 
  Inbox,
  Star,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useGmailConnection, useGmailMessages, useConnectGmail, useModifyMessage } from "@/hooks/useGmail";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MailWidget = () => {
  const { data: connection, isLoading: isLoadingConnection } = useGmailConnection();
  const { data: messagesData, isLoading: isLoadingMessages, dataUpdatedAt } = useGmailMessages({
    labelIds: ["INBOX"],
    maxResults: 5,
    enabled: connection?.isConnected ?? false,
  });
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: modifyMessage } = useModifyMessage();

  // Calculate time since last update for freshness indicator
  const lastUpdated = dataUpdatedAt ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true }) : null;

  const unreadCount = messagesData?.messages?.filter(m => m.isUnread).length || 0;
  const messages = messagesData?.messages || [];

  const isLoading = isLoadingConnection || (connection?.isConnected && isLoadingMessages);

  const handleMarkRead = (messageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modifyMessage({ messageId, removeLabelIds: ["UNREAD"] });
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

  // Not connected state
  if (!isLoading && !connection?.isConnected) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Mail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Gmail to see your inbox here
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => connectGmail()}
              disabled={isConnecting}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Gmail"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Mail
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/20 text-primary text-xs animate-pulse">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[10px] text-muted-foreground">
                {lastUpdated}
              </span>
            )}
            <a 
              href="https://mail.google.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
            </a>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[260px]">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Your inbox is empty</p>
            </div>
          ) : (
            <div className="space-y-1 pr-2">
              {messages.map((message) => (
                <a
                  key={message.id}
                  href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "relative block p-3 rounded-lg transition-colors group",
                    "hover:bg-muted/50",
                    message.isUnread && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium",
                      message.isUnread 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {message.from.name?.charAt(0).toUpperCase() || message.from.email?.charAt(0).toUpperCase() || "?"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm truncate",
                          message.isUnread ? "font-medium text-foreground" : "text-muted-foreground"
                        )}>
                          {message.from.name || message.from.email}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDistanceToNow(new Date(message.date), { addSuffix: false })}
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm truncate",
                        message.isUnread ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {message.subject || "(No subject)"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {message.snippet}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {message.isUnread && (
                        <button
                          onClick={(e) => handleMarkRead(message.id, e)}
                          className="p-1 hover:bg-muted rounded"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleStar(message.id, message.isStarred, e)}
                        className="p-1 hover:bg-muted rounded"
                        title={message.isStarred ? "Unstar" : "Star"}
                      >
                        <Star className={cn(
                          "h-3.5 w-3.5",
                          message.isStarred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                        )} />
                      </button>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {message.isUnread && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />
                  )}
                </a>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
