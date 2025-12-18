import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Building2, Store, Download, MessageSquare, MapPin, Calendar, DollarSign, Ruler, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useCommercialListings, CommercialListing } from "@/hooks/useCommercialListings";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const CommercialListings = () => {
  const [activeTab, setActiveTab] = useState<"office" | "retail">("office");
  const { data: listings, isLoading } = useCommercialListings();
  const { openContactSheet } = useContactSheet();
  const officeRef = useRef<HTMLDivElement>(null);
  const retailRef = useRef<HTMLDivElement>(null);

  const officeListings = listings?.filter((l) => l.listing_type === "office") || [];
  const retailListings = listings?.filter((l) => l.listing_type === "retail") || [];

  const scrollToSection = (type: "office" | "retail") => {
    setActiveTab(type);
    const ref = type === "office" ? officeRef : retailRef;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const heroContent = (
    <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
      <div className="absolute inset-0 bg-[url('/lovable-uploads/ad049e33-7a22-4d66-9015-0299205f5e02.png')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
          Available Spaces
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
          Premium office and retail spaces for lease in New York City
        </p>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>Commercial Spaces for Lease | Bridge</title>
        <meta
          name="description"
          content="Browse available office and retail spaces for lease in NYC. Premium commercial real estate opportunities in Manhattan and Brooklyn."
        />
      </Helmet>

      <ServicePageLayout serviceKey="commercial-leasing" heroContent={heroContent}>
        {/* Sticky Tab Navigation */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 py-2">
              <Button
                variant={activeTab === "office" ? "default" : "ghost"}
                onClick={() => scrollToSection("office")}
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Office ({officeListings.length})
              </Button>
              <Button
                variant={activeTab === "retail" ? "default" : "ghost"}
                onClick={() => scrollToSection("retail")}
                className="flex items-center gap-2"
              >
                <Store className="h-4 w-4" />
                Retail ({retailListings.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Office Section */}
        <section ref={officeRef} className="py-16 bg-background scroll-mt-32">
          <div className="container mx-auto px-4">
            <SectionHeader
              icon={Building2}
              title="Office Spaces"
              subtitle="Professional workspaces in prime NYC locations"
            />
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                {isLoading ? (
                  <ListingSkeletons count={2} />
                ) : officeListings.length > 0 ? (
                  officeListings.map((listing) => (
                    <OfficeListingCard
                      key={listing.id}
                      listing={listing}
                      onInquire={openContactSheet}
                    />
                  ))
                ) : (
                  <EmptyState type="office" />
                )}
              </div>
              <div className="lg:col-span-2">
                <MapPlaceholder type="office" />
              </div>
            </div>
          </div>
        </section>

        {/* Retail Section */}
        <section ref={retailRef} className="py-16 bg-muted/30 scroll-mt-32">
          <div className="container mx-auto px-4">
            <SectionHeader
              icon={Store}
              title="Retail Spaces"
              subtitle="High-visibility storefronts in thriving neighborhoods"
            />
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                {isLoading ? (
                  <ListingSkeletons count={2} />
                ) : retailListings.length > 0 ? (
                  retailListings.map((listing) => (
                    <RetailListingCard
                      key={listing.id}
                      listing={listing}
                      onInquire={openContactSheet}
                    />
                  ))
                ) : (
                  <EmptyState type="retail" />
                )}
              </div>
              <div className="lg:col-span-2">
                <MapPlaceholder type="retail" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Need Help Finding the Right Space?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Our commercial leasing experts can help you find the perfect space for your business.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={openContactSheet}
              className="gap-2"
            >
              <MessageSquare className="h-5 w-5" />
              Contact Our Team
            </Button>
          </div>
        </section>
      </ServicePageLayout>
    </>
  );
};

// Section Header Component
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) => {
  const { elementRef, isVisible } = useScrollReveal();
  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(
        "mb-8 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};

// Office Listing Card
const OfficeListingCard = ({
  listing,
  onInquire,
}: {
  listing: CommercialListing;
  onInquire: () => void;
}) => {
  const { elementRef, isVisible } = useScrollReveal();
  const formatCurrency = (value: number | null) =>
    value ? `$${value.toLocaleString()}` : "—";

  return (
    <Card
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(
        "overflow-hidden transition-all duration-700 hover:shadow-lg",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <CardContent className="p-0">
        <div className="grid md:grid-cols-3 gap-0">
          {/* Image */}
          <div className="aspect-[4/3] md:aspect-auto bg-muted relative">
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.property_address}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <Building2 className="h-16 w-16 text-primary/30" />
              </div>
            )}
            <Badge className="absolute top-3 left-3 bg-primary">Office</Badge>
          </div>

          {/* Details */}
          <div className="md:col-span-2 p-6">
            <div className="flex flex-col h-full">
              {/* Address */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {listing.property_address}
                </h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.neighborhood}, {listing.borough}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <MetricItem
                  icon={Ruler}
                  label="Square Footage"
                  value={`${listing.square_footage.toLocaleString()} SF`}
                />
                <MetricItem
                  icon={DollarSign}
                  label="Asking Rent"
                  value={formatCurrency(listing.asking_rent)}
                />
                <MetricItem
                  icon={DollarSign}
                  label="Rent/SF"
                  value={listing.rent_per_sf ? `$${listing.rent_per_sf}/SF` : "—"}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <MetricItem
                  icon={Calendar}
                  label="Lease Term"
                  value={listing.lease_term || "—"}
                />
                <MetricItem
                  icon={Clock}
                  label="Possession"
                  value={listing.possession || "—"}
                />
                <MetricItem
                  icon={ArrowUp}
                  label="Ceiling Height"
                  value={listing.ceiling_height_ft ? `${listing.ceiling_height_ft}'` : "—"}
                />
              </div>

              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-4 border-t border-border">
                <Button asChild className="flex-1 gap-2">
                  <Link to="/404">
                    <Download className="h-4 w-4" />
                    Download Flyer
                  </Link>
                </Button>
                <Button variant="outline" onClick={onInquire} className="flex-1 gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Inquire
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Retail Listing Card
const RetailListingCard = ({
  listing,
  onInquire,
}: {
  listing: CommercialListing;
  onInquire: () => void;
}) => {
  const { elementRef, isVisible } = useScrollReveal();
  const formatCurrency = (value: number | null) =>
    value ? `$${value.toLocaleString()}` : "—";

  return (
    <Card
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(
        "overflow-hidden transition-all duration-700 hover:shadow-lg",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <CardContent className="p-0">
        <div className="grid md:grid-cols-3 gap-0">
          {/* Image */}
          <div className="aspect-[4/3] md:aspect-auto bg-muted relative">
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.property_address}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
                <Store className="h-16 w-16 text-accent/30" />
              </div>
            )}
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              Retail
            </Badge>
          </div>

          {/* Details */}
          <div className="md:col-span-2 p-6">
            <div className="flex flex-col h-full">
              {/* Address */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {listing.property_address}
                </h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.neighborhood}, {listing.borough}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <MetricItem
                  icon={Ruler}
                  label="Square Footage"
                  value={`${listing.square_footage.toLocaleString()} SF`}
                />
                <MetricItem
                  icon={DollarSign}
                  label="Asking Rent"
                  value={formatCurrency(listing.asking_rent)}
                />
                <MetricItem
                  icon={DollarSign}
                  label="Rent/SF"
                  value={listing.rent_per_sf ? `$${listing.rent_per_sf}/SF` : "—"}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <MetricItem
                  icon={Calendar}
                  label="Lease Term"
                  value={listing.lease_term || "—"}
                />
                <MetricItem
                  icon={Clock}
                  label="Possession"
                  value={listing.possession || "—"}
                />
                <MetricItem
                  icon={ArrowUp}
                  label="Ceiling Height"
                  value={listing.ceiling_height_ft ? `${listing.ceiling_height_ft}'` : "—"}
                />
              </div>

              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-4 border-t border-border">
                <Button asChild className="flex-1 gap-2">
                  <Link to="/404">
                    <Download className="h-4 w-4" />
                    Download Flyer
                  </Link>
                </Button>
                <Button variant="outline" onClick={onInquire} className="flex-1 gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Inquire
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Metric Item Component
const MetricItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </p>
    <p className="font-semibold text-foreground">{value}</p>
  </div>
);

// Loading Skeletons
const ListingSkeletons = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 gap-0">
            <Skeleton className="aspect-[4/3] md:aspect-auto md:h-64" />
            <div className="md:col-span-2 p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </>
);

// Empty State
const EmptyState = ({ type }: { type: "office" | "retail" }) => (
  <Card className="p-12 text-center">
    {type === "office" ? (
      <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
    ) : (
      <Store className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
    )}
    <h3 className="text-lg font-semibold text-foreground mb-2">
      No {type} spaces currently available
    </h3>
    <p className="text-muted-foreground">
      Check back soon or contact us for off-market opportunities.
    </p>
  </Card>
);

// Map Placeholder
const MapPlaceholder = ({ type }: { type: "office" | "retail" }) => (
  <div className="sticky top-48 h-[500px] bg-muted rounded-lg flex items-center justify-center border border-border">
    <div className="text-center p-6">
      <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-muted-foreground font-medium">
        {type === "office" ? "Office" : "Retail"} Locations Map
      </p>
      <p className="text-sm text-muted-foreground/70 mt-1">Coming soon</p>
    </div>
  </div>
);

export default CommercialListings;
