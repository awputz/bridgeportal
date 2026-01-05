import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { NYCWeatherWidget } from "./NYCWeatherWidget";

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

export const WelcomeBanner = () => {
  const { data: agent, isLoading } = useCurrentAgent();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-6">
          <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const greeting = getGreeting();
  const dayMessage = getDayMessage();

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      {/* Left: Agent Photo + Greeting */}
      <div className="flex items-center gap-4 min-w-0">
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

      {/* Right: NYC Weather Widget */}
      <NYCWeatherWidget />
    </div>
  );
};
