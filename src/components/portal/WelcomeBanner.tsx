import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

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
      <div className="flex items-center gap-6 mb-8">
        <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
    );
  }

  const greeting = getGreeting();
  const dayMessage = getDayMessage();

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
      {/* Agent Photo */}
      <div className="flex-shrink-0">
        {agent?.photoUrl ? (
          <img 
            src={agent.photoUrl} 
            alt={agent.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border-2 border-white/20">
            <User className="h-10 w-10 text-foreground/70" />
          </div>
        )}
      </div>

      {/* Greeting */}
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-1 leading-tight whitespace-nowrap">
          {greeting}, {agent?.firstName || "Agent"}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground font-light">
          {agent?.title && (
            <>
              <span>{agent.title}</span>
              <span className="text-white/30">•</span>
            </>
          )}
          <span>{dayMessage}</span>
        </div>
      </div>
    </div>
  );
};
