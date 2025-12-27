import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MoreHorizontal, 
  Building2,
  Calendar,
  User,
  ArrowUpDown,
  ExternalLink,
  Check
} from "lucide-react";
import { CRMDeal, CRMDealStage } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  formatFullCurrency, 
  formatResidentialRent, 
  formatInvestmentSalesPrice,
} from "@/lib/formatters";

interface CRMTableProps {
  deals: CRMDeal[];
  stages: CRMDealStage[];
  onStageChange: (dealId: string, newStageId: string) => void;
  onDeleteDeal?: (dealId: string) => void;
  division: string;
  selectedDeals?: Set<string>;
  onSelectionChange?: (dealId: string, selected: boolean) => void;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  medium: { label: "Medium", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  low: { label: "Low", className: "bg-green-500/20 text-green-400 border-green-500/30" },
};

const formatDealValueByDivision = (deal: CRMDeal, division: string): string => {
  if (division === "investment-sales") {
    const price = deal.asking_price || deal.offer_price || deal.value;
    if (!price) return "—";
    return formatInvestmentSalesPrice(price);
  }
  
  if (division === "commercial-leasing") {
    if (deal.asking_rent_psf) {
      return `$${deal.asking_rent_psf.toFixed(2)}/SF`;
    }
    if (deal.value) return formatFullCurrency(deal.value);
    return "—";
  }
  
  if (division === "residential") {
    if (deal.is_rental && deal.monthly_rent) {
      return formatResidentialRent(deal.monthly_rent);
    }
    if (deal.listing_price) {
      return formatFullCurrency(deal.listing_price);
    }
    if (deal.value) {
      return deal.value < 50000 
        ? formatResidentialRent(deal.value)
        : formatFullCurrency(deal.value);
    }
    return "—";
  }
  
  return deal.value ? formatFullCurrency(deal.value) : "—";
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const CRMTable = ({ 
  deals, 
  stages, 
  onStageChange, 
  onDeleteDeal,
  division,
  selectedDeals = new Set(),
  onSelectionChange,
}: CRMTableProps) => {
  const [sortField, setSortField] = useState<string>("updated_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedDeals = [...deals].sort((a, b) => {
    let aVal: any, bVal: any;
    
    switch (sortField) {
      case "property_address":
        aVal = a.property_address.toLowerCase();
        bVal = b.property_address.toLowerCase();
        break;
      case "value":
        aVal = a.value || 0;
        bVal = b.value || 0;
        break;
      case "expected_close":
        aVal = a.expected_close ? new Date(a.expected_close).getTime() : 0;
        bVal = b.expected_close ? new Date(b.expected_close).getTime() : 0;
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aVal = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bVal = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case "cap_rate":
        aVal = a.cap_rate || 0;
        bVal = b.cap_rate || 0;
        break;
      default:
        aVal = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        bVal = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
    >
      {children}
      <ArrowUpDown className={cn(
        "h-3 w-3",
        sortField === field ? "text-foreground" : "text-muted-foreground/50"
      )} />
    </button>
  );

  // Division-specific column labels and extra columns
  const getDivisionConfig = () => {
    switch (division) {
      case "investment-sales":
        return { 
          valueLabel: "Price", 
          showCapRate: true,
          showUnits: true,
        };
      case "commercial-leasing":
        return { 
          valueLabel: "Rent/SF", 
          showCapRate: false,
          showUnits: false,
        };
      case "residential":
        return { 
          valueLabel: "Price/Rent", 
          showCapRate: false,
          showUnits: false,
        };
      default:
        return { 
          valueLabel: "Value", 
          showCapRate: false,
          showUnits: false,
        };
    }
  };

  const config = getDivisionConfig();

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              {onSelectionChange && (
                <TableHead className="w-[50px]">
                  <span className="sr-only">Select</span>
                </TableHead>
              )}
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="property_address">Property</SortHeader>
              </TableHead>
              <TableHead className="text-muted-foreground font-light">Contact</TableHead>
              <TableHead className="text-muted-foreground font-light">Status</TableHead>
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="value">{config.valueLabel}</SortHeader>
              </TableHead>
              {config.showCapRate && (
                <TableHead className="text-muted-foreground font-light">
                  <SortHeader field="cap_rate">Cap Rate</SortHeader>
                </TableHead>
              )}
              {config.showUnits && (
                <TableHead className="text-muted-foreground font-light">Units</TableHead>
              )}
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="expected_close">Close Date</SortHeader>
              </TableHead>
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="priority">Priority</SortHeader>
              </TableHead>
              <TableHead className="text-muted-foreground font-light w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDeals.map((deal) => {
              const currentStage = stages.find(s => s.id === deal.stage_id);
              const priority = priorityConfig[deal.priority || "medium"];
              const isSelected = selectedDeals.has(deal.id);

              return (
                <TableRow 
                  key={deal.id} 
                  className={cn(
                    "border-white/5 hover:bg-white/5 transition-colors",
                    isSelected && "bg-primary/10"
                  )}
                >
                  {onSelectionChange && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelectionChange(deal.id, !!checked)}
                        aria-label={`Select ${deal.property_address}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-light">
                    <Link 
                      to={`/portal/crm/deals/${deal.id}`}
                      className="flex items-center gap-2 hover:text-foreground text-foreground/90 transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="truncate block max-w-[200px]">{deal.property_address}</span>
                        {deal.property_type && (
                          <span className="text-xs text-muted-foreground">{deal.property_type}</span>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {deal.contact ? (
                      <Link 
                        to={`/portal/crm/contacts/${deal.contact.id}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{deal.contact.full_name}</span>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={deal.stage_id || ""}
                      onValueChange={(value) => onStageChange(deal.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8 bg-transparent border-white/10 text-sm">
                        <div className="flex items-center gap-2">
                          {currentStage && (
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: currentStage.color }}
                            />
                          )}
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: stage.color }}
                              />
                              {stage.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground/90 font-medium">
                      {formatDealValueByDivision(deal, division)}
                    </div>
                  </TableCell>
                  {config.showCapRate && (
                    <TableCell>
                      {deal.cap_rate ? (
                        <span className="text-foreground/90">{deal.cap_rate.toFixed(2)}%</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  {config.showUnits && (
                    <TableCell>
                      {deal.unit_count ? (
                        <span className="text-foreground/90">{deal.unit_count}</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(deal.expected_close)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn("font-light border", priority.className)}
                    >
                      {priority.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/portal/crm/deals/${deal.id}`} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {onDeleteDeal && (
                          <DropdownMenuItem 
                            onClick={() => onDeleteDeal(deal.id)}
                            className="text-destructive"
                          >
                            Delete Deal
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {sortedDeals.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-light">No deals in your pipeline yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Create your first deal to start tracking</p>
        </div>
      )}
    </div>
  );
};