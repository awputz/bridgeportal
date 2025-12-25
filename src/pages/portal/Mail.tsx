import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail as MailIcon, Inbox, Send, FileText, Star, Trash2, Plus, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGmailConnection, useConnectGmail, useDisconnectGmail, useGmailLabels, useGmailMessages, useExchangeGmailCode } from "@/hooks/useGmail";
import { MailInbox } from "@/components/portal/MailInbox";
import { MailMessage } from "@/components/portal/MailMessage";
import { MailCompose } from "@/components/portal/MailCompose";
import { MailSearch } from "@/components/portal/MailSearch";

const LABEL_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
  INBOX: { icon: Inbox, label: "Inbox" },
  SENT: { icon: Send, label: "Sent" },
  DRAFT: { icon: FileText, label: "Drafts" },
  STARRED: { icon: Star, label: "Starred" },
  TRASH: { icon: Trash2, label: "Trash" },
};

export default function Mail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeLabel, setActiveLabel] = useState<string>("INBOX");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const { data: connection, isLoading: isLoadingConnection } = useGmailConnection();
  const { data: labels, isLoading: isLoadingLabels, refetch: refetchLabels } = useGmailLabels(connection?.isConnected);
  const { data: messagesData, isLoading: isLoadingMessages, refetch: refetchMessages } = useGmailMessages({
    labelIds: [activeLabel],
    query: searchQuery || undefined,
    enabled: connection?.isConnected,
  });

  const connectGmail = useConnectGmail();
  const disconnectGmail = useDisconnectGmail();
  const exchangeCode = useExchangeGmailCode();

  // Handle OAuth callback
  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !connection?.isConnected) {
      exchangeCode.mutate(code, {
        onSettled: () => {
          setSearchParams({});
        },
      });
    }
  }, [searchParams, connection?.isConnected]);

  const handleRefresh = () => {
    refetchLabels();
    refetchMessages();
  };

  const getLabelUnreadCount = (labelId: string) => {
    const label = labels?.find(l => l.id === labelId);
    return label?.messagesUnread || 0;
  };

  if (isLoadingConnection) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!connection?.isConnected) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <MailIcon className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold">Connect Your Gmail</h1>
              <p className="text-muted-foreground max-w-md">
                Connect your Gmail account to view and send emails directly from the portal.
                Your emails will be synced and you can link them to deals and contacts.
              </p>
              <Button
                size="lg"
                onClick={() => connectGmail.mutate()}
                disabled={connectGmail.isPending}
              >
                {connectGmail.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <MailIcon className="h-4 w-4 mr-2" />
                    Connect Gmail
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Mail</h1>
          {connection.email && (
            <span className="text-sm text-muted-foreground">{connection.email}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsComposeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => disconnectGmail.mutate()}
            disabled={disconnectGmail.isPending}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Labels */}
        <div className="w-48 border-r p-2 overflow-y-auto hidden md:block">
          <div className="space-y-1">
            {Object.entries(LABEL_CONFIG).map(([id, config]) => {
              const Icon = config.icon;
              const unreadCount = getLabelUnreadCount(id);
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveLabel(id);
                    setSelectedMessageId(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeLabel === id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </span>
                  {unreadCount > 0 && id !== "TRASH" && (
                    <Badge variant={activeLabel === id ? "secondary" : "default"} className="text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden w-full border-b">
          <Tabs value={activeLabel} onValueChange={setActiveLabel} className="w-full">
            <TabsList className="w-full h-auto flex-wrap justify-start p-1">
              {Object.entries(LABEL_CONFIG).map(([id, config]) => {
                const Icon = config.icon;
                return (
                  <TabsTrigger key={id} value={id} className="flex items-center gap-1 text-xs">
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Email List */}
          <div className={`${selectedMessageId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 border-r`}>
            <MailSearch value={searchQuery} onChange={setSearchQuery} />
            <MailInbox
              messages={messagesData?.messages || []}
              isLoading={isLoadingMessages}
              selectedId={selectedMessageId}
              onSelect={setSelectedMessageId}
            />
          </div>

          {/* Email View */}
          <div className={`${selectedMessageId ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
            <MailMessage
              messageId={selectedMessageId}
              onBack={() => setSelectedMessageId(null)}
              onReply={() => setIsComposeOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Compose Dialog */}
      <MailCompose
        open={isComposeOpen}
        onOpenChange={setIsComposeOpen}
      />
    </div>
  );
}
