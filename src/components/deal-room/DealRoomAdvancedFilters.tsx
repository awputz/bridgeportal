import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AdvancedFilters } from "@/hooks/useDealRoom";

interface DealRoomAdvancedFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  showCapRate?: boolean;
}

const PRICE_PRESETS = [
  { label: "< $1M", min: undefined, max: 1000000 },
  { label: "$1M-$5M", min: 1000000, max: 5000000 },
  { label: "$5M-$10M", min: 5000000, max: 10000000 },
  { label: "> $10M", min: 10000000, max: undefined },
];

const SF_PRESETS = [
  { label: "< 5K SF", min: undefined, max: 5000 },
  { label: "5K-25K SF", min: 5000, max: 25000 },
  { label: "25K-100K SF", min: 25000, max: 100000 },
  { label: "> 100K SF", min: 100000, max: undefined },
];

export function DealRoomAdvancedFilters({
  filters,
  onFiltersChange,
  showCapRate = false,
}: DealRoomAdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasAdvancedFilters = 
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minSF !== undefined ||
    filters.maxSF !== undefined ||
    filters.minCapRate !== undefined ||
    filters.maxCapRate !== undefined ||
    filters.newThisWeek ||
    filters.updatedToday;

  const advancedFilterCount = [
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
    filters.minSF !== undefined || filters.maxSF !== undefined,
    filters.minCapRate !== undefined || filters.maxCapRate !== undefined,
    filters.newThisWeek,
    filters.updatedToday,
  ].filter(Boolean).length;

  const clearAdvancedFilters = () => {
    onFiltersChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
      minSF: undefined,
      maxSF: undefined,
      minCapRate: undefined,
      maxCapRate: undefined,
      newThisWeek: undefined,
      updatedToday: undefined,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 w-full sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced
          {advancedFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {advancedFilterCount}
            </Badge>
          )}
          {isOpen ? (
            <ChevronUp className="h-4 w-4 ml-auto" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-auto" />
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border bg-muted/30">
          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Price Range</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-8 text-sm"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {PRICE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      minPrice: preset.min,
                      maxPrice: preset.max,
                    })
                  }
                  className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                    filters.minPrice === preset.min && filters.maxPrice === preset.max
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Square Footage Range */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Square Feet</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minSF || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minSF: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-8 text-sm"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxSF || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    maxSF: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {SF_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      minSF: preset.min,
                      maxSF: preset.max,
                    })
                  }
                  className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                    filters.minSF === preset.min && filters.maxSF === preset.max
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cap Rate (Investment Sales only) */}
          {showCapRate && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Cap Rate %</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  step="0.1"
                  value={filters.minCapRate || ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minCapRate: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="h-8 text-sm"
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  step="0.1"
                  value={filters.maxCapRate || ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxCapRate: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>
          )}

          {/* Time-based filters */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Recency</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="newThisWeek"
                  checked={!!filters.newThisWeek}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      newThisWeek: checked ? true : undefined,
                    })
                  }
                />
                <label
                  htmlFor="newThisWeek"
                  className="text-sm cursor-pointer"
                >
                  New this week
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="updatedToday"
                  checked={!!filters.updatedToday}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      updatedToday: checked ? true : undefined,
                    })
                  }
                />
                <label
                  htmlFor="updatedToday"
                  className="text-sm cursor-pointer"
                >
                  Updated today
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Clear advanced filters */}
        {hasAdvancedFilters && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAdvancedFilters}
              className="text-xs h-7"
            >
              <X className="h-3 w-3 mr-1" />
              Clear advanced filters
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
