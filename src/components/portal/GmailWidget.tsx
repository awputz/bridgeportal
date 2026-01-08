import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  ExternalLink,
  Inbox,
  Star,
  RefreshCw,
  Search,
  Archive,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPACING, COMPONENT_CLASSES } from "@/lib/spacing";
import { differenceInMinutes, format } from "date-fns";
import { useGmailConnection, useGmailMessages, useConnectGmail, useModifyMessage, useTrashMessage } from "@/hooks/useGmail";
import { useQueryClient } from "@tanstack/react-query";
import { EmailPreviewSlideOver } from "./EmailPreviewSlideOver";
import { LinkToRecordDialog } from "./LinkToRecordDialog";
import { SectionErrorBoundary } from "./SectionErrorBoundary";
import { toast } from "sonner";
import { formatSafeRelativeTime } from "@/lib/dateUtils";

// Decode HTML entities (e.g., &#39; → ')
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Sanitize plain text for encoding issues
function sanitizeEmailText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
    .replace(/Â /g, ' ');
}

type LabelFilter = "INBOX" | "UNREAD" | "STARRED" | "SENT";

export const GmailWidget = () => {
  const queryClient = useQueryClient();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [labelFilter, setLabelFilter] = useState<LabelFilter>("INBOX");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkDialogData, setLinkDialogData] = useState<{
    emailId: string;
    threadId: string;
    subject: string;
    from: string;
  } | null>(null);

  // Gmail connection and data
  const { data: gmailConnection, isLoading: gmailConnectionLoading } = useGmailConnection();
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages, isRefetching } = useGmailMessages({
    labelIds: [labelFilter === "UNREAD" ? "INBOX" : labelFilter],
    query: labelFilter === "UNREAD" ? (searchQuery ? `is:unread ${searchQuery}` : "is:unread") : (searchQuery || undefined),
    maxResults: 100, // Sync 100 emails
    enabled: gmailConnection?.isConnected ?? false,
    refetchInterval: 30000, // 30 seconds
  });
  
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: modifyMessage } = useModifyMessage();
  const { mutate: trashMessage } = useTrashMessage();
  
  const allMessages = messagesData?.messages || [];
  const messages = labelFilter === "UNREAD" ? allMessages.filter(m => m.isUnread) : allMessages; // Show ALL emails
  const unreadCount = allMessages.filter(m => m.isUnread).length;
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

  const handleArchive = (messageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modifyMessage(
      { messageId, removeLabelIds: ["INBOX"] },
      { onSuccess: () => toast.success("Email archived") }
    );
  };

  const handleDelete = (messageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trashMessage(messageId, {
      onSuccess: () => toast.success("Email moved to trash"),
    });
  };

  const handleEmailClick = (messageId: string) => {
    setSelectedEmailId(messageId);
  };

  const handleLinkToRecord = (emailId: string, threadId: string, subject: string, from: string) => {
    setLinkDialogData({ emailId, threadId, subject, from });
    setLinkDialogOpen(true);
    setSelectedEmailId(null); // Close the preview
  };

  const getSyncStatusText = () => {
    if (isRefetching) return 'Syncing...';
    if (!lastSyncTime) return '';
    const mins = differenceInMinutes(new Date(), lastSyncTime);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return format(lastSyncTime, 'h:mm a');
  };

  const labelFilters: { id: LabelFilter; label: string; showCount?: boolean }[] = [
    { id: "INBOX", label: "Inbox" },
    { id: "UNREAD", label: "Unread", showCount: true },
    { id: "STARRED", label: "Starred" },
    { id: "SENT", label: "Sent" },
  ];

  return (
    <>
      <Card className="overflow-hidden border-border/50 bg-card h-full">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold">Gmail</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full font-medium">
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

          {/* Search and Filters - only show when connected */}
          {isConnected && !isLoading && (
            <div className="mt-2 space-y-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 text-sm bg-muted/30 border-0 pl-8"
                />
              </div>

              {/* Label Filter Pills */}
              <div className="flex gap-2">
                {labelFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setLabelFilter(filter.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full transition-colors",
                      labelFilter === filter.id
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter.label}
                    {filter.showCount && unreadCount > 0 && ` (${unreadCount})`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          <ScrollArea className="h-[440px]">
            <div className="p-3 overflow-hidden">
              {/* Not connected state */}
              {!isConnected && !isLoading && (
                <div className="flex flex-col items-center justify-center py-6 bg-destructive/5 rounded-lg border border-destructive/10">
                  <div className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                    <Mail className="h-4 w-4 text-destructive" />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mb-2">
                    Connect Gmail to see your inbox
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => connectGmail()} 
                    disabled={isConnecting}
                    variant="destructive"
                    className="h-8 text-xs px-3"
                  >
                    {isConnecting ? "Connecting..." : "Connect Gmail"}
                  </Button>
                </div>
              )}

              {/* Loading state - 5 line skeleton */}
              {isLoading && (
                <div className="space-y-2 pr-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="px-3 py-2 rounded-md border border-border/30 bg-muted/5 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <Skeleton className="h-1.5 w-1.5 rounded-full shrink-0" />
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-12 ml-auto shrink-0" />
                      </div>
                      <Skeleton className="h-3.5 w-full mb-1" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {isConnected && !isLoading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 bg-muted/20 rounded-lg">
                  <Inbox className="h-7 w-7 text-muted-foreground mb-1.5" />
                  <p className="text-xs text-muted-foreground">
                    {searchQuery ? "No emails match your search" : "No emails"}
                  </p>
                </div>
              )}

              {/* Messages list - Gmail-style 3-line layout with bordered cards */}
              {isConnected && !isLoading && messages.length > 0 && (
                <div className="space-y-2 pr-2 overflow-hidden">
                  {messages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => handleEmailClick(message.id)}
                      className={cn(
                        "group block w-full max-w-full px-3 py-2 rounded-md border border-border/30 border-l-2 overflow-hidden text-left",
                        "hover:bg-muted/50 hover:border-border/50 transition-colors cursor-pointer",
                        message.isUnread 
                          ? "border-l-blue-500 bg-primary/5" 
                          : "border-l-transparent bg-muted/5"
                      )}
                      aria-label={`Email from ${message.from?.name || message.from?.email || 'Unknown'}: ${message.subject || '(No subject)'}`}
                    >
                      {/* Line 1: Unread dot + Sender + Quick Actions + Star + Date */}
                      <div className="flex items-center justify-between gap-2 mb-0.5 min-w-0 max-w-full overflow-hidden">
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                          {/* Unread indicator dot - always reserve space for alignment */}
                          <div 
                            className={cn(
                              "w-1.5 h-1.5 rounded-full flex-shrink-0",
                              message.isUnread ? "bg-blue-500" : "bg-transparent"
                            )}
                            aria-hidden="true"
                          >
                            {message.isUnread && <span className="sr-only">Unread</span>}
                          </div>
                          
                          {/* Sender name */}
                          <span className={cn(
                            "text-sm truncate min-w-0 max-w-full flex-1 leading-none overflow-hidden",
                            message.isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/70"
                          )}>
                            {message.from?.name || message.from?.email || 'Unknown sender'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Quick actions - visible on hover */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleArchive(message.id, e)}
                              className="p-1 rounded hover:bg-muted transition-colors"
                              title="Archive"
                            >
                              <Archive className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(message.id, e)}
                              className="p-1 rounded hover:bg-muted transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>

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
                              "h-3.5 w-3.5 flex-shrink-0 transition-colors",
                              message.isStarred 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-muted-foreground hover:text-amber-400"
                            )} />
                          </button>
                          
                          {/* Date/Time */}
                          <time 
                            dateTime={message.date || undefined}
                            className="text-xs text-muted-foreground whitespace-nowrap leading-none"
                          >
                            {formatSafeRelativeTime(message.internalDate || message.date) || 'No date'}
                          </time>
                        </div>
                      </div>

                      {/* Line 2: Subject */}
                      <p className={cn(
                        "text-sm truncate mb-px min-w-0 max-w-full leading-tight overflow-hidden",
                        message.isUnread ? "font-semibold text-foreground" : "text-foreground/70"
                      )}>
                        {decodeHtmlEntities(message.subject || "(No subject)")}
                      </p>

                      {/* Line 3: Snippet/Preview */}
                      <p className="text-xs text-muted-foreground truncate min-w-0 max-w-full mb-0 leading-tight overflow-hidden whitespace-nowrap">
                        {sanitizeEmailText(decodeHtmlEntities(message.snippet || ""))}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Email Preview SlideOver - wrapped in error boundary */}
      <SectionErrorBoundary sectionName="Email Preview">
        <EmailPreviewSlideOver
          emailId={selectedEmailId}
          onClose={() => setSelectedEmailId(null)}
          onLinkToRecord={handleLinkToRecord}
        />
      </SectionErrorBoundary>

      {/* Link to Record Dialog */}
      {linkDialogData && (
        <LinkToRecordDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          emailId={linkDialogData.emailId}
          threadId={linkDialogData.threadId}
          emailSubject={linkDialogData.subject}
          emailFrom={linkDialogData.from}
        />
      )}
    </>
  );
};
