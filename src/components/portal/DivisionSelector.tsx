import { Link, useLocation } from "react-router-dom";
import { TrendingUp, Building2, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const divisions = [
  { 
    id: "investment-sales", 
    name: "Investment Sales", 
    icon: TrendingUp,
    description: "LOIs, exclusives, setup sheets"
  },
  { 
    id: "commercial-leasing", 
    name: "Commercial Leasing", 
    icon: Building2,
    description: "Tenant & landlord rep documents"
  },
  { 
    id: "residential", 
    name: "Residential", 
    icon: Home,
    description: "Rental & sales templates"
  },
];

interface DivisionSelectorProps {
  activeDivision?: string;
}

export const DivisionSelector = ({ activeDivision }: DivisionSelectorProps) => {
  const location = useLocation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {divisions.map((division) => {
        const Icon = division.icon;
        const isActive = activeDivision === division.id || 
          location.pathname.includes(division.id);
        
        return (
          <Link
            key={division.id}
            to={`/portal/templates/${division.id}`}
            className={cn(
              "glass-card p-6 flex flex-col items-center text-center transition-all duration-300",
              isActive 
                ? "border-white/20 bg-white/[0.06]" 
                : "hover:border-white/15 hover:bg-white/[0.04]"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
              isActive ? "bg-white/15" : "bg-white/5"
            )}>
              <Icon className={cn(
                "h-7 w-7 transition-colors",
                isActive ? "text-foreground" : "text-foreground/60"
              )} />
            </div>
            <h3 className="text-base font-light text-foreground mb-1">
              {division.name}
            </h3>
            <p className="text-xs text-muted-foreground font-light">
              {division.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export { divisions };
