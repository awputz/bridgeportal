import { format, differenceInDays } from "date-fns";
import { FileSignature, Eye, Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HROffer, getOfferStatus, offerStatusColors, OfferStatus } from "@/hooks/hr/useHROffers";
import { CreateOfferDialog } from "@/components/hr/CreateOfferDialog";
import { cn } from "@/lib/utils";

interface AgentOfferSectionProps {
  offers: HROffer[];
  agentId: string;
  division: string;
  isLoading?: boolean;
}

const statusIcons: Record<OfferStatus, React.ReactNode> = {
  draft: <FileText className="h-3 w-3" />,
  sent: <Clock className="h-3 w-3" />,
  signed: <CheckCircle2 className="h-3 w-3" />,
  declined: <XCircle className="h-3 w-3" />,
};

export function AgentOfferSection({ 
  offers, 
  agentId,
  division,
  isLoading,
}: AgentOfferSectionProps) {
  const navigate = useNavigate();

  const hasPendingOffer = offers.some(o => {
    const status = getOfferStatus(o);
    return status === 'draft' || status === 'sent';
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Offers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-3">
              No offers created yet
            </p>
            <CreateOfferDialog defaultAgentId={agentId} defaultDivision={division}>
              <Button size="sm" variant="outline">
                <FileSignature className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
            </CreateOfferDialog>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => {
              const status = getOfferStatus(offer);
              const daysSinceSent = offer.sent_at && status === 'sent'
                ? differenceInDays(new Date(), new Date(offer.sent_at))
                : null;

              return (
                <div 
                  key={offer.id} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer",
                    status === 'sent' ? "bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20" : "bg-muted/50 hover:bg-muted/70"
                  )}
                  onClick={() => navigate(`/hr/offers/${offer.id}`)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs gap-1", offerStatusColors[status])}
                      >
                        {statusIcons[status]}
                        {status}
                      </Badge>
                      {daysSinceSent !== null && daysSinceSent > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {daysSinceSent} day{daysSinceSent !== 1 ? 's' : ''} waiting
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium">{offer.commission_split}% split</span>
                      {offer.signing_bonus && (
                        <span className="text-muted-foreground">
                          ${offer.signing_bonus.toLocaleString()} bonus
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(offer.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              );
            })}

            {!hasPendingOffer && (
              <CreateOfferDialog defaultAgentId={agentId} defaultDivision={division}>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <FileSignature className="h-4 w-4 mr-2" />
                  Create New Offer
                </Button>
              </CreateOfferDialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
