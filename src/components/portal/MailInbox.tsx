import { useState, useMemo, useCallback, useEffect } from "react";
import { format, isToday, isYesterday, parseISO, isThisWeek, isThisYear } from "date-fns";
import { Star, Paperclip, Mail, Archive, Trash2, MailOpen, Clock, MoreHorizontal, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { GmailMessage } from "@/hooks/useGmail";
import { useModifyMessage, useTrashMessage } from "@/hooks/useGmail";
import { toast } from "sonner";
import { MailSnoozeDialog } from "./MailSnoozeDialog";

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

// Group messages by threadId for conversation view
function groupByThread(messages: GmailMessage[]) {
  const threads = new Map<string, GmailMessage[]>();
  
  messages.forEach((message) => {
    const threadId = message.threadId;
    if (!threads.has(threadId)) {
      threads.set(threadId, []);
    }
    threads.get(threadId)!.push(message);
  });
  
  return Array.from(threads.entries()).map(([threadId, msgs]) => ({
    ...msgs[0],
    threadCount: msgs.length,
    threadMessages: msgs,
  }));
}

// Group messages by date category
function groupMessagesByDate(messages: (GmailMessage & { threadCount: number })[]) {
  const groups: { label: string; messages: (GmailMessage & { threadCount: number })[] }[] = [];
  const today: (GmailMessage & { threadCount: number })[] = [];
  const yesterday: (GmailMessage & { threadCount: number })[] = [];
  const thisWeek: (GmailMessage & { threadCount: number })[] = [];
  const older: (GmailMessage & { threadCount: number })[] = [];

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [snoozeMessageId, setSnoozeMessageId] = useState<string | null>(null);
  
  const modifyMessage = useModifyMessage();
  const trashMessage = useTrashMessage();

  const threadedMessages = useMemo(() => groupByThread(messages), [messages]);
  const groupedMessages = useMemo(() => groupMessagesByDate(threadedMessages), [threadedMessages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const currentIndex = threadedMessages.findIndex(m => m.id === selectedId);
      
      switch (e.key) {
        case 'j':
          if (currentIndex < threadedMessages.length - 1) {
            onSelect(threadedMessages[currentIndex + 1].id);
          }
          break;
        case 'k':
          if (currentIndex > 0) {
            onSelect(threadedMessages[currentIndex - 1].id);
          }
          break;
        case 'x':
          if (selectedId) {
            toggleSelection(selectedId);
          }
          break;
        case 'e':
          if (selectedIds.size > 0) {
            handleBulkArchive();
          } else if (selectedId) {
            handleQuickArchive(selectedId);
          }
          break;
        case '#':
          if (selectedIds.size > 0) {
            handleBulkDelete();
          } else if (selectedId) {
            handleQuickDelete(selectedId);
          }
          break;
        case 's':
          if (selectedId) {
            handleQuickStar(selectedId);
          }
          break;
        case 'Escape':
          setSelectedIds(new Set());
          setIsSelectionMode(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedIds, threadedMessages, onSelect]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setIsSelectionMode(newSet.size > 0);
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === threadedMessages.length) {
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } else {
      setSelectedIds(new Set(threadedMessages.map(m => m.id)));
      setIsSelectionMode(true);
    }
  }, [threadedMessages, selectedIds.size]);

  // Quick actions for single messages (hover actions)
  const handleQuickArchive = useCallback(async (id: string) => {
    await modifyMessage.mutateAsync({ messageId: id, removeLabelIds: ["INBOX"] });
    toast.success("Archived");
  }, [modifyMessage]);

  const handleQuickDelete = useCallback(async (id: string) => {
    await trashMessage.mutateAsync(id);
    toast.success("Moved to trash");
  }, [trashMessage]);

  const handleQuickStar = useCallback(async (id: string) => {
    const message = messages.find(m => m.id === id);
    if (message?.isStarred) {
      await modifyMessage.mutateAsync({ messageId: id, removeLabelIds: ["STARRED"] });
    } else {
      await modifyMessage.mutateAsync({ messageId: id, addLabelIds: ["STARRED"] });
    }
  }, [messages, modifyMessage]);

  const handleQuickMarkRead = useCallback(async (id: string) => {
    await modifyMessage.mutateAsync({ messageId: id, removeLabelIds: ["UNREAD"] });
    toast.success("Marked as read");
  }, [modifyMessage]);

  const handleSnooze = useCallback((until: Date) => {
    // In a real implementation, this would call an API to snooze the message
    // For now, we'll just show a toast
    console.log("Snoozing until", until);
  }, []);

  // Bulk actions
  const handleBulkArchive = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await modifyMessage.mutateAsync({ messageId: id, removeLabelIds: ["INBOX"] });
    }
    toast.success(`Archived ${ids.length} email${ids.length !== 1 ? 's' : ''}`);
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  }, [selectedIds, modifyMessage]);

  const handleBulkDelete = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await trashMessage.mutateAsync(id);
    }
    toast.success(`Deleted ${ids.length} email${ids.length !== 1 ? 's' : ''}`);
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  }, [selectedIds, trashMessage]);

  const handleBulkMarkRead = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await modifyMessage.mutateAsync({ messageId: id, removeLabelIds: ["UNREAD"] });
    }
    toast.success(`Marked ${ids.length} email${ids.length !== 1 ? 's' : ''} as read`);
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  }, [selectedIds, modifyMessage]);

  const handleBulkStar = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await modifyMessage.mutateAsync({ messageId: id, addLabelIds: ["STARRED"] });
    }
    toast.success(`Starred ${ids.length} email${ids.length !== 1 ? 's' : ''}`);
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  }, [selectedIds, modifyMessage]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="divide-y divide-border/30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 space-y-2 animate-pulse">
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

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Bulk Action Bar */}
        {isSelectionMode && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gmail-red/10 border-b border-gmail-red/20 animate-fade-in">
            <Checkbox
              checked={selectedIds.size === threadedMessages.length}
              onCheckedChange={toggleSelectAll}
              className="data-[state=checked]:bg-gmail-red data-[state=checked]:border-gmail-red"
            />
            <span className="text-sm font-medium text-gmail-red">
              {selectedIds.size} selected
            </span>
            <div className="flex-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkArchive}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  disabled={modifyMessage.isPending}
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkMarkRead}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  disabled={modifyMessage.isPending}
                >
                  <MailOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark as read</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkStar}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  disabled={modifyMessage.isPending}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Star</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  disabled={trashMessage.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Select All Header */}
        {!isSelectionMode && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-muted/10">
            <Checkbox
              checked={false}
              onCheckedChange={toggleSelectAll}
              className="opacity-50 hover:opacity-100 transition-opacity"
            />
            <span className="text-xs text-muted-foreground">
              Select all • {threadedMessages.length} conversation{threadedMessages.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

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
                  <div
                    key={message.id}
                    className="relative"
                    onMouseEnter={() => setHoveredId(message.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <button
                      onClick={(e) => {
                        if (e.shiftKey || isSelectionMode) {
                          toggleSelection(message.id);
                        } else {
                          onSelect(message.id);
                        }
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 transition-all border-l-4 group",
                        selectedId === message.id
                          ? "bg-gmail-red/5 border-l-gmail-red"
                          : message.isUnread
                          ? "bg-background border-l-transparent hover:bg-muted/30"
                          : "border-l-transparent hover:bg-muted/20",
                        selectedIds.has(message.id) && "bg-gmail-red/10"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div 
                          className={cn(
                            "flex-shrink-0 transition-opacity mt-0.5",
                            isSelectionMode || hoveredId === message.id ? "opacity-100" : "opacity-0"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelection(message.id);
                          }}
                        >
                          <Checkbox
                            checked={selectedIds.has(message.id)}
                            className="data-[state=checked]:bg-gmail-red data-[state=checked]:border-gmail-red"
                          />
                        </div>

                        {/* Avatar */}
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-gmail-red/20 to-gmail-orange/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gmail-red">
                            {(message.from?.name || message.from?.email || "U")[0].toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span
                                className={cn(
                                  "text-sm truncate",
                                  message.isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                                )}
                              >
                                {message.from?.name || message.from?.email || "Unknown"}
                              </span>
                              {message.threadCount > 1 && (
                                <span className="flex-shrink-0 text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded">
                                  {message.threadCount}
                                </span>
                              )}
                            </div>
                            
                            {/* Date or Hover Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              {hoveredId === message.id && !isSelectionMode ? (
                                // Hover action buttons
                                <div className="flex items-center gap-0.5 animate-fade-in">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuickArchive(message.id);
                                        }}
                                      >
                                        <Archive className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Archive</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuickDelete(message.id);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete</TooltipContent>
                                  </Tooltip>
                                  {message.isUnread && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuickMarkRead(message.id);
                                          }}
                                        >
                                          <MailOpen className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Mark as read</TooltipContent>
                                    </Tooltip>
                                  )}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSnoozeMessageId(message.id);
                                        }}
                                      >
                                        <Clock className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Snooze</TooltipContent>
                                  </Tooltip>
                                </div>
                              ) : (
                                // Default: show star, attachment, date
                                <>
                                  {message.isStarred && (
                                    <Star className="h-4 w-4 text-gmail-yellow fill-gmail-yellow" />
                                  )}
                                  {message.hasAttachments && (
                                    <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                  <span className={cn(
                                    "text-xs ml-1",
                                    message.isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                                  )}>
                                    {formatEmailDate(message.date)}
                                  </span>
                                </>
                              )}
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
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Keyboard Shortcuts Hint */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 border-t border-border/30 text-xs text-muted-foreground bg-muted/5">
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">j</kbd> / <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">k</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">x</kbd> select</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">e</kbd> archive</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">s</kbd> star</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">#</kbd> delete</span>
        </div>

        {/* Snooze Dialog */}
        <MailSnoozeDialog
          open={!!snoozeMessageId}
          onOpenChange={(open) => !open && setSnoozeMessageId(null)}
          messageId={snoozeMessageId || ""}
          onSnooze={handleSnooze}
        />
      </div>
    </TooltipProvider>
  );
}
