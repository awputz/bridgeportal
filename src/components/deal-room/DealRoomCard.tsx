import { formatDistanceToNow } from "date-fns";
import { FileText, MessageCircle, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DealRoomDeal } from "@/hooks/useDealRoom";
import { cn } from "@/lib/utils";

interface DealRoomCardProps {
  deal: DealRoomDeal;
  onClick: () => void;
}

const DIVISION_LABELS: Record<string, string> = {
  "investment-sales": "Investment",
  "commercial-leasing": "Commercial",
  residential: "Residential",
};

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

export function DealRoomCard({ deal, onClick }: DealRoomCardProps) {
  const timeAgo = deal.last_deal_room_update
    ? formatDistanceToNow(new Date(deal.last_deal_room_update), { addSuffix: true })
    : formatDistanceToNow(new Date(deal.updated_at), { addSuffix: true });

  const agentInitials = deal.agent?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200",
        "hover:border-primary/30 hover:shadow-md"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header: Agent + Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarImage src={deal.agent?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">{agentInitials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {deal.agent?.full_name || "Unknown Agent"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="text-xs">
              {DIVISION_LABELS[deal.division] || deal.division}
            </Badge>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="font-semibold text-base leading-tight line-clamp-1">
            {deal.property_address}
          </h3>
          {deal.neighborhood && (
            <p className="text-sm text-muted-foreground">{deal.neighborhood}</p>
          )}
        </div>

        {/* Key Metrics */}
        <div className="flex flex-wrap gap-2">
          {deal.value && (
            <Badge variant="secondary">{formatCurrency(deal.value)}</Badge>
          )}
          {deal.gross_sf && (
            <Badge variant="secondary">{formatSF(deal.gross_sf)}</Badge>
          )}
          {deal.property_type && (
            <Badge variant="secondary" className="capitalize">
              {deal.property_type.replace(/-/g, " ")}
            </Badge>
          )}
          {deal.deal_type && (
            <Badge variant="outline" className="capitalize">
              {deal.deal_type.replace(/-/g, " ")}
            </Badge>
          )}
        </div>

        {/* Notes preview */}
        {deal.deal_room_notes && (
          <p className="text-sm text-muted-foreground line-clamp-2 italic">
            "{deal.deal_room_notes}"
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/50">
          {deal.om_file_url && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.open(deal.om_file_url!, "_blank");
              }}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>OM</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open comments modal
            }}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Comments</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link to={`/portal/crm/deals/${deal.id}`}>
              <ExternalLink className="h-3.5 w-3.5" />
              <span>CRM</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 ml-auto gap-1.5 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Express interest
            }}
          >
            <Star className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Interested</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
