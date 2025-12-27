import { useState, useEffect, useRef } from "react";
import { Box, Maximize2, Minimize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Immersive3DMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  className?: string;
  defaultExpanded?: boolean;
}

export const Immersive3DMap = ({
  latitude,
  longitude,
  address,
  className,
  defaultExpanded = false,
}: Immersive3DMapProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isLoading, setIsLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Google Maps 3D embed URL with photorealistic tiles
  const getMapUrl = () => {
    const zoom = isExpanded ? 18 : 17;
    const tilt = 45;
    const heading = 0;
    
    // Use satellite/3D view
    return `https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo'}&center=${latitude},${longitude}&zoom=${zoom}&maptype=satellite`;
  };

  // Alternative: Direct link to Google Maps 3D
  const get3DViewUrl = () => {
    return `https://www.google.com/maps/@${latitude},${longitude},100a,35y,39.15t/data=!3m1!1e3`;
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className={cn(
        "relative rounded-xl overflow-hidden border border-border/50 transition-all duration-300",
        isExpanded ? "h-[500px]" : "h-64",
        className
      )}
    >
      {/* Toggle Button */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Minimize</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Immersive Mode</span>
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={() => window.open(get3DViewUrl(), '_blank')}
        >
          <Box className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Full 3D</span>
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading 3D view...</span>
          </div>
        </div>
      )}

      {/* Map Iframe */}
      <iframe
        src={getMapUrl()}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
      />

      {/* Location Label */}
      {address && (
        <div className="absolute bottom-3 left-3 z-10">
          <div className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs text-foreground">
            {address}
          </div>
        </div>
      )}
    </div>
  );
};
