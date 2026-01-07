import { useMemo } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { DealRoomCard } from "./DealRoomCard";
import { DealRoomDeal } from "@/hooks/useDealRoom";
import { SectionErrorBoundary } from "@/components/portal/SectionErrorBoundary";

interface DealRoomListProps {
  deals: DealRoomDeal[];
  onDealClick: (dealId: string) => void;
}

const BOROUGH_ORDER = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Other"];

function getBoroughFromDeal(deal: DealRoomDeal): string {
  // First check the borough field
  if (deal.borough) {
    return deal.borough;
  }
  
  // Try to extract from address
  const address = deal.property_address.toLowerCase();
  if (address.includes("brooklyn")) return "Brooklyn";
  if (address.includes("queens")) return "Queens";
  if (address.includes("bronx")) return "Bronx";
  if (address.includes("staten island")) return "Staten Island";
  if (address.includes("manhattan") || address.includes("new york")) return "Manhattan";
  
  // Check by neighborhood if available
  if (deal.neighborhood) {
    const hood = deal.neighborhood.toLowerCase();
    if (hood.includes("brooklyn")) return "Brooklyn";
    if (hood.includes("queens")) return "Queens";
    if (hood.includes("bronx")) return "Bronx";
  }
  
  return "Manhattan"; // Default for NYC-focused brokerage
}

export function DealRoomList({ deals, onDealClick }: DealRoomListProps) {
  // Group deals by borough
  const groupedDeals = useMemo(() => {
    const groups: Record<string, DealRoomDeal[]> = {};
    
    deals.forEach(deal => {
      const borough = getBoroughFromDeal(deal);
      if (!groups[borough]) {
        groups[borough] = [];
      }
      groups[borough].push(deal);
    });
    
    // Sort groups by predefined order
    return BOROUGH_ORDER
      .filter(borough => groups[borough]?.length > 0)
      .map(borough => ({
        borough,
        deals: groups[borough],
      }));
  }, [deals]);

  return (
    <div className="space-y-4">
      {groupedDeals.map(({ borough, deals: boroughDeals }) => (
        <Collapsible key={borough} defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 group">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{borough}</span>
            <Badge variant="secondary" className="text-xs">
              {boroughDeals.length}
            </Badge>
            <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-4 pt-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {boroughDeals.map(deal => (
                <SectionErrorBoundary 
                  key={deal.id} 
                  fallback={
                    <div className="p-4 text-sm text-muted-foreground border border-border/50 rounded-lg bg-muted/20">
                      Failed to load deal
                    </div>
                  }
                >
                  <DealRoomCard
                    deal={deal}
                    onClick={() => onDealClick(deal.id)}
                  />
                </SectionErrorBoundary>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}