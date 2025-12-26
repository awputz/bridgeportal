import { useState, useMemo, useEffect } from "react";
import { Mail as MailIcon, Inbox, Send, FileText, Star, Trash2, Plus, RefreshCw, Settings, AlertCircle, Loader2, Archive, ChevronDown, Search as SearchIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="glass-card p-8">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Checking connection...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!connection?.isConnected) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gmail-red flex items-center justify-center">
                <MailIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground">
                Gmail
              </h1>
            </div>
            <p className="text-muted-foreground font-light">Connect your Gmail to send and receive emails</p>
          </div>

          {/* Connect Card */}
          <div className="glass-card p-8 md:p-12 max-w-xl mx-auto text-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Gmail-style Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gmail-red flex items-center justify-center">
              <MailIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-foreground">Gmail</h1>
              {connection.email && <p className="text-sm text-muted-foreground">{connection.email}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                setReplyToData(undefined);
                setIsComposeOpen(true);
              }} 
              className="gap-2 bg-gmail-red hover:bg-gmail-red/90 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Compose</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://mail.google.com', '_blank')}
              className="gap-2 border-gmail-red/30 text-gmail-red hover:bg-gmail-red/10"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open Gmail</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
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
          <div className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Couldn't load Gmail data</p>
                  <p className="text-sm text-muted-foreground break-words">{dataError.message}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={hardLogout} className="shrink-0">
                Sign in again
              </Button>
            </div>
          </div>
        )}

        {/* Gmail-style Main Content */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row h-[calc(100vh-14rem)] md:h-[700px]">
            {/* Gmail-style Sidebar - Labels */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border/30 py-2 overflow-x-auto md:overflow-y-auto bg-muted/5">
              <div className="flex md:flex-col gap-1 px-2">
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
                        "flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        isActive
                          ? "bg-gmail-red/10 text-gmail-red"
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

            {/* Content Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Email List */}
              <div
                className={cn(
                  "flex-col border-b md:border-b-0 md:border-r border-border/30 w-full md:w-[400px] bg-background",
                  selectedMessageId ? "hidden md:flex" : "flex"
                )}
              >
                {/* Search with Advanced Filters */}
                <div className="p-3 border-b border-border/30">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mail..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-gmail-red/50"
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
                <MailInbox
                  messages={messagesData?.messages || []}
                  isLoading={isLoadingMessages}
                  selectedId={selectedMessageId}
                  onSelect={setSelectedMessageId}
                />
              </div>

              {/* Email View */}
              <div className={cn("flex-1 flex-col bg-background", selectedMessageId ? "flex" : "hidden md:flex")}>
                <MailMessage
                  messageId={selectedMessageId}
                  onBack={() => setSelectedMessageId(null)}
                  onReply={handleReply}
                />
              </div>
            </div>
          </div>
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
