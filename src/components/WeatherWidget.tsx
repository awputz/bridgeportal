import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface WeatherData {
  temperature: number;
  condition?: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
}

interface WeatherWidgetProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  className?: string;
  compact?: boolean;
}

const getWeatherIcon = (condition: string | undefined | null) => {
  if (!condition) {
    return Cloud;
  }
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return CloudRain;
  }
  if (lowerCondition.includes('snow') || lowerCondition.includes('sleet')) {
    return CloudSnow;
  }
  if (lowerCondition.includes('wind')) {
    return Wind;
  }
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
    return Cloud;
  }
  return Sun;
};

export const WeatherWidget = ({
  latitude,
  longitude,
  address,
  className,
  compact = false,
}: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // Default to NYC coordinates if none provided
      const lat = latitude || 40.7128;
      const lng = longitude || -74.006;
      const locationName = address || "New York, NY";

      try {
        setIsLoading(true);
        setError(null);

        const { data, error: funcError } = await supabase.functions.invoke('get-weather', {
          body: { latitude: lat, longitude: lng, location: locationName }
        });

        if (funcError) {
          throw new Error(funcError.message);
        }

        if (data?.weather) {
          setWeather(data.weather);
        } else {
          throw new Error('No weather data returned');
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to load weather');
        // Set fallback data
        setWeather({
          temperature: 45,
          condition: 'Partly Cloudy',
          location: locationName,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [latitude, longitude, address]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading weather...</span>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const WeatherIcon = getWeatherIcon(weather?.condition);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <WeatherIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{weather.temperature}°F</span>
        <span className="text-muted-foreground">{weather.condition || 'Unknown'}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "glass-panel-subtle p-4 rounded-xl",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <WeatherIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-light">{weather.temperature}°F</span>
              <span className="text-muted-foreground text-sm">{weather.condition || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{weather.location}</span>
            </div>
          </div>
        </div>
        {(weather.humidity || weather.windSpeed) && (
          <div className="text-right text-xs text-muted-foreground space-y-1">
            {weather.humidity && <div>Humidity: {weather.humidity}%</div>}
            {weather.windSpeed && <div>Wind: {weather.windSpeed} mph</div>}
          </div>
        )}
      </div>
    </div>
  );
};
