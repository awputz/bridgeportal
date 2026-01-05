import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  User, 
  Calendar,
  Plus,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";
import { CRMDeal, CRMDealStage } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { 
  formatFullCurrency, 
  formatResidentialRent, 
  formatInvestmentSalesPrice,
} from "@/lib/formatters";

interface CRMGroupedViewProps {
  deals: CRMDeal[];
  stages: CRMDealStage[];
  onStageChange: (dealId: string, newStageId: string) => void;
  onDeleteDeal?: (dealId: string) => void;
  division: string;
}

const formatDealValue = (deal: CRMDeal, division: string): string => {
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

export const CRMGroupedView = ({ 
  deals, 
  stages, 
  onStageChange, 
  onDeleteDeal,
  division,
}: CRMGroupedViewProps) => {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(stages.map(s => s.id))
  );

  const toggleStage = (stageId: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped: Record<string, CRMDeal[]> = {};
    stages.forEach(stage => {
      grouped[stage.id] = [];
    });
    deals.forEach(deal => {
      if (deal.stage_id && grouped[deal.stage_id]) {
        grouped[deal.stage_id].push(deal);
      }
    });
    return grouped;
  }, [deals, stages]);

  // Calculate stage totals
  const stageTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    stages.forEach(stage => {
      const stageDeals = dealsByStage[stage.id] || [];
      totals[stage.id] = stageDeals.reduce((sum, deal) => {
        if (division === "investment-sales") {
          return sum + (deal.asking_price || deal.offer_price || deal.value || 0);
        }
        if (division === "residential") {
          return sum + (deal.is_rental ? (deal.monthly_rent || 0) * 12 : (deal.listing_price || 0));
        }
        return sum + (deal.value || 0);
      }, 0);
    });
    return totals;
  }, [dealsByStage, stages, division]);

  const formatStageTotal = (total: number): string => {
    if (total >= 1000000) {
      return `$${(total / 1000000).toFixed(1)}M`;
    }
    if (total >= 1000) {
      return `$${(total / 1000).toFixed(0)}K`;
    }
    return formatFullCurrency(total);
  };

  if (stages.length === 0) {
    return (
      <div className="text-center py-12 glass-card">
        <p className="text-muted-foreground">No stages configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stages.map((stage) => {
        const stageDeals = dealsByStage[stage.id] || [];
        const isExpanded = expandedStages.has(stage.id);
        const stageTotal = stageTotals[stage.id] || 0;

        return (
          <Collapsible
            key={stage.id}
            open={isExpanded}
            onOpenChange={() => toggleStage(stage.id)}
            className="glass-card overflow-hidden"
          >
            {/* Stage Header */}
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="font-medium text-foreground">{stage.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stageDeals.length}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {stageTotal > 0 && (
                    <span className="font-medium text-foreground">
                      {formatStageTotal(stageTotal)}
                    </span>
                  )}
                </div>
              </button>
            </CollapsibleTrigger>

            {/* Stage Deals */}
            <CollapsibleContent>
              <div className="border-t border-white/10">
                {stageDeals.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          {/* Property */}
                          <Link 
                            to={`/portal/crm/deals/${deal.id}`}
                            className="flex items-center gap-2 text-foreground hover:text-foreground/80 min-w-0 flex-shrink-0"
                          >
                            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{deal.property_address}</span>
                          </Link>

                          {/* Contact */}
                          {deal.contact && (
                            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                              <User className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{deal.contact.full_name}</span>
                            </div>
                          )}

                          {/* Due Date / Expected Close */}
                          {(deal.due_date || deal.expected_close) && (
                            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(deal.due_date || deal.expected_close)}</span>
                            </div>
                          )}

                          {/* Division-specific badges */}
                          {division === "investment-sales" && deal.property_type && (
                            <Badge variant="outline" className="hidden lg:flex text-xs capitalize">
                              {deal.property_type.replace("-", " ")}
                            </Badge>
                          )}
                          {division === "residential" && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "hidden lg:flex text-xs",
                                deal.is_rental 
                                  ? "bg-green-500/10 text-green-400 border-green-500/30" 
                                  : "bg-pink-500/10 text-pink-400 border-pink-500/30"
                              )}
                            >
                              {deal.is_rental ? "Rental" : "Sale"}
                            </Badge>
                          )}
                          {division === "commercial-leasing" && deal.space_type && (
                            <Badge variant="outline" className="hidden lg:flex text-xs capitalize">
                              {deal.space_type}
                            </Badge>
                          )}
                        </div>

                        {/* Value & Actions */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground">
                            {formatDealValue(deal, division)}
                          </span>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
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
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No deals in this stage
                  </div>
                )}

                {/* Add Deal Button */}
                <div className="px-4 py-2 border-t border-white/5">
                  <Link to={`/portal/crm/deals/new`}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                      <Plus className="h-3.5 w-3.5" />
                      Add deal
                    </Button>
                  </Link>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default CRMGroupedView;