import { format, isToday, isYesterday, parseISO } from "date-fns";
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
    return format(date, "MMM d");
  } catch {
    return "";
  }
}

export function MailInbox({ messages, isLoading, selectedId, onSelect }: MailInboxProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="p-2 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-3 border rounded-lg space-y-2">
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
          <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No emails found</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {messages.map((message) => (
          <button
            key={message.id}
            onClick={() => onSelect(message.id)}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-all",
              selectedId === message.id
                ? "bg-primary/5 border-primary/20"
                : "hover:bg-muted/50 border-transparent",
              message.isUnread && "bg-primary/5"
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span
                className={cn(
                  "text-sm truncate flex-1",
                  message.isUnread ? "font-semibold" : "font-medium"
                )}
              >
                {message.from?.name || message.from?.email || "Unknown"}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {message.isStarred && (
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                )}
                {message.hasAttachments && (
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">
                  {formatEmailDate(message.date)}
                </span>
              </div>
            </div>
            <p
              className={cn(
                "text-sm truncate mb-1",
                message.isUnread ? "font-medium" : "text-foreground"
              )}
            >
              {message.subject || "(No subject)"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {message.snippet}
            </p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
