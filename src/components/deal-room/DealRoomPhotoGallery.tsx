import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Star, 
  Trash2, 
  Upload,
  ImageIcon,
  Building2,
  Home,
  TreePine,
  Sofa
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
  useDealRoomPhotos, 
  useSetPrimaryPhoto, 
  useDeleteDealRoomPhoto,
  DealRoomPhoto 
} from "@/hooks/useDealRoomPhotos";
import { PhotoUploader } from "./PhotoUploader";

interface DealRoomPhotoGalleryProps {
  dealId: string;
  isOwner: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  exterior: <Building2 className="h-3.5 w-3.5" />,
  interior: <Sofa className="h-3.5 w-3.5" />,
  amenities: <Home className="h-3.5 w-3.5" />,
  neighborhood: <TreePine className="h-3.5 w-3.5" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  exterior: "Exterior",
  interior: "Interior",
  amenities: "Amenities",
  neighborhood: "Neighborhood",
};

export function DealRoomPhotoGallery({ dealId, isOwner }: DealRoomPhotoGalleryProps) {
  const { data: photos, isLoading } = useDealRoomPhotos(dealId);
  const setPrimary = useSetPrimaryPhoto();
  const deletePhoto = useDeleteDealRoomPhoto();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showUploader, setShowUploader] = useState(false);

  if (isLoading) {
    return (
      <div className="px-6 space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-16 w-16 rounded" />
          <Skeleton className="h-16 w-16 rounded" />
          <Skeleton className="h-16 w-16 rounded" />
        </div>
      </div>
    );
  }

  const photosList = photos || [];

  // Group photos by category
  const photosByCategory = photosList.reduce((acc, photo) => {
    const cat = photo.category || "exterior";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(photo);
    return acc;
  }, {} as Record<string, DealRoomPhoto[]>);

  const handlePrevious = () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => Math.min(photosList.length - 1, prev + 1));
  };

  const handleSetPrimary = async (photoId: string) => {
    await setPrimary.mutateAsync({ dealId, photoId });
  };

  const handleDelete = async (photoId: string) => {
    await deletePhoto.mutateAsync({ photoId, dealId });
    if (selectedIndex >= photosList.length - 1) {
      setSelectedIndex(Math.max(0, photosList.length - 2));
    }
    if (photosList.length <= 1) {
      setLightboxOpen(false);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  // Empty state
  if (photosList.length === 0) {
    return (
      <div className="px-6 py-8">
        {showUploader ? (
          <PhotoUploader 
            dealId={dealId} 
            onComplete={() => setShowUploader(false)} 
          />
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              No photos added yet
            </p>
            {isOwner && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowUploader(true)}
              >
                <Upload className="h-4 w-4" />
                Add Photos
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="px-6 space-y-4">
        {/* Upload section if owner */}
        {isOwner && showUploader && (
          <PhotoUploader 
            dealId={dealId} 
            onComplete={() => setShowUploader(false)} 
          />
        )}

        {/* Category tabs */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between gap-2 mb-3">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-2 h-6">
                All ({photosList.length})
              </TabsTrigger>
              {Object.entries(photosByCategory).map(([category, catPhotos]) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="text-xs px-2 h-6 gap-1"
                >
                  {CATEGORY_ICONS[category]}
                  {catPhotos.length}
                </TabsTrigger>
              ))}
            </TabsList>
            {isOwner && !showUploader && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5"
                onClick={() => setShowUploader(true)}
              >
                <Upload className="h-3.5 w-3.5" />
                Add
              </Button>
            )}
          </div>

          {/* All photos */}
          <TabsContent value="all" className="m-0">
            <PhotoGrid 
              photos={photosList} 
              onPhotoClick={openLightbox}
            />
          </TabsContent>

          {/* Category-specific photos */}
          {Object.entries(photosByCategory).map(([category, catPhotos]) => (
            <TabsContent key={category} value={category} className="m-0">
              <PhotoGrid 
                photos={catPhotos} 
                onPhotoClick={(idx) => {
                  // Find the index in the full list
                  const photo = catPhotos[idx];
                  const fullIndex = photosList.findIndex(p => p.id === photo.id);
                  openLightbox(fullIndex);
                }}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 gap-0 bg-background/95 backdrop-blur-sm">
          <div className="relative">
            {/* Main image */}
            <div className="relative aspect-video bg-black/5">
              <img
                src={photosList[selectedIndex]?.image_url}
                alt={photosList[selectedIndex]?.caption || "Property photo"}
                className="w-full h-full object-contain"
              />
              
              {/* Navigation arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 hover:bg-background"
                onClick={handlePrevious}
                disabled={selectedIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 hover:bg-background"
                onClick={handleNext}
                disabled={selectedIndex === photosList.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Photo info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {photosList[selectedIndex]?.is_primary && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        Primary
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs capitalize">
                      {CATEGORY_LABELS[photosList[selectedIndex]?.category || "exterior"]}
                    </Badge>
                    <span className="text-xs text-white/80">
                      {selectedIndex + 1} / {photosList.length}
                    </span>
                  </div>
                  
                  {isOwner && (
                    <div className="flex items-center gap-1">
                      {!photosList[selectedIndex]?.is_primary && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-white hover:text-white hover:bg-white/20"
                          onClick={() => handleSetPrimary(photosList[selectedIndex].id)}
                          disabled={setPrimary.isPending}
                        >
                          <Star className="h-3.5 w-3.5 mr-1" />
                          Set Primary
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:text-destructive hover:bg-destructive/20"
                        onClick={() => handleDelete(photosList[selectedIndex].id)}
                        disabled={deletePhoto.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                {photosList[selectedIndex]?.caption && (
                  <p className="text-sm text-white/90 mt-2">
                    {photosList[selectedIndex].caption}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            <ScrollArea className="w-full">
              <div className="flex gap-2 p-3">
                {photosList.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={cn(
                      "w-16 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0",
                      idx === selectedIndex
                        ? "border-primary scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption || "Thumbnail"}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Photo grid sub-component
function PhotoGrid({ 
  photos, 
  onPhotoClick 
}: { 
  photos: DealRoomPhoto[];
  onPhotoClick: (index: number) => void;
}) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No photos in this category
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((photo, idx) => (
        <button
          key={photo.id}
          onClick={() => onPhotoClick(idx)}
          className="relative aspect-square rounded-lg overflow-hidden group"
        >
          <img
            src={photo.image_url}
            alt={photo.caption || "Property photo"}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          {photo.is_primary && (
            <div className="absolute top-1 left-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 drop-shadow" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
