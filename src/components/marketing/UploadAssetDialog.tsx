import { useState, useCallback } from "react";
import { useUploadMarketingAsset } from "@/hooks/marketing/useMarketingAssets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, X, Image, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: string;
}

const assetTypes = [
  { value: "logo", label: "Logo" },
  { value: "headshot", label: "Headshot" },
  { value: "photo", label: "Photo" },
  { value: "signature", label: "Signature" },
];

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function UploadAssetDialog({ open, onOpenChange, defaultType }: UploadAssetDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState(defaultType || "photo");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useUploadMarketingAsset();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload a PNG, JPG, WEBP, or SVG file";
    }
    if (file.size > MAX_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setFile(file);
    setName(file.name.replace(/\.[^/.]+$/, ""));
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !name.trim()) return;
    
    await uploadMutation.mutateAsync({ file, name: name.trim(), type });
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setName("");
    setType(defaultType || "photo");
    setError(null);
    onOpenChange(false);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setName("");
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-2 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-light">Upload Asset</DialogTitle>
          <DialogDescription className="text-sm">
            Add a new branding asset to your library
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
          {/* Drop Zone */}
          {!preview ? (
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={handleInputChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Drop your file here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP, SVG • Max 5MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="asset-name">Name</Label>
            <Input
              id="asset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Asset name"
            />
          </div>

          {/* Type Select */}
          <div className="space-y-2">
            <Label htmlFor="asset-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="asset-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !name.trim() || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
