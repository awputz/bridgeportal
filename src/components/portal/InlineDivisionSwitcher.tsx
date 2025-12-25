import { TrendingUp, Building2, Home, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDivision, Division, divisionConfigs } from "@/contexts/DivisionContext";
import { useState, useEffect } from "react";

const divisionIcons: Record<Division, typeof TrendingUp> = {
  "investment-sales": TrendingUp,
  "commercial-leasing": Building2,
  "residential": Home,
};

const divisionOrder: Division[] = ["investment-sales", "commercial-leasing", "residential"];

export const InlineDivisionSwitcher = () => {
  const { division, setDivision, divisionConfig } = useDivision();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem("division-switcher-hint-seen");
    if (!hasSeenHint) {
      setShowHint(true);
    }
  }, []);

  const handleDivisionChange = (newDivision: Division) => {
    setDivision(newDivision);
    // Mark hint as seen after first interaction
    if (showHint) {
      localStorage.setItem("division-switcher-hint-seen", "true");
      setShowHint(false);
    }
  };

  return (
    <div className="relative">
      {/* Hint banner for first-time users */}
      {showHint && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-bounce whitespace-nowrap z-10">
          <Sparkles className="h-4 w-4" />
          <span>Click to switch your division</span>
          <ArrowRight className="h-4 w-4 animate-pulse" />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Working in:</span>
          {showHint && (
            <span className="text-primary animate-pulse flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              tap to change
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {divisionOrder.map((div) => {
            const Icon = divisionIcons[div];
            const config = divisionConfigs[div];
            const isSelected = division === div;

            return (
              <button
                key={div}
                onClick={() => handleDivisionChange(div)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                  "border-2 bg-card hover:shadow-lg",
                  isSelected
                    ? "border-primary shadow-md scale-[1.02]"
                    : "border-border/50 hover:border-primary/50 opacity-70 hover:opacity-100"
                )}
                style={{
                  borderColor: isSelected ? config.color : undefined,
                  boxShadow: isSelected ? `0 4px 20px ${config.color}30` : undefined,
                }}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isSelected ? "bg-primary/10" : "bg-muted"
                  )}
                  style={{
                    backgroundColor: isSelected ? `${config.color}20` : undefined,
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: isSelected ? config.color : undefined }}
                  />
                </div>
                <div className="text-left">
                  <div
                    className={cn(
                      "font-semibold text-sm",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {config.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {div === "investment-sales" && "Sales & Acquisitions"}
                    {div === "commercial-leasing" && "Office & Retail"}
                    {div === "residential" && "Rentals & Sales"}
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="ml-2 h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: config.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
