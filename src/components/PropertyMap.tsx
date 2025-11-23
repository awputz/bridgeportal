import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/hooks/useProperties';
import { Card } from './ui/card';
import { X } from 'lucide-react';

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

export const PropertyMap = ({ properties, onPropertyClick }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    // In production, this should come from Supabase secrets
    // For now, we'll use a placeholder that users need to replace
    const token = import.meta.env.VITE_MAPBOX_TOKEN || '';
    setMapboxToken(token);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    // Calculate center from properties with coordinates
    const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);
    const avgLat = propertiesWithCoords.length > 0
      ? propertiesWithCoords.reduce((sum, p) => sum + Number(p.latitude), 0) / propertiesWithCoords.length
      : 40.7128; // NYC default
    const avgLng = propertiesWithCoords.length > 0
      ? propertiesWithCoords.reduce((sum, p) => sum + Number(p.longitude), 0) / propertiesWithCoords.length
      : -74.0060;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [avgLng, avgLat],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for properties with coordinates
    properties.forEach(property => {
      if (!property.latitude || !property.longitude) return;

      const el = document.createElement('div');
      el.className = 'property-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: hsl(var(--primary));
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      `;
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      el.addEventListener('click', () => {
        setSelectedProperty(property);
        if (onPropertyClick) {
          onPropertyClick(property);
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([Number(property.longitude), Number(property.latitude)])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [properties, onPropertyClick]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center p-8 max-w-md">
          <p className="text-lg font-medium mb-2">Map Configuration Required</p>
          <p className="text-sm text-muted-foreground">
            Please add your Mapbox token to the backend secrets to enable the map view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      
      {selectedProperty && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 p-4 z-10">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full"
          >
            <X size={16} />
          </button>
          
          <div className="space-y-2">
            <img
              src={selectedProperty.images?.[0] || '/placeholder.svg'}
              alt={selectedProperty.title}
              className="w-full h-32 object-cover rounded-lg"
            />
            <h3 className="font-semibold">{selectedProperty.title}</h3>
            <p className="text-sm text-muted-foreground">{selectedProperty.address}</p>
            <p className="text-lg font-semibold text-primary">
              ${selectedProperty.price.toLocaleString()}
              {selectedProperty.listing_type === 'rent' && <span className="text-xs">/mo</span>}
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              {selectedProperty.bedrooms && <span>{selectedProperty.bedrooms} beds</span>}
              {selectedProperty.bathrooms && <span>{selectedProperty.bathrooms} baths</span>}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
