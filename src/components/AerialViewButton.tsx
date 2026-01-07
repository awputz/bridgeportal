import { useState } from "react";
import { Plane, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AerialViewButtonProps {
  address: string;
  latitude?: number;
  longitude?: number;
  className?: string;
}

export const AerialViewButton = ({
  address,
  latitude,
  longitude,
  className,
}: AerialViewButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Create Google Earth URL for the location
  const getGoogleEarthUrl = () => {
    if (latitude && longitude) {
      // Google Earth web with specific coordinates
      return `https://earth.google.com/web/@${latitude},${longitude},100a,500d,35y,0h,45t,0r`;
    }
    // Fall back to search by address
    const encodedAddress = encodeURIComponent(address);
    return `https://earth.google.com/web/search/${encodedAddress}`;
  };

  // Create Google Maps 3D view URL (for external links)
  const getGoogle3DUrl = () => {
    if (latitude && longitude) {
      return `https://www.google.com/maps/@${latitude},${longitude},100a,35y,39.15t/data=!3m1!1e3`;
    }
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/${encodedAddress}/@?data=!3m1!1e3`;
  };

  // Get embeddable URL using Maps Embed API
  const getEmbedUrl = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) return null;
    
    if (latitude && longitude) {
      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=18&maptype=satellite`;
    }
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&zoom=17&maptype=satellite`;
  };

  const embedUrl = getEmbedUrl();

  const handleOpenAerialView = () => {
    setIsLoading(true);
    setIsOpen(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenAerialView}
        className={cn("gap-2", className)}
      >
        <Plane className="h-4 w-4" />
        Cinematic Flyover
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Aerial View
            </DialogTitle>
            <DialogDescription>
              Explore the property and surrounding area in immersive 3D
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="aspect-video bg-muted/30 rounded-lg overflow-hidden relative">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center px-4">
                        Map preview unavailable. Use the buttons below to open in Google Maps.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => window.open(getGoogleEarthUrl(), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Google Earth
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 gap-2"
                    onClick={() => window.open(getGoogle3DUrl(), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Full 3D Experience
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  {address}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
