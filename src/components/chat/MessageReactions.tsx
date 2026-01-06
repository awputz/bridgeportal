import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageReactionsProps {
  reactions: { emoji: string; count: number; userIds: string[] }[];
  messageId: string;
  currentUserId?: string;
  onReact: (messageId: string, emoji: string) => void;
  isOwnMessage?: boolean;
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "🎉", "😮", "😢", "🔥", "👏"];

export function MessageReactions({
  reactions,
  messageId,
  currentUserId,
  onReact,
  isOwnMessage,
}: MessageReactionsProps) {
  const hasReactions = reactions.length > 0;

  return (
    <div className={cn(
      "flex items-center gap-1 mt-1 flex-wrap",
      isOwnMessage && "justify-end"
    )}>
      {/* Existing reactions */}
      {reactions.map((reaction) => {
        const hasReacted = currentUserId && reaction.userIds.includes(currentUserId);
        return (
          <button
            key={reaction.emoji}
            onClick={() => onReact(messageId, reaction.emoji)}
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs",
              "border transition-colors",
              hasReacted
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted/50 border-border/50 hover:bg-muted"
            )}
          >
            <span>{reaction.emoji}</span>
            <span className="font-medium">{reaction.count}</span>
          </button>
        );
      })}

      {/* Add reaction button */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "inline-flex items-center justify-center h-6 w-6 rounded-full",
              "border border-dashed border-border/50",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              "transition-colors opacity-0 group-hover:opacity-100",
              hasReactions && "opacity-100"
            )}
          >
            <Smile className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align={isOwnMessage ? "end" : "start"}>
          <div className="flex gap-1">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReact(messageId, emoji)}
                className="p-1.5 hover:bg-muted rounded text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
