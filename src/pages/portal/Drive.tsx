import { useState } from "react";
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
  Grid3X3,
  List,
  ExternalLink,
  RefreshCw,
  Settings,
  Loader2,
  AlertCircle,
  ChevronRight,
  Home,
  Clock,
  Star,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useDriveConnection, useConnectDrive, useDisconnectDrive, useDriveFiles } from "@/hooks/useGoogleDrive";
import { hardLogout } from "@/lib/auth";

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

  const { data: connection, isLoading: isLoadingConnection, error: connectionError } = useDriveConnection();
  const {
    data: filesData,
    isLoading: isLoadingFiles,
    error: filesError,
    refetch: refetchFiles,
  } = useDriveFiles({
    query: searchQuery || undefined,
    enabled: connection?.isConnected,
  });

  const connectDrive = useConnectDrive();
  const disconnectDrive = useDisconnectDrive();

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

  const files = filesData?.files || [];

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
            <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn("rounded-none", viewMode === "grid" && "bg-gdrive-folder hover:bg-gdrive-folder/90")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn("rounded-none", viewMode === "list" && "bg-gdrive-folder hover:bg-gdrive-folder/90")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
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
                  onClick={() => setQuickFilter("all")}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    quickFilter === "all"
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
            <div className="flex items-center gap-1 mb-4 text-sm">
              <button className="flex items-center gap-1 text-gdrive-folder hover:underline">
                <Home className="h-4 w-4" />
                <span>My Drive</span>
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
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

            {/* Files */}
            <div className="rounded-2xl border border-border/50 bg-card p-4 md:p-6 shadow-sm">
              {isLoadingFiles ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {searchQuery ? "No files match your search" : "No files found"}
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    {searchQuery ? "Try a different search term" : "Your Drive appears to be empty"}
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {files.map((file) => {
                    const Icon = getFileIcon(file.mimeType);
                    const colorClass = getFileColor(file.mimeType);
                    return (
                      <a
                        key={file.id}
                        href={file.webViewLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all duration-200 border border-transparent hover:border-border/50 hover:shadow-md"
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
                          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
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
                  {files.map((file) => {
                    const Icon = getFileIcon(file.mimeType);
                    const colorClass = getFileColor(file.mimeType);
                    return (
                      <a
                        key={file.id}
                        href={file.webViewLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/30 transition-colors"
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
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
