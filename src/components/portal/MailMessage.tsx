import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ArrowLeft, Reply, Forward, Trash2, Star, MoreHorizontal, Paperclip, Link2, ExternalLink, Archive, ChevronDown, ChevronUp, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useGmailMessage, useModifyMessage, useTrashMessage } from "@/hooks/useGmail";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MailMessageProps {
  messageId: string | null;
  onBack: () => void;
  onReply: (to: string, subject: string, threadId?: string, messageId?: string) => void;
}

export function MailMessage({ messageId, onBack, onReply }: MailMessageProps) {
  const { data: message, isLoading, error } = useGmailMessage(messageId);
  const modifyMessage = useModifyMessage();
  const trashMessage = useTrashMessage();
  const [showFullHeaders, setShowFullHeaders] = useState(false);

  const handleToggleStar = () => {
    if (!messageId) return;
    
    if (message?.isStarred) {
      modifyMessage.mutate({ messageId, removeLabelIds: ["STARRED"] });
    } else {
      modifyMessage.mutate({ messageId, addLabelIds: ["STARRED"] });
    }
  };

  const handleArchive = () => {
    if (!messageId) return;
    modifyMessage.mutate({ messageId, removeLabelIds: ["INBOX"] }, {
      onSuccess: () => {
        toast.success("Email archived");
        onBack();
      }
    });
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

  const handleReply = () => {
    if (!message) return;
    onReply(
      message.from.email,
      message.subject,
      message.threadId,
      message.id
    );
  };

  const handleForward = () => {
    if (!message) return;
    onReply(
      "",
      `Fwd: ${message.subject}`,
      undefined,
      undefined
    );
  };

  // Mark as read when viewing
  useEffect(() => {
    if (message?.isUnread) {
      handleMarkAsRead();
    }
  }, [message?.id, message?.isUnread]);

  if (!messageId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
            <MailOpen className="h-12 w-12 text-muted-foreground/30" />
          </div>
          <p className="text-xl font-medium text-muted-foreground mb-2">Select an email to read</p>
          <p className="text-sm text-muted-foreground/70">Choose a message from the list to view its contents</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-4">Failed to load email</p>
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
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
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header with Actions */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border/30 bg-card shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-medium truncate text-xl">{message.subject || "(No subject)"}</h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleArchive}
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
            disabled={modifyMessage.isPending}
          >
            <Archive className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggleStar}
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
          >
            <Star
              className={cn(
                "h-5 w-5",
                message.isStarred && "text-gmail-yellow fill-gmail-yellow"
              )}
            />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="h-10 w-10 text-muted-foreground hover:text-destructive"
            disabled={trashMessage.isPending}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("Feature coming soon")}>
                <Link2 className="h-4 w-4 mr-2" />
                Link to Deal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Feature coming soon")}>
                <Link2 className="h-4 w-4 mr-2" />
                Link to Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${message.id}`, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Gmail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Message Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
          {/* Sender Info with Expandable Headers */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarFallback className="bg-gmail-red/10 text-gmail-red text-xl font-semibold">
                    {senderInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-xl">{message.from.name || message.from.email}</p>
                    {message.from.name && (
                      <span className="text-sm text-muted-foreground">&lt;{message.from.email}&gt;</span>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowFullHeaders(!showFullHeaders)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-1"
                  >
                    <span>to {message.to?.split(',')[0] || 'me'}</span>
                    {showFullHeaders ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(message.date), "MMM d, yyyy")}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(message.date), "h:mm a")}
                </p>
              </div>
            </div>

            {/* Expanded Headers */}
            {showFullHeaders && (
              <div className="ml-[72px] p-4 rounded-xl bg-muted/30 text-sm space-y-1.5">
                <p><span className="text-muted-foreground">From:</span> {message.from.name} &lt;{message.from.email}&gt;</p>
                <p><span className="text-muted-foreground">To:</span> {message.to}</p>
                {message.cc && <p><span className="text-muted-foreground">Cc:</span> {message.cc}</p>}
                <p><span className="text-muted-foreground">Date:</span> {format(new Date(message.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}</p>
                <p><span className="text-muted-foreground">Subject:</span> {message.subject || "(No subject)"}</p>
              </div>
            )}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-3 p-5 rounded-xl bg-muted/20 border border-border/30">
              <p className="w-full text-sm font-medium text-muted-foreground mb-1">
                {message.attachments.length} Attachment{message.attachments.length !== 1 ? 's' : ''}
              </p>
              {message.attachments.map((attachment) => (
                <Badge 
                  key={attachment.id} 
                  variant="secondary" 
                  className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-muted/80 text-sm"
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="max-w-[200px] truncate">{attachment.filename}</span>
                  <span className="text-muted-foreground text-xs">
                    {attachment.size < 1024 * 1024 
                      ? `${Math.round(attachment.size / 1024)}KB`
                      : `${(attachment.size / (1024 * 1024)).toFixed(1)}MB`
                    }
                  </span>
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Body */}
          <div className="min-h-[300px] py-4">
            {message.bodyHtml ? (
              <div
                className="prose prose-base max-w-none dark:prose-invert 
                  prose-headings:font-medium prose-headings:text-foreground
                  prose-p:text-foreground/90 prose-p:leading-relaxed
                  prose-a:text-gmail-red prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-gmail-red/50 prose-blockquote:text-muted-foreground
                  prose-code:text-gmail-red prose-code:bg-muted/50 prose-code:px-1.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
              />
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90">
                {message.bodyText || message.snippet}
              </pre>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Actions Footer */}
      <div className="px-6 py-4 border-t border-border/30 bg-card shrink-0">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button onClick={handleReply} size="lg" className="gap-2 bg-gmail-red hover:bg-gmail-red/90 text-white">
            <Reply className="h-5 w-5" />
            Reply
          </Button>
          <Button variant="outline" size="lg" onClick={handleForward} className="gap-2">
            <Forward className="h-5 w-5" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}