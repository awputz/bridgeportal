import { memo, useCallback } from "react";
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import { Star, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GmailMessage } from "@/hooks/useGmail";

interface MobileEmailRowProps {
  message: GmailMessage & { threadCount?: number };
  isSelected: boolean;
  onSelect: () => void;
  onStar: () => void;
}

function formatEmailDate(dateStr: string): string {
  try {
    const date = parseISO(new Date(dateStr).toISOString());
    if (isToday(date)) return format(date, "h:mm a");
    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date)) return format(date, "EEE");
    if (isThisYear(date)) return format(date, "MMM d");
    return format(date, "MM/dd/yy");
  } catch {
    return "";
  }
}

export const MobileEmailRow = memo(function MobileEmailRow({ 
  message, 
  isSelected, 
  onSelect, 
  onStar 
}: MobileEmailRowProps) {
  const senderName = message.from?.name || message.from?.email?.split('@')[0] || "Unknown";
  
  const handleStarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onStar();
  }, [onStar]);
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors active:bg-muted/70",
        isSelected ? "bg-gmail-red/10" : message.isUnread ? "bg-card" : "bg-transparent",
        "border-b border-border/20"
      )}
    >
      {/* Unread indicator */}
      <div className="w-2 shrink-0 pt-2">
        {message.isUnread && (
          <div className="w-2 h-2 rounded-full bg-gcal-blue" />
        )}
      </div>

      {/* Main content - two line layout */}
      <div className="flex-1 min-w-0">
        {/* Top row: sender + date */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn(
            "truncate text-sm",
            message.isUnread ? "font-semibold text-foreground" : "text-foreground/80"
          )}>
            {senderName}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {message.hasAttachments && (
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className={cn(
              "text-xs",
              message.isUnread ? "font-medium text-foreground" : "text-muted-foreground"
            )}>
              {formatEmailDate(message.date)}
            </span>
          </div>
        </div>

        {/* Subject */}
        <div className={cn(
          "text-sm truncate",
          message.isUnread ? "font-medium text-foreground" : "text-foreground/70"
        )}>
          {message.subject || "(No subject)"}
          {(message.threadCount ?? 0) > 1 && (
            <span className="ml-1.5 text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              {message.threadCount}
            </span>
          )}
        </div>

        {/* Snippet */}
        <div className="text-xs text-muted-foreground truncate mt-0.5">
          {message.snippet}
        </div>
      </div>

      {/* Star button */}
      <button
        className="shrink-0 p-1 -mr-1 touch-manipulation"
        onClick={handleStarClick}
      >
        <Star className={cn(
          "h-5 w-5",
          message.isStarred ? "text-gmail-yellow fill-gmail-yellow" : "text-muted-foreground/50"
        )} />
      </button>
    </button>
  );
});
