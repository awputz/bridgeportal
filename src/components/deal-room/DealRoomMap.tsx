import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DealRoomDeal } from "@/hooks/useDealRoom";
import { formatFullCurrency } from "@/lib/formatters";

// Get token from env
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface DealRoomMapProps {
  deals: DealRoomDeal[];
  onDealClick: (dealId: string) => void;
  selectedDealId?: string | null;
}

// Borough center coordinates for NYC
const BOROUGH_COORDS: Record<string, [number, number]> = {
  "Manhattan": [-73.9712, 40.7831],
  "Brooklyn": [-73.9442, 40.6782],
  "Queens": [-73.7949, 40.7282],
  "Bronx": [-73.8648, 40.8448],
  "Staten Island": [-74.1502, 40.5795],
};

// Get coordinates for a deal - uses lat/lng if available, otherwise approximates by borough
function getCoordinatesForDeal(deal: DealRoomDeal): [number, number] | null {
  // Use stored coordinates if available
  if ((deal as unknown as { latitude: number; longitude: number }).latitude && 
      (deal as unknown as { latitude: number; longitude: number }).longitude) {
    return [
      (deal as unknown as { longitude: number }).longitude,
      (deal as unknown as { latitude: number }).latitude
    ];
  }

  // Approximate by borough with random offset
  const borough = deal.borough || "Manhattan";
  const baseCoords = BOROUGH_COORDS[borough] || BOROUGH_COORDS["Manhattan"];
  
  // Add deterministic offset based on deal ID to prevent overlapping
  const hash = deal.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const offsetLng = ((hash % 100) / 100 - 0.5) * 0.02;
  const offsetLat = ((hash % 73) / 73 - 0.5) * 0.02;
  
  return [baseCoords[0] + offsetLng, baseCoords[1] + offsetLat];
}

// Get marker color based on price
function getMarkerColor(value: number | null): string {
  if (!value) return "#6b7280"; // gray
  if (value < 1000000) return "#22c55e"; // green
  if (value < 5000000) return "#eab308"; // yellow
  return "#ef4444"; // red
}

export function DealRoomMap({ deals, onDealClick, selectedDealId }: DealRoomMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-73.9712, 40.7831], // NYC center
      zoom: 11,
      pitch: 30,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    map.current.on("load", () => setMapLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add/update markers when deals change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoords = false;

    deals.forEach(deal => {
      const coords = getCoordinatesForDeal(deal);
      if (!coords) return;

      hasValidCoords = true;
      bounds.extend(coords);

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "deal-room-marker";
      el.style.cssText = `
        cursor: pointer;
        transition: transform 0.2s;
      `;

      const color = getMarkerColor(deal.value);
      const isSelected = selectedDealId === deal.id;
      
      el.innerHTML = `
        <div style="
          background: ${isSelected ? 'hsl(var(--primary))' : 'white'};
          color: ${isSelected ? 'white' : 'inherit'};
          border: 2px solid ${color};
          border-radius: 8px;
          padding: 6px 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          min-width: 80px;
          text-align: center;
          font-family: system-ui, sans-serif;
        ">
          <div style="font-size: 12px; font-weight: 600;">
            ${formatFullCurrency(deal.value)}
          </div>
          <div style="font-size: 10px; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
            ${deal.property_address.split(",")[0]}
          </div>
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onDealClick(deal.id);
      });

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.1)";
        el.style.zIndex = "1000";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.zIndex = "auto";
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coords)
        .addTo(map.current!);

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
      }).setHTML(`
        <div style="padding: 8px; font-family: system-ui, sans-serif;">
          <div style="font-weight: 600; margin-bottom: 4px;">${deal.property_address}</div>
          <div style="font-size: 13px; color: #666;">
            ${formatFullCurrency(deal.value)} • ${deal.property_type || deal.division}
          </div>
          <div style="font-size: 12px; color: #888; margin-top: 4px;">
            ${deal.agent?.full_name || "Unknown Agent"}
          </div>
        </div>
      `);

      marker.setPopup(popup);

      markersRef.current.set(deal.id, marker);
    });

    // Fit map to show all markers
    if (hasValidCoords && deals.length > 0) {
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });
    }
  }, [deals, mapLoaded, selectedDealId, onDealClick]);

  // Fly to selected deal
  useEffect(() => {
    if (!selectedDealId || !map.current || !mapLoaded) return;

    const marker = markersRef.current.get(selectedDealId);
    if (marker) {
      const lngLat = marker.getLngLat();
      map.current.flyTo({ center: lngLat, zoom: 14, duration: 1000 });
    }
  }, [selectedDealId, mapLoaded]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Map token not configured</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
        <p className="text-xs font-medium text-foreground mb-2">Deal Values</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">&lt; $1M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-muted-foreground">$1M - $5M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">&gt; $5M</span>
          </div>
        </div>
      </div>

      {/* Deal count */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-foreground">
          {deals.length} deal{deals.length !== 1 ? "s" : ""} on map
        </p>
      </div>
    </div>
  );
}
