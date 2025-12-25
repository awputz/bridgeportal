import { Pin, Trash2, Sparkles, Link, User, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Note } from "@/hooks/useNotes";

const colorClasses: Record<string, string> = {
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700",
  pink: "bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700",
  blue: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
  green: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
  purple: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700",
};

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onAiSummarize: (note: Note) => void;
}

export const NoteCard = ({ note, onEdit, onDelete, onTogglePin, onAiSummarize }: NoteCardProps) => {
  const colorClass = colorClasses[note.color] || colorClasses.yellow;

  return (
    <div
      className={cn(
        "group relative rounded-lg border-2 p-4 transition-all hover:shadow-lg cursor-pointer",
        colorClass
      )}
      onClick={() => onEdit(note)}
    >
      {/* Pin indicator */}
      {note.is_pinned && (
        <Pin className="absolute -top-2 -right-2 h-5 w-5 text-primary fill-primary rotate-45" />
      )}

      {/* Title */}
      <h3 className="font-semibold text-foreground line-clamp-1 pr-6">{note.title}</h3>

      {/* Content preview */}
      {note.content && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{note.content}</p>
      )}

      {/* AI Summary */}
      {note.ai_summary && (
        <div className="mt-2 p-2 rounded bg-background/50 border border-border/50">
          <div className="flex items-center gap-1 text-xs text-primary mb-1">
            <Sparkles className="h-3 w-3" />
            <span>AI Summary</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{note.ai_summary}</p>
        </div>
      )}

      {/* Linked items */}
      {(note.deal || note.contact) && (
        <div className="mt-3 flex flex-wrap gap-1">
          {note.deal && (
            <Badge variant="outline" className="text-xs gap-1 bg-background/50">
              <Building className="h-3 w-3" />
              {note.deal.property_address}
            </Badge>
          )}
          {note.contact && (
            <Badge variant="outline" className="text-xs gap-1 bg-background/50">
              <User className="h-3 w-3" />
              {note.contact.full_name}
            </Badge>
          )}
        </div>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{note.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Actions - show on hover */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id, !note.is_pinned);
          }}
        >
          <Pin className={cn("h-4 w-4", note.is_pinned && "fill-current")} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onAiSummarize(note);
          }}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Timestamp */}
      <p className="mt-3 text-xs text-muted-foreground">
        {new Date(note.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
};
