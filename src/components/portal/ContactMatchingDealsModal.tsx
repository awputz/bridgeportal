import { Building2, MapPin, Target, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useContactDealMatches } from "@/hooks/useDealMatching";

interface ContactMatchingDealsModalProps {
  contactId: string;
  contactName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealClick?: (dealId: string) => void;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

function formatSF(sf: number): string {
  return `${sf.toLocaleString()} SF`;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (score >= 70) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-muted text-muted-foreground border-border";
}

export function ContactMatchingDealsModal({
  contactId,
  contactName,
  open,
  onOpenChange,
  onDealClick,
}: ContactMatchingDealsModalProps) {
  const { data: matches, isLoading } = useContactDealMatches(contactId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Matching Deals for {contactName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-2">
            {isLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg border space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </>
            )}

            {!isLoading && (!matches || matches.length === 0) && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">
                  No matching deals found
                </p>
                <p className="text-muted-foreground/60 text-xs mt-1">
                  Share deals to the Deal Room to enable AI matching
                </p>
              </div>
            )}

            {matches?.map((match) => (
              <div
                key={match.id}
                className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onDealClick?.(match.deal_id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {match.deal?.property_address || "Unknown Property"}
                    </p>
                    {match.deal?.neighborhood && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {match.deal.neighborhood}
                        {match.deal.borough && `, ${match.deal.borough}`}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("flex-shrink-0 text-xs", getScoreColor(match.match_score))}
                  >
                    {match.match_score}% Match
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {match.deal?.value && (
                    <Badge variant="secondary" className="text-xs">
                      {formatCurrency(match.deal.value)}
                    </Badge>
                  )}
                  {match.deal?.gross_sf && (
                    <Badge variant="secondary" className="text-xs">
                      {formatSF(match.deal.gross_sf)}
                    </Badge>
                  )}
                  {match.deal?.property_type && (
                    <Badge variant="secondary" className="text-xs capitalize">
                      {match.deal.property_type.replace(/-/g, " ")}
                    </Badge>
                  )}
                </div>

                {/* AI Summary */}
                {match.ai_summary && (
                  <p className="text-xs text-muted-foreground italic">
                    "{match.ai_summary}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
