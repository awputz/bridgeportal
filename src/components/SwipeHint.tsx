import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SwipeHintProps {
  text?: string;
  direction?: "horizontal" | "vertical";
  storageKey?: string;
  className?: string;
  delay?: number;
}

export const SwipeHint = ({
  text = "Swipe to explore",
  direction = "horizontal",
  storageKey,
  className,
  delay = 500,
}: SwipeHintProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has already seen this hint
    if (storageKey) {
      const hasSeen = localStorage.getItem(`swipe-hint-${storageKey}`);
      if (hasSeen) {
        setHasInteracted(true);
        return;
      }
    }

    // Show hint after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    // Auto-hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (storageKey) {
        localStorage.setItem(`swipe-hint-${storageKey}`, "true");
      }
    }, delay + 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [delay, storageKey]);

  // Hide on any touch/scroll interaction
  useEffect(() => {
    if (!isVisible) return;

    const handleInteraction = () => {
      setIsVisible(false);
      setHasInteracted(true);
      if (storageKey) {
        localStorage.setItem(`swipe-hint-${storageKey}`, "true");
      }
    };

    window.addEventListener("touchstart", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, [isVisible, storageKey]);

  if (!isMobile || hasInteracted || !isVisible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70 py-2 animate-fade-in",
        className
      )}
    >
      {direction === "horizontal" ? (
        <>
          <ChevronLeft className="h-3 w-3 animate-pulse" />
          <span className="font-light">{text}</span>
          <ChevronRight className="h-3 w-3 animate-pulse" />
        </>
      ) : (
        <>
          <span className="font-light">{text}</span>
          <ChevronDown className="h-3 w-3 animate-bounce" />
        </>
      )}
    </div>
  );
};
