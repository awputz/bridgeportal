import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Building2, Store, Download, MessageSquare, MapPin, Ruler, DollarSign, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommercialListings, CommercialListing } from "@/hooks/useCommercialListings";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { cn } from "@/lib/utils";

const CommercialListings = () => {
  const [activeTab, setActiveTab] = useState<"office" | "retail">("office");
  const { data: listings, isLoading } = useCommercialListings();
  const { openContactSheet } = useContactSheet();

  const officeListings = listings?.filter((l) => l.listing_type === "office") || [];
  const retailListings = listings?.filter((l) => l.listing_type === "retail") || [];
  const displayedListings = activeTab === "office" ? officeListings : retailListings;

  return (
    <>
      <Helmet>
        <title>Commercial Spaces for Lease | Bridge</title>
        <meta
          name="description"
          content="Browse available office and retail spaces for lease in NYC. Premium commercial real estate opportunities in Manhattan and Brooklyn."
        />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Compact Hero */}
        <section className="relative h-[25vh] min-h-[200px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
          <div className="absolute inset-0 bg-[url('/lovable-uploads/ad049e33-7a22-4d66-9015-0299205f5e02.png')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              Commercial Listings
            </h1>
            <p className="text-sm md:text-base text-primary-foreground/80">
              Office & retail spaces for lease in NYC
            </p>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="sticky top-16 z-40 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 py-2">
              <Button
                variant={activeTab === "office" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("office")}
                className="gap-1.5 text-sm"
              >
                <Building2 className="h-3.5 w-3.5" />
                Office ({officeListings.length})
              </Button>
              <Button
                variant={activeTab === "retail" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("retail")}
                className="gap-1.5 text-sm"
              >
                <Store className="h-3.5 w-3.5" />
                Retail ({retailListings.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-[16/10]" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayedListings.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onInquire={openContactSheet}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  {activeTab === "office" ? (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Store className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">No {activeTab} listings available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check back soon or contact us for off-market opportunities.
                </p>
                <Button size="sm" onClick={openContactSheet}>
                  Contact Us
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Compact CTA */}
        <section className="py-10 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl font-semibold mb-2">Need Help Finding Space?</h2>
            <p className="text-sm text-primary-foreground/80 mb-4 max-w-md mx-auto">
              Our team can help you find the perfect location.
            </p>
            <Button size="sm" variant="secondary" onClick={openContactSheet} className="gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Contact Us
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

// Compact Listing Card
const ListingCard = ({
  listing,
  onInquire,
}: {
  listing: CommercialListing;
  onInquire: () => void;
}) => {
  const isOffice = listing.listing_type === "office";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-[16/10] bg-muted relative">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.property_address}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            {isOffice ? (
              <Building2 className="h-10 w-10 text-primary/30" />
            ) : (
              <Store className="h-10 w-10 text-primary/30" />
            )}
          </div>
        )}
        <Badge
          className={cn(
            "absolute top-2 left-2 text-xs",
            isOffice ? "bg-primary" : "bg-accent text-accent-foreground"
          )}
        >
          {isOffice ? "Office" : "Retail"}
        </Badge>
        {listing.rent_per_sf && (
          <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
            ${listing.rent_per_sf}/SF
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Address */}
        <h3 className="font-semibold text-foreground mb-1 truncate">
          {listing.property_address}
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
          <MapPin className="h-3 w-3" />
          {listing.neighborhood}, {listing.borough}
        </p>

        {/* Key Metrics - Single Row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
          <span className="flex items-center gap-1">
            <Ruler className="h-3 w-3" />
            {listing.square_footage.toLocaleString()} SF
          </span>
          {listing.lease_term && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {listing.lease_term}
            </span>
          )}
          {listing.possession && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {listing.possession}
            </span>
          )}
        </div>

        {/* Asking Rent */}
        {listing.asking_rent && (
          <p className="text-sm font-medium text-foreground mb-3">
            <DollarSign className="h-3.5 w-3.5 inline" />
            {listing.asking_rent.toLocaleString()}/mo
          </p>
        )}

        {/* Features - Compact */}
        {listing.features && listing.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.features.slice(0, 3).map((feature, i) => (
              <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                {feature}
              </Badge>
            ))}
            {listing.features.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{listing.features.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {listing.flyer_url && (
            <Button asChild size="sm" variant="outline" className="flex-1 text-xs h-8">
              <a href={listing.flyer_url} target="_blank" rel="noopener noreferrer">
                <Download className="h-3 w-3 mr-1" />
                Flyer
              </a>
            </Button>
          )}
          <Button size="sm" onClick={onInquire} className="flex-1 text-xs h-8">
            <MessageSquare className="h-3 w-3 mr-1" />
            Inquire
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommercialListings;
