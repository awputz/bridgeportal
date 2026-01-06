import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ReceiptUploadProps {
  value?: { url: string; filename: string } | null;
  onChange: (receipt: { url: string; filename: string; path: string } | null) => void;
  onUpload: (file: File) => Promise<{ url: string | null; filename: string; path: string } | null>;
  isUploading?: boolean;
  progress?: number;
  className?: string;
}

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const ReceiptUpload = ({
  value,
  onChange,
  onUpload,
  isUploading = false,
  progress = 0,
  className,
}: ReceiptUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Use PDF, JPG, PNG, or WebP";
    }
    if (file.size > MAX_SIZE) {
      return "File too large. Maximum size is 5MB";
    }
    return null;
  };

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const result = await onUpload(file);
    if (result && result.url) {
      onChange({ url: result.url, filename: result.filename, path: result.path });
    }
  }, [onUpload, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input value to allow re-uploading same file
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  const isImage = value?.filename?.match(/\.(jpg|jpeg|png|webp)$/i);

  if (value?.url) {
    return (
      <div className={cn("relative border rounded-lg p-4 bg-muted/30", className)}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {isImage ? (
              <div className="w-16 h-16 rounded-md overflow-hidden border bg-background">
                <img 
                  src={value.url} 
                  alt="Receipt preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-md border bg-background flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.filename}</p>
            <p className="text-xs text-muted-foreground">Receipt uploaded</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragOver && "border-primary bg-primary/5",
          !isDragOver && "border-muted-foreground/25 hover:border-muted-foreground/50",
          isUploading && "pointer-events-none opacity-75"
        )}
      >
        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-2 mb-3">
              <Image className="h-6 w-6 text-muted-foreground" />
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Drop your receipt here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, JPG, PNG, WebP up to 5MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
};
