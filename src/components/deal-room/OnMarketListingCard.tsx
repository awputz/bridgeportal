import { Building2, Download, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatFullCurrency, formatSquareFeet, formatCapRate } from "@/lib/formatters";

interface ListingAgent {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
}

interface OnMarketListing {
  id: string;
  property_address: string;
  neighborhood: string | null;
  borough: string | null;
  image_url: string | null;
  om_url?: string | null;
  flyer_url?: string | null;
  agents?: ListingAgent[];
  // Investment Sales fields
  asking_price?: number | null;
  units?: number | null;
  gross_sf?: number | null;
  cap_rate?: number | null;
  // Commercial fields
  asking_rent?: number | null;
  rent_per_sf?: number | null;
  square_footage?: number;
  listing_type?: string;
}

interface OnMarketListingCardProps {
  listing: OnMarketListing;
  division: "investment-sales" | "commercial";
}

export function OnMarketListingCard({ listing, division }: OnMarketListingCardProps) {
  const isInvestment = division === "investment-sales";

  const handleDownload = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:border-border transition-all hover:shadow-md">
      {/* Image */}
      <div className="relative h-40 bg-muted">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.property_address}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Division Badge */}
        <Badge
          className={`absolute top-3 left-3 ${
            isInvestment
              ? "bg-purple-500/90 hover:bg-purple-500"
              : "bg-blue-500/90 hover:bg-blue-500"
          }`}
        >
          {isInvestment ? "Investment Sales" : "Commercial"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Address */}
        <div>
          <h3 className="font-medium text-foreground line-clamp-1">
            {listing.property_address}
          </h3>
          {(listing.neighborhood || listing.borough) && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">
                {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {isInvestment ? (
            <>
              <span className="font-semibold text-foreground">
                {formatFullCurrency(listing.asking_price)}
              </span>
              {listing.units && (
                <span className="text-muted-foreground">{listing.units} Units</span>
              )}
              {listing.gross_sf && (
                <span className="text-muted-foreground">{formatSquareFeet(listing.gross_sf)}</span>
              )}
              {listing.cap_rate && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {formatCapRate(listing.cap_rate)}
                </span>
              )}
            </>
          ) : (
            <>
              {listing.rent_per_sf && (
                <span className="font-semibold text-foreground">
                  ${listing.rent_per_sf.toFixed(2)}/SF
                </span>
              )}
              {listing.square_footage && (
                <span className="text-muted-foreground">
                  {formatSquareFeet(listing.square_footage)}
                </span>
              )}
              {listing.listing_type && (
                <span className="text-muted-foreground capitalize">
                  {listing.listing_type}
                </span>
              )}
            </>
          )}
        </div>

        {/* Footer: Agents + Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          {/* Agents */}
          <div className="flex items-center -space-x-2">
            {listing.agents?.slice(0, 3).map((agent) => (
              <Avatar key={agent.id} className="h-7 w-7 border-2 border-background">
                <AvatarImage src={agent.image_url || undefined} alt={agent.name} />
                <AvatarFallback className="text-xs bg-muted">
                  {getInitials(agent.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {listing.agents && listing.agents.length > 3 && (
              <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                +{listing.agents.length - 3}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            {listing.om_url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={(e) => handleDownload(listing.om_url!, e)}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                OM
              </Button>
            )}
            {listing.flyer_url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={(e) => handleDownload(listing.flyer_url!, e)}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Flyer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
