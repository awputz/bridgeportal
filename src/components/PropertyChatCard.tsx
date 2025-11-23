import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { Property } from "@/hooks/useProperties";

interface PropertyChatCardProps {
  property: Property & { match_score?: number; match_reason?: string };
}

export const PropertyChatCard = ({ property }: PropertyChatCardProps) => {
  const formatPrice = (price: number) => {
    if (property.listing_type === "rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={property.images?.[0] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        {property.match_score && (
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-medium">
              {property.match_score}% Match
            </span>
          </div>
        )}
        
        <div>
          <h4 className="font-semibold text-lg mb-1">{property.title}</h4>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin size={14} />
            {property.address}, {property.city}
          </p>
        </div>

        {property.match_reason && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {property.match_reason}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed size={16} />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath size={16} />
              {property.bathrooms}
            </span>
          )}
          {property.square_feet && (
            <span className="flex items-center gap-1">
              <Maximize size={16} />
              {property.square_feet} sq ft
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-semibold">{formatPrice(property.price)}</span>
          <Button asChild size="sm">
            <Link to={`/listings/${property.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
