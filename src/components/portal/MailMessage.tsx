import { format } from "date-fns";
import { ArrowLeft, Reply, Forward, Trash2, Star, MoreHorizontal, Paperclip, Link2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGmailMessage, useModifyMessage, useTrashMessage } from "@/hooks/useGmail";
import { cn } from "@/lib/utils";

interface MailMessageProps {
  messageId: string | null;
  onBack: () => void;
  onReply: () => void;
}

export function MailMessage({ messageId, onBack, onReply }: MailMessageProps) {
  const { data: message, isLoading, error } = useGmailMessage(messageId);
  const modifyMessage = useModifyMessage();
  const trashMessage = useTrashMessage();

  const handleToggleStar = () => {
    if (!messageId) return;
    
    if (message?.isStarred) {
      modifyMessage.mutate({ messageId, removeLabelIds: ["STARRED"] });
    } else {
      modifyMessage.mutate({ messageId, addLabelIds: ["STARRED"] });
    }
  };

  const handleMarkAsRead = () => {
    if (!messageId) return;
    modifyMessage.mutate({ messageId, removeLabelIds: ["UNREAD"] });
  };

  const handleDelete = () => {
    if (!messageId) return;
    trashMessage.mutate(messageId, {
      onSuccess: () => onBack(),
    });
  };

  if (!messageId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p>Select an email to read</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p>Failed to load email</p>
          <Button variant="outline" className="mt-4" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Mark as read when viewing
  if (message.isUnread) {
    handleMarkAsRead();
  }

  const senderInitials = message.from.name
    ? message.from.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : message.from.email[0].toUpperCase();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-medium truncate">{message.subject || "(No subject)"}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleToggleStar}>
            <Star
              className={cn(
                "h-4 w-4",
                message.isStarred && "text-yellow-500 fill-yellow-500"
              )}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link2 className="h-4 w-4 mr-2" />
                Link to Deal
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link2 className="h-4 w-4 mr-2" />
                Link to Contact
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Gmail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Message Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Sender Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {senderInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{message.from.name || message.from.email}</p>
                <p className="text-sm text-muted-foreground">{message.from.email}</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {format(new Date(message.date), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          {/* Recipients */}
          <div className="text-sm text-muted-foreground">
            <p>To: {message.to}</p>
            {message.cc && <p>Cc: {message.cc}</p>}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {message.attachments.map((attachment) => (
                <Badge key={attachment.id} variant="secondary" className="gap-1">
                  <Paperclip className="h-3 w-3" />
                  {attachment.filename}
                  <span className="text-muted-foreground">
                    ({Math.round(attachment.size / 1024)}KB)
                  </span>
                </Badge>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="pt-4 border-t">
            {message.bodyHtml ? (
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
              />
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {message.bodyText || message.snippet}
              </pre>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t flex gap-2">
        <Button onClick={onReply} className="flex-1 md:flex-none">
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </Button>
        <Button variant="outline" className="flex-1 md:flex-none">
          <Forward className="h-4 w-4 mr-2" />
          Forward
        </Button>
      </div>
    </div>
  );
}
