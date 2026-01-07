import { Search, Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ShareableDeal {
  id: string;
  property_address: string;
  value: number | null;
  deal_type: string;
  division: string;
  property_type: string | null;
}

interface DealSelectListProps {
  deals: ShareableDeal[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const formatValue = (value: number | null): string => {
  if (!value) return "—";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
};

const getDivisionColor = (division: string): string => {
  switch (division) {
    case "investment_sales":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "commercial":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "residential":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatDivision = (division: string): string => {
  switch (division) {
    case "investment_sales":
      return "Investment";
    case "commercial":
      return "Commercial";
    case "residential":
      return "Residential";
    default:
      return division;
  }
};

export function DealSelectList({
  deals,
  selectedId,
  onSelect,
  isLoading,
  searchQuery,
  onSearchChange,
}: DealSelectListProps) {
  const filteredDeals = deals.filter((deal) =>
    deal.property_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Building2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium">No deals available to share</p>
        <p className="text-xs text-muted-foreground mt-1">
          Create a deal in the CRM first, or all your deals are already shared.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search deals by address..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[200px] pr-3">
        {filteredDeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">No deals match your search</p>
          </div>
        ) : (
          <RadioGroup value={selectedId || ""} onValueChange={onSelect} className="space-y-2">
            {filteredDeals.map((deal) => (
              <Label
                key={deal.id}
                htmlFor={deal.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedId === deal.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                <RadioGroupItem value={deal.id} id={deal.id} className="mt-0.5" />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{deal.property_address}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-primary">
                      {formatValue(deal.value)}
                    </span>
                    {deal.property_type && (
                      <span className="text-xs text-muted-foreground">• {deal.property_type}</span>
                    )}
                    <span className="text-xs text-muted-foreground">• {deal.deal_type}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-medium",
                        getDivisionColor(deal.division)
                      )}
                    >
                      {formatDivision(deal.division)}
                    </span>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        )}
      </ScrollArea>
    </div>
  );
}
