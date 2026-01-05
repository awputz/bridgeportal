import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Calendar, 
  ExternalLink,
  Inbox,
  Clock,
  Star,
  Check,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, isSameDay } from "date-fns";
import { Link } from "react-router-dom";

// Gmail hooks
import { useGmailConnection, useGmailMessages, useConnectGmail, useModifyMessage } from "@/hooks/useGmail";

// Calendar hooks  
import { useGoogleCalendarConnection, useGoogleCalendarEvents, useConnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useUpcomingEvents } from "@/hooks/useCalendarEvents";

export const GoogleWorkspaceWidget = () => {
  // Get counts for tab badges
  const { data: gmailConnection } = useGmailConnection();
  const { data: messagesData } = useGmailMessages({
    labelIds: ["INBOX"],
    maxResults: 3,
    enabled: gmailConnection?.isConnected ?? false,
  });
  
  const { data: googleCalConnection } = useGoogleCalendarConnection();
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  const isCalConnected = googleCalConnection?.calendar_enabled && !!googleCalConnection?.access_token;
  const { data: googleEvents = [] } = useGoogleCalendarEvents(startOfDay, endOfDay);
  const { data: companyEvents = [] } = useUpcomingEvents(1);
  
  const unreadCount = messagesData?.messages?.filter(m => m.isUnread).length || 0;
  const todaysEvents = [...companyEvents, ...googleEvents]
    .filter(event => isSameDay(new Date(event.start_time), today));
  const eventCount = todaysEvents.length;

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500/20 via-red-500/20 to-yellow-500/20 flex items-center justify-center">
              <img src="/google-brandmark.png" alt="Google" className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Google Workspace</span>
          </div>
          <Link 
            to="/portal/settings/google-services" 
            className="p-1 rounded-md hover:bg-muted/50 transition-colors"
            title="Google Services Settings"
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-0">
        <Tabs defaultValue="gmail" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-muted/30 mb-2 h-8">
            <TabsTrigger 
              value="gmail" 
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Mail className="h-3.5 w-3.5 text-red-400" />
              <span>Gmail</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0 h-4 border-0">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>Calendar</span>
              {eventCount > 0 && (
                <Badge className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0 h-4 border-0">
                  {eventCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gmail" className="mt-0">
            <GmailSection />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            <CalendarSection />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Gmail Section
const GmailSection = () => {
  const { data: connection, isLoading: isLoadingConnection } = useGmailConnection();
  const { data: messagesData, isLoading: isLoadingMessages } = useGmailMessages({
    labelIds: ["INBOX"],
    maxResults: 3,
    enabled: connection?.isConnected ?? false,
  });
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: modifyMessage } = useModifyMessage();

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
  if (!connection?.isConnected && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-5 px-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-3">
          <Mail className="h-5 w-5 text-red-400" />
        </div>
        <p className="text-xs text-muted-foreground text-center mb-3">
          Connect Gmail to preview your inbox
        </p>
        <Button 
          size="sm" 
          onClick={() => connectGmail()} 
          disabled={isConnecting}
          className="bg-red-500 hover:bg-red-600 text-white h-7 text-xs"
        >
          {isConnecting ? "Connecting..." : "Connect Gmail"}
        </Button>
        <FooterLink href="https://mail.google.com" label="Open Gmail" />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="py-2">
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-2 p-2">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
        <FooterLink href="https://mail.google.com" label="Open Gmail" />
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-5">
        <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center mb-2">
          <Inbox className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">Your inbox is empty</p>
        <FooterLink href="https://mail.google.com" label="Open Gmail" />
      </div>
    );
  }

  // Messages list
  return (
    <div>
      <ScrollArea className="h-[130px]">
        <div className="space-y-1 pr-2">
          {messages.map((message) => (
            <a
              key={message.id}
              href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative flex items-start gap-2.5 p-2.5 rounded-lg transition-all group",
                "hover:bg-muted/50 border border-transparent hover:border-border/50",
                message.isUnread && "bg-red-500/5"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold",
                message.isUnread 
                  ? "bg-gradient-to-br from-red-500/30 to-orange-500/20 text-red-400" 
                  : "bg-muted text-muted-foreground"
              )}>
                {message.from.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn(
                    "text-xs truncate",
                    message.isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}>
                    {message.from.name || message.from.email}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(message.date), { addSuffix: false })}
                  </span>
                </div>
                <p className={cn(
                  "text-xs truncate mt-0.5",
                  message.isUnread ? "text-foreground" : "text-muted-foreground"
                )}>
                  {message.subject || "(No subject)"}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {message.isUnread && (
                  <button 
                    onClick={(e) => handleMarkRead(message.id, e)} 
                    className="p-1 hover:bg-muted rounded-md transition-colors" 
                    title="Mark as read"
                  >
                    <Check className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
                <button 
                  onClick={(e) => handleStar(message.id, message.isStarred, e)} 
                  className="p-1 hover:bg-muted rounded-md transition-colors"
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
      </ScrollArea>
      <FooterLink href="https://mail.google.com" label="Open Gmail" />
    </div>
  );
};

// Calendar Section
const CalendarSection = () => {
  const today = new Date();
  const { data: googleConnection, isLoading: isLoadingConnection } = useGoogleCalendarConnection();
  const { mutate: connectGoogle, isPending: isConnecting } = useConnectGoogleCalendar();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: googleEvents = [], isLoading: isLoadingEvents } = useGoogleCalendarEvents(startOfDay, endOfDay);
  const { data: companyEvents = [], isLoading: isLoadingCompany } = useUpcomingEvents(1);

  const isConnected = googleConnection?.calendar_enabled && !!googleConnection?.access_token;
  const isLoading = isLoadingConnection || isLoadingEvents || isLoadingCompany;

  const todaysEvents = [...companyEvents, ...googleEvents]
    .filter(event => isSameDay(new Date(event.start_time), today))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3);

  // Not connected state
  if (!isConnected && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-5 px-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-3">
          <Calendar className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-xs text-muted-foreground text-center mb-3">
          Connect Calendar to see today's events
        </p>
        <Button 
          size="sm" 
          onClick={() => connectGoogle()} 
          disabled={isConnecting}
          className="bg-blue-500 hover:bg-blue-600 text-white h-7 text-xs"
        >
          {isConnecting ? "Connecting..." : "Connect Calendar"}
        </Button>
        <FooterLink href="https://calendar.google.com" label="Open Calendar" />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="py-2">
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
        <FooterLink href="https://calendar.google.com" label="Open Calendar" />
      </div>
    );
  }

  // Empty state
  if (todaysEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-5">
        <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center mb-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">No events today</p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
          {format(today, "EEEE, MMMM d")}
        </p>
        <FooterLink href="https://calendar.google.com" label="Open Calendar" />
      </div>
    );
  }

  // Events list
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-1">
        {format(today, "EEEE, MMMM d")}
      </div>
      <div className="space-y-2">
        {todaysEvents.map((event) => (
          <div 
            key={event.id} 
            className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1 h-full min-h-[2rem] rounded-full bg-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {event.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-blue-400 font-medium">
                    {event.all_day ? "All day" : format(new Date(event.start_time), "h:mm a")}
                  </span>
                  {event.location && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {event.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <FooterLink href="https://calendar.google.com" label="Open Calendar" />
    </div>
  );
};

// Reusable footer link component
const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground py-2 mt-2 border-t border-border/30 hover:bg-muted/30 transition-colors rounded-b-lg -mx-1"
  >
    {label}
    <ExternalLink className="h-2.5 w-2.5" />
  </a>
);
