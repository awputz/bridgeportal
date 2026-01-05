import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, ChevronDown, ChevronUp, Sunset } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    weatherCode: number;
  }>;
  location: string;
}

const getWeatherIcon = (condition: string, size: "sm" | "md" = "sm") => {
  const lower = condition.toLowerCase();
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  
  if (lower.includes("thunder") || lower.includes("lightning")) return <CloudLightning className={sizeClass} />;
  if (lower.includes("rain") || lower.includes("drizzle") || lower.includes("shower")) return <CloudRain className={sizeClass} />;
  if (lower.includes("snow") || lower.includes("sleet") || lower.includes("hail")) return <CloudSnow className={sizeClass} />;
  if (lower.includes("fog") || lower.includes("mist") || lower.includes("haze")) return <CloudFog className={sizeClass} />;
  if (lower.includes("wind")) return <Wind className={sizeClass} />;
  if (lower.includes("cloud") || lower.includes("overcast")) return <Cloud className={sizeClass} />;
  return <Sun className={`${sizeClass} text-yellow-500`} />;
};

export const NYCWeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if market is open (9:30 AM - 4:00 PM ET, weekdays)
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: "America/New_York",
      });
      const [hourStr, minStr] = formatter.format(now).split(":");
      const hour = parseInt(hourStr);
      const min = parseInt(minStr);
      const timeInMinutes = hour * 60 + min;
      const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/New_York" });
      const isWeekday = !["Sat", "Sun"].includes(dayOfWeek);
      setIsMarketOpen(isWeekday && timeInMinutes >= 570 && timeInMinutes < 960);
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
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-10 w-48 rounded-lg flex-shrink-0 hidden md:block" />
        <Skeleton className="h-11 w-full rounded-lg md:hidden" />
      </>
    );
  }

  if (!weather) return null;

  const popoverContent = (
    <div className="w-72 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">New York City</span>
        <span className="text-xs text-muted-foreground tabular-nums">{formattedTime} ET</span>
      </div>

      {/* Current Conditions */}
      <div className="flex items-center gap-3">
        {getWeatherIcon(weather.current.condition, "md")}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{weather.current.temperature}°F</span>
            <span className="text-sm text-muted-foreground capitalize">{weather.current.condition}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Feels like {weather.current.feelsLike}°F • Wind {weather.current.windSpeed} mph
          </div>
        </div>
      </div>

      {/* Today's Details */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
        <div className="flex items-center gap-4">
          <span>H: {weather.today.high}° / L: {weather.today.low}°</span>
        </div>
        {weather.today.sunset && (
          <div className="flex items-center gap-1">
            <Sunset className="h-3 w-3" />
            <span>{weather.today.sunset}</span>
          </div>
        )}
      </div>

      {/* 5-Day Forecast */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="border-t border-border/50 pt-3">
          <div className="text-xs font-medium text-muted-foreground mb-2">5-Day Forecast</div>
          <div className="grid grid-cols-5 gap-1">
            {weather.forecast.slice(0, 5).map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <span className="text-xs text-muted-foreground">{day.day}</span>
                {getWeatherIcon(day.condition, "sm")}
                <div className="text-xs">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-muted-foreground">/{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Status */}
      <div className="flex items-center gap-2 border-t border-border/50 pt-3">
        <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
        <span className="text-xs text-muted-foreground">
          NYSE {isMarketOpen ? 'Open' : 'Closed'}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Version */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30 border border-border/30 flex-shrink-0 hover:bg-muted/50 transition-colors cursor-pointer">
            <span className="text-xs font-medium text-muted-foreground">NYC</span>
            <div className="flex items-center gap-1.5">
              {getWeatherIcon(weather.current.condition)}
              <span className="text-sm font-medium">{weather.current.temperature}°</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>H:{weather.today.high}°</span>
              <span>L:{weather.today.low}°</span>
            </div>
            <div className="w-px h-4 bg-border/50" />
            <span className="text-xs text-muted-foreground tabular-nums">{formattedTime}</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
              <span className="text-xs text-muted-foreground">
                {isMarketOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            {isOpen ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0">
          {popoverContent}
        </PopoverContent>
      </Popover>

      {/* Mobile Version */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex md:hidden items-center justify-center gap-3 w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors cursor-pointer">
            <span className="text-xs font-medium text-muted-foreground">NYC</span>
            <div className="flex items-center gap-1.5">
              {getWeatherIcon(weather.current.condition)}
              <span className="text-sm font-medium">{weather.current.temperature}°</span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">H:{weather.today.high}° L:{weather.today.low}°</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground tabular-nums">{formattedTime}</span>
            {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto" />}
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="p-0 w-[calc(100vw-2rem)] max-w-sm">
          {popoverContent}
        </PopoverContent>
      </Popover>
    </>
  );
};
