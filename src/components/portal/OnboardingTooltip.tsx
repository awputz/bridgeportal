import { useState, useEffect } from "react";
import { X, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingTooltipProps {
  id: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  onNext?: () => void;
  onSkipAll?: () => void;
}

const STORAGE_KEY = "bridge-onboarding-tooltips-dismissed";

export const OnboardingTooltip = ({
  id,
  title,
  description,
  position = "bottom",
  children,
  step,
  totalSteps,
  onNext,
  onSkipAll,
}: OnboardingTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const dismissedList: string[] = dismissed ? JSON.parse(dismissed) : [];
    
    if (!dismissedList.includes(id) && !dismissedList.includes("all")) {
      setIsDismissed(false);
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 500);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      const dismissedList: string[] = dismissed ? JSON.parse(dismissed) : [];
      dismissedList.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissedList));
      setIsDismissed(true);
    }, 200);
  };

  const handleSkipAll = () => {
    setIsVisible(false);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["all"]));
      setIsDismissed(true);
      onSkipAll?.();
    }, 200);
  };

  const handleNext = () => {
    handleDismiss();
    onNext?.();
  };

  if (isDismissed) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const arrowClasses = {
    top: "bottom-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-primary",
    bottom: "top-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-primary",
    left: "right-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-primary",
    right: "left-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-primary",
  };

  return (
    <div className="relative inline-block">
      {children}
      <div
        className={cn(
          "absolute z-50 w-72 transition-all duration-200",
          positionClasses[position],
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4">
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-0 h-0 border-[6px]",
              arrowClasses[position]
            )}
          />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="pr-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-medium text-sm">{title}</h3>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">{description}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center gap-2">
              {step !== undefined && totalSteps !== undefined && (
                <span className="text-xs opacity-70">
                  {step} of {totalSteps}
                </span>
              )}
              <button
                onClick={handleSkipAll}
                className="text-xs opacity-70 hover:opacity-100 underline"
              >
                Skip tour
              </button>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={onNext ? handleNext : handleDismiss}
              className="h-7 text-xs gap-1"
            >
              {onNext ? "Next" : "Got it"}
              {onNext && <ChevronRight className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook to reset all tooltips (for testing or settings)
export const useResetOnboardingTooltips = () => {
  return () => {
    localStorage.removeItem(STORAGE_KEY);
  };
};
