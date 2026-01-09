import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadStagingImage } from "@/hooks/marketing/useStaging";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadZoneProps {
  projectId: string;
  onUploadComplete: () => void;
}

export function ImageUploadZone({ projectId, onUploadComplete }: ImageUploadZoneProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; progress: number }[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = Array.from(e.dataTransfer.files).filter(file =>
        file.type.startsWith("image/")
      );
      
      if (files.length > 0) {
        await uploadFiles(files);
      }
    },
    [projectId]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith("image/")
    );
    
    if (files.length > 0) {
      await uploadFiles(files);
    }
    
    // Reset input
    e.target.value = "";
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setUploadProgress(files.map(f => ({ name: f.name, progress: 0 })));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not authenticated", variant: "destructive" });
      setUploading(false);
      return;
    }

    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        setUploadProgress(prev =>
          prev.map((p, idx) => (idx === i ? { ...p, progress: 50 } : p))
        );

        await uploadStagingImage(file, projectId, user.id);
        
        setUploadProgress(prev =>
          prev.map((p, idx) => (idx === i ? { ...p, progress: 100 } : p))
        );
        
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        toast({
          title: `Failed to upload ${file.name}`,
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    setUploadProgress([]);
    
    if (successCount > 0) {
      toast({ title: `${successCount} image${successCount > 1 ? "s" : ""} uploaded` });
      onUploadComplete();
    }
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        uploading && "pointer-events-none opacity-60"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      <div className="flex flex-col items-center justify-center gap-3 text-center">
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <div className="space-y-1">
              <p className="font-medium">Uploading images...</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                {uploadProgress.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="truncate max-w-[100px]">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Drag & drop images here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, WebP (Max 10MB each)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
