import { useState } from "react";
import { Building2, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDealRoomPhotos } from "@/hooks/useDealRoomPhotos";

interface DealRoomCardImageProps {
  dealId: string;
  primaryImageUrl?: string | null;
  className?: string;
}

export function DealRoomCardImage({ 
  dealId, 
  primaryImageUrl,
  className 
}: DealRoomCardImageProps) {
  const [imageError, setImageError] = useState(false);
  const { data: photos, isLoading } = useDealRoomPhotos(dealId);

  // Use primary image from prop first, then from photos
  const imageUrl = primaryImageUrl || photos?.[0]?.image_url;
  const photoCount = photos?.length || 0;

  if (isLoading) {
    return (
      <Skeleton className={cn("w-full aspect-video rounded-lg", className)} />
    );
  }

  if (!imageUrl || imageError) {
    return (
      <div 
        className={cn(
          "w-full aspect-video rounded-lg bg-muted/50 flex items-center justify-center",
          className
        )}
      >
        <Building2 className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <img
        src={imageUrl}
        alt="Property"
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
      {photoCount > 1 && (
        <Badge 
          variant="secondary" 
          className="absolute bottom-2 right-2 gap-1 text-xs bg-background/80 backdrop-blur-sm"
        >
          <ImageIcon className="h-3 w-3" />
          {photoCount}
        </Badge>
      )}
    </div>
  );
}
