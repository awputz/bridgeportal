import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Type declarations for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          AutocompleteService: new () => GoogleAutocompleteService;
          PlacesService: new (div: HTMLDivElement) => GooglePlacesService;
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
}

interface GoogleAutocompleteService {
  getPlacePredictions: (
    request: { input: string; componentRestrictions?: { country: string }; types?: string[] },
    callback: (predictions: GooglePrediction[] | null, status: string) => void
  ) => void;
}

interface GooglePlacesService {
  getDetails: (
    request: { placeId: string; fields: string[] },
    callback: (place: GooglePlaceResult | null, status: string) => void
  ) => void;
}

interface GooglePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GooglePlaceResult {
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export interface AddressComponents {
  fullAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  borough?: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (address: AddressComponents) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AddressAutocomplete = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing an address...",
  className,
  disabled = false,
}: AddressAutocompleteProps) => {
  const [predictions, setPredictions] = useState<GooglePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<GoogleAutocompleteService | null>(null);
  const placesService = useRef<GooglePlacesService | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load Google Places script
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.warn("Google Places API key not found. Address autocomplete disabled.");
      return;
    }

    if (window.google?.maps?.places) {
      setIsGoogleLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize services
  useEffect(() => {
    if (isGoogleLoaded && window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement("div");
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
    }
  }, [isGoogleLoaded]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPredictions = useCallback(async (input: string) => {
    if (!autocompleteService.current || input.length < 3) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await new Promise<GooglePrediction[]>((resolve, reject) => {
        autocompleteService.current!.getPlacePredictions(
          { input, componentRestrictions: { country: "us" }, types: ["address"] },
          (predictions, status) => {
            if (status === window.google?.maps?.places?.PlacesServiceStatus?.OK && predictions) {
              resolve(predictions);
            } else {
              reject(new Error(status));
            }
          }
        );
      });

      setPredictions(response.slice(0, 5));
      setShowDropdown(true);
    } catch {
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(newValue), 300);
  };

  const parseAddressComponents = (place: GooglePlaceResult): AddressComponents => {
    const components = place.address_components || [];
    
    const getComponent = (type: string): string => {
      const component = components.find((c) => c.types.includes(type));
      return component?.long_name || "";
    };

    const getShortComponent = (type: string): string => {
      const component = components.find((c) => c.types.includes(type));
      return component?.short_name || "";
    };

    const sublocality = getComponent("sublocality_level_1");
    const borough = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"].includes(sublocality)
      ? sublocality : undefined;

    return {
      fullAddress: place.formatted_address || "",
      streetAddress: `${getComponent("street_number")} ${getComponent("route")}`.trim(),
      city: getComponent("locality") || getComponent("sublocality") || "",
      state: getShortComponent("administrative_area_level_1"),
      zipCode: getComponent("postal_code"),
      country: getShortComponent("country"),
      borough,
      neighborhood: getComponent("neighborhood") || getComponent("sublocality_level_2"),
      latitude: place.geometry?.location?.lat(),
      longitude: place.geometry?.location?.lng(),
    };
  };

  const handleSelectPrediction = async (prediction: GooglePrediction) => {
    if (!placesService.current) return;

    setIsLoading(true);
    setShowDropdown(false);

    try {
      const details = await new Promise<GooglePlaceResult>((resolve, reject) => {
        placesService.current!.getDetails(
          { placeId: prediction.place_id, fields: ["formatted_address", "address_components", "geometry"] },
          (place, status) => {
            if (status === window.google?.maps?.places?.PlacesServiceStatus?.OK && place) {
              resolve(place);
            } else {
              reject(new Error(status));
            }
          }
        );
      });

      const address = parseAddressComponents(details);
      onChange(address.fullAddress);
      onAddressSelect?.(address);
    } catch {
      onChange(prediction.description);
    } finally {
      setIsLoading(false);
      setPredictions([]);
    }
  };

  const handleClear = () => {
    onChange("");
    setPredictions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pl-10 pr-10", className)}
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        ) : value ? (
          <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showDropdown && predictions.length > 0 && (
        <div ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectPrediction(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-start gap-3 border-b border-border/50 last:border-0"
            >
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{prediction.structured_formatting.main_text}</div>
                <div className="text-xs text-muted-foreground truncate">{prediction.structured_formatting.secondary_text}</div>
              </div>
            </button>
          ))}
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground">Powered by Google</div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
