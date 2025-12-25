import { format, isToday, isYesterday, parseISO, isThisWeek, isThisYear } from "date-fns";
import { Star, Paperclip, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { GmailMessage } from "@/hooks/useGmail";

interface MailInboxProps {
  messages: GmailMessage[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function formatEmailDate(dateStr: string): string {
  try {
    const date = parseISO(new Date(dateStr).toISOString());
    if (isToday(date)) {
      return format(date, "h:mm a");
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    if (isThisWeek(date)) {
      return format(date, "EEE");
    }
    if (isThisYear(date)) {
      return format(date, "MMM d");
    }
    return format(date, "MM/dd/yy");
  } catch {
    return "";
  }
}

// Group messages by date category
function groupMessagesByDate(messages: GmailMessage[]) {
  const groups: { label: string; messages: GmailMessage[] }[] = [];
  const today: GmailMessage[] = [];
  const yesterday: GmailMessage[] = [];
  const thisWeek: GmailMessage[] = [];
  const older: GmailMessage[] = [];

  messages.forEach((message) => {
    try {
      const date = new Date(message.date);
      if (isToday(date)) {
        today.push(message);
      } else if (isYesterday(date)) {
        yesterday.push(message);
      } else if (isThisWeek(date)) {
        thisWeek.push(message);
      } else {
        older.push(message);
      }
    } catch {
      older.push(message);
    }
  });

  if (today.length > 0) groups.push({ label: "Today", messages: today });
  if (yesterday.length > 0) groups.push({ label: "Yesterday", messages: yesterday });
  if (thisWeek.length > 0) groups.push({ label: "This Week", messages: thisWeek });
  if (older.length > 0) groups.push({ label: "Earlier", messages: older });

  return groups;
}

export function MailInbox({ messages, isLoading, selectedId, onSelect }: MailInboxProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="divide-y divide-border/30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No emails found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Your inbox is empty</p>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y divide-border/20">
        {groupedMessages.map((group) => (
          <div key={group.label}>
            {/* Date Group Header */}
            <div className="px-4 py-2 bg-muted/20 sticky top-0 z-10">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.label}
              </span>
            </div>
            {/* Messages in Group */}
            {group.messages.map((message) => (
              <button
                key={message.id}
                onClick={() => onSelect(message.id)}
                className={cn(
                  "w-full text-left px-4 py-3 transition-all border-l-4 hover:shadow-sm",
                  selectedId === message.id
                    ? "bg-gmail-red/5 border-l-gmail-red"
                    : message.isUnread
                    ? "bg-background border-l-transparent hover:bg-muted/30"
                    : "border-l-transparent hover:bg-muted/20"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar/Checkbox Area */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gmail-red/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gmail-red">
                      {(message.from?.name || message.from?.email || "U")[0].toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className={cn(
                          "text-sm truncate flex-1",
                          message.isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                        )}
                      >
                        {message.from?.name || message.from?.email || "Unknown"}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {message.isStarred && (
                          <Star className="h-4 w-4 text-gmail-yellow fill-gmail-yellow" />
                        )}
                        {message.hasAttachments && (
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className={cn(
                          "text-xs",
                          message.isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                          {formatEmailDate(message.date)}
                        </span>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-sm truncate",
                        message.isUnread ? "font-medium text-foreground" : "text-foreground/80"
                      )}
                    >
                      {message.subject || "(No subject)"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {message.snippet}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
