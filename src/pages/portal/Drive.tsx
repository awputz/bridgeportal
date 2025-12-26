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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDriveConnection, useConnectDrive, useDisconnectDrive, useDriveFiles, useDriveFolderPath, DriveFile } from "@/hooks/useGoogleDrive";
import { hardLogout } from "@/lib/auth";
import { DriveContextMenu } from "@/components/portal/DriveContextMenu";
import { DriveFilePreview } from "@/components/portal/DriveFilePreview";
import { DriveActionBar, SortField, SortDirection, FileTypeFilter } from "@/components/portal/DriveActionBar";
import { DriveBreadcrumbs, BreadcrumbItem } from "@/components/portal/DriveBreadcrumbs";

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

type QuickFilter = "all" | "recent" | "starred";

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
      // Folders always first
      const aIsFolder = a.mimeType.includes("folder");
      const bIsFolder = b.mimeType.includes("folder");
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;

      // Sort by field
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

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  if (isLoadingConnection) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="glass-card p-8">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Checking connection...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!connection?.isConnected) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gdrive-folder flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground">
                Google Drive
              </h1>
            </div>
            <p className="text-muted-foreground font-light">Connect your Google Drive to access and manage files</p>
          </div>

          {/* Connect Card */}
          <div className="glass-card p-8 md:p-12 max-w-xl mx-auto text-center">
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
      </div>
    );
  }

  const breadcrumbPath: BreadcrumbItem[] = folderPath.map(f => ({ id: f.id, name: f.name }));

  return (
    <div className="min-h-screen pb-24 md:pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Google Drive-style Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gdrive-folder flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-foreground">Drive</h1>
              <p className="text-sm text-muted-foreground">Your Google Drive files</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetchFiles()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://drive.google.com', '_blank')}
              className="gap-2 border-gdrive-folder/30 text-gdrive-folder hover:bg-gdrive-folder/10"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open Drive</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => disconnectDrive.mutate()}
              disabled={disconnectDrive.isPending}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filesError && (
          <div className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Couldn't load Drive files</p>
                  <p className="text-sm text-muted-foreground break-words">{(filesError as Error).message}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={hardLogout} className="shrink-0">
                Sign in again
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar - Quick Filters */}
          <div className="hidden md:block w-48 flex-shrink-0">
            <div className="rounded-2xl border border-border/50 bg-card p-3 shadow-sm">
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setQuickFilter("all");
                    setCurrentFolderId(null);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    quickFilter === "all" && !currentFolderId
                      ? "bg-gdrive-folder/10 text-gdrive-folder"
                      : "text-foreground/70 hover:bg-muted/50"
                  )}
                >
                  <Home className="h-4 w-4" />
                  My Drive
                </button>
                <button
                  onClick={() => setQuickFilter("recent")}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    quickFilter === "recent"
                      ? "bg-gdrive-folder/10 text-gdrive-folder"
                      : "text-foreground/70 hover:bg-muted/50"
                  )}
                >
                  <Clock className="h-4 w-4" />
                  Recent
                </button>
                <button
                  onClick={() => setQuickFilter("starred")}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    quickFilter === "starred"
                      ? "bg-gdrive-folder/10 text-gdrive-folder"
                      : "text-foreground/70 hover:bg-muted/50"
                  )}
                >
                  <Star className="h-4 w-4" />
                  Starred
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            <div className="mb-4">
              <DriveBreadcrumbs 
                path={breadcrumbPath} 
                onNavigate={handleNavigateToFolder} 
              />
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search in Drive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/30 border-transparent focus:border-gdrive-folder/50 focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Action Bar */}
            <DriveActionBar
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              fileFilter={fileFilter}
              onFilterChange={setFileFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onRefresh={() => refetchFiles()}
            />

            {/* Files */}
            <div className="rounded-2xl border border-border/50 bg-card p-4 md:p-6 shadow-sm">
              {isLoadingFiles ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : processedFiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {searchQuery ? "No files match your search" : "This folder is empty"}
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    {searchQuery ? "Try a different search term" : "Upload files or create a folder to get started"}
                  </p>
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
                          onDoubleClick={() => {
                            if (!isFolder && file.webViewLink) {
                              window.open(file.webViewLink, "_blank");
                            }
                          }}
                          className="group w-full text-left p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all duration-200 border border-transparent hover:border-border/50 hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn("p-2.5 rounded-xl", colorClass)}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate group-hover:text-gdrive-folder transition-colors">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                {file.size && (
                                  <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                                )}
                                {file.modifiedTime && (
                                  <span className="text-xs text-muted-foreground">{formatDate(file.modifiedTime)}</span>
                                )}
                              </div>
                            </div>
                            {!isFolder && (
                              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </button>
                      </DriveContextMenu>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1">
                  {/* List Header */}
                  <div className="hidden md:flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/30">
                    <div className="flex-1">Name</div>
                    <div className="w-24 text-right">Size</div>
                    <div className="w-32 text-right">Modified</div>
                    <div className="w-8" />
                  </div>
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
                          onDoubleClick={() => {
                            if (!isFolder && file.webViewLink) {
                              window.open(file.webViewLink, "_blank");
                            }
                          }}
                          className="group w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/30 transition-colors text-left"
                        >
                          <div className={cn("p-1.5 rounded-lg", colorClass)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-gdrive-folder transition-colors">
                              {file.name}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground hidden sm:block w-24 text-right">
                            {formatFileSize(file.size)}
                          </span>
                          <span className="text-xs text-muted-foreground hidden md:block w-32 text-right">
                            {formatDate(file.modifiedTime)}
                          </span>
                          {!isFolder && (
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </DriveContextMenu>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      <DriveFilePreview
        file={previewFile}
        files={processedFiles}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onNavigate={setPreviewFile}
      />
    </div>
  );
}
