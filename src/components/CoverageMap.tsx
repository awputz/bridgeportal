import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useBridgeBoroughs, BridgeBorough } from '@/hooks/useBridgeMarkets';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

// Borough coordinates for NYC
const BOROUGH_COORDS: Record<string, [number, number]> = {
  manhattan: [-73.9712, 40.7831],
  brooklyn: [-73.9442, 40.6782],
  queens: [-73.7949, 40.7282],
  bronx: [-73.8648, 40.8448],
};

export const CoverageMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedBorough, setSelectedBorough] = useState<BridgeBorough | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const { data: boroughs, isLoading } = useBridgeBoroughs();
  const sectionReveal = useScrollReveal(0.1);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN || '';
    setMapboxToken(token);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-73.935242, 40.730610],
      zoom: 10,
      pitch: 30,
      bearing: -10,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    map.current.scrollZoom.disable();

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !boroughs?.length) return;

    // Wait for map to load
    const addMarkers = () => {
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      boroughs.forEach((borough) => {
        const coords = BOROUGH_COORDS[borough.slug];
        if (!coords) return;

        const el = document.createElement('div');
        el.className = 'borough-marker';
        el.innerHTML = `
          <div style="
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, hsl(47, 84%, 49%), hsl(47, 84%, 35%));
            border: 3px solid rgba(255,255,255,0.9);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="color: #1a1a1a; font-weight: 600; font-size: 14px;">
              ${borough.name.charAt(0)}
            </span>
          </div>
        `;

        el.addEventListener('mouseenter', () => {
          const inner = el.querySelector('div');
          if (inner) {
            inner.style.transform = 'scale(1.15)';
            inner.style.boxShadow = '0 6px 30px rgba(0,0,0,0.5)';
          }
        });

        el.addEventListener('mouseleave', () => {
          const inner = el.querySelector('div');
          if (inner) {
            inner.style.transform = 'scale(1)';
            inner.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
          }
        });

        el.addEventListener('click', () => {
          setSelectedBorough(borough);
          map.current?.flyTo({
            center: coords,
            zoom: 12,
            duration: 1000,
          });
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .addTo(map.current!);

        markers.current.push(marker);
      });
    };

    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on('load', addMarkers);
    }
  }, [boroughs]);

  const handleReset = () => {
    setSelectedBorough(null);
    map.current?.flyTo({
      center: [-73.935242, 40.730610],
      zoom: 10,
      pitch: 30,
      duration: 1000,
    });
  };

  if (!mapboxToken) {
    return null; // Don't show section if no token
  }

  return (
    <section 
      className="py-16 md:py-24 border-b border-border/50" 
      ref={sectionReveal.elementRef}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            sectionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            NYC Market Coverage
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Deep expertise across all five boroughs. Click a marker to explore market statistics.
          </p>
        </div>

        <div
          className={`relative transition-all duration-700 ${
            sectionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Map Container */}
          <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-2xl">
            <div 
              ref={mapContainer} 
              className="w-full h-[400px] md:h-[500px]" 
            />
            
            {/* Borough Info Card */}
            {selectedBorough && (
              <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:max-w-sm bg-card/95 backdrop-blur-md border border-border rounded-lg p-5 shadow-xl animate-fade-in">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-medium">{selectedBorough.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {selectedBorough.description}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {selectedBorough.metadata?.stats && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-background/50 rounded-md">
                      <DollarSign className="h-4 w-4 mx-auto text-accent mb-1" />
                      <p className="text-xs text-muted-foreground">Avg/Unit</p>
                      <p className="text-sm font-medium">{selectedBorough.metadata.stats.avgPricePerUnit}</p>
                    </div>
                    <div className="text-center p-2 bg-background/50 rounded-md">
                      <TrendingUp className="h-4 w-4 mx-auto text-accent mb-1" />
                      <p className="text-xs text-muted-foreground">Cap Rate</p>
                      <p className="text-sm font-medium">{selectedBorough.metadata.stats.capRate}</p>
                    </div>
                    <div className="text-center p-2 bg-background/50 rounded-md">
                      <MapPin className="h-4 w-4 mx-auto text-accent mb-1" />
                      <p className="text-xs text-muted-foreground">Volume</p>
                      <p className="text-sm font-medium">{selectedBorough.metadata.stats.volume}</p>
                    </div>
                  </div>
                )}

                {selectedBorough.metadata?.neighborhoods && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Key Neighborhoods</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedBorough.metadata.neighborhoods.slice(0, 5).map((n) => (
                        <span key={n} className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                          {n}
                        </span>
                      ))}
                      {selectedBorough.metadata.neighborhoods.length > 5 && (
                        <span className="text-xs px-2 py-1 text-muted-foreground">
                          +{selectedBorough.metadata.neighborhoods.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Button asChild size="sm" className="w-full font-light">
                  <Link to="/markets">
                    Explore All Markets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-4 py-3 hidden md:block">
              <p className="text-sm font-medium mb-2">Coverage Areas</p>
              <div className="space-y-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </>
                ) : (
                  boroughs?.map((b) => (
                    <div 
                      key={b.id} 
                      className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => {
                        setSelectedBorough(b);
                        const coords = BOROUGH_COORDS[b.slug];
                        if (coords) {
                          map.current?.flyTo({
                            center: coords,
                            zoom: 12,
                            duration: 1000,
                          });
                        }
                      }}
                    >
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      {b.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
