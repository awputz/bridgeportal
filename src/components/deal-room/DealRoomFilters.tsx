import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DealRoomFilters } from "@/hooks/useDealRoom";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

interface DealRoomFiltersComponentProps {
  filters: DealRoomFilters;
  sortBy: "recent" | "value" | "comments";
  onFiltersChange: (filters: DealRoomFilters) => void;
  onSortChange: (sort: "recent" | "value" | "comments") => void;
  onClear: () => void;
  dealCount: number;
}

const DIVISIONS = [
  { value: "investment-sales", label: "Investment Sales" },
  { value: "commercial-leasing", label: "Commercial Leasing" },
  { value: "residential", label: "Residential" },
];

const PROPERTY_TYPES = [
  { value: "multifamily", label: "Multifamily" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "industrial", label: "Industrial" },
  { value: "mixed-use", label: "Mixed Use" },
  { value: "development", label: "Development" },
  { value: "land", label: "Land" },
];

export function DealRoomFiltersComponent({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  onClear,
  dealCount,
}: DealRoomFiltersComponentProps) {
  const debouncedSearch = useDebouncedCallback((value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  }, 300);

  const activeFilterCount = [
    filters.search,
    filters.division,
    filters.propertyType,
  ].filter(Boolean).length;

  const handleDivisionChange = (value: string) => {
    onFiltersChange({
      ...filters,
      division: value === "all" ? undefined : value,
    });
  };

  const handlePropertyTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      propertyType: value === "all" ? undefined : value,
    });
  };

  return (
    <div className="space-y-3">
      {/* Main filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address, tenant, or agent..."
            className="pl-9"
            defaultValue={filters.search || ""}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        {/* Division filter */}
        <Select
          value={filters.division || "all"}
          onValueChange={handleDivisionChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            {DIVISIONS.map((div) => (
              <SelectItem key={div.value} value={div.value}>
                {div.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Property type filter */}
        <Select
          value={filters.propertyType || "all"}
          onValueChange={handlePropertyTypeChange}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {PROPERTY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as "recent" | "value" | "comments")}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="value">Highest Value</SelectItem>
            <SelectItem value="comments">Most Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filters row */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {dealCount} deal{dealCount !== 1 ? "s" : ""} found
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, search: undefined })
                  }
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.division && (
              <Badge variant="secondary" className="gap-1">
                {DIVISIONS.find((d) => d.value === filters.division)?.label}
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, division: undefined })
                  }
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.propertyType && (
              <Badge variant="secondary" className="gap-1">
                {PROPERTY_TYPES.find((t) => t.value === filters.propertyType)?.label}
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, propertyType: undefined })
                  }
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
