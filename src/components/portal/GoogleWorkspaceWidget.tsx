import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Mail, 
  Calendar, 
  HardDrive, 
  ChevronDown,
  ExternalLink,
  Inbox,
  Clock,
  FileText,
  Star,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, isSameDay } from "date-fns";

// Gmail hooks
import { useGmailConnection, useGmailMessages, useConnectGmail, useModifyMessage } from "@/hooks/useGmail";

// Calendar hooks  
import { useGoogleCalendarConnection, useGoogleCalendarEvents, useConnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useUpcomingEvents } from "@/hooks/useCalendarEvents";

// Drive hooks
import { useDriveConnection, useDriveFiles, useConnectDrive } from "@/hooks/useGoogleDrive";

export const GoogleWorkspaceWidget = () => {
  const [mailOpen, setMailOpen] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [driveOpen, setDriveOpen] = useState(false);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2 text-lg">
          <img src="/brandmark-white.png" alt="Google" className="h-5 w-5" />
          Google Workspace
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-1 pt-0">
        {/* Gmail Section */}
        <GmailSection isOpen={mailOpen} onOpenChange={setMailOpen} />

        {/* Calendar Section */}
        <CalendarSection isOpen={calendarOpen} onOpenChange={setCalendarOpen} />

        {/* Drive Section */}
        <DriveSection isOpen={driveOpen} onOpenChange={setDriveOpen} />
      </CardContent>
    </Card>
  );
};

// Gmail Accordion Section
const GmailSection = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const { data: connection, isLoading: isLoadingConnection } = useGmailConnection();
  const { data: messagesData, isLoading: isLoadingMessages } = useGmailMessages({
    labelIds: ["INBOX"],
    maxResults: 4,
    enabled: connection?.isConnected ?? false,
  });
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: modifyMessage } = useModifyMessage();

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

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium">Gmail</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-2">
        {!connection?.isConnected && !isLoading ? (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground mb-2">Connect Gmail to preview emails</p>
            <Button size="sm" variant="outline" onClick={() => connectGmail()} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Gmail"}
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4">
            <Inbox className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Inbox is empty</p>
          </div>
        ) : (
          <ScrollArea className="h-[180px]">
            <div className="space-y-1 pr-2">
              {messages.map((message) => (
                <a
                  key={message.id}
                  href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "relative block p-2 rounded-md transition-colors group",
                    "hover:bg-muted/50",
                    message.isUnread && "bg-red-500/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-medium",
                      message.isUnread ? "bg-red-500/20 text-red-400" : "bg-muted text-muted-foreground"
                    )}>
                      {message.from.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className={cn("text-xs truncate", message.isUnread ? "font-medium" : "text-muted-foreground")}>
                          {message.from.name || message.from.email}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {formatDistanceToNow(new Date(message.date), { addSuffix: false })}
                        </span>
                      </div>
                      <p className={cn("text-xs truncate", message.isUnread ? "text-foreground" : "text-muted-foreground")}>
                        {message.subject || "(No subject)"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100">
                      {message.isUnread && (
                        <button onClick={(e) => handleMarkRead(message.id, e)} className="p-0.5 hover:bg-muted rounded" title="Mark read">
                          <Check className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                      <button onClick={(e) => handleStar(message.id, message.isStarred, e)} className="p-0.5 hover:bg-muted rounded">
                        <Star className={cn("h-3 w-3", message.isStarred ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </ScrollArea>
        )}

        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-2 mt-1 border-t border-border/30"
        >
          Open Gmail <ExternalLink className="h-3 w-3" />
        </a>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Calendar Accordion Section
const CalendarSection = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
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
    .slice(0, 4);

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">Calendar</span>
            {todaysEvents.length > 0 && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                {todaysEvents.length}
              </Badge>
            )}
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-2">
        {!isConnected && !isLoading ? (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground mb-2">Connect Calendar to see events</p>
            <Button size="sm" variant="outline" onClick={() => connectGoogle()} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Calendar"}
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : todaysEvents.length === 0 ? (
          <div className="text-center py-4">
            <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">No events today</p>
          </div>
        ) : (
          <div className="space-y-1">
            {todaysEvents.map((event) => (
              <div key={event.id} className="p-2 rounded-md bg-blue-500/10 border-l-2 border-blue-500">
                <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {event.all_day ? "All day" : format(new Date(event.start_time), "h:mm a")}
                  {event.location && ` • ${event.location}`}
                </p>
              </div>
            ))}
          </div>
        )}

        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-2 mt-1 border-t border-border/30"
        >
          Open Google Calendar <ExternalLink className="h-3 w-3" />
        </a>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Drive Accordion Section  
const DriveSection = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const { data: connection, isLoading: isLoadingConnection } = useDriveConnection();
  const { data: filesData, isLoading: isLoadingFiles } = useDriveFiles({ enabled: true });
  const { mutate: connectDrive, isPending: isConnecting } = useConnectDrive();

  const isConnected = connection?.isConnected;
  const isLoading = isLoadingConnection || (isConnected && isLoadingFiles);
  const files = filesData?.files?.slice(0, 4) || [];

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Drive</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-2">
        {!isConnected && !isLoading ? (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground mb-2">Connect Drive to see files</p>
            <Button size="sm" variant="outline" onClick={() => connectDrive()} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Drive"}
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-4">
            <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">No recent files</p>
          </div>
        ) : (
          <div className="space-y-1">
            {files.map((file) => (
              <a
                key={file.id}
                href={file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-foreground truncate">{file.name}</span>
              </a>
            ))}
          </div>
        )}

        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-2 mt-1 border-t border-border/30"
        >
          Open Google Drive <ExternalLink className="h-3 w-3" />
        </a>
      </CollapsibleContent>
    </Collapsible>
  );
};
