import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Loader2,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  File,
} from "lucide-react";
import { DriveFile } from "@/hooks/useGoogleDrive";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface DriveFilePreviewProps {
  file: DriveFile | null;
  files: DriveFile[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (file: DriveFile) => void;
}

export function DriveFilePreview({ file, files, isOpen, onClose, onNavigate }: DriveFilePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (!file) return null;

  const currentIndex = files.findIndex(f => f.id === file.id);
  const previewableFiles = files.filter(f => !f.mimeType.includes("folder"));
  const currentPreviewIndex = previewableFiles.findIndex(f => f.id === file.id);
  const hasPrev = currentPreviewIndex > 0;
  const hasNext = currentPreviewIndex < previewableFiles.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setIsLoading(true);
      setZoom(1);
      setRotation(0);
      onNavigate(previewableFiles[currentPreviewIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setIsLoading(true);
      setZoom(1);
      setRotation(0);
      onNavigate(previewableFiles[currentPreviewIndex + 1]);
    }
  };

  const handleDownload = () => {
    if (file.webContentLink) {
      window.open(file.webContentLink, "_blank");
    }
  };

  const handleOpenInDrive = () => {
    if (file.webViewLink) {
      window.open(file.webViewLink, "_blank");
    }
  };

  const isImage = file.mimeType.includes("image");
  const isVideo = file.mimeType.includes("video");
  const isAudio = file.mimeType.includes("audio");
  const isPdf = file.mimeType.includes("pdf");
  const isGoogleDoc = file.mimeType.includes("document") && file.mimeType.includes("google");
  const isGoogleSheet = file.mimeType.includes("spreadsheet") && file.mimeType.includes("google");
  const isGoogleSlides = file.mimeType.includes("presentation") && file.mimeType.includes("google");
  const isGoogleFile = isGoogleDoc || isGoogleSheet || isGoogleSlides;

  const getPreviewContent = () => {
    if (isImage && file.thumbnailLink) {
      // Use high-res thumbnail
      const highResUrl = file.thumbnailLink.replace(/=s\d+/, "=s1600");
      return (
        <div className="relative flex items-center justify-center w-full h-full overflow-auto">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          <img
            src={highResUrl}
            alt={file.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <Film className="h-12 w-12 text-purple-500" />
            </div>
            <p className="text-foreground font-medium mb-2">{file.name}</p>
            <p className="text-muted-foreground text-sm mb-4">Video preview not available in browser</p>
            <Button onClick={handleOpenInDrive} variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open in Google Drive
            </Button>
          </div>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <Music className="h-12 w-12 text-orange-500" />
            </div>
            <p className="text-foreground font-medium mb-2">{file.name}</p>
            <p className="text-muted-foreground text-sm mb-4">Audio preview not available</p>
            <Button onClick={handleOpenInDrive} variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open in Google Drive
            </Button>
          </div>
        </div>
      );
    }

    if (isPdf || isGoogleFile) {
      // Embed Google viewer for PDFs and Google files
      const embedUrl = isGoogleFile 
        ? file.webViewLink?.replace("/view", "/preview") 
        : `https://drive.google.com/file/d/${file.id}/preview`;
      
      return (
        <div className="w-full h-full">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0 rounded-lg"
            allow="autoplay"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      );
    }

    // Fallback for other file types
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <File className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-2">{file.name}</p>
          <p className="text-muted-foreground text-sm mb-4">Preview not available for this file type</p>
          <div className="flex gap-2 justify-center">
            {file.webContentLink && (
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
            <Button onClick={handleOpenInDrive} variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open in Google Drive
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 bg-background/95 backdrop-blur-xl">
        <VisuallyHidden>
          <DialogTitle>Preview: {file.name}</DialogTitle>
        </VisuallyHidden>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-3 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            {file.size && (
              <span className="text-xs text-muted-foreground shrink-0">
                {formatFileSize(file.size)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isImage && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                  className="h-8 w-8"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                  className="h-8 w-8"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRotation(r => r + 90)}
                  className="h-8 w-8"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
              </>
            )}
            {file.webContentLink && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenInDrive}
              className="h-8 w-8"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 relative overflow-hidden">
          {getPreviewContent()}
          
          {/* Navigation Arrows */}
          {hasPrev && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Footer with file count */}
        <div className="px-4 py-2 border-t border-border/50 text-center">
          <span className="text-xs text-muted-foreground">
            {currentPreviewIndex + 1} of {previewableFiles.length} files
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
