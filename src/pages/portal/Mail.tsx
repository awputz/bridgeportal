import { useState, useMemo, useEffect } from "react";
import { Mail as MailIcon, Inbox, Send, FileText, Star, Trash2, Plus, RefreshCw, Settings, AlertCircle, Loader2, ChevronDown, Search as SearchIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useGmailConnection, useConnectGmail, useDisconnectGmail, useGmailLabels, useGmailMessages } from "@/hooks/useGmail";
import { MailInbox } from "@/components/portal/MailInbox";
import { MailMessage } from "@/components/portal/MailMessage";
import { MailCompose } from "@/components/portal/MailCompose";
import { cn } from "@/lib/utils";
import { hardLogout } from "@/lib/auth";

// Gmail-style label configuration with colors
const LABEL_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  INBOX: { icon: Inbox, label: "Inbox", color: "text-foreground" },
  STARRED: { icon: Star, label: "Starred", color: "text-gmail-yellow" },
  SENT: { icon: Send, label: "Sent", color: "text-foreground" },
  DRAFT: { icon: FileText, label: "Drafts", color: "text-foreground" },
  TRASH: { icon: Trash2, label: "Trash", color: "text-foreground" },
};

// Search filters for advanced search
const SEARCH_FILTERS = [
  { label: "Has attachment", value: "has:attachment" },
  { label: "Is unread", value: "is:unread" },
  { label: "Is starred", value: "is:starred" },
  { label: "From me", value: "from:me" },
];

