import { Award, Shield, Users, TrendingUp } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLiveStats } from "@/hooks/useLiveStats";
import { cn } from "@/lib/utils";

const formatVolume = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B+`;
  }
  if (value >= 1000000) {
    return `$${Math.floor(value / 1000000)}M+`;
  }
  return `$${Math.floor(value / 1000)}K+`;
};

export const TrustBadges = () => {
  const { elementRef, isVisible } = useScrollReveal();
  const { data: stats, isLoading } = useLiveStats();

  const badges = [
    {
      icon: Award,
      title: "REBNY Member",
      description: "Industry accredited",
    },
    {
      icon: Shield,
      title: `${stats?.yearsExperience || 15}+ Years`,
      description: "Combined experience",
    },
    {
      icon: Users,
      title: `${stats?.teamCount || 0} Professionals`,
      description: "Expert team",
    },
    {
      icon: TrendingUp,
      title: isLoading ? "Loading..." : formatVolume(stats?.totalVolume || 0),
      description: `${stats?.transactionCount || 0}+ transactions closed`,
    },
  ];

  return (
    <section ref={elementRef} className="py-12 border-y border-border/50 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div
              key={badge.title}
              className={cn(
                "flex flex-col items-center text-center transition-all duration-700",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <badge.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-medium text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
