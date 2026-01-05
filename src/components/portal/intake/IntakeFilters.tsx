import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IntakeFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDivision: string;
  onDivisionChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const divisions = [
  { value: "all", label: "All Divisions" },
  { value: "investment-sales", label: "Investment Sales" },
  { value: "commercial-leasing", label: "Commercial Leasing" },
  { value: "residential", label: "Residential" },
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

export function IntakeFilters({
  searchQuery,
  onSearchChange,
  selectedDivision,
  onDivisionChange,
  selectedStatus,
  onStatusChange,
}: IntakeFiltersProps) {
  const hasActiveFilters = selectedDivision !== "all" || selectedStatus !== "all" || searchQuery.length > 0;

  const clearFilters = () => {
    onSearchChange("");
    onDivisionChange("all");
    onStatusChange("all");
  };

  const activeFilterCount = [
    selectedDivision !== "all",
    selectedStatus !== "all",
    searchQuery.length > 0,
  ].filter(Boolean).length;

  return (
    <Card className="p-5">
      <div className="space-y-4">
        {/* Main Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10 h-11 bg-background"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => onSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Division Filter */}
          <Select value={selectedDivision} onValueChange={onDivisionChange}>
            <SelectTrigger className="w-full lg:w-[200px] h-11 bg-background">
              <SelectValue placeholder="All Divisions" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {divisions.map((div) => (
                <SelectItem key={div.value} value={div.value}>
                  {div.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full lg:w-[160px] h-11 bg-background">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span>Active filters:</span>
            </div>
            
            {searchQuery && (
              <Badge 
                variant="secondary" 
                className="gap-1.5 pl-2.5 pr-1 py-1"
              >
                Search: "{searchQuery}"
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-0.5 hover:bg-transparent"
                  onClick={() => onSearchChange("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {selectedDivision !== "all" && (
              <Badge 
                variant="secondary" 
                className="gap-1.5 pl-2.5 pr-1 py-1"
              >
                {divisions.find(d => d.value === selectedDivision)?.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-0.5 hover:bg-transparent"
                  onClick={() => onDivisionChange("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {selectedStatus !== "all" && (
              <Badge 
                variant="secondary" 
                className="gap-1.5 pl-2.5 pr-1 py-1"
              >
                {statuses.find(s => s.value === selectedStatus)?.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-0.5 hover:bg-transparent"
                  onClick={() => onStatusChange("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilterCount > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
