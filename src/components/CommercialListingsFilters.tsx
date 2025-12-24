import { useState } from "react";
import { ChevronDown, ChevronUp, X, SlidersHorizontal, MapPin, Ruler, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface CommercialFilters {
  sqftMin: number;
  sqftMax: number;
  rentMin: number;
  rentMax: number;
  selectedAreas: string[];
}

interface CommercialListingsFiltersProps {
  filters: CommercialFilters;
  onFiltersChange: (filters: CommercialFilters) => void;
  availableAreas: string[];
  totalCount: number;
  filteredCount: number;
}

const SQFT_PRESETS = [
  { label: "Any Size", min: 0, max: 50000 },
  { label: "Under 1,000 SF", min: 0, max: 1000 },
  { label: "1,000 - 3,000 SF", min: 1000, max: 3000 },
  { label: "3,000 - 5,000 SF", min: 3000, max: 5000 },
  { label: "5,000+ SF", min: 5000, max: 50000 },
];

const RENT_PRESETS = [
  { label: "Any Price", min: 0, max: 200 },
  { label: "Under $50/SF", min: 0, max: 50 },
  { label: "$50 - $75/SF", min: 50, max: 75 },
  { label: "$75 - $100/SF", min: 75, max: 100 },
  { label: "$100+/SF", min: 100, max: 200 },
];

export const CommercialListingsFilters = ({
  filters,
  onFiltersChange,
  availableAreas,
  totalCount,
  filteredCount,
}: CommercialListingsFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.sqftMin > 0 ||
    filters.sqftMax < 50000 ||
    filters.rentMin > 0 ||
    filters.rentMax < 200 ||
    filters.selectedAreas.length > 0;

  const activeFilterCount =
    (filters.sqftMin > 0 || filters.sqftMax < 50000 ? 1 : 0) +
    (filters.rentMin > 0 || filters.rentMax < 200 ? 1 : 0) +
    (filters.selectedAreas.length > 0 ? 1 : 0);

  const clearAllFilters = () => {
    onFiltersChange({
      sqftMin: 0,
      sqftMax: 50000,
      rentMin: 0,
      rentMax: 200,
      selectedAreas: [],
    });
  };

  const updateSqftRange = (min: number, max: number) => {
    onFiltersChange({ ...filters, sqftMin: min, sqftMax: max });
  };

  const updateRentRange = (min: number, max: number) => {
    onFiltersChange({ ...filters, rentMin: min, rentMax: max });
  };

  const toggleArea = (area: string) => {
    const newAreas = filters.selectedAreas.includes(area)
      ? filters.selectedAreas.filter((a) => a !== area)
      : [...filters.selectedAreas, area];
    onFiltersChange({ ...filters, selectedAreas: newAreas });
  };

  const removeArea = (area: string) => {
    onFiltersChange({
      ...filters,
      selectedAreas: filters.selectedAreas.filter((a) => a !== area),
    });
  };

  // Get current preset labels for display
  const getCurrentSqftLabel = () => {
    const preset = SQFT_PRESETS.find(
      (p) => p.min === filters.sqftMin && p.max === filters.sqftMax
    );
    if (preset) return preset.label;
    if (filters.sqftMax >= 50000) return `${filters.sqftMin.toLocaleString()}+ SF`;
    return `${filters.sqftMin.toLocaleString()} - ${filters.sqftMax.toLocaleString()} SF`;
  };

  const getCurrentRentLabel = () => {
    const preset = RENT_PRESETS.find(
      (p) => p.min === filters.rentMin && p.max === filters.rentMax
    );
    if (preset) return preset.label;
    if (filters.rentMax >= 200) return `$${filters.rentMin}+/SF`;
    return `$${filters.rentMin} - $${filters.rentMax}/SF`;
  };

  return (
    <div className="border-b border-border bg-card/50">
      <div className="container mx-auto px-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between py-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-sm">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {filteredCount === totalCount
                  ? `${totalCount} listings`
                  : `${filteredCount} of ${totalCount} listings`}
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <CollapsibleContent>
            <div className="pb-4 space-y-4">
              {/* Filter Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Square Footage Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Ruler className="h-3.5 w-3.5" />
                    Square Footage
                  </label>
                  <Select
                    value={`${filters.sqftMin}-${filters.sqftMax}`}
                    onValueChange={(value) => {
                      const [min, max] = value.split("-").map(Number);
                      updateSqftRange(min, max);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm bg-background">
                      <SelectValue placeholder="Any Size" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {SQFT_PRESETS.map((preset) => (
                        <SelectItem
                          key={`${preset.min}-${preset.max}`}
                          value={`${preset.min}-${preset.max}`}
                        >
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rent per SF Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    Price (per SF)
                  </label>
                  <Select
                    value={`${filters.rentMin}-${filters.rentMax}`}
                    onValueChange={(value) => {
                      const [min, max] = value.split("-").map(Number);
                      updateRentRange(min, max);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm bg-background">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {RENT_PRESETS.map((preset) => (
                        <SelectItem
                          key={`${preset.min}-${preset.max}`}
                          value={`${preset.min}-${preset.max}`}
                        >
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Location
                  </label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !filters.selectedAreas.includes(value)) {
                        toggleArea(value);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm bg-background">
                      <SelectValue
                        placeholder={
                          filters.selectedAreas.length > 0
                            ? `${filters.selectedAreas.length} selected`
                            : "All Locations"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {availableAreas.map((area) => (
                        <SelectItem
                          key={area}
                          value={area}
                          disabled={filters.selectedAreas.includes(area)}
                        >
                          {area}
                          {filters.selectedAreas.includes(area) && " ✓"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Active:</span>
                  
                  {(filters.sqftMin > 0 || filters.sqftMax < 50000) && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      {getCurrentSqftLabel()}
                      <button
                        onClick={() => updateSqftRange(0, 50000)}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {(filters.rentMin > 0 || filters.rentMax < 200) && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      {getCurrentRentLabel()}
                      <button
                        onClick={() => updateRentRange(0, 200)}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {filters.selectedAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="gap-1 text-xs">
                      {area}
                      <button
                        onClick={() => removeArea(area)}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default CommercialListingsFilters;
