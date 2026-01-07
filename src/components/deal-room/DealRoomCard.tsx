import { useState, memo } from "react";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { 
  FileText, 
  MessageCircle, 
  ExternalLink, 
  Star, 
  Flame,
  MapPin,
  Eye,
  ImageIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DealRoomDeal, useDealRoomComments, useDealRoomInterests } from "@/hooks/useDealRoom";
import { useDealRoomPhotos } from "@/hooks/useDealRoomPhotos";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

interface DealRoomCardProps {
  deal: DealRoomDeal;
  onClick: () => void;
}

const DIVISION_LABELS: Record<string, string> = {
  "investment-sales": "Investment",
  "commercial-leasing": "Commercial",
  residential: "Residential",
};

const DIVISION_COLORS: Record<string, string> = {
  "investment-sales": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "commercial-leasing": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  residential: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
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

// Memoized engagement badges component
const EngagementBadges = memo(function EngagementBadges({ dealId }: { dealId: string }) {
  const { data: comments, isLoading: commentsLoading } = useDealRoomComments(dealId);
  const { data: interests, isLoading: interestsLoading } = useDealRoomInterests(dealId);

  const commentCount = comments?.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) || 0;
  const interestCount = interests?.length || 0;
  const isHot = commentCount >= 5 || interestCount >= 3;

  if (commentsLoading || interestsLoading) {
    return <Skeleton className="h-5 w-16" />;
  }

  if (commentCount === 0 && interestCount === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {isHot && (
        <Badge variant="destructive" className="gap-1 text-[10px] px-1.5 py-0">
          <Flame className="h-3 w-3" />
          Hot
        </Badge>
      )}
      {commentCount > 0 && (
        <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0" aria-label={`${commentCount} comments`}>
          <MessageCircle className="h-3 w-3" />
          {commentCount}
        </Badge>
      )}
      {interestCount > 0 && (
        <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0" aria-label={`${interestCount} interested`}>
          <Star className="h-3 w-3" />
          {interestCount}
        </Badge>
      )}
    </div>
  );
});

export const DealRoomCard = memo(function DealRoomCard({ deal, onClick }: DealRoomCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { data: photos } = useDealRoomPhotos(deal.id);
  
  const timeAgo = deal.last_deal_room_update
    ? formatDistanceToNow(new Date(deal.last_deal_room_update), { addSuffix: true })
    : formatDistanceToNow(new Date(deal.updated_at), { addSuffix: true });

  const agentInitials = deal.agent?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  // Check if deal is new (shared within 48 hours)
  const isNew = deal.last_deal_room_update
    ? differenceInHours(new Date(), new Date(deal.last_deal_room_update)) < 48
    : false;

  // Get image URL - use photos, then placeholder
  const primaryPhoto = photos?.find(p => p.is_primary) || photos?.[0];
  const imageUrl = primaryPhoto?.image_url || PLACEHOLDER_IMAGES.building.exterior;
  const photoCount = photos?.length || 0;
  const divisionColor = DIVISION_COLORS[deal.division] || "bg-muted/50 text-muted-foreground";

  return (
    <Card
      role="article"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Deal at ${deal.property_address}${deal.value ? `, ${formatCurrency(deal.value)}` : ''}`}
      className="group cursor-pointer overflow-hidden border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Hero Image Section */}
      <div className="deal-card-image-container relative h-40 w-full bg-muted">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        
        <img
          src={imageError ? PLACEHOLDER_IMAGES.building.exterior : imageUrl}
          alt={`Property at ${deal.property_address}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={cn(
            "deal-card-image w-full h-full object-cover",
            !imageLoaded && "blur-sm scale-105",
            imageLoaded && "blur-0 scale-100"
          )}
        />
        
        {/* Gradient overlay for text readability */}
        <div className="deal-card-gradient absolute inset-0 pointer-events-none" />

        {/* Top badges - absolute positioned on image */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          {/* Division Badge */}
          <Badge 
            variant="outline" 
            className={cn("text-[10px] backdrop-blur-sm border", divisionColor)}
          >
            {DIVISION_LABELS[deal.division] || deal.division}
          </Badge>

          {/* New Badge */}
          {isNew && (
            <Badge className="bg-emerald-500 text-white text-[10px] animate-pulse">
              <Flame className="h-3 w-3 mr-0.5" />
              New
            </Badge>
          )}
        </div>

        {/* Agent Info - bottom left on image */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <Avatar className="h-7 w-7 border-2 border-background/80 flex-shrink-0">
            <AvatarImage src={deal.agent?.avatar_url || undefined} />
            <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
              {agentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="text-white min-w-0">
            <p className="text-xs font-semibold leading-none drop-shadow-lg mb-1 truncate">
              {deal.agent?.full_name || "Unknown Agent"}
            </p>
            <p className="text-[10px] text-white/90 leading-none drop-shadow">
              {DIVISION_LABELS[deal.division] || deal.division} • {timeAgo}
            </p>
          </div>
        </div>

        {/* Photo count badge - bottom right */}
        {photoCount > 1 && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 gap-1 text-[10px] bg-background/80 backdrop-blur-sm"
          >
            <ImageIcon className="h-3 w-3" />
            {photoCount}
          </Badge>
        )}

        {/* Hover overlay with "View Details" */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2 text-white font-medium">
            <Eye className="h-5 w-5" />
            View Details
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-3 space-y-2">
        {/* Address & Location */}
        <div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {deal.property_address}
          </h3>
          {(deal.neighborhood || deal.borough) && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {deal.neighborhood}
              {deal.neighborhood && deal.borough && ", "}
              {deal.borough}
            </p>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          {deal.value && (
            <div>
              <span className="text-muted-foreground">Value</span>
              <p className="font-semibold text-foreground">
                {formatCurrency(deal.value)}
              </p>
            </div>
          )}
          {deal.gross_sf && (
            <div>
              <span className="text-muted-foreground">Size</span>
              <p className="font-semibold text-foreground">
                {formatSF(deal.gross_sf)}
              </p>
            </div>
          )}
          {deal.property_type && (
            <div>
              <span className="text-muted-foreground">Type</span>
              <p className="font-medium text-foreground capitalize">
                {deal.property_type.replace(/-/g, " ")}
              </p>
            </div>
          )}
          {deal.deal_type && (
            <div>
              <span className="text-muted-foreground">Deal</span>
              <p className="font-medium text-foreground capitalize">
                {deal.deal_type.replace(/-/g, " ")}
              </p>
            </div>
          )}
        </div>

        {/* Notes Preview */}
        {deal.deal_room_notes && (
          <p className="text-xs text-muted-foreground italic line-clamp-2 border-l-2 border-muted pl-2">
            "{deal.deal_room_notes}"
          </p>
        )}

        {/* Engagement & Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <EngagementBadges dealId={deal.id} />
          
          <div className="flex items-center gap-1">
            {deal.om_file_url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px]"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(deal.om_file_url!, "_blank");
                }}
              >
                <FileText className="h-3 w-3 mr-1" />
                OM
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={(e) => e.stopPropagation()}
              asChild
            >
              <Link to={`/portal/crm/deals/${deal.id}`}>
                <ExternalLink className="h-3 w-3 mr-1" />
                CRM
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
