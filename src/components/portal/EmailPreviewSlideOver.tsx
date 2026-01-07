import { useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Reply,
  Star,
  Archive,
  Trash2,
  Link2,
  Paperclip,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGmailMessage, useModifyMessage, useTrashMessage } from "@/hooks/useGmail";
import { toast } from "sonner";
import { formatSafeDate } from "@/lib/dateUtils";

// Decode HTML entities (e.g., &#39; → ')
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Sanitize email HTML for dark mode and encoding issues
function sanitizeEmailHtml(html: string): string {
  if (!html) return '';
  
  // Decode HTML entities first
  let sanitized = decodeHtmlEntities(html);
  
  // Fix common UTF-8 encoding issues (fallback for cached/old emails)
  sanitized = sanitized
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
    .replace(/Â /g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  
  // Force dark mode friendly colors - replace light colors with foreground
  sanitized = sanitized
    .replace(/color:\s*#fff(fff)?/gi, 'color: hsl(var(--foreground))')
    .replace(/color:\s*#f{3,6}/gi, 'color: hsl(var(--foreground))')
    .replace(/color:\s*white/gi, 'color: hsl(var(--foreground))')
    .replace(/color:\s*#[a-f0-9]{6}/gi, (match) => {
      const hex = match.match(/#([a-f0-9]{6})/i)?.[1];
      if (hex) {
        const rgb = parseInt(hex, 16);
        const r = (rgb >> 16) & 255;
        const g = (rgb >> 8) & 255;
        const b = rgb & 255;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness > 200) {
          return 'color: hsl(var(--foreground))';
        }
      }
      return match;
    });
  
  // Fix invisible white backgrounds
  sanitized = sanitized
    .replace(/background-color:\s*#fff(fff)?/gi, 'background-color: transparent')
    .replace(/background-color:\s*white/gi, 'background-color: transparent');
  
  // Remove restrictive width constraints
  sanitized = sanitized.replace(/max-width:\s*\d+px/gi, 'max-width: 100%');
  
  return sanitized;
}

// Sanitize plain text for encoding issues
function sanitizeEmailText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
    .replace(/Â /g, ' ');
}

interface EmailPreviewSlideOverProps {
  emailId: string | null;
  onClose: () => void;
  onLinkToRecord?: (emailId: string, threadId: string, subject: string, from: string) => void;
}

export function EmailPreviewSlideOver({
  emailId,
  onClose,
  onLinkToRecord,
}: EmailPreviewSlideOverProps) {
  const { data: email, isLoading } = useGmailMessage(emailId);
  const { mutate: modifyMessage } = useModifyMessage();
  const { mutate: trashMessage } = useTrashMessage();

  // Mark as read when opened
  useEffect(() => {
    if (email?.isUnread && emailId) {
      modifyMessage({ messageId: emailId, removeLabelIds: ["UNREAD"] });
    }
  }, [email?.isUnread, emailId, modifyMessage]);

  const handleStar = useCallback(() => {
    if (!emailId) return;
    if (email?.isStarred) {
      modifyMessage({ messageId: emailId, removeLabelIds: ["STARRED"] });
    } else {
      modifyMessage({ messageId: emailId, addLabelIds: ["STARRED"] });
    }
  }, [emailId, email?.isStarred, modifyMessage]);

  const handleArchive = useCallback(() => {
    if (!emailId) return;
    modifyMessage(
      { messageId: emailId, removeLabelIds: ["INBOX"] },
      { onSuccess: () => {
        toast.success("Email archived");
        onClose();
      }}
    );
  }, [emailId, modifyMessage, onClose]);

  const handleDelete = useCallback(() => {
    if (!emailId) return;
    trashMessage(emailId, {
      onSuccess: () => {
        toast.success("Email moved to trash");
        onClose();
      },
    });
  }, [emailId, trashMessage, onClose]);

  const handleLinkToRecord = useCallback(() => {
    if (!emailId || !email) return;
    onLinkToRecord?.(
      emailId,
      email.threadId || emailId,
      email.subject || "",
      email.from?.email || ""
    );
  }, [emailId, email, onLinkToRecord]);

  const handleReply = useCallback(() => {
    if (!emailId) return;
    window.open(`https://mail.google.com/mail/u/0/#inbox/${emailId}`, "_blank");
  }, [emailId]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!emailId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "r":
          if (!e.metaKey && !e.ctrlKey) handleReply();
          break;
        case "s":
          if (!e.metaKey && !e.ctrlKey) handleStar();
          break;
        case "e":
          handleArchive();
          break;
        case "#":
          handleDelete();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emailId, onClose, handleReply, handleStar, handleArchive, handleDelete]);

  // No longer need createMarkup - using sanitizeEmailHtml directly

  return (
    <Sheet open={!!emailId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-4xl p-0 flex flex-col border-l-border/30"
      >
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b shrink-0">
          <SheetTitle className="text-base font-semibold truncate pr-8">
            {isLoading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              decodeHtmlEntities(email?.subject || "(No subject)")
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Actions Bar */}
        <div className="px-4 py-2 border-b flex items-center gap-1 shrink-0 bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleReply}
          >
            <Reply className="h-3.5 w-3.5" />
            Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleStar}
          >
            <Star
              className={cn(
                "h-3.5 w-3.5",
                email?.isStarred && "fill-amber-400 text-amber-400"
              )}
            />
            {email?.isStarred ? "Unstar" : "Star"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleArchive}
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
          {onLinkToRecord && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={handleLinkToRecord}
            >
              <Link2 className="h-3.5 w-3.5" />
              Link
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${emailId}`, '_blank')}
            title="Open in Gmail"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Gmail
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>

        {/* Email Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ) : email ? (
              <>
                {/* Email metadata */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">From:</span>
                    <span className="text-sm text-muted-foreground">
                      {email.from?.name || email.from?.email || 'Unknown sender'}
                      {email.from?.name && email.from?.email && (
                        <span className="text-xs ml-1">{"<"}{email.from.email}{">"}</span>
                      )}
                    </span>
                  </div>
                  {email.to && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">To:</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {email.to}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm text-muted-foreground">
                      {formatSafeDate(email.internalDate || email.date)}
                    </span>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Email body */}
                {email.bodyHtml ? (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert prose-a:text-primary prose-img:max-w-full email-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(email.bodyHtml) }}
                  />
                ) : email.bodyText ? (
                  <pre className="text-sm whitespace-pre-wrap font-sans text-foreground">
                    {sanitizeEmailText(email.bodyText)}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No content available
                  </p>
                )}

                {/* Attachments */}
                {email.attachments && email.attachments.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Attachments ({email.attachments.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {email.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                        >
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate flex-1">
                            {attachment.filename}
                          </span>
                          {attachment.size && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {formatFileSize(attachment.size)}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Open in Gmail link */}
                <div className="mt-6 pt-4 border-t">
                  <a
                    href={`https://mail.google.com/mail/u/0/#inbox/${emailId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    Open in Gmail
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Email not found</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
