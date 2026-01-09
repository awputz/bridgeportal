import { format, differenceInDays } from "date-fns";
import { Link } from "react-router-dom";
import { Eye, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HROfferWithAgent,
  getOfferStatus,
  offerStatusColors,
  offerStatusLabels,
  OfferStatus,
} from "@/hooks/hr/useHROffers";
import { divisionLabels, Division } from "@/hooks/hr/useHRAgents";

interface MobileOfferCardProps {
  offer: HROfferWithAgent;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function MobileOfferCard({ offer, onDuplicate, onDelete }: MobileOfferCardProps) {
  const status = getOfferStatus(offer);
  
  const getDaysWaiting = () => {
    if (status !== 'sent' || !offer.sent_at) return null;
    const days = differenceInDays(new Date(), new Date(offer.sent_at));
    return days;
  };

  const daysWaiting = getDaysWaiting();

  return (
    <div className="p-4 bg-card/50 border border-border rounded-xl space-y-3">
      {/* Header with agent name and status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/hr/agents/${offer.agent_id}`}
            className="font-medium hover:text-primary transition-colors block truncate"
          >
            {offer.hr_agents?.full_name || 'Unknown'}
          </Link>
          <p className="text-sm text-muted-foreground truncate">
            {offer.hr_agents?.current_brokerage}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge className={offerStatusColors[status]}>
            {offerStatusLabels[status]}
          </Badge>
          {daysWaiting !== null && (
            <span className="text-xs text-muted-foreground">
              {daysWaiting}d
            </span>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Division</p>
          <p className="font-medium">
            {offer.division ? divisionLabels[offer.division as Division] : '-'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Commission Split</p>
          <p className="font-mono font-medium">{offer.commission_split || '-'}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Signing Bonus</p>
          <p className="font-medium">
            {offer.signing_bonus ? `$${offer.signing_bonus.toLocaleString()}` : '-'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Start Date</p>
          <p className="font-medium">
            {offer.start_date ? format(new Date(offer.start_date), 'MMM d, yyyy') : '-'}
          </p>
        </div>
      </div>

      {/* Footer with date and actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          Created {format(new Date(offer.created_at!), 'MMM d, yyyy')}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            asChild
          >
            <Link to={`/hr/offers/${offer.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
