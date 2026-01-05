import { Star, Trash2, MoreHorizontal, Folder, User, Building, Phone, FileText, Lightbulb, ClipboardList, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import type { Note, NoteFolder } from "@/hooks/useNotes";
import { format } from "date-fns";

const categoryIcons: Record<string, React.ElementType> = {
  general: FileText,
  meeting: MessageSquare,
  call: Phone,
  research: Lightbulb,
  idea: Lightbulb,
  "action-item": ClipboardList,
};

const priorityColors: Record<string, string> = {
  low: "text-muted-foreground",
  normal: "text-yellow-500",
  high: "text-red-500",
};

interface NoteListItemProps {
  note: Note;
  viewMode: "grid" | "list";
  folders?: NoteFolder[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string, starred: boolean) => void;
  onMoveToFolder: (noteId: string, folderId: string | null) => void;
}

export const NoteListItem = ({
  note,
  viewMode,
  folders = [],
  onEdit,
  onDelete,
  onToggleStar,
  onMoveToFolder,
}: NoteListItemProps) => {
  const CategoryIcon = categoryIcons[note.category] || FileText;

  if (viewMode === "list") {
    return (
      <div
        className="group flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-all cursor-pointer"
        onClick={() => onEdit(note)}
      >
        {/* Star */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(note.id, !note.starred);
          }}
        >
          <Star
            className={cn(
              "h-4 w-4",
              note.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        </Button>

        {/* Category icon */}
        <div className={cn("p-2 rounded-md bg-muted flex-shrink-0", priorityColors[note.priority])}>
          <CategoryIcon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{note.title}</h3>
            {note.folder && (
              <Badge variant="outline" className="text-xs gap-1">
                <Folder className="h-3 w-3" />
                {note.folder.name}
              </Badge>
            )}
          </div>
          {note.content && (
            <p className="text-sm text-muted-foreground truncate mt-1">{note.content}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {note.deal && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Building className="h-3 w-3" />
                {note.deal.property_address}
              </Badge>
            )}
            {note.contact && (
              <Badge variant="secondary" className="text-xs gap-1">
                <User className="h-3 w-3" />
                {note.contact.full_name}
              </Badge>
            )}
            {note.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="text-sm text-muted-foreground flex-shrink-0">
          {format(new Date(note.updated_at), "MMM d, yyyy")}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onToggleStar(note.id, !note.starred)}>
              <Star className={cn("h-4 w-4 mr-2", note.starred && "fill-yellow-400")} />
              {note.starred ? "Unstar" : "Star"}
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Folder className="h-4 w-4 mr-2" />
                Move to folder
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => onMoveToFolder(note.id, null)}>
                  Inbox (No folder)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => onMoveToFolder(note.id, folder.id)}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(note.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Grid view (card)
  return (
    <div
      className="group relative bg-card border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onEdit(note)}
    >
      {/* Star indicator */}
      {note.starred && (
        <Star className="absolute top-2 right-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("p-2 rounded-md bg-muted flex-shrink-0", priorityColors[note.priority])}>
          <CategoryIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium line-clamp-1">{note.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground capitalize">{note.category}</span>
            {note.folder && (
              <Badge variant="outline" className="text-xs">
                {note.folder.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content preview */}
      {note.content && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{note.content}</p>
      )}

      {/* Linked items */}
      {(note.deal || note.contact) && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.deal && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Building className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{note.deal.property_address}</span>
            </Badge>
          )}
          {note.contact && (
            <Badge variant="secondary" className="text-xs gap-1">
              <User className="h-3 w-3" />
              {note.contact.full_name}
            </Badge>
          )}
        </div>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{note.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-xs text-muted-foreground">
          {format(new Date(note.updated_at), "MMM d, yyyy")}
        </span>

        {/* Quick actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(note.id, !note.starred);
            }}
          >
            <Star
              className={cn(
                "h-4 w-4",
                note.starred ? "fill-yellow-400 text-yellow-400" : ""
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
