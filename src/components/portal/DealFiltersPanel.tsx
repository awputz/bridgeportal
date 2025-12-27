import { useState } from "react";
import { 
  Filter, 
  X, 
  ChevronDown, 
  Save,
  Trash2,
  Clock,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface DealFilters {
  stageIds: string[];
  priority: string[];
  minValue: number | null;
  maxValue: number | null;
  minCapRate: number | null;
  maxCapRate: number | null;
  expectedCloseStart: string | null;
  expectedCloseEnd: string | null;
  propertyTypes: string[];
  dealTypes: string[];
  search: string;
}

interface DealFiltersPanelProps {
  filters: DealFilters;
  onChange: (filters: DealFilters) => void;
  onClear: () => void;
  stages: { id: string; name: string; color: string }[];
  division: string;
}

const priorityOptions = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
];

const dealTypes = [
  { value: "sale", label: "Sale" },
  { value: "lease", label: "Lease" },
  { value: "listing", label: "Listing" },
  { value: "buyer-rep", label: "Buyer Rep" },
  { value: "tenant-rep", label: "Tenant Rep" },
];

const propertyTypes = {
  "investment-sales": [
    { value: "multifamily", label: "Multifamily" },
    { value: "mixed-use", label: "Mixed-Use" },
    { value: "office", label: "Office" },
    { value: "retail", label: "Retail" },
    { value: "industrial", label: "Industrial" },
    { value: "land", label: "Land" },
  ],
  "commercial-leasing": [
    { value: "office", label: "Office" },
    { value: "retail", label: "Retail" },
    { value: "flex", label: "Flex" },
    { value: "industrial", label: "Industrial" },
    { value: "warehouse", label: "Warehouse" },
    { value: "medical", label: "Medical" },
  ],
  "residential": [
    { value: "condo", label: "Condo" },
    { value: "co-op", label: "Co-op" },
    { value: "townhouse", label: "Townhouse" },
    { value: "single-family", label: "Single Family" },
    { value: "apartment", label: "Apartment" },
  ],
};

const quickFilters = [
  { id: "closing-soon", label: "Closing This Week", icon: Clock },
  { id: "stale", label: "Stale Deals (30+ days)", icon: AlertTriangle },
  { id: "high-value", label: "High Value", icon: TrendingUp },
];

