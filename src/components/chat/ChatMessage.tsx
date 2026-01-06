import { useState } from "react";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageReactions } from "./MessageReactions";
import type { ChatMessage as ChatMessageType } from "@/hooks/useDivisionChat";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
  reactions: { emoji: string; count: number; userIds: string[] }[];
  currentUserId?: string;
  onEdit: (messageId: string, text: string) => Promise<unknown>;
  onDelete: (messageId: string) => Promise<unknown>;
  onReact: (messageId: string, emoji: string) => void;
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  
  if (isToday(date)) {
    return format(date, "h:mm a");
  }
  
  if (isYesterday(date)) {
    return `Yesterday ${format(date, "h:mm a")}`;
  }
  
  return format(date, "MMM d, h:mm a");
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ChatMessage({
  message,
  isOwnMessage,
  reactions,
  currentUserId,
  onEdit,
  onDelete,
  onReact,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.message);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText.trim() === message.message) {
      setIsEditing(false);
      setEditText(message.message);
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit(message.id, editText);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(message.message);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this message?")) {
      await onDelete(message.id);
    }
  };

  return (
    <div
      className={cn(
        "group flex gap-3 px-3 py-2 hover:bg-muted/30 transition-colors rounded-lg",
        isOwnMessage && "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarImage src={message.sender_avatar || undefined} />
        <AvatarFallback className="text-xs bg-primary/10 text-primary">
          {getInitials(message.sender_name || "?")}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex-1 min-w-0", isOwnMessage && "text-right")}>
        <div className={cn("flex items-center gap-2 mb-0.5", isOwnMessage && "flex-row-reverse")}>
          <span className="font-medium text-sm">
            {message.sender_name}
            {isOwnMessage && <span className="text-muted-foreground ml-1">(you)</span>}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.created_at)}
          </span>
          {message.edited_at && (
            <span className="text-xs text-muted-foreground italic">(edited)</span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-[60px] text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isSubmitting || !editText.trim()}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className={cn("text-sm whitespace-pre-wrap break-words", isOwnMessage && "text-right")}>
            {message.message}
          </div>
        )}

        {/* Reactions */}
        {!isEditing && (
          <MessageReactions
            reactions={reactions}
            messageId={message.id}
            currentUserId={currentUserId}
            onReact={onReact}
            isOwnMessage={isOwnMessage}
          />
        )}
      </div>

      {/* Actions menu (only for own messages) */}
      {isOwnMessage && !isEditing && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
