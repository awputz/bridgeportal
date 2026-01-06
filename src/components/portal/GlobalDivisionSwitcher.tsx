import { TrendingUp, Building2, Home, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDivision, Division, divisionConfigs } from "@/contexts/DivisionContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const divisionIcons: Record<Division, typeof TrendingUp> = {
  "investment-sales": TrendingUp,
  "commercial-leasing": Building2,
  "residential": Home,
};

export const GlobalDivisionSwitcher = () => {
  const { division, setDivision, divisionConfig, isAdmin } = useDivision();
  const CurrentIcon = divisionIcons[division];

  // AGENT VIEW: Static badge (non-clickable)
  if (!isAdmin) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
          "bg-white/10 border border-white/20"
        )}
        style={{ borderColor: divisionConfig.color + "40" }}
      >
        <CurrentIcon className="h-4 w-4" style={{ color: divisionConfig.color }} />
        <span>{divisionConfig.name}</span>
      </div>
    );
  }

  // ADMIN VIEW: Dropdown to switch divisions
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            "bg-white/10 hover:bg-white/20 border border-white/20"
          )}
          style={{ borderColor: divisionConfig.color + "40" }}
        >
          <CurrentIcon className="h-4 w-4" style={{ color: divisionConfig.color }} />
          <span>{divisionConfig.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-dropdown">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Switch division view
        </div>
        {(Object.keys(divisionConfigs) as Division[]).map((div) => {
          const Icon = divisionIcons[div];
          const config = divisionConfigs[div];
          const isSelected = division === div;

          return (
            <DropdownMenuItem
              key={div}
              onClick={() => setDivision(div)}
              className={cn(
                "flex items-center gap-3 cursor-pointer",
                isSelected && "bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" style={{ color: config.color }} />
              <span className="flex-1">{config.name}</span>
              {isSelected && <Check className="h-4 w-4 text-foreground" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
