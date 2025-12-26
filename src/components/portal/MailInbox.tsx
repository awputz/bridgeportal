import { useState, useMemo, useCallback, useEffect } from "react";
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import { Star, Paperclip, Mail, Archive, Trash2, MailOpen, Clock, ChevronDown, ChevronUp, MoreHorizontal, CheckSquare, Square } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
    if (isToday(date)) return format(date, "h:mm a");
    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date)) return format(date, "EEE");
    if (isThisYear(date)) return format(date, "MMM d");
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
  return Array.from(threads.entries()).map(([, msgs]) => ({
    ...msgs[0],
    threadCount: msgs.length,
    threadMessages: msgs,
  }));
}

type ThreadedMessage = GmailMessage & { threadCount: number; threadMessages: GmailMessage[] };

export function MailInbox({ messages, isLoading, selectedId, onSelect }: MailInboxProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [snoozeMessageId, setSnoozeMessageId] = useState<string | null>(null);
  const [unreadOpen, setUnreadOpen] = useState(true);
  const [everythingElseOpen, setEverythingElseOpen] = useState(true);
  
  const modifyMessage = useModifyMessage();
  const trashMessage = useTrashMessage();

  const threadedMessages = useMemo(() => groupByThread(messages), [messages]);
  
  // Split into Unread and Everything Else
  const { unreadMessages, readMessages } = useMemo(() => {
    const unread: ThreadedMessage[] = [];
    const read: ThreadedMessage[] = [];
    threadedMessages.forEach((msg) => {
      if (msg.isUnread) {
        unread.push(msg);
      } else {
        read.push(msg);
      }
    });
    return { unreadMessages: unread, readMessages: read };
  }, [threadedMessages]);

  const isSelectionMode = selectedIds.size > 0;

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
          if (selectedId) toggleSelection(selectedId);
          break;
        case 'e':
          if (selectedIds.size > 0) handleBulkArchive();
          else if (selectedId) handleQuickArchive(selectedId);
          break;
        case '#':
          if (selectedIds.size > 0) handleBulkDelete();
          else if (selectedId) handleQuickDelete(selectedId);
          break;
        case 's':
          if (selectedId) handleQuickStar(selectedId);
          break;
        case 'Escape':
          setSelectedIds(new Set());
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedIds, threadedMessages, onSelect]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === threadedMessages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(threadedMessages.map(m => m.id)));
    }
  }, [threadedMessages, selectedIds.size]);

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
    console.log("Snoozing until", until);
  }, []);

  const handleBulkArchive = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await modifyMessage.mutateAsync({ messageId: id, removeLabelIds: ["INBOX"] });
    }
    toast.success(`Archived ${ids.length} email${ids.length !== 1 ? 's' : ''}`);
    setSelectedIds(new Set());
  }, [selectedIds, modifyMessage]);

  const handleBulkDelete = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await trashMessage.mutateAsync(id);
    }
    toast.success(`Deleted ${ids.length} email${ids.length !== 1 ? 's' : ''}`);
    setSelectedIds(new Set());
  }, [selectedIds, trashMessage]);

  const handleBulkMarkRead = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await modifyMessage.mutateAsync({ messageId: id, removeLabelIds: ["UNREAD"] });
    }
    toast.success(`Marked ${ids.length} as read`);
    setSelectedIds(new Set());
  }, [selectedIds, modifyMessage]);

  const handleBulkStar = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await modifyMessage.mutateAsync({ messageId: id, addLabelIds: ["STARRED"] });
    }
    toast.success(`Starred ${ids.length}`);
    setSelectedIds(new Set());
  }, [selectedIds, modifyMessage]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden p-4">
        <div className="space-y-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-4 w-14" />
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
          <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">No emails found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Your inbox is empty</p>
        </div>
      </div>
    );
  }

  const renderMessageRow = (message: ThreadedMessage) => {
    const isHovered = hoveredId === message.id;
    const isSelected = selectedIds.has(message.id);
    const isActive = selectedId === message.id;

    return (
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
            "w-full text-left px-4 py-3 flex items-center gap-3 transition-all text-sm group rounded-lg mx-2",
            "hover:shadow-sm",
            isActive ? "bg-gmail-red/10 shadow-sm" : isSelected ? "bg-gmail-red/5" : "hover:bg-muted/50",
            message.isUnread && "bg-card shadow-sm"
          )}
          style={{ width: 'calc(100% - 16px)' }}
        >
          {/* Checkbox */}
          <div
            className={cn(
              "shrink-0 transition-opacity",
              isHovered || isSelectionMode ? "opacity-100" : "opacity-0"
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelection(message.id);
            }}
          >
            <Checkbox
              checked={isSelected}
              className="h-5 w-5 data-[state=checked]:bg-gmail-red data-[state=checked]:border-gmail-red"
            />
          </div>

          {/* Star */}
          <button
            className="shrink-0 text-muted-foreground hover:text-gmail-yellow p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickStar(message.id);
            }}
          >
            <Star className={cn("h-5 w-5", message.isStarred && "text-gmail-yellow fill-gmail-yellow")} />
          </button>

          {/* Sender - fixed width */}
          <span className={cn(
            "w-40 truncate shrink-0",
            message.isUnread ? "font-semibold text-foreground" : "text-foreground/80"
          )}>
            {message.from?.name || message.from?.email || "Unknown"}
          </span>

          {/* Subject & Snippet */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className={cn(
              "truncate",
              message.isUnread ? "font-semibold text-foreground" : "text-foreground/80"
            )}>
              {message.subject || "(No subject)"}
            </span>
            {message.threadCount > 1 && (
              <span className="shrink-0 text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {message.threadCount}
              </span>
            )}
            <span className="text-muted-foreground truncate hidden lg:inline">
              — {message.snippet}
            </span>
          </div>

          {/* Right side: Actions on hover OR date */}
          <div className="shrink-0 flex items-center gap-1.5 ml-3">
            {isHovered && !isSelectionMode ? (
              <div className="flex items-center gap-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickArchive(message.id);
                      }}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Archive</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickDelete(message.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Delete</TooltipContent>
                </Tooltip>
                {message.isUnread && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickMarkRead(message.id);
                        }}
                      >
                        <MailOpen className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Mark read</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSnoozeMessageId(message.id);
                      }}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Snooze</TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <>
                {message.hasAttachments && (
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={cn(
                  "text-xs w-16 text-right",
                  message.isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                )}>
                  {formatEmailDate(message.date)}
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Gmail-style Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-muted/5 shrink-0">
          {/* Select Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 px-2 gap-1">
                {selectedIds.size === 0 ? (
                  <Square className="h-5 w-5" />
                ) : selectedIds.size === threadedMessages.length ? (
                  <CheckSquare className="h-5 w-5 text-gmail-red" />
                ) : (
                  <div className="h-5 w-5 border border-current rounded bg-gmail-red/30" />
                )}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={toggleSelectAll}>
                {selectedIds.size === threadedMessages.length ? "None" : "All"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedIds(new Set(unreadMessages.map(m => m.id)));
              }}>
                Unread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedIds(new Set(readMessages.map(m => m.id)));
              }}>
                Read
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedIds(new Set(threadedMessages.filter(m => m.isStarred).map(m => m.id)));
              }}>
                Starred
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border/50 mx-1" />

          {/* Archive */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={selectedIds.size === 0 || modifyMessage.isPending}
                onClick={handleBulkArchive}
              >
                <Archive className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>

          {/* Delete */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={selectedIds.size === 0 || trashMessage.isPending}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>

          {/* Mark Read */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={selectedIds.size === 0 || modifyMessage.isPending}
                onClick={handleBulkMarkRead}
              >
                <MailOpen className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as read</TooltipContent>
          </Tooltip>

          {/* Star */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={selectedIds.size === 0 || modifyMessage.isPending}
                onClick={handleBulkStar}
              >
                <Star className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Star</TooltipContent>
          </Tooltip>

          <div className="flex-1" />

          {/* Selection Count */}
          {selectedIds.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        {/* Email List */}
        <ScrollArea className="flex-1">
          <div className="py-2">
            {/* Unread Section */}
            {unreadMessages.length > 0 && (
              <Collapsible open={unreadOpen} onOpenChange={setUnreadOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground w-full">
                  {unreadOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Unread ({unreadMessages.length})
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-0.5">
                    {unreadMessages.map(renderMessageRow)}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Everything Else Section */}
            {readMessages.length > 0 && (
              <Collapsible open={everythingElseOpen} onOpenChange={setEverythingElseOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground w-full mt-2">
                  {everythingElseOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Everything else ({readMessages.length})
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-0.5">
                    {readMessages.map(renderMessageRow)}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </ScrollArea>

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