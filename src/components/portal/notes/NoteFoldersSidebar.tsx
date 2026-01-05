import { useState } from "react";
import { Folder, Star, Inbox, Plus, MoreHorizontal, Pencil, Trash2, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useNoteFolders,
  useCreateNoteFolder,
  useUpdateNoteFolder,
  useDeleteNoteFolder,
  useNoteCounts,
  type NoteFolder,
} from "@/hooks/useNotes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface NoteFoldersSidebarProps {
  selectedFolder: string;
  onSelectFolder: (folderId: string) => void;
}

export const NoteFoldersSidebar = ({ selectedFolder, onSelectFolder }: NoteFoldersSidebarProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<NoteFolder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<NoteFolder | null>(null);

  const { data: folders = [], isLoading } = useNoteFolders();
  const { data: counts } = useNoteCounts();
  const createFolder = useCreateNoteFolder();
  const updateFolder = useUpdateNoteFolder();
  const deleteFolder = useDeleteNoteFolder();

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder.mutate({ name: newFolderName.trim() });
      setNewFolderName("");
      setIsCreating(false);
    }
  };

  const handleRenameFolder = () => {
    if (editingFolder && newFolderName.trim()) {
      updateFolder.mutate({ id: editingFolder.id, name: newFolderName.trim() });
      setEditingFolder(null);
      setNewFolderName("");
    }
  };

  const handleDeleteFolder = () => {
    if (deletingFolder) {
      deleteFolder.mutate(deletingFolder.id);
      if (selectedFolder === deletingFolder.id) {
        onSelectFolder("all");
      }
      setDeletingFolder(null);
    }
  };

  const systemFolders = [
    { id: "all", name: "All Notes", icon: FileText, count: counts?.total || 0 },
    { id: "inbox", name: "Inbox", icon: Inbox, count: counts?.inbox || 0 },
    { id: "starred", name: "Starred", icon: Star, count: counts?.starred || 0 },
  ];

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-card rounded-lg border p-4 space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Folders
        </h3>

        {/* System folders */}
        <div className="space-y-1">
          {systemFolders.map((folder) => (
            <button
              key={folder.id}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                selectedFolder === folder.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => onSelectFolder(folder.id)}
            >
              <span className="flex items-center gap-2">
                <folder.icon className="h-4 w-4" />
                {folder.name}
              </span>
              <span className={cn(
                "text-xs",
                selectedFolder === folder.id ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {folder.count}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Custom folders */}
        <div className="space-y-1">
          {isLoading ? (
            <div className="text-sm text-muted-foreground px-3">Loading...</div>
          ) : folders.length === 0 && !isCreating ? (
            <div className="text-sm text-muted-foreground px-3">No folders yet</div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                  selectedFolder === folder.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => onSelectFolder(folder.id)}
              >
                <span className="flex items-center gap-2 truncate">
                  <Folder className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{folder.name}</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "text-xs",
                    selectedFolder === folder.id ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {folder.note_count || 0}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-6 w-6 opacity-0 group-hover:opacity-100",
                          selectedFolder === folder.id && "text-primary-foreground hover:text-primary-foreground"
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolder(folder);
                          setNewFolderName(folder.name);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingFolder(folder);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}

          {/* New folder input */}
          {isCreating && (
            <div className="px-3 py-2">
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewFolderName("");
                  }
                }}
                onBlur={() => {
                  if (!newFolderName.trim()) {
                    setIsCreating(false);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Add folder button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="h-4 w-4" />
          New Folder
        </Button>
      </div>

      {/* Rename Dialog */}
      <Dialog open={!!editingFolder} onOpenChange={() => setEditingFolder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameFolder();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFolder(null)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFolder}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingFolder} onOpenChange={() => setDeletingFolder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingFolder?.name}"? Notes in this folder will be moved to Inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFolder} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
