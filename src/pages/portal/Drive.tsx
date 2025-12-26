import { useState, useMemo } from "react";
import {
  FolderOpen,
  File,
  Image,
  FileText,
  Sheet,
  Presentation,
  Film,
  Music,
  Archive,
  Folder,
  Search,
  ExternalLink,
  RefreshCw,
  Settings,
  Loader2,
  AlertCircle,
  Home,
  Clock,
  Star,
  HardDrive,
  Grid3X3,
  List,
  Filter,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDriveConnection, useConnectDrive, useDisconnectDrive, useDriveFiles, useDriveFolderPath, DriveFile } from "@/hooks/useGoogleDrive";
import { hardLogout } from "@/lib/auth";
import { DriveContextMenu } from "@/components/portal/DriveContextMenu";
import { DriveFilePreview } from "@/components/portal/DriveFilePreview";
import { DriveBreadcrumbs, BreadcrumbItem } from "@/components/portal/DriveBreadcrumbs";

type SortField = "name" | "modifiedTime" | "size";
type SortDirection = "asc" | "desc";
type FileTypeFilter = "all" | "documents" | "spreadsheets" | "presentations" | "images" | "videos" | "audio" | "pdfs";
type QuickFilter = "all" | "recent" | "starred";

// Google Drive-style file icons and colors
const getFileIcon = (mimeType: string) => {
  if (mimeType.includes("folder")) return Folder;
  if (mimeType.includes("image")) return Image;
  if (mimeType.includes("video")) return Film;
  if (mimeType.includes("audio")) return Music;
  if (mimeType.includes("pdf")) return FileText;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return Sheet;
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return Presentation;
  if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("compressed")) return Archive;
  if (mimeType.includes("document") || mimeType.includes("text")) return FileText;
  return File;
};

