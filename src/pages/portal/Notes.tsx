import { useState } from "react";
import { Plus, Search, Pin, Filter, Grid3X3, List, Sparkles, Building, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteCard } from "@/components/portal/NoteCard";
import { NoteEditor } from "@/components/portal/NoteEditor";
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote, type Note, type NoteFilters } from "@/hooks/useNotes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const colorOptions = [
  { value: "yellow", label: "Yellow", class: "bg-yellow-400" },
  { value: "pink", label: "Pink", class: "bg-pink-400" },
  { value: "blue", label: "Blue", class: "bg-blue-400" },
  { value: "green", label: "Green", class: "bg-green-400" },
  { value: "purple", label: "Purple", class: "bg-purple-400" },
];

const Notes = () => {
  const [filters, setFilters] = useState<NoteFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: notes, isLoading } = useNotes({ ...filters, search: searchTerm });
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const handleNewNote = () => {
    setSelectedNote(null);
    setEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (noteData.id) {
      updateNote.mutate({ id: noteData.id, ...noteData });
    } else {
      createNote.mutate(noteData);
    }
  };

  const handleTogglePin = (id: string, isPinned: boolean) => {
    updateNote.mutate({ id, is_pinned: isPinned });
  };

  const handleAiSummarize = async (note: Note) => {
    // Open editor with the note to use AI there
    setSelectedNote(note);
    setEditorOpen(true);
  };

  const handleUpdateAiSummary = (id: string, summary: string) => {
    updateNote.mutate({ id, ai_summary: summary });
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteNote.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const pinnedNotes = notes?.filter((n) => n.is_pinned) || [];
  const unpinnedNotes = notes?.filter((n) => !n.is_pinned) || [];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="space-y-6 pb-24 md:pb-16">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Sticky Notes</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Keep track of ideas, action items, and deal notes with AI assistance
            </p>
          </div>
          <Button onClick={handleNewNote} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuCheckboxItem
                checked={filters.isPinned === true}
                onCheckedChange={(checked) =>
                  setFilters((f) => ({ ...f, isPinned: checked ? true : undefined }))
                }
              >
                <Pin className="h-4 w-4 mr-2" />
                Pinned only
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem
                checked={filters.hasDeal === true}
                onCheckedChange={(checked) =>
                  setFilters((f) => ({ ...f, hasDeal: checked ? true : undefined }))
                }
              >
                <Building className="h-4 w-4 mr-2" />
                Linked to deal
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem
                checked={filters.hasContact === true}
                onCheckedChange={(checked) =>
                  setFilters((f) => ({ ...f, hasContact: checked ? true : undefined }))
                }
              >
                <User className="h-4 w-4 mr-2" />
                Linked to contact
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Color</DropdownMenuLabel>
              
              {colorOptions.map((color) => (
                <DropdownMenuCheckboxItem
                  key={color.value}
                  checked={filters.color === color.value}
                  onCheckedChange={(checked) =>
                    setFilters((f) => ({ ...f, color: checked ? color.value : undefined }))
                  }
                >
                  <div className={cn("h-3 w-3 rounded-full mr-2", color.class)} />
                  {color.label}
                </DropdownMenuCheckboxItem>
              ))}

              {(filters.color || filters.isPinned || filters.hasDeal || filters.hasContact) && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => setFilters({})}
                  >
                    Clear filters
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className={cn(
            "gap-4",
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "flex flex-col"
          )}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : notes?.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first sticky note to get started
            </p>
            <Button onClick={handleNewNote}>
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pinned notes */}
            {pinnedNotes.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Pin className="h-4 w-4" />
                  Pinned ({pinnedNotes.length})
                </h2>
                <div className={cn(
                  "gap-4",
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "flex flex-col"
                )}>
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={(id) => setDeleteId(id)}
                      onTogglePin={handleTogglePin}
                      onAiSummarize={handleAiSummarize}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other notes */}
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h2 className="text-sm font-medium text-muted-foreground mb-3">
                    Other Notes ({unpinnedNotes.length})
                  </h2>
                )}
                <div className={cn(
                  "gap-4",
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "flex flex-col"
                )}>
                  {unpinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={(id) => setDeleteId(id)}
                      onTogglePin={handleTogglePin}
                      onAiSummarize={handleAiSummarize}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note Editor */}
        <NoteEditor
          note={selectedNote}
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveNote}
          onUpdateAiSummary={handleUpdateAiSummary}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this note? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Notes;