export const DealFiltersPanel = ({
  filters,
  onChange,
  onClear,
  stages,
  division,
}: DealFiltersPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  const activeFilterCount =
    (filters.stageIds.length > 0 ? 1 : 0) +
    (filters.priority.length > 0 ? 1 : 0) +
    (filters.minValue || filters.maxValue ? 1 : 0) +
    (filters.minCapRate || filters.maxCapRate ? 1 : 0) +
    (filters.expectedCloseStart || filters.expectedCloseEnd ? 1 : 0) +
    (filters.propertyTypes.length > 0 ? 1 : 0) +
    (filters.dealTypes.length > 0 ? 1 : 0);

  const handleQuickFilter = (filterId: string) => {
    if (activeQuickFilter === filterId) {
      setActiveQuickFilter(null);
      onClear();
      return;
    }

    setActiveQuickFilter(filterId);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (filterId) {
      case "closing-soon":
        onChange({
          ...filters,
          expectedCloseStart: today.toISOString().split("T")[0],
          expectedCloseEnd: weekFromNow.toISOString().split("T")[0],
        });
        break;
      case "stale":
        // This would need to be handled differently - perhaps with a lastActivityDate filter
        onChange({
          ...filters,
          expectedCloseStart: null,
          expectedCloseEnd: thirtyDaysAgo.toISOString().split("T")[0],
        });
        break;
      case "high-value":
        onChange({
          ...filters,
          minValue: division === "residential" ? 1000000 : 5000000,
          maxValue: null,
        });
        break;
    }
  };

  const toggleArrayFilter = (
    key: keyof Pick<DealFilters, "stageIds" | "priority" | "propertyTypes" | "dealTypes">,
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  const divisionPropertyTypes = propertyTypes[division as keyof typeof propertyTypes] || [];

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {quickFilters.map((qf) => {
          const Icon = qf.icon;
          const isActive = activeQuickFilter === qf.id;
          return (
            <Button
              key={qf.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter(qf.id)}
              className="gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {qf.label}
            </Button>
          );
        })}
        
        <div className="flex-1" />
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5">
              Advanced
              <ChevronDown className={cn(
                "h-3.5 w-3.5 transition-transform",
                isOpen && "rotate-180"
              )} />
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <div className="glass-card p-4 space-y-6 border-white/10">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search deals..."
                value={filters.search}
                onChange={(e) => onChange({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stage Filter */}
              <div className="space-y-2">
                <Label>Stage</Label>
                <div className="flex flex-wrap gap-1.5">
                  {stages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => toggleArrayFilter("stageIds", stage.id)}
                      className={cn(
                        "px-2 py-1 rounded text-xs transition-colors flex items-center gap-1.5",
                        filters.stageIds.includes(stage.id)
                          ? "bg-foreground text-background"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      {stage.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-1.5">
                  {priorityOptions.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => toggleArrayFilter("priority", p.value)}
                      className={cn(
                        "px-2 py-1 rounded text-xs transition-colors",
                        filters.priority.includes(p.value)
                          ? "bg-foreground text-background"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deal Type Filter */}
              <div className="space-y-2">
                <Label>Deal Type</Label>
                <div className="flex flex-wrap gap-1.5">
                  {dealTypes.map((dt) => (
                    <button
                      key={dt.value}
                      onClick={() => toggleArrayFilter("dealTypes", dt.value)}
                      className={cn(
                        "px-2 py-1 rounded text-xs transition-colors",
                        filters.dealTypes.includes(dt.value)
                          ? "bg-foreground text-background"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type Filter */}
              {divisionPropertyTypes.length > 0 && (
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {divisionPropertyTypes.map((pt) => (
                      <button
                        key={pt.value}
                        onClick={() => toggleArrayFilter("propertyTypes", pt.value)}
                        className={cn(
                          "px-2 py-1 rounded text-xs transition-colors",
                          filters.propertyTypes.includes(pt.value)
                            ? "bg-foreground text-background"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Value Range */}
              <div className="space-y-2">
                <Label>Value Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minValue || ""}
                    onChange={(e) =>
                      onChange({ ...filters, minValue: e.target.value ? Number(e.target.value) : null })
                    }
                    className="w-24"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxValue || ""}
                    onChange={(e) =>
                      onChange({ ...filters, maxValue: e.target.value ? Number(e.target.value) : null })
                    }
                    className="w-24"
                  />
                </div>
              </div>

              {/* Expected Close Range */}
              <div className="space-y-2">
                <Label>Expected Close</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filters.expectedCloseStart || ""}
                    onChange={(e) =>
                      onChange({ ...filters, expectedCloseStart: e.target.value || null })
                    }
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="date"
                    value={filters.expectedCloseEnd || ""}
                    onChange={(e) =>
                      onChange({ ...filters, expectedCloseEnd: e.target.value || null })
                    }
                    className="w-32"
                  />
                </div>
              </div>

              {/* Cap Rate (Investment Sales) */}
              {division === "investment-sales" && (
                <div className="space-y-2">
                  <Label>Cap Rate (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Min"
                      value={filters.minCapRate || ""}
                      onChange={(e) =>
                        onChange({ ...filters, minCapRate: e.target.value ? Number(e.target.value) : null })
                      }
                      className="w-20"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Max"
                      value={filters.maxCapRate || ""}
                      onChange={(e) =>
                        onChange({ ...filters, maxCapRate: e.target.value ? Number(e.target.value) : null })
                      }
                      className="w-20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DealFiltersPanel;
