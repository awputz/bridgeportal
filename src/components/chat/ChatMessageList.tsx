import { useEffect, useRef } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { Loader2, MessageCircle } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/hooks/useDivisionChat";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  currentUserId?: string;
  getReactionsForMessage: (messageId: string) => { emoji: string; count: number; userIds: string[] }[];
  onEditMessage: (messageId: string, text: string) => Promise<unknown>;
  onDeleteMessage: (messageId: string) => Promise<unknown>;
  onReact: (messageId: string, emoji: string) => void;
}

function formatDateSeparator(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d, yyyy");
}

export function ChatMessageList({
  messages,
  isLoading,
  currentUserId,
  getReactionsForMessage,
  onEditMessage,
  onDeleteMessage,
  onReact,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-1">No messages yet</h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Be the first to start the conversation with your team!
        </p>
      </div>
    );
  }

  // Group messages by date
  const messagesWithSeparators: Array<{ type: "separator"; date: Date } | { type: "message"; message: ChatMessageType }> = [];
  let lastDate: Date | null = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.created_at);
    
    if (!lastDate || !isSameDay(lastDate, messageDate)) {
      messagesWithSeparators.push({ type: "separator", date: messageDate });
      lastDate = messageDate;
    }
    
    messagesWithSeparators.push({ type: "message", message });
  });

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="py-4 space-y-1">
        {messagesWithSeparators.map((item, index) => {
          if (item.type === "separator") {
            return (
              <div key={`sep-${index}`} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground font-medium">
                  {formatDateSeparator(item.date)}
                </span>
                <div className="flex-1 h-px bg-border/50" />
              </div>
            );
          }

          const message = item.message;
          return (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.user_id === currentUserId}
              reactions={getReactionsForMessage(message.id)}
              currentUserId={currentUserId}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
              onReact={onReact}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
