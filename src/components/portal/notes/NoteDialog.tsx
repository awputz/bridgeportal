import { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Building, User, Tag, Folder, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCRMDeals, useCRMContacts } from "@/hooks/useCRM";
import { useNoteFolders, type Note, type NoteFolder } from "@/hooks/useNotes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/portal/RichTextEditor";
import { format } from "date-fns";

const categories = [
  { value: "general", label: "General" },
  { value: "meeting", label: "Meeting" },
  { value: "call", label: "Call" },
  { value: "research", label: "Research" },
  { value: "idea", label: "Idea" },
  { value: "action-item", label: "Action Item" },
];

const priorities = [
  { value: "low", label: "Low", color: "text-muted-foreground" },
  { value: "normal", label: "Normal", color: "text-yellow-500" },
  { value: "high", label: "High", color: "text-red-500" },
];

interface NoteDialogProps {
  note: Partial<Note> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  onUpdateAiSummary?: (id: string, summary: string) => void;
}

export const NoteDialog = ({ note, isOpen, onClose, onSave, onUpdateAiSummary }: NoteDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("normal");
  const [starred, setStarred] = useState(false);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dealId, setDealId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const { data: deals } = useCRMDeals();
  const { data: contacts } = useCRMContacts();
  const { data: folders = [] } = useNoteFolders();

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setCategory(note.category || "general");
      setPriority(note.priority || "normal");
      setStarred(note.starred || note.is_pinned || false);
      setFolderId(note.folder_id || null);
      setTags(note.tags || []);
      setDealId(note.deal_id || null);
      setContactId(note.contact_id || null);
      setAiSummary(note.ai_summary || null);
    } else {
      setTitle("");
      setContent("");
      setCategory("general");
      setPriority("normal");
      setStarred(false);
      setFolderId(null);
      setTags([]);
      setDealId(null);
      setContactId(null);
      setAiSummary(null);
    }
  }, [note, isOpen]);

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
      toast({ title: "Please add a subject/title", variant: "destructive" });
      return;
    }

    onSave({
      id: note?.id,
      title: title.trim(),
      content: content.trim() || null,
      category,
      priority,
      starred,
      is_pinned: starred, // Keep backward compat
      folder_id: folderId,
      tags,
      deal_id: dealId,
      contact_id: contactId,
      ai_summary: aiSummary,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {note?.id ? "Edit Note" : "Create Note"}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-auto"
              onClick={() => setStarred(!starred)}
            >
              <Star className={cn("h-5 w-5", starred && "fill-yellow-400 text-yellow-400")} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="form-section">
          {/* Subject/Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Subject/Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note subject..."
              className="mt-1.5"
            />
          </div>

          {/* Category, Priority, Folder */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <span className={p.color}>{p.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Folder</Label>
              <Select value={folderId || "none"} onValueChange={(v) => setFolderId(v === "none" ? null : v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select folder..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      Inbox (No folder)
                    </span>
                  </SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      <span className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        {folder.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project/Deal and Contact */}
          <div className="form-grid">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Project/Deal
              </Label>
              <Select value={dealId || "none"} onValueChange={(v) => setDealId(v === "none" ? null : v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Link to deal..." />
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

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Primary Contact
              </Label>
              <Select value={contactId || "none"} onValueChange={(v) => setContactId(v === "none" ? null : v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Link to contact..." />
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
          </div>

          {/* Note Content */}
          <div>
            <Label className="text-sm font-medium">Note Content</Label>
            <div className="mt-1.5">
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your note here..."
                minHeight="200px"
              />
            </div>
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
              AI Summarize
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

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex gap-2 mt-1.5">
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

          {/* Timestamps */}
          {note?.id && (
            <div className="text-xs text-muted-foreground border-t pt-4">
              Created: {format(new Date(note.created_at!), "MMM d, yyyy h:mm a")}
              {note.updated_at && note.updated_at !== note.created_at && (
                <span className="ml-4">
                  Modified: {format(new Date(note.updated_at), "MMM d, yyyy h:mm a")}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {note?.id ? "Save Changes" : "Create Note"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
