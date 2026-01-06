import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, 
  Calendar, 
  ExternalLink,
  Inbox,
  Clock,
  Star,
  RefreshCw,
  Settings,
  MapPin,
  Video,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, isSameDay, differenceInMinutes, isToday } from "date-fns";
import { Link } from "react-router-dom";

// Gmail hooks
import { useGmailConnection, useGmailMessages, useConnectGmail, useModifyMessage } from "@/hooks/useGmail";

// Calendar hooks  
import { useGoogleCalendarConnection, useGoogleCalendarEvents, useConnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useUpcomingEvents } from "@/hooks/useCalendarEvents";
import { useQueryClient } from "@tanstack/react-query";

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export const GoogleWorkspaceWidget = () => {
  const queryClient = useQueryClient();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Gmail connection and data
  const { data: gmailConnection, isLoading: gmailConnectionLoading } = useGmailConnection();
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages, isRefetching: isRefetchingMessages } = useGmailMessages({
    labelIds: ["INBOX"],
    maxResults: 4, // Reduced for better mobile performance
    enabled: gmailConnection?.isConnected ?? false,
    refetchInterval: 300000, // 5 minutes
  });
  
  // Calendar connection and data
  const { data: googleCalConnection, isLoading: calConnectionLoading } = useGoogleCalendarConnection();
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  const isCalConnected = googleCalConnection?.calendar_enabled && !!googleCalConnection?.access_token;
  const { data: googleEvents = [], isLoading: eventsLoading, refetch: refetchEvents, isRefetching: isRefetchingEvents } = useGoogleCalendarEvents(startOfDay, endOfDay);
  const { data: companyEvents = [] } = useUpcomingEvents(1);
  
  // Computed values
  const messages = messagesData?.messages || [];
  const unreadCount = messages.filter(m => m.isUnread).length;
  const todaysEvents = [...companyEvents, ...googleEvents]
    .filter(event => isSameDay(new Date(event.start_time), today))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 4); // Reduced for better mobile performance

  const isGmailConnected = gmailConnection?.isConnected ?? false;
  const isSyncing = isRefetchingMessages || isRefetchingEvents;

  // Update last sync time when data loads
  useEffect(() => {
    if (!messagesLoading && !eventsLoading && (isGmailConnected || isCalConnected)) {
      setLastSyncTime(new Date());
      setSyncStatus('success');
    }
  }, [messagesLoading, eventsLoading, isGmailConnected, isCalConnected]);

  const handleRefresh = async () => {
    setSyncStatus('syncing');
    try {
      await Promise.all([
        isGmailConnected && refetchMessages(),
        isCalConnected && refetchEvents(),
      ]);
      setLastSyncTime(new Date());
      setSyncStatus('success');
    } catch (error) {
      setSyncStatus('error');
    }
  };

  const getSyncStatusText = () => {
    if (syncStatus === 'syncing' || isSyncing) return 'Syncing...';
    if (syncStatus === 'error') return 'Sync failed';
    if (!lastSyncTime) return 'Not synced';
    const mins = differenceInMinutes(new Date(), lastSyncTime);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return format(lastSyncTime, 'h:mm a');
  };

  const isConnected = isGmailConnected || isCalConnected;

  return (
    <Card className="overflow-hidden border-border/50 bg-card">
      <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-blue-500/20 via-red-500/20 to-yellow-500/20 flex items-center justify-center">
              <img src="/google-brandmark.png" alt="Google" className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-sm sm:text-base font-semibold">Google Workspace</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {isConnected && (
              <>
                <span className="text-xs text-muted-foreground hidden md:inline">
                  {getSyncStatusText()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 touch-target"
                  onClick={handleRefresh}
                  disabled={isSyncing}
                >
                  <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isSyncing && "animate-spin")} />
                </Button>
              </>
            )}
            <Link 
              to="/portal/settings/google-services" 
              className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors touch-target"
              title="Google Services Settings"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-4 px-4 sm:px-5">
        <ScrollArea className="max-h-[380px] sm:max-h-[420px]">
          {/* Gmail Section */}
          <GmailSection 
            messages={messages}
            unreadCount={unreadCount}
            isConnected={isGmailConnected}
            isLoading={gmailConnectionLoading || (isGmailConnected && messagesLoading)}
          />
          
          {/* Divider */}
          <div className="h-px bg-border my-3 sm:my-4" />
          
          {/* Calendar Section */}
          <CalendarSection 
            events={todaysEvents}
            isConnected={isCalConnected}
            isLoading={calConnectionLoading || (isCalConnected && eventsLoading)}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Gmail Section Component
