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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDriveConnection, useConnectDrive, useDisconnectDrive, useDriveFiles, DriveFile } from "@/hooks/useGoogleDrive";

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('folder')) return Folder;
  if (mimeType.includes('image')) return Image;
  if (mimeType.includes('video')) return Film;
  if (mimeType.includes('audio')) return Music;
  if (mimeType.includes('pdf')) return FileText;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return Sheet;
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return Presentation;
  if (mimeType.includes('zip') || mimeType.includes('archive') || mimeType.includes('compressed')) return Archive;
  if (mimeType.includes('document') || mimeType.includes('text')) return FileText;
  return File;
};

const getFileColor = (mimeType: string) => {
  if (mimeType.includes('folder')) return 'text-yellow-400';
  if (mimeType.includes('image')) return 'text-pink-400';
  if (mimeType.includes('video')) return 'text-purple-400';
  if (mimeType.includes('audio')) return 'text-green-400';
  if (mimeType.includes('pdf')) return 'text-red-400';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'text-emerald-400';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'text-orange-400';
  return 'text-blue-400';
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function Drive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: connection, isLoading: isLoadingConnection, error: connectionError } = useDriveConnection();
  const { data: filesData, isLoading: isLoadingFiles, refetch: refetchFiles } = useDriveFiles({ 
    query: searchQuery || undefined,
    enabled: connection?.isConnected 
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
              Drive
            </h1>
            <p className="text-muted-foreground font-light">
              Connect your Google Drive to access and manage files
            </p>
          </div>

          {/* Connect Card */}
          <div className="glass-card p-8 md:p-12 max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-light text-foreground mb-3">
              Connect Your Google Drive
            </h2>
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
              className="gap-2"
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

            <p className="text-xs text-muted-foreground mt-6">
              We'll only request read permissions for your files
            </p>
          </div>
        </div>
      </div>
    );
  }

  const files = filesData?.files || [];

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
              Drive
            </h1>
            <p className="text-muted-foreground font-light">
              Your Google Drive files
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchFiles()} 
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
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

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Files */}
        <div className="glass-card p-4 md:p-6">
          {isLoadingFiles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No files match your search' : 'No files found'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file) => {
                const Icon = getFileIcon(file.mimeType);
                const iconColor = getFileColor(file.mimeType);
                return (
                  <a
                    key={file.id}
                    href={file.webViewLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg bg-background/50", iconColor)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {file.size && (
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                          )}
                          {file.modifiedTime && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(file.modifiedTime)}
                            </span>
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
              {files.map((file) => {
                const Icon = getFileIcon(file.mimeType);
                const iconColor = getFileColor(file.mimeType);
                return (
                  <a
                    key={file.id}
                    href={file.webViewLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className={cn("p-1.5 rounded-lg bg-muted/50", iconColor)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                        {file.name}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {formatFileSize(file.size)}
                    </span>
                    <span className="text-xs text-muted-foreground hidden md:block">
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
  );
}
