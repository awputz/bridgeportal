import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, Trash2, FolderPlus, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UseInProjectDialog } from "./UseInProjectDialog";

interface StagingImage {
  id: string;
  original_url: string;
  staged_url: string | null;
  status: string;
  room_type: string | null;
  style_preference: string | null;
}

interface StagingImageCardProps {
  image: StagingImage;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRetry?: (imageId: string) => void;
}

export function StagingImageCard({ image, isSelected, onClick, onDelete, onRetry }: StagingImageCardProps) {
  const [useDialogOpen, setUseDialogOpen] = useState(false);

  const getStatusIcon = () => {
    switch (image.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleUseInProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUseDialogOpen(true);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRetry?.(image.id);
  };

  const isCompleted = image.status === "completed" && image.staged_url;
  const isProcessing = image.status === "processing";
  const isFailed = image.status === "failed";

  return (
    <>
      <div
        className={cn(
          "relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all group",
          "border-2 hover:border-primary/50",
          isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent"
        )}
        onClick={onClick}
      >
        <img
          src={image.staged_url || image.original_url}
          alt="Property"
          className="w-full h-full object-cover"
        />
        
        {/* Status indicator */}
        <div className="absolute top-2 right-2">
          {getStatusIcon()}
        </div>

        {/* Staged badge */}
        {image.staged_url && (
          <Badge 
            variant="default" 
            className="absolute bottom-2 left-2 bg-green-500 text-xs"
          >
            Staged
          </Badge>
        )}

        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="text-xs text-blue-300 font-medium">Processing...</span>
            </div>
          </div>
        )}

        {/* Failed overlay with retry */}
        {isFailed && onRetry && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-sm">
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleRetry}
              className="gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          </div>
        )}

        {/* Action buttons on hover */}
        <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="destructive"
            size="icon"
            className="h-6 w-6"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          {isCompleted && (
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6"
              onClick={handleUseInProject}
            >
              <FolderPlus className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Selection overlay */}
        {isSelected && !isProcessing && !isFailed && (
          <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
        )}
      </div>

      {isCompleted && (
        <UseInProjectDialog
          open={useDialogOpen}
          onOpenChange={setUseDialogOpen}
          imageUrl={image.staged_url!}
          imageName={image.room_type ? `${image.room_type} - ${image.style_preference}` : undefined}
        />
      )}
    </>
  );
}