import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  const sizeClass = "h-4 w-4";
  
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
    return <Skeleton className="h-10 w-48 rounded-lg flex-shrink-0" />;
  }

  if (!weather) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30 border border-border/30 flex-shrink-0">
      {/* NYC Label */}
      <span className="text-xs font-medium text-muted-foreground">NYC</span>
      
      {/* Current Temp + Icon */}
      <div className="flex items-center gap-1.5">
        {getWeatherIcon(weather.current.condition)}
        <span className="text-sm font-medium">{weather.current.temperature}°</span>
      </div>
      
      {/* High/Low */}
      <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
        <span>H:{weather.today.high}°</span>
        <span>L:{weather.today.low}°</span>
      </div>
      
      {/* Divider */}
      <div className="w-px h-4 bg-border/50 hidden sm:block" />
      
      {/* Time */}
      <span className="text-xs text-muted-foreground hidden sm:block tabular-nums">{formattedTime}</span>
      
      {/* Market Status */}
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
        <span className="text-xs text-muted-foreground hidden md:block">
          {isMarketOpen ? 'Open' : 'Closed'}
        </span>
      </div>
    </div>
  );
};
