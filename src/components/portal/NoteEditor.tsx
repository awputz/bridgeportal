import { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Building, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCRMDeals, useCRMContacts } from "@/hooks/useCRM";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";

const colors = [
  { value: "yellow", label: "Yellow", class: "bg-yellow-400" },
  { value: "pink", label: "Pink", class: "bg-pink-400" },
  { value: "blue", label: "Blue", class: "bg-blue-400" },
  { value: "green", label: "Green", class: "bg-green-400" },
  { value: "purple", label: "Purple", class: "bg-purple-400" },
];

interface NoteEditorProps {
  note: Partial<Note> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  onUpdateAiSummary?: (id: string, summary: string) => void;
}

export const NoteEditor = ({ note, isOpen, onClose, onSave, onUpdateAiSummary }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dealId, setDealId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const { data: deals } = useCRMDeals();
  const { data: contacts } = useCRMContacts();

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setColor(note.color || "yellow");
      setIsPinned(note.is_pinned || false);
      setTags(note.tags || []);
      setDealId(note.deal_id || null);
      setContactId(note.contact_id || null);
      setAiSummary(note.ai_summary || null);
    } else {
      setTitle("");
      setContent("");
      setColor("yellow");
      setIsPinned(false);
      setTags([]);
      setDealId(null);
      setContactId(null);
      setAiSummary(null);
    }
  }, [note]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAiSummarize = async () => {
    if (!content.trim()) {
      toast({ title: "Add some content first", variant: "destructive" });
      return;
    }

    setIsAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("notes-ai", {
        body: { action: "summarize", content, title },
      });

      if (error) throw error;

      setAiSummary(data.summary);
      
      // If editing existing note, update in DB
      if (note?.id && onUpdateAiSummary) {
        onUpdateAiSummary(note.id, data.summary);
      }

      toast({ title: "AI summary generated" });
    } catch (error) {
      console.error("AI error:", error);
      toast({ title: "Failed to generate summary", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiSuggestTags = async () => {
    if (!content.trim() && !title.trim()) {
      toast({ title: "Add some content first", variant: "destructive" });
      return;
    }

    setIsAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("notes-ai", {
        body: { action: "suggest-tags", content, title },
      });

      if (error) throw error;

      const newTags = data.tags.filter((tag: string) => !tags.includes(tag));
      setTags([...tags, ...newTags]);
      toast({ title: `Added ${newTags.length} suggested tags` });
    } catch (error) {
      console.error("AI error:", error);
      toast({ title: "Failed to suggest tags", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({ title: "Please add a title", variant: "destructive" });
      return;
    }

    onSave({
      id: note?.id,
      title: title.trim(),
      content: content.trim() || null,
      color,
      is_pinned: isPinned,
      tags,
      deal_id: dealId,
      contact_id: contactId,
      ai_summary: aiSummary,
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{note?.id ? "Edit Note" : "New Sticky Note"}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Color picker */}
          <div>
            <Label className="text-sm">Color</Label>
            <div className="flex gap-2 mt-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full transition-transform",
                    c.class,
                    color === c.value && "ring-2 ring-offset-2 ring-primary scale-110"
                  )}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="mt-1"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="mt-1 min-h-[150px]"
            />
          </div>

          {/* AI Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAiSummarize}
              disabled={isAiLoading}
            >
              {isAiLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Summarize with AI
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAiSuggestTags}
              disabled={isAiLoading}
            >
              {isAiLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Tag className="h-4 w-4 mr-2" />
              )}
              Suggest Tags
            </Button>
          </div>

          {/* AI Summary display */}
          {aiSummary && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-1 text-sm text-primary mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">AI Summary</span>
              </div>
              <p className="text-sm text-muted-foreground">{aiSummary}</p>
            </div>
          )}

          {/* Pin toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="pinned">Pin to top</Label>
            <Switch
              id="pinned"
              checked={isPinned}
              onCheckedChange={setIsPinned}
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Link to Deal */}
          <div>
            <Label className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Link to Deal
            </Label>
            <Select
              value={dealId || "none"}
              onValueChange={(v) => setDealId(v === "none" ? null : v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a deal..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No deal linked</SelectItem>
                {deals?.map((deal) => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.property_address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Link to Contact */}
          <div>
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Link to Contact
            </Label>
            <Select
              value={contactId || "none"}
              onValueChange={(v) => setContactId(v === "none" ? null : v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a contact..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No contact linked</SelectItem>
                {contacts?.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Save Button */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {note?.id ? "Save Changes" : "Create Note"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
