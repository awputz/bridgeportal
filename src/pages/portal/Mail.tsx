import { useState } from "react";
import { Mail as MailIcon, Inbox, Send, FileText, Star, Trash2, Plus, RefreshCw, Settings, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGmailConnection, useConnectGmail, useDisconnectGmail, useGmailLabels, useGmailMessages } from "@/hooks/useGmail";
import { MailInbox } from "@/components/portal/MailInbox";
import { MailMessage } from "@/components/portal/MailMessage";
import { MailCompose } from "@/components/portal/MailCompose";
import { MailSearch } from "@/components/portal/MailSearch";
import { cn } from "@/lib/utils";
import { hardLogout } from "@/lib/auth";

const LABEL_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
  INBOX: { icon: Inbox, label: "Inbox" },
  SENT: { icon: Send, label: "Sent" },
  DRAFT: { icon: FileText, label: "Drafts" },
  STARRED: { icon: Star, label: "Starred" },
  TRASH: { icon: Trash2, label: "Trash" },
};

export default function Mail() {
  const [activeLabel, setActiveLabel] = useState<string>("INBOX");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);

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
    enabled: connection?.isConnected,
  });

  const connectGmail = useConnectGmail();
  const disconnectGmail = useDisconnectGmail();

  const handleRefresh = () => {
    refetchLabels();
    refetchMessages();
  };

  const dataError = (labelsError as Error | null) || (messagesError as Error | null);

  const getLabelUnreadCount = (labelId: string) => {
    const label = labels?.find((l) => l.id === labelId);
    return label?.messagesUnread || 0;
  };

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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
              Mail
            </h1>
            <p className="text-muted-foreground font-light">Connect your Gmail to send and receive emails</p>
          </div>

          {/* Connect Card */}
          <div className="glass-card p-8 md:p-12 max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <MailIcon className="h-10 w-10 text-red-400" />
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

            <Button size="lg" onClick={() => connectGmail.mutate()} disabled={connectGmail.isPending} className="gap-2">
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
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">Mail</h1>
            {connection.email && <p className="text-muted-foreground font-light">{connection.email}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button size="sm" onClick={() => setIsComposeOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Compose</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => disconnectGmail.mutate()}
              disabled={disconnectGmail.isPending}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {dataError && (
          <div className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Couldn’t load Gmail data</p>
                  <p className="text-sm text-muted-foreground break-words">{dataError.message}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={hardLogout} className="shrink-0">
                Sign in again
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="glass-card overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100vh-16rem)] md:h-[600px]">
            {/* Sidebar - Labels */}
            <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-border/50 p-2 md:p-3 overflow-x-auto md:overflow-y-auto bg-muted/20">
              <div className="flex md:flex-col gap-1 md:space-y-1">
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
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        <span className="hidden md:inline">{config.label}</span>
                      </span>
                      {unreadCount > 0 && id !== "TRASH" && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className="text-[10px] h-5 min-w-[20px] justify-center hidden md:flex"
                        >
                          {unreadCount}
                        </Badge>
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
                  "flex-col border-b md:border-b-0 md:border-r border-border/50 w-full md:w-96",
                  selectedMessageId ? "hidden md:flex" : "flex"
                )}
              >
                <div className="p-3 border-b border-border/50">
                  <MailSearch value={searchQuery} onChange={setSearchQuery} />
                </div>
                <MailInbox
                  messages={messagesData?.messages || []}
                  isLoading={isLoadingMessages}
                  selectedId={selectedMessageId}
                  onSelect={setSelectedMessageId}
                />
              </div>

              {/* Email View */}
              <div className={cn("flex-1 flex-col bg-muted/10", selectedMessageId ? "flex" : "hidden md:flex")}>
                <MailMessage
                  messageId={selectedMessageId}
                  onBack={() => setSelectedMessageId(null)}
                  onReply={() => setIsComposeOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compose Dialog */}
      <MailCompose open={isComposeOpen} onOpenChange={setIsComposeOpen} />
    </div>
  );
}
