import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Building2, Store, Download, MessageSquare, MapPin, Ruler, Calendar, Clock, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommercialListings, CommercialListing } from "@/hooks/useCommercialListings";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import commercialHero from "@/assets/commercial-listings-hero.jpg";

const CommercialListings = () => {
  const [activeTab, setActiveTab] = useState<"office" | "retail">("office");
  const { data: listings, isLoading } = useCommercialListings();
  const { openContactSheet } = useContactSheet();
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollReveal();

  const officeListings = listings?.filter((l) => l.listing_type === "office") || [];
  const retailListings = listings?.filter((l) => l.listing_type === "retail") || [];
  const displayedListings = activeTab === "office" ? officeListings : retailListings;

  return (
    <>
      <Helmet>
        <title>Exclusive Commercial Listings | Bridge</title>
        <meta
          name="description"
          content="Browse exclusive office and retail spaces for lease in NYC. Premium commercial real estate opportunities in Manhattan and Brooklyn."
        />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section with Background Image */}
        <section 
          ref={heroRef}
          className={`relative h-[35vh] sm:h-[40vh] md:h-[45vh] min-h-[280px] sm:min-h-[320px] md:min-h-[400px] flex items-center justify-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <img 
            src={commercialHero} 
            alt="Commercial Real Estate" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="relative z-10 text-center px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 tracking-tight">
              Exclusive Commercial Listings
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto">
              Premium office & retail spaces for lease in NYC
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

        {/* Map and Listings Container */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Listings Grid */}
              <div>
                {isLoading ? (
                  <div className="grid sm:grid-cols-2 gap-4">
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
                  <div className="grid sm:grid-cols-2 gap-4">
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

              {/* Map Placeholder - Hidden on mobile */}
              <div className="hidden lg:block lg:sticky lg:top-32 h-fit">
                <div className="bg-muted rounded-lg border border-border overflow-hidden">
                  <div className="aspect-square flex flex-col items-center justify-center text-muted-foreground p-8">
                    <Map className="h-16 w-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">Mapbox Integration</p>
                    <p className="text-sm text-center">Map will display listing locations</p>
                  </div>
                </div>
              </div>
            </div>
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

        {/* Asking Rent - PSF format */}
        {listing.rent_per_sf && (
          <p className="text-sm font-medium text-foreground mb-3">
            Asking ${listing.rent_per_sf}/PSF
          </p>
        )}


        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            asChild={!!listing.flyer_url} 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={!listing.flyer_url}
          >
            {listing.flyer_url ? (
              <a href={listing.flyer_url} target="_blank" rel="noopener noreferrer">
                <Download className="h-3 w-3 mr-1" />
                Flyer
              </a>
            ) : (
              <>
                <Download className="h-3 w-3 mr-1" />
                Flyer
              </>
            )}
          </Button>
          <Button size="sm" onClick={onInquire} className="flex-1 text-xs h-8 focus-visible:ring-0 focus-visible:ring-offset-0">
            <MessageSquare className="h-3 w-3 mr-1" />
            Inquire
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommercialListings;