const getFileColor = (mimeType: string) => {
  if (mimeType.includes("folder")) return "text-gdrive-folder bg-gdrive-folder/10";
  if (mimeType.includes("image")) return "text-pink-500 bg-pink-500/10";
  if (mimeType.includes("video")) return "text-purple-500 bg-purple-500/10";
  if (mimeType.includes("audio")) return "text-gdrive-audio bg-gdrive-audio/10";
  if (mimeType.includes("pdf")) return "text-gdrive-pdf bg-gdrive-pdf/10";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "text-gdrive-sheets bg-gdrive-sheets/10";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "text-gdrive-slides bg-gdrive-slides/10";
  if (mimeType.includes("document")) return "text-gdrive-docs bg-gdrive-docs/10";
  return "text-muted-foreground bg-muted/30";
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const filterOptions = [
  { value: "all" as FileTypeFilter, label: "All files", icon: File },
  { value: "documents" as FileTypeFilter, label: "Documents", icon: FileText },
  { value: "spreadsheets" as FileTypeFilter, label: "Spreadsheets", icon: Sheet },
  { value: "presentations" as FileTypeFilter, label: "Presentations", icon: Presentation },
  { value: "pdfs" as FileTypeFilter, label: "PDFs", icon: FileText },
  { value: "images" as FileTypeFilter, label: "Images", icon: Image },
  { value: "videos" as FileTypeFilter, label: "Videos", icon: Film },
  { value: "audio" as FileTypeFilter, label: "Audio", icon: Music },
];

const sortOptions = [
  { field: "name" as SortField, label: "Name" },
  { field: "modifiedTime" as SortField, label: "Modified" },
  { field: "size" as SortField, label: "Size" },
];

export default function Drive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [fileFilter, setFileFilter] = useState<FileTypeFilter>("all");
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);

  const { data: connection, isLoading: isLoadingConnection, error: connectionError } = useDriveConnection();
  const {
    data: filesData,
    isLoading: isLoadingFiles,
    error: filesError,
    refetch: refetchFiles,
  } = useDriveFiles({
    query: searchQuery || undefined,
    folderId: currentFolderId || undefined,
    enabled: connection?.isConnected,
  });

  const { data: folderPath = [] } = useDriveFolderPath(currentFolderId);

  const connectDrive = useConnectDrive();
  const disconnectDrive = useDisconnectDrive();

  // Sort and filter files
  const processedFiles = useMemo(() => {
    let files = filesData?.files || [];

    // Apply file type filter
    if (fileFilter !== "all") {
      files = files.filter(file => {
        const mime = file.mimeType.toLowerCase();
        switch (fileFilter) {
          case "documents": return mime.includes("document") && !mime.includes("pdf");
          case "spreadsheets": return mime.includes("spreadsheet") || mime.includes("excel");
          case "presentations": return mime.includes("presentation") || mime.includes("powerpoint");
          case "pdfs": return mime.includes("pdf");
          case "images": return mime.includes("image");
          case "videos": return mime.includes("video");
          case "audio": return mime.includes("audio");
          default: return true;
        }
      });
    }

    // Sort files (folders first, then by selected field)
    files = [...files].sort((a, b) => {
      const aIsFolder = a.mimeType.includes("folder");
      const bIsFolder = b.mimeType.includes("folder");
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;

      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "modifiedTime":
          comparison = new Date(a.modifiedTime || 0).getTime() - new Date(b.modifiedTime || 0).getTime();
          break;
        case "size":
          comparison = (a.size || 0) - (b.size || 0);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return files;
  }, [filesData?.files, fileFilter, sortField, sortDirection]);

  const handleNavigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSearchQuery("");
  };

  const handleFileClick = (file: DriveFile) => {
    if (file.mimeType.includes("folder")) {
      handleNavigateToFolder(file.id);
    } else {
      setPreviewFile(file);
    }
  };


  if (isLoadingConnection) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Checking connection...</span>
        </div>
      </div>
    );
  }

  if (!connection?.isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-card p-8 md:p-12 max-w-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gdrive-folder/20 to-gdrive-docs/20 flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="h-10 w-10 text-gdrive-folder" />
          </div>
          <h2 className="text-2xl font-light text-foreground mb-3">Connect Your Google Drive</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-sm mx-auto">
            Access your files directly from the portal. View, organize, and link documents to deals and contacts.
          </p>

          {connectionError && (
            <div className="flex items-center gap-2 justify-center text-amber-400 mb-6 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Connection check failed. Try connecting anyway.</span>
            </div>
          )}

          <Button 
            size="lg" 
            onClick={() => connectDrive.mutate()} 
            disabled={connectDrive.isPending} 
            className="gap-2 bg-gdrive-folder hover:bg-gdrive-folder/90"
          >
            {connectDrive.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <FolderOpen className="h-4 w-4" />
                Connect Google Drive
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-6">We'll only request read permissions for your files</p>
        </div>
      </div>
    );
  }

  const breadcrumbPath: BreadcrumbItem[] = folderPath.map(f => ({ id: f.id, name: f.name }));

  const activeFilterCount = (fileFilter !== "all" ? 1 : 0) + (sortField !== "name" || sortDirection !== "asc" ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background min-h-0">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-3 px-4 lg:px-6 py-3 border-b border-border/30 bg-card shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gdrive-folder flex items-center justify-center shrink-0">
            <HardDrive className="h-5 w-5 text-white" />
          </div>
          {/* Breadcrumbs inline with title */}
          <DriveBreadcrumbs 
            path={breadcrumbPath} 
            onNavigate={handleNavigateToFolder} 
          />
        </div>
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in Drive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-gdrive-folder/50 h-9"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          {/* Unified View Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 px-2.5">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">View</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-gdrive-folder text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-muted-foreground mb-2">Layout</p>
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="flex-1 h-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4 mr-1.5" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="flex-1 h-8"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-1.5" />
                    List
                  </Button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-muted-foreground mb-2">File Type</p>
              </div>
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFileFilter(option.value)}
                    className={cn("gap-2", fileFilter === option.value && "bg-muted")}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-muted-foreground mb-2">Sort By</p>
              </div>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.field}
                  onClick={() => {
                    if (sortField === option.field) {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortField(option.field);
                      setSortDirection("asc");
                    }
                  }}
                  className={cn("gap-2", sortField === option.field && "bg-muted")}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {option.label}
                  {sortField === option.field && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => refetchFiles()} className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open('https://drive.google.com', '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Google Drive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => disconnectDrive.mutate()}
                disabled={disconnectDrive.isPending}
                className="text-destructive"
              >
                Disconnect Drive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filesError && (
        <div className="mx-4 lg:mx-6 mt-4 rounded-xl border border-border/50 bg-muted/20 p-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">Couldn't load Drive files</p>
                <p className="text-xs text-muted-foreground mt-0.5">{(filesError as Error).message}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={hardLogout}>
              Sign in again
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Quick Filters */}
        <div className="hidden md:block w-56 lg:w-64 border-r border-border/30 py-4 overflow-y-auto bg-muted/5 shrink-0">
          <div className="px-3">
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setQuickFilter("all");
                  setCurrentFolderId(null);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  quickFilter === "all" && !currentFolderId
                    ? "bg-gdrive-folder/10 text-gdrive-folder"
                    : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Home className="h-5 w-5" />
                My Drive
              </button>
              <button
                onClick={() => setQuickFilter("recent")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  quickFilter === "recent"
                    ? "bg-gdrive-folder/10 text-gdrive-folder"
                    : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Clock className="h-5 w-5" />
                Recent
              </button>
              <button
                onClick={() => setQuickFilter("starred")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  quickFilter === "starred"
                    ? "bg-gdrive-folder/10 text-gdrive-folder"
                    : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Star className="h-5 w-5" />
                Starred
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Files */}
          <div className="flex-1 overflow-auto p-4 lg:p-6 animate-fade-in">
            {isLoadingFiles ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : processedFiles.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">
                    {searchQuery ? "No files match your search" : "This folder is empty"}
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    {searchQuery ? "Try a different search term" : "Upload files to get started"}
                  </p>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {processedFiles.map((file) => {
                  const Icon = getFileIcon(file.mimeType);
                  const colorClass = getFileColor(file.mimeType);
                  const isFolder = file.mimeType.includes("folder");
                  
                  return (
                    <DriveContextMenu 
                      key={file.id} 
                      file={file}
                      onPreview={!isFolder ? setPreviewFile : undefined}
                      onNavigateToFolder={isFolder ? handleNavigateToFolder : undefined}
                    >
                      <button
                        onClick={() => handleFileClick(file)}
                        className="group w-full text-left rounded-xl border border-border/50 bg-card p-4 hover:border-gdrive-folder/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(file.modifiedTime)}
                              {file.size && ` • ${formatFileSize(file.size)}`}
                            </p>
                          </div>
                        </div>
                      </button>
                    </DriveContextMenu>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/5">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Modified</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedFiles.map((file) => {
                      const Icon = getFileIcon(file.mimeType);
                      const colorClass = getFileColor(file.mimeType);
                      const isFolder = file.mimeType.includes("folder");

                      return (
                        <DriveContextMenu 
                          key={file.id} 
                          file={file}
                          onPreview={!isFolder ? setPreviewFile : undefined}
                          onNavigateToFolder={isFolder ? handleNavigateToFolder : undefined}
                        >
                          <tr
                            onClick={() => handleFileClick(file)}
                            className="border-b border-border/20 last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-foreground truncate text-sm">{file.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                              {formatDate(file.modifiedTime)}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                              {formatFileSize(file.size)}
                            </td>
                          </tr>
                        </DriveContextMenu>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Preview */}
      <DriveFilePreview
        file={previewFile}
        files={processedFiles}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onNavigate={(file) => setPreviewFile(file)}
      />
    </div>
  );
}