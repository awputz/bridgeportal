import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export const PullToRefreshIndicator = ({
  isPulling,
  pullDistance,
  isRefreshing,
}: PullToRefreshIndicatorProps) => {
  if (!isPulling) return null;

  const rotation = Math.min(pullDistance * 3, 360);
  const opacity = Math.min(pullDistance / 80, 1);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        transform: `translateY(${Math.min(pullDistance - 40, 60)}px)`,
        opacity,
        transition: isRefreshing ? "transform 0.3s ease-out" : "none",
      }}
    >
      <div className="bg-background/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-border">
        <RefreshCw
          size={20}
          className={cn(
            "text-foreground transition-transform",
            isRefreshing && "animate-spin"
          )}
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        />
      </div>
    </div>
  );
};
