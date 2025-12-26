import { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Palette,
  Type,
  RemoveFormatting,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const TEXT_COLORS = [
  { name: "Default", value: "inherit" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Green", value: "#16a34a" },
  { name: "Blue", value: "#2563eb" },
  { name: "Purple", value: "#9333ea" },
  { name: "Pink", value: "#db2777" },
  { name: "Gray", value: "#6b7280" },
];

const FONT_SIZES = [
  { name: "Small", value: "1" },
  { name: "Normal", value: "3" },
  { name: "Large", value: "5" },
  { name: "Huge", value: "7" },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your message...",
  className,
  minHeight = "200px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateValue();
  }, []);

  const updateValue = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    updateValue();
  }, [updateValue]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    updateValue();
  }, [updateValue]);

  const insertLink = useCallback(() => {
    if (linkUrl) {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      execCommand("createLink", url);
      setLinkUrl("");
      setShowLinkPopover(false);
    }
  }, [linkUrl, execCommand]);

  const removeFormatting = useCallback(() => {
    execCommand("removeFormat");
  }, [execCommand]);

  const isCommandActive = (command: string): boolean => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-background", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/20">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("undo")}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("redo")}
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Font Size */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 p-1">
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"
                onClick={() => execCommand("fontSize", size.value)}
              >
                {size.name}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <Toggle
          pressed={isCommandActive("bold")}
          onPressedChange={() => execCommand("bold")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={isCommandActive("italic")}
          onPressedChange={() => execCommand("italic")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={isCommandActive("underline")}
          onPressedChange={() => execCommand("underline")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={isCommandActive("strikeThrough")}
          onPressedChange={() => execCommand("strikeThrough")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <div className="grid grid-cols-3 gap-1">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.value}
                  className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground/30 flex items-center justify-center"
                  style={{ backgroundColor: color.value === "inherit" ? "transparent" : color.value }}
                  onClick={() => execCommand("foreColor", color.value)}
                  title={color.name}
                >
                  {color.value === "inherit" && <span className="text-xs">A</span>}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <Toggle
          pressed={isCommandActive("insertUnorderedList")}
          onPressedChange={() => execCommand("insertUnorderedList")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={isCommandActive("insertOrderedList")}
          onPressedChange={() => execCommand("insertOrderedList")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <Toggle
          pressed={isCommandActive("justifyLeft")}
          onPressedChange={() => execCommand("justifyLeft")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={isCommandActive("justifyCenter")}
          onPressedChange={() => execCommand("justifyCenter")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={isCommandActive("justifyRight")}
          onPressedChange={() => execCommand("justifyRight")}
          size="sm"
          className="h-8 w-8 p-0 data-[state=on]:bg-gmail-red/20 data-[state=on]:text-gmail-red"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Link */}
        <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert Link</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && insertLink()}
                  className="flex-1"
                />
                <Button size="sm" onClick={insertLink}>
                  Insert
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Remove Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={removeFormatting}
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "p-4 outline-none overflow-auto",
          "prose prose-sm max-w-none dark:prose-invert",
          "prose-p:my-1 prose-headings:my-2",
          "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground"
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
