import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getDayMessage = () => {
  const day = new Date().getDay();
  const messages: Record<number, string> = {
    0: "Enjoy your Sunday!",
    1: "Let's start the week strong!",
    2: "Keep the momentum going!",
    3: "Midweek hustle!",
    4: "Almost there!",
    5: "Happy Friday!",
    6: "Have a great Saturday!",
  };
  return messages[day] || "Let's make it a great day!";
};

interface MarketCity {
  id: string;
  name: string;
  abbr: string;
  flag: string;
  timezone: string;
  lat: number;
  lon: number;
  marketOpen: number;
  marketClose: number;
}

const markets: MarketCity[] = [
  { id: "ny", name: "New York", abbr: "NY", flag: "🇺🇸", timezone: "America/New_York", lat: 40.7128, lon: -74.006, marketOpen: 9, marketClose: 17 },
  { id: "lon", name: "London", abbr: "LON", flag: "🇬🇧", timezone: "Europe/London", lat: 51.5074, lon: -0.1278, marketOpen: 9, marketClose: 17 },
  { id: "la", name: "Los Angeles", abbr: "LA", flag: "🇺🇸", timezone: "America/Los_Angeles", lat: 34.0522, lon: -118.2437, marketOpen: 9, marketClose: 17 },
  { id: "tlv", name: "Tel Aviv", abbr: "TLV", flag: "🇮🇱", timezone: "Asia/Jerusalem", lat: 32.0853, lon: 34.7818, marketOpen: 9, marketClose: 17 },
];

interface WeatherData {
  temperature: number;
  condition: string;
}

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes("thunder") || lower.includes("lightning")) return CloudLightning;
  if (lower.includes("rain") || lower.includes("drizzle") || lower.includes("shower")) return CloudRain;
  if (lower.includes("snow") || lower.includes("sleet") || lower.includes("hail")) return CloudSnow;
  if (lower.includes("fog") || lower.includes("mist") || lower.includes("haze")) return CloudFog;
  if (lower.includes("wind")) return Wind;
  if (lower.includes("cloud") || lower.includes("overcast")) return Cloud;
  return Sun;
};

const MarketBubble = ({ market }: { market: MarketCity }) => {
  const [time, setTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: market.timezone,
      });
      setTime(formatter.format(now));

      // Check if market is open
      const localHour = parseInt(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: market.timezone,
        }).format(now)
      );
      const dayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "short", timeZone: market.timezone });
      const isWeekday = !["Sat", "Sun"].includes(dayOfWeek);
      setIsOpen(isWeekday && localHour >= market.marketOpen && localHour < market.marketClose);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [market]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-weather", {
          body: { latitude: market.lat, longitude: market.lon, location: market.name },
        });
        if (!error && data?.weather) {
          setWeather({
            temperature: Math.round(data.weather.temperature),
            condition: data.weather.condition || "Clear",
          });
        }
      } catch {
        // Silently fail
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Refresh every 10 min
    return () => clearInterval(interval);
  }, [market]);

  const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Sun;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40 border border-border/50 min-w-0">
      <span className="text-base">{market.flag}</span>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-foreground">{market.abbr}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-500" : "bg-muted-foreground/50"}`} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
          <span>{time}</span>
          {weather && (
            <>
              <span className="text-border">•</span>
              <WeatherIcon className="h-3 w-3" />
              <span>{weather.temperature}°</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const WelcomeBanner = () => {
  const { data: agent, isLoading } = useCurrentAgent();

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 mb-4">
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  const greeting = getGreeting();
  const dayMessage = getDayMessage();

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Top row: Agent + Greeting + Market Bubbles */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left: Agent Photo + Greeting */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Agent Photo */}
          <div className="flex-shrink-0">
            {agent?.photoUrl ? (
              <img 
                src={agent.photoUrl} 
                alt={agent.fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-border/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center border-2 border-border/30">
                <User className="h-7 w-7 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Greeting */}
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-light text-foreground leading-tight truncate">
              {greeting}, {agent?.firstName || "Agent"}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              {agent?.title && (
                <>
                  <span className="truncate">{agent.title}</span>
                  <span className="text-border">•</span>
                </>
              )}
              <span>{dayMessage}</span>
            </div>
          </div>
        </div>

        {/* Right: Market Bubbles 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 lg:gap-2.5 flex-shrink-0">
          {markets.map((market) => (
            <MarketBubble key={market.id} market={market} />
          ))}
        </div>
      </div>
    </div>
  );
};
