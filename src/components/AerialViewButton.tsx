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

  // Create Google Maps 3D view URL
  const getGoogle3DUrl = () => {
    if (latitude && longitude) {
      return `https://www.google.com/maps/@${latitude},${longitude},100a,35y,39.15t/data=!3m1!1e3`;
    }
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/${encodedAddress}/@?data=!3m1!1e3`;
  };

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
                  <iframe
                    src={getGoogle3DUrl()}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
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
