import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MoreHorizontal, 
  Building2,
  Calendar,
  User,
  ArrowUpDown,
  ExternalLink,
  AlertCircle
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

const propertyConditionConfig: Record<string, { label: string; className: string }> = {
  distressed: { label: "Distressed", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  "value-add": { label: "Value Add", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  core: { label: "Core", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  "core-plus": { label: "Core+", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  opportunistic: { label: "Opportunistic", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
};

const propertyTypeConfig: Record<string, { label: string; className: string }> = {
  multifamily: { label: "Multifamily", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  "mixed-use": { label: "Mixed-Use", className: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
  office: { label: "Office", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  retail: { label: "Retail", className: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  industrial: { label: "Industrial", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  land: { label: "Land", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  hotel: { label: "Hotel", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  "special-purpose": { label: "Special", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
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
    if ((deal.is_rental || deal.deal_category === "rental") && deal.monthly_rent) {
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
  });
};

const isDueSoon = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
};

const isOverdue = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  return dueDate < today;
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

  // Division-specific column configuration
  const getDivisionColumns = () => {
    switch (division) {
      case "investment-sales":
        return { 
          valueLabel: "Budget", 
          showCapRate: true,
          showUnits: true,
          showSF: true,
          showCondition: true,
          showPropertyType: true,
          showDueDate: true,
          showReferral: true,
        };
      case "commercial-leasing":
        return { 
          valueLabel: "Rent/SF", 
          showCapRate: false,
          showUnits: false,
          showSF: true,
          showCondition: false,
          showPropertyType: false,
          showDueDate: true,
          showReferral: true,
          showSpaceType: true,
          showBusinessType: true,
        };
      case "residential":
        return { 
          valueLabel: "Budget", 
          showCapRate: false,
          showUnits: false,
          showSF: false,
          showCondition: false,
          showPropertyType: false,
          showDueDate: true,
          showReferral: true,
          showBedBath: true,
          showDealType: true,
        };
      default:
        return { 
          valueLabel: "Value", 
          showCapRate: false,
          showUnits: false,
          showSF: false,
          showCondition: false,
          showPropertyType: false,
          showDueDate: false,
          showReferral: false,
        };
    }
  };

  const config = getDivisionColumns();

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              {onSelectionChange && (
                <TableHead className="w-[40px]">
                  <span className="sr-only">Select</span>
                </TableHead>
              )}
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="property_address">Name / Property</SortHeader>
              </TableHead>
              {config.showDueDate && (
                <TableHead className="text-muted-foreground font-light">Due Date</TableHead>
              )}
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="value">{config.valueLabel}</SortHeader>
              </TableHead>
              {config.showSF && (
                <TableHead className="text-muted-foreground font-light">SQFT</TableHead>
              )}
              {config.showCapRate && (
                <TableHead className="text-muted-foreground font-light">
                  <SortHeader field="cap_rate">Cap</SortHeader>
                </TableHead>
              )}
              {config.showUnits && (
                <TableHead className="text-muted-foreground font-light">Units</TableHead>
              )}
              {config.showBedBath && (
                <TableHead className="text-muted-foreground font-light">Bed/Bath</TableHead>
              )}
              {config.showDealType && (
                <TableHead className="text-muted-foreground font-light">Type</TableHead>
              )}
              {config.showSpaceType && (
                <TableHead className="text-muted-foreground font-light">Space</TableHead>
              )}
              {config.showCondition && (
                <TableHead className="text-muted-foreground font-light">Condition</TableHead>
              )}
              {config.showPropertyType && (
                <TableHead className="text-muted-foreground font-light">Asset</TableHead>
              )}
              <TableHead className="text-muted-foreground font-light">Market</TableHead>
              {config.showReferral && (
                <TableHead className="text-muted-foreground font-light">Referral</TableHead>
              )}
              <TableHead className="text-muted-foreground font-light">Status</TableHead>
              <TableHead className="text-muted-foreground font-light w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDeals.map((deal) => {
              const currentStage = stages?.find(s => s.id === deal.stage_id);
              const isSelected = selectedDeals?.has(deal.id) ?? false;
              const dueDate = deal?.due_date || deal?.expected_close;
              const dueSoon = isDueSoon(dueDate);
              const overdue = isOverdue(dueDate);
              const propertyType = propertyTypeConfig[deal?.property_type || ""];
              const condition = propertyConditionConfig[deal?.property_condition || ""];
              const isRental = deal?.is_rental || deal?.deal_category === "rental";

              return (
                <TableRow 
                  key={deal.id} 
                  className={cn(
                    "border-white/5 hover:bg-white/5 transition-colors",
                    isSelected && "bg-primary/10"
                  )}
                >
                  {onSelectionChange && (
                    <TableCell className="py-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelectionChange(deal.id, !!checked)}
                        aria-label={`Select ${deal.property_address}`}
                      />
                    </TableCell>
                  )}
                  {/* Name / Property */}
                  <TableCell className="py-2 font-light">
                    <Link 
                      to={`/portal/crm/deals/${deal.id}`}
                      className="flex items-center gap-2 hover:text-foreground text-foreground/90 transition-colors"
                    >
                      <div className="min-w-0">
                        {deal?.contact?.full_name ? (
                          <>
                            <span className="truncate block max-w-[180px] font-medium">{deal.contact.full_name}</span>
                            <span className="text-xs text-muted-foreground truncate block max-w-[180px]">{deal.property_address || "No address"}</span>
                          </>
                        ) : (
                          <span className="truncate block max-w-[180px]">{deal?.property_address || "No address"}</span>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  {/* Due Date */}
                  {config.showDueDate && (
                    <TableCell className="py-2">
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        overdue && "text-red-400",
                        dueSoon && !overdue && "text-yellow-400",
                        !dueSoon && !overdue && "text-muted-foreground"
                      )}>
                        {(overdue || dueSoon) && <AlertCircle className="h-3 w-3" />}
                        {formatDate(dueDate)}
                      </div>
                    </TableCell>
                  )}
                  {/* Value/Budget */}
                  <TableCell className="py-2">
                    <div className="text-foreground/90 font-medium text-sm">
                      {formatDealValueByDivision(deal, division)}
                    </div>
                  </TableCell>
                  {/* SQFT */}
                  {config.showSF && (
                    <TableCell className="py-2">
                      {deal.gross_sf ? (
                        <span className="text-sm text-foreground/90">{deal.gross_sf.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  {/* Cap Rate */}
                  {config.showCapRate && (
                    <TableCell className="py-2">
                      {deal.cap_rate ? (
                        <span className="text-sm text-foreground/90">{deal.cap_rate.toFixed(1)}%</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  {/* Units */}
                  {config.showUnits && (
                    <TableCell className="py-2">
                      {deal.unit_count ? (
                        <span className="text-sm text-foreground/90">{deal.unit_count}</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  {/* Bed/Bath (Residential) */}
                  {config.showBedBath && (
                    <TableCell className="py-2">
                      {deal.bedrooms || deal.bathrooms ? (
                        <span className="text-sm text-foreground/90">
                          {deal.bedrooms || 0}B, {deal.bathrooms || 0}B
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  {/* Deal Type (Residential) */}
                  {config.showDealType && (
                    <TableCell className="py-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          isRental 
                            ? "bg-green-500/10 text-green-400 border-green-500/30" 
                            : "bg-pink-500/10 text-pink-400 border-pink-500/30"
                        )}
                      >
                        {isRental ? "Rental" : "Sale"}
                      </Badge>
                    </TableCell>
                  )}
                  {/* Space Type (Commercial) */}
                  {config.showSpaceType && (
                    <TableCell className="py-2">
                      {deal.space_type ? (
                        <Badge variant="outline" className="text-xs capitalize bg-purple-500/10 text-purple-400 border-purple-500/30">
                          {deal.space_type}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  {/* Condition (Investment Sales) */}
                  {config.showCondition && (
                    <TableCell className="py-2">
                      {condition ? (
                        <Badge variant="outline" className={cn("text-xs", condition.className)}>
                          {condition.label}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  {/* Property Type (Investment Sales) */}
                  {config.showPropertyType && (
                    <TableCell className="py-2">
                      {propertyType ? (
                        <Badge variant="outline" className={cn("text-xs", propertyType.className)}>
                          {propertyType.label}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  )}
                  {/* Market */}
                  <TableCell className="py-2">
                    <span className="text-sm text-muted-foreground truncate block max-w-[100px]">
                      {deal?.neighborhood || deal?.borough || "—"}
                    </span>
                  </TableCell>
                  {/* Referral */}
                  {config.showReferral && (
                    <TableCell className="py-2">
                      <span className="text-sm text-muted-foreground truncate block max-w-[80px]">
                        {deal?.referral_source || "—"}
                      </span>
                    </TableCell>
                  )}
                  {/* Status */}
                  <TableCell className="py-2">
                    <Select
                      value={deal.stage_id || ""}
                      onValueChange={(value) => onStageChange(deal.id, value)}
                    >
                      <SelectTrigger className="w-[130px] h-7 bg-transparent border-white/10 text-xs">
                        <div className="flex items-center gap-1.5">
                          {currentStage?.color && (
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: currentStage.color }}
                            />
                          )}
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {stages?.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            <div className="flex items-center gap-2">
                              {stage?.color && (
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: stage.color }}
                                />
                              )}
                              {stage?.name || "Unknown"}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-2">
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