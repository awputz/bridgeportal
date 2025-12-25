import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MoreHorizontal, 
  Building2,
  Calendar,
  User,
  ArrowUpDown,
  ExternalLink
} from "lucide-react";
import { CRMDeal, CRMDealStage } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DIVISION_DISPLAY_NAMES
} from "@/lib/formatters";

interface CRMTableProps {
  deals: CRMDeal[];
  stages: CRMDealStage[];
  onStageChange: (dealId: string, newStageId: string) => void;
  onDeleteDeal?: (dealId: string) => void;
  division: string;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  medium: { label: "Medium", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  low: { label: "Low", className: "bg-green-500/20 text-green-400 border-green-500/30" },
};

/**
 * Format deal value based on division type
 * - Investment Sales: Full purchase price (e.g., $12,500,000)
 * - Commercial Leasing: Full lease value (e.g., $450,000)
 * - Residential: Full monthly rent or sale price (e.g., $4,500/month or $1,200,000)
 */
const formatDealValueByDivision = (value: number | null | undefined, division: string): string => {
  if (!value) return "—";
  
  switch (division) {
    case "investment-sales":
      // Always show full price, no abbreviations
      return formatInvestmentSalesPrice(value);
    
    case "commercial-leasing":
      // Show full lease value
      return formatFullCurrency(value);
    
    case "residential":
      // For residential, if value < 10000, assume it's monthly rent
      // Otherwise, assume it's a sale price
      if (value < 50000) {
        return formatResidentialRent(value);
      }
      return formatFullCurrency(value);
    
    default:
      return formatFullCurrency(value);
  }
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
  division 
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

  // Division-specific column labels
  const getDivisionColumns = () => {
    switch (division) {
      case "investment-sales":
        return { 
          valueLabel: "Sale Price", 
          typeLabel: "Asset Type",
          valueHint: "Full purchase price"
        };
      case "commercial-leasing":
        return { 
          valueLabel: "Lease Value", 
          typeLabel: "Space Type",
          valueHint: "Total lease value"
        };
      case "residential":
        return { 
          valueLabel: "Price/Rent", 
          typeLabel: "Deal Type",
          valueHint: "Monthly rent or sale price"
        };
      default:
        return { 
          valueLabel: "Value", 
          typeLabel: "Type",
          valueHint: ""
        };
    }
  };

  const { valueLabel, typeLabel, valueHint } = getDivisionColumns();

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="property_address">Property</SortHeader>
              </TableHead>
              <TableHead className="text-muted-foreground font-light">Contact</TableHead>
              <TableHead className="text-muted-foreground font-light">Status</TableHead>
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="value">{valueLabel}</SortHeader>
              </TableHead>
              <TableHead className="text-muted-foreground font-light">
                <SortHeader field="expected_close">Expected Close</SortHeader>
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

              return (
                <TableRow 
                  key={deal.id} 
                  className="border-white/5 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="font-light">
                    <Link 
                      to={`/portal/crm/deals/${deal.id}`}
                      className="flex items-center gap-2 hover:text-foreground text-foreground/90 transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{deal.property_address}</span>
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
                      {formatDealValueByDivision(deal.value, division)}
                    </div>
                  </TableCell>
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
