import { CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

export function StagingImageCard({ image, isSelected, onClick, onDelete }: StagingImageCardProps) {
  const getStatusIcon = () => {
    switch (image.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
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

  return (
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

      {/* Delete button on hover */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 left-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      {/* Selection overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
      )}
    </div>
  );
}
