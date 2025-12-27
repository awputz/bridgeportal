import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface MarketTime {
  name: string;
  timezone: string;
  flag: string;
}

const markets: MarketTime[] = [
  { name: "New York", timezone: "America/New_York", flag: "🇺🇸" },
  { name: "London", timezone: "Europe/London", flag: "🇬🇧" },
  { name: "Los Angeles", timezone: "America/Los_Angeles", flag: "🇺🇸" },
  { name: "Israel", timezone: "Asia/Jerusalem", flag: "🇮🇱" },
];

const formatTime = (timezone: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
};

const isBusinessHours = (timezone: string): boolean => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
    weekday: "short",
  });
  
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0");
  const weekday = parts.find(p => p.type === "weekday")?.value || "";
  
  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const isOpen = !isWeekend && hour >= 9 && hour < 17;
  
  return isOpen;
};

export const MarketClocksWidget = () => {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, string> = {};
      markets.forEach((market) => {
        newTimes[market.timezone] = formatTime(market.timezone);
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Market Status</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {markets.map((market) => {
          const isOpen = isBusinessHours(market.timezone);
          
          return (
            <div
              key={market.timezone}
              className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
            >
              <span className="text-lg">{market.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{market.name}</p>
                <p className="text-sm font-medium text-foreground tabular-nums">
                  {times[market.timezone] || "--:--"}
                </p>
              </div>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isOpen ? "bg-green-500" : "bg-muted-foreground/30"
                }`}
                title={isOpen ? "Market Open" : "Market Closed"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
