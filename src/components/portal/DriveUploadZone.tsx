import { useState, useCallback, useRef } from "react";
import { Upload, X, CheckCircle2, AlertCircle, Loader2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface DriveUploadZoneProps {
  folderId?: string;
  onUploadComplete?: () => void;
  className?: string;
}

export function DriveUploadZone({ folderId, onUploadComplete, className }: DriveUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFiles = (files: File[]) => {
    // Google Drive upload requires write permissions which we don't have
    // For now, show a message that upload is not supported
    toast.info("Upload to Google Drive requires additional permissions. Use Google Drive directly to upload files.");
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const hasActiveUploads = uploads.some(u => u.status === "uploading" || u.status === "pending");

  return (
    <>
      {/* Drag Overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-12 rounded-3xl border-2 border-dashed border-gdrive-folder bg-gdrive-folder/5 text-center">
            <Upload className="h-16 w-16 text-gdrive-folder mx-auto mb-4" />
            <p className="text-xl font-medium text-foreground">Drop files here to upload</p>
            <p className="text-muted-foreground mt-2">Files will be uploaded to current folder</p>
          </div>
        </div>
      )}

      {/* Inline Upload Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all duration-200",
          isDragging
            ? "border-gdrive-folder bg-gdrive-folder/5"
            : "border-border/50 hover:border-border",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="card-content text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-foreground font-medium mb-1">
            Drag & drop files here
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            or click to browse
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Choose Files
          </Button>
        </div>

        {/* Upload Progress List */}
        {uploads.length > 0 && (
          <div className="border-t border-border/50 card-content-sm list-gap-md">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  {upload.status === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : upload.status === "error" ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : upload.status === "uploading" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gdrive-folder" />
                  ) : (
                    <File className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{upload.file.name}</p>
                  {upload.status === "uploading" && (
                    <Progress value={upload.progress} className="h-1 mt-1" />
                  )}
                  {upload.status === "error" && (
                    <p className="text-xs text-destructive">{upload.error}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeUpload(upload.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Compact upload button for action bar
export function DriveUploadButton({ folderId, onUploadComplete }: { folderId?: string; onUploadComplete?: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      toast.info("Upload to Google Drive requires additional permissions. Use Google Drive directly to upload files.");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Upload</span>
      </Button>
    </>
  );
}
