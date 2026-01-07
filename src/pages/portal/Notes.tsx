import { useState } from "react";
import { Plus, Search, Grid3X3, List, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteFoldersSidebar } from "@/components/portal/notes/NoteFoldersSidebar";
import { NoteListItem } from "@/components/portal/notes/NoteListItem";
import { NoteDialog } from "@/components/portal/notes/NoteDialog";
import { NoteFilters } from "@/components/portal/notes/NoteFilters";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import { 
  useNotes, 
  useNoteFolders,
  useCreateNote, 
  useUpdateNote, 
  useDeleteNote, 
  type Note, 
  type NoteFilters as NoteFiltersType 
} from "@/hooks/useNotes";
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

const Notes = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [filters, setFilters] = useState<NoteFiltersType>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: notes, isLoading, error, refetch } = useNotes({ 
    ...filters, 
    search: searchTerm,
    folderId: selectedFolder,
  });
  const { data: folders = [] } = useNoteFolders();
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
      // If we're viewing a specific folder, add the note to that folder
      if (selectedFolder && selectedFolder !== "all" && selectedFolder !== "starred" && selectedFolder !== "inbox") {
        noteData.folder_id = selectedFolder;
      }
      createNote.mutate(noteData);
    }
  };

  const handleToggleStar = (id: string, starred: boolean) => {
    updateNote.mutate({ id, starred, is_pinned: starred });
  };

  const handleMoveToFolder = (noteId: string, folderId: string | null) => {
    updateNote.mutate({ id: noteId, folder_id: folderId });
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

  const getFolderLabel = () => {
    if (selectedFolder === "all") return "All Notes";
    if (selectedFolder === "starred") return "Starred";
    if (selectedFolder === "inbox") return "Inbox";
    const folder = folders.find((f) => f.id === selectedFolder);
    return folder?.name || "Notes";
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto page-content">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between section-gap">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-1 md:mb-2">Notes</h1>
            <p className="text-sm md:text-base text-muted-foreground font-light">
              Organize and manage your notes with folders, tags, and AI assistance
            </p>
          </div>
          <Button onClick={handleNewNote} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <NoteFoldersSidebar 
            selectedFolder={selectedFolder} 
            onSelectFolder={setSelectedFolder} 
          />

          {/* Main content */}
          <div className="flex-1 space-y-4">
            {/* Search and filters bar */}
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

              {/* View toggle */}
              <div className="flex border rounded-lg overflow-hidden flex-shrink-0">
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

            {/* Filters */}
            <NoteFilters filters={filters} onFiltersChange={setFilters} />

            {/* Folder header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{getFolderLabel()}</h2>
              <span className="text-sm text-muted-foreground">
                {notes?.length || 0} {notes?.length === 1 ? "note" : "notes"}
              </span>
            </div>

            {/* Notes Grid/List */}
            {error ? (
              <QueryErrorState 
                error={error}
                onRetry={() => refetch()}
                title="Failed to load notes"
              />
            ) : isLoading ? (
              <div className={cn(
                "gap-4",
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                  : "flex flex-col"
              )}>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            ) : notes?.length === 0 ? (
              <div className="text-center py-16 bg-card border rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "Try adjusting your search or filters"
                    : "Create your first note to get started"}
                </p>
                {!searchTerm && (
                  <Button onClick={handleNewNote}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                )}
              </div>
            ) : (
              <div className={cn(
                "gap-4",
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                  : "flex flex-col"
              )}>
                {notes?.map((note) => (
                  <NoteListItem
                    key={note.id}
                    note={note}
                    viewMode={viewMode}
                    folders={folders}
                    onEdit={handleEditNote}
                    onDelete={(id) => setDeleteId(id)}
                    onToggleStar={handleToggleStar}
                    onMoveToFolder={handleMoveToFolder}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Dialog */}
      <NoteDialog
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
  );
};

export default Notes;
