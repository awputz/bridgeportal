import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, Sunrise, Sunset, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  weatherCode: number;
}

interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  today: {
    high: number;
    low: number;
    sunrise: string | null;
    sunset: string | null;
  };
  forecast: ForecastDay[];
  location: string;
}

const getWeatherIcon = (condition: string, size: "sm" | "md" | "lg" = "md") => {
  const lower = condition.toLowerCase();
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-5 w-5";
  
  if (lower.includes("thunder") || lower.includes("lightning")) return <CloudLightning className={sizeClass} />;
  if (lower.includes("rain") || lower.includes("drizzle") || lower.includes("shower")) return <CloudRain className={sizeClass} />;
  if (lower.includes("snow") || lower.includes("sleet") || lower.includes("hail")) return <CloudSnow className={sizeClass} />;
  if (lower.includes("fog") || lower.includes("mist") || lower.includes("haze")) return <CloudFog className={sizeClass} />;
  if (lower.includes("wind")) return <Wind className={sizeClass} />;
  if (lower.includes("cloud") || lower.includes("overcast")) return <Cloud className={sizeClass} />;
  return <Sun className={sizeClass} />;
};

export const NYCWeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if market is open (9 AM - 5 PM ET, weekdays)
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: "America/New_York",
      });
      const hour = parseInt(formatter.format(now));
      const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/New_York" });
      const isWeekday = !["Sat", "Sun"].includes(dayOfWeek);
      setIsMarketOpen(isWeekday && hour >= 9 && hour < 17);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-weather", {
          body: { latitude: 40.7128, longitude: -74.006, location: "New York, NY" },
        });
        if (!error && data?.weather) {
          setWeather(data.weather);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });

  if (isLoading) {
    return (
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 flex-1" />
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 flex-1" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="glass-card p-4 rounded-xl">
      {/* Header: Location + Date/Time */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗽</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">New York City</span>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              isMarketOpen 
                ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                : "bg-muted text-muted-foreground"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? "bg-green-500" : "bg-muted-foreground"}`} />
              {isMarketOpen ? "Market Open" : "Market Closed"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formattedDate}</span>
          <span className="text-border">•</span>
          <span className="font-medium text-foreground tabular-nums">{formattedTime} EST</span>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 pb-4 border-b border-border/50">
        {/* Temperature + Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {getWeatherIcon(weather.current.condition, "lg")}
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light text-foreground">{weather.current.temperature}</span>
              <span className="text-xl text-muted-foreground">°F</span>
            </div>
            <p className="text-sm text-muted-foreground">{weather.current.condition}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 sm:ml-auto">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">High/Low:</span>
            <span className="font-medium">{weather.today.high}° / {weather.today.low}°</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Feels like:</span>
            <span className="font-medium">{weather.current.feelsLike}°F</span>
          </div>
          {weather.today.sunset && (
            <div className="flex items-center gap-2 text-sm">
              <Sunset className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{weather.today.sunset}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{weather.current.windSpeed} mph</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-5 gap-2">
        {weather.forecast.map((day, index) => (
          <div 
            key={day.day} 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              index === 0 ? "bg-primary/5" : "bg-muted/30"
            }`}
          >
            <span className={`text-xs font-medium ${index === 0 ? "text-primary" : "text-muted-foreground"}`}>
              {index === 0 ? "Today" : day.day}
            </span>
            <div className="text-muted-foreground">
              {getWeatherIcon(day.condition, "sm")}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium">{day.high}°</span>
              <span className="text-muted-foreground">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
