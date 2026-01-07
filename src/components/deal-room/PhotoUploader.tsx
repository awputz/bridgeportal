import { useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUploadDealRoomPhotos } from "@/hooks/useDealRoomPhotos";

interface PhotoUploaderProps {
  dealId: string;
  onComplete?: () => void;
}

const CATEGORIES = [
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
  { value: "amenities", label: "Amenities" },
  { value: "neighborhood", label: "Neighborhood" },
];

export function PhotoUploader({ dealId, onComplete }: PhotoUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("exterior");
  const [isDragging, setIsDragging] = useState(false);
  const uploadPhotos = useUploadDealRoomPhotos();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith("image/")
    );
    
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      file => file.type.startsWith("image/")
    );
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    await uploadPhotos.mutateAsync({ dealId, files, category });
    setFiles([]);
    onComplete?.();
  };

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Category:</span>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Drop images here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <span>Browse Files</span>
            </Button>
          </label>
        </div>
      </div>

      {/* Selected files preview */}
      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
          </p>
          <div className="grid grid-cols-4 gap-2">
            {files.map((file, idx) => (
              <div 
                key={`${file.name}-${idx}`} 
                className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={uploadPhotos.isPending}
              className="gap-2"
            >
              {uploadPhotos.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload {files.length} Photo{files.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFiles([]);
                onComplete?.();
              }}
              disabled={uploadPhotos.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