interface GmailSectionProps {
  messages: any[];
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
}

const GmailSection = ({ messages, unreadCount, isConnected, isLoading }: GmailSectionProps) => {
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: modifyMessage } = useModifyMessage();

  const handleStar = (messageId: string, isStarred: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isStarred) {
      modifyMessage({ messageId, removeLabelIds: ["STARRED"] });
    } else {
      modifyMessage({ messageId, addLabelIds: ["STARRED"] });
    }
  };

  // Section Header
  const SectionHeader = () => (
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
        <span className="text-xs sm:text-sm font-semibold">Gmail</span>
        {unreadCount > 0 && (
          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
            {unreadCount}
          </span>
        )}
      </div>
      {isConnected && (
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors touch-target"
        >
          <span className="hidden sm:inline">View all</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );

  // Not connected state
  if (!isConnected && !isLoading) {
    return (
      <div>
        <SectionHeader />
        <div className="flex flex-col items-center justify-center py-6 bg-red-500/5 rounded-xl border border-red-500/10">
          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
            <Mail className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm text-muted-foreground text-center mb-3">
            Connect Gmail to see your inbox
          </p>
          <Button 
            size="sm" 
            onClick={() => connectGmail()} 
            disabled={isConnecting}
            className="bg-red-500 hover:bg-red-600 text-white h-9 text-sm px-4"
          >
            {isConnecting ? "Connecting..." : "Connect Gmail"}
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <SectionHeader />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 p-3 bg-muted/30 rounded-xl">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div>
        <SectionHeader />
        <div className="flex flex-col items-center justify-center py-6 bg-muted/20 rounded-xl">
          <Inbox className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No new emails</p>
        </div>
      </div>
    );
  }

  // Messages list
  return (
    <div>
      <SectionHeader />
      <div className="space-y-1.5 sm:space-y-2">
        {messages.map((message) => (
          <a
            key={message.id}
            href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "relative flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all group touch-target",
              "hover:bg-muted/50 border border-transparent hover:border-border/50",
              message.isUnread && "bg-red-500/5 border-red-500/10"
            )}
          >
            {/* Unread indicator */}
            {message.isUnread && (
              <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-500" />
            )}
            
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-semibold",
              message.isUnread 
                ? "bg-red-500/20 text-red-400" 
                : "bg-muted text-muted-foreground"
            )}>
              {message.from.name?.charAt(0).toUpperCase() || "?"}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={cn(
                  "text-xs sm:text-sm truncate",
                  message.isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                )}>
                  {message.from.name || message.from.email}
                </span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatRelativeTime(new Date(message.date))}
                </span>
              </div>
              <p className={cn(
                "text-xs sm:text-sm truncate mt-0.5",
                message.isUnread ? "text-foreground/80" : "text-muted-foreground"
              )}>
                {message.subject || "(No subject)"}
              </p>
            </div>
            
            {/* Actions - Desktop only */}
            <div className="hidden sm:flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => handleStar(message.id, message.isStarred, e)} 
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                title={message.isStarred ? "Unstar" : "Star"}
              >
                <Star className={cn(
                  "h-4 w-4 transition-colors",
                  message.isStarred ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-400"
                )} />
              </button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// Calendar Section Component
interface CalendarSectionProps {
  events: any[];
  isConnected: boolean;
  isLoading: boolean;
}

const CalendarSection = ({ events, isConnected, isLoading }: CalendarSectionProps) => {
  const { mutate: connectGoogle, isPending: isConnecting } = useConnectGoogleCalendar();
  const today = new Date();

  // Get meeting type icon
  const getMeetingIcon = (event: any) => {
    if (event.hangoutLink || event.location?.toLowerCase().includes('zoom') || event.location?.toLowerCase().includes('meet')) {
      return <Video className="h-3.5 w-3.5 text-blue-400" />;
    }
    if (event.location?.toLowerCase().includes('call') || event.location?.toLowerCase().includes('phone')) {
      return <Phone className="h-3.5 w-3.5 text-green-400" />;
    }
    if (event.location) {
      return <MapPin className="h-3.5 w-3.5 text-orange-400" />;
    }
    return null;
  };

  // Get event color
  const getEventColor = (event: any) => {
    const colorId = event.colorId;
    const colorMap: Record<string, string> = {
      '1': 'bg-blue-500',
      '2': 'bg-green-500',
      '3': 'bg-purple-500',
      '4': 'bg-red-500',
      '5': 'bg-yellow-500',
      '6': 'bg-orange-500',
      '7': 'bg-cyan-500',
      '8': 'bg-gray-500',
      '9': 'bg-blue-600',
      '10': 'bg-green-600',
      '11': 'bg-red-600',
    };
    return colorMap[colorId] || 'bg-blue-500';
  };

  // Section Header
  const SectionHeader = () => (
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
        <span className="text-xs sm:text-sm font-semibold">Today</span>
        {events.length > 0 && (
          <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
            {events.length}
          </span>
        )}
      </div>
      {isConnected && (
        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors touch-target"
        >
          <span className="hidden sm:inline">View all</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );

  // Not connected state
  if (!isConnected && !isLoading) {
    return (
      <div>
        <SectionHeader />
        <div className="flex flex-col items-center justify-center py-6 bg-blue-500/5 rounded-xl border border-blue-500/10">
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-sm text-muted-foreground text-center mb-3">
            Connect Calendar to see events
          </p>
          <Button 
            size="sm" 
            onClick={() => connectGoogle()} 
            disabled={isConnecting}
            className="bg-blue-500 hover:bg-blue-600 text-white h-9 text-sm px-4"
          >
            {isConnecting ? "Connecting..." : "Connect Calendar"}
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <SectionHeader />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <div>
        <SectionHeader />
        <div className="flex flex-col items-center justify-center py-6 bg-muted/20 rounded-xl">
          <Clock className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No events today</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {format(today, "EEEE, MMMM d")}
          </p>
        </div>
      </div>
    );
  }

  // Events list
  return (
    <div>
      <SectionHeader />
      <div className="space-y-1.5 sm:space-y-2">
        {events.map((event) => {
          const eventUrl = event.htmlLink || `https://calendar.google.com/calendar/u/0/r/eventedit/${event.id}`;
          const startTime = new Date(event.start_time);
          const endTime = event.end_time ? new Date(event.end_time) : null;
          const isPast = startTime < new Date() && (!endTime || endTime < new Date());
          
          return (
            <a
              key={event.id}
              href={eventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block p-2.5 sm:p-3 rounded-xl border transition-all hover:shadow-sm touch-target",
                isPast 
                  ? "bg-muted/30 border-border/30 opacity-60" 
                  : "bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10"
              )}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                {/* Color bar */}
                <div className={cn("w-0.5 sm:w-1 h-full min-h-[2rem] sm:min-h-[2.5rem] rounded-full flex-shrink-0", getEventColor(event))} />
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-xs sm:text-sm font-medium truncate",
                    isPast ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {event.title}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1 flex-wrap">
                    <span className={cn(
                      "text-xs font-medium",
                      isPast ? "text-muted-foreground" : "text-blue-400"
                    )}>
                      {event.all_day 
                        ? "All day" 
                        : endTime 
                          ? `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`
                          : format(startTime, "h:mm a")
                      }
                    </span>
                    {event.location && (
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[140px]">
                        {getMeetingIcon(event)}
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    {!event.location && event.hangoutLink && (
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-400">
                        <Video className="h-3.5 w-3.5" />
                        <span>Meet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

// Helper function for relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24 && isToday(date)) return format(date, 'h:mm a');
  if (diffDays < 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;
  return format(date, 'MMM d');
}
