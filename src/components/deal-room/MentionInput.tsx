import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentsList } from "@/hooks/useDealRoom";
import { cn } from "@/lib/utils";

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onMentionsChange: (userIds: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MentionInput = ({
  value,
  onChange,
  onMentionsChange,
  placeholder = "Add a comment...",
  className,
  disabled = false,
}: MentionInputProps) => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionedUsers, setMentionedUsers] = useState<Map<string, string>>(new Map());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionStartRef = useRef<number>(-1);

  const { data: agents = [] } = useAgentsList();

  const filteredAgents = agents.filter((agent) =>
    agent.full_name?.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [mentionSearch]);

  useEffect(() => {
    onMentionsChange(Array.from(mentionedUsers.keys()));
  }, [mentionedUsers, onMentionsChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Check if we should show mention dropdown
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      // Only show if @ is at start or after a space, and no space after @
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : " ";
      if ((charBeforeAt === " " || charBeforeAt === "\n" || lastAtIndex === 0) && !textAfterAt.includes(" ")) {
        setShowMentions(true);
        setMentionSearch(textAfterAt);
        mentionStartRef.current = lastAtIndex;
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }

    onChange(newValue);
  };

  const insertMention = (agent: { id: string; full_name: string | null }) => {
    if (!textareaRef.current || mentionStartRef.current === -1) return;

    const cursorPos = textareaRef.current.selectionStart;
    const beforeMention = value.slice(0, mentionStartRef.current);
    const afterCursor = value.slice(cursorPos);
    const mentionText = `@${agent.full_name} `;

    const newValue = beforeMention + mentionText + afterCursor;
    onChange(newValue);

    // Track mentioned user
    setMentionedUsers((prev) => {
      const updated = new Map(prev);
      updated.set(agent.id, agent.full_name || "");
      return updated;
    });

    setShowMentions(false);
    setMentionSearch("");
    mentionStartRef.current = -1;

    // Focus and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeMention.length + mentionText.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions || filteredAgents.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredAgents.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredAgents.length) % filteredAgents.length);
        break;
      case "Enter":
        if (showMentions) {
          e.preventDefault();
          insertMention(filteredAgents[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowMentions(false);
        break;
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <Popover open={showMentions && filteredAgents.length > 0}>
        <PopoverAnchor asChild>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("resize-none min-h-[80px]", className)}
          />
        </PopoverAnchor>
        <PopoverContent
          className="w-64 p-0"
          align="start"
          side="top"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ScrollArea className="max-h-48">
            <div className="p-1">
              {filteredAgents.map((agent, index) => (
                <button
                  key={agent.id}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => insertMention(agent)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={agent.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(agent.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{agent.full_name}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {mentionedUsers.size > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {Array.from(mentionedUsers.entries()).map(([id, name]) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
            >
              @{name}
              <button
                type="button"
                className="hover:text-destructive"
                onClick={() => {
                  setMentionedUsers((prev) => {
                    const updated = new Map(prev);
                    updated.delete(id);
                    return updated;
                  });
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
