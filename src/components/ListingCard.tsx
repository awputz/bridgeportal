import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Bed, Bath } from "lucide-react";

export interface Listing {
  id: string;
  address: string;
  neighborhood: string;
  price: string;
  beds: number;
  baths: number;
  image: string;
  type: "rental" | "sale";
}

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Link to={`/listings/${listing.id}`} className="group block">
      <Card className="overflow-hidden border border-border hover-lift h-full">
        <div className="aspect-[4/3] overflow-hidden bg-secondary relative">
          <img
            src={listing.image}
            alt={listing.address}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-5 md:p-6">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-gold transition-colors">{listing.address}</h3>
              <p className="text-sm text-muted-foreground">{listing.neighborhood}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Bed size={16} />
                <span>{listing.beds}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Bath size={16} />
                <span>{listing.baths}</span>
              </span>
            </div>
            
            <div className="pt-3 border-t border-border">
              <p className="text-2xl font-semibold">{listing.price}</p>
              {listing.type === "rental" && (
                <p className="text-xs text-muted-foreground mt-0.5">per month</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