export default function Mail() {
  const [activeLabel, setActiveLabel] = useState<string>("INBOX");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [replyToData, setReplyToData] = useState<{ to: string; subject: string; threadId?: string; messageId?: string } | undefined>();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const { data: connection, isLoading: isLoadingConnection, error: connectionError } = useGmailConnection();
  const {
    data: labels,
    isLoading: isLoadingLabels,
    error: labelsError,
    refetch: refetchLabels,
  } = useGmailLabels(connection?.isConnected);
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages,
  } = useGmailMessages({
    labelIds: [activeLabel],
    query: searchQuery || undefined,
    maxResults: 50,
    enabled: connection?.isConnected,
  });

  const connectGmail = useConnectGmail();
  const disconnectGmail = useDisconnectGmail();

  const handleRefresh = () => {
    refetchLabels();
    refetchMessages();
  };

  const handleReply = (to: string, subject: string, threadId?: string, messageId?: string) => {
    setReplyToData({ to, subject, threadId, messageId });
    setIsComposeOpen(true);
  };

  const dataError = (labelsError as Error | null) || (messagesError as Error | null);

  const getLabelUnreadCount = (labelId: string) => {
    const label = labels?.find((l) => l.id === labelId);
    return label?.messagesUnread || 0;
  };

  const addSearchFilter = (filter: string) => {
    setSearchQuery(prev => prev ? `${prev} ${filter}` : filter);
    setShowAdvancedSearch(false);
  };

  // Update document title with unread count
  useEffect(() => {
    const inboxUnread = getLabelUnreadCount("INBOX");
    if (inboxUnread > 0) {
      document.title = `(${inboxUnread}) Gmail - Portal`;
    } else {
      document.title = "Gmail - Portal";
    }
    return () => {
      document.title = "Portal";
    };
  }, [labels]);

  if (isLoadingConnection) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Checking connection...</span>
        </div>
      </div>
    );
  }

  if (!connection?.isConnected) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="glass-card p-8 md:p-12 max-w-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gmail-red/20 to-gmail-orange/20 flex items-center justify-center mx-auto mb-6">
            <MailIcon className="h-10 w-10 text-gmail-red" />
          </div>
          <h2 className="text-2xl font-light text-foreground mb-3">Connect Your Gmail</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-sm mx-auto">
            Access your emails directly from the portal. Send, receive, and link emails to deals and contacts.
          </p>

          {connectionError && (
            <div className="flex items-center gap-2 justify-center text-amber-400 mb-6 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Connection check failed. Try connecting anyway.</span>
            </div>
          )}

          <Button 
            size="lg" 
            onClick={() => connectGmail.mutate()} 
            disabled={connectGmail.isPending} 
            className="gap-2 bg-gmail-red hover:bg-gmail-red/90"
          >
            {connectGmail.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <MailIcon className="h-4 w-4" />
                Connect Gmail
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-6">We'll only request read and send permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-border/30 bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gmail-red flex items-center justify-center">
            <MailIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-medium text-foreground">Gmail</h1>
          </div>
        </div>
        
        {/* Search Bar - Center */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-gmail-red/50 h-9"
            />
            <DropdownMenu open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
              <DropdownMenuTrigger asChild>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Quick filters</p>
                {SEARCH_FILTERS.map((filter) => (
                  <DropdownMenuItem 
                    key={filter.value} 
                    onClick={() => addSearchFilter(filter.value)}
                  >
                    {filter.label}
                  </DropdownMenuItem>
                ))}
                {searchQuery && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSearchQuery("")}>
                      Clear search
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh} 
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              setReplyToData(undefined);
              setIsComposeOpen(true);
            }} 
            className="gap-1.5 bg-gmail-red hover:bg-gmail-red/90 text-white h-8"
          >
            <Plus className="h-4 w-4" />
            Compose
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open('https://mail.google.com', '_blank')}
            className="h-8 w-8"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open('https://mail.google.com', '_blank')}>
                Open Gmail
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => disconnectGmail.mutate()}
                disabled={disconnectGmail.isPending}
                className="text-destructive"
              >
                Disconnect Gmail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {dataError && (
        <div className="mx-4 mt-2 rounded-lg border border-border/50 bg-muted/20 p-3 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Couldn't load Gmail data</p>
                <p className="text-xs text-muted-foreground">{dataError.message}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={hardLogout}>
              Sign in again
            </Button>
          </div>
        </div>
      )}

      {/* Main Content - Full Height */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Labels */}
        <div className="w-16 md:w-52 border-r border-border/30 py-2 overflow-y-auto bg-muted/5 shrink-0">
          <div className="flex flex-col gap-0.5 px-2">
            {Object.entries(LABEL_CONFIG).map(([id, config]) => {
              const Icon = config.icon;
              const unreadCount = getLabelUnreadCount(id);
              const isActive = activeLabel === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveLabel(id);
                    setSelectedMessageId(null);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-full text-sm transition-all",
                    isActive
                      ? "bg-gmail-red/10 text-gmail-red font-medium"
                      : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", isActive && id === "STARRED" && "text-gmail-yellow fill-gmail-yellow")} />
                    <span className="hidden md:inline">{config.label}</span>
                  </span>
                  {unreadCount > 0 && id !== "TRASH" && (
                    <span className={cn(
                      "text-xs font-semibold hidden md:inline",
                      isActive ? "text-gmail-red" : "text-muted-foreground"
                    )}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email List */}
        <div
          className={cn(
            "flex-col border-r border-border/30 w-full md:w-[450px] lg:w-[500px] bg-background shrink-0",
            selectedMessageId ? "hidden md:flex" : "flex"
          )}
        >
          <MailInbox
            messages={messagesData?.messages || []}
            isLoading={isLoadingMessages}
            selectedId={selectedMessageId}
            onSelect={setSelectedMessageId}
          />
        </div>

        {/* Email View */}
        <div className={cn("flex-1 flex-col bg-background min-w-0", selectedMessageId ? "flex" : "hidden md:flex")}>
          <MailMessage
            messageId={selectedMessageId}
            onBack={() => setSelectedMessageId(null)}
            onReply={handleReply}
          />
        </div>
      </div>

      {/* Compose Dialog */}
      <MailCompose 
        open={isComposeOpen} 
        onOpenChange={setIsComposeOpen} 
        replyTo={replyToData}
      />
    </div>
  );
}