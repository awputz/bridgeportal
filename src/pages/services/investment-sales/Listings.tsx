import { Link } from "react-router-dom";
import { Download, Lock, Building2, MapPin, TrendingUp, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHelmet } from "@/components/SEOHelmet";
import { ServicePageNav } from "@/components/ServicePageNav";
import { useInvestmentListings } from "@/hooks/useInvestmentListings";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

const formatPrice = (price: number | null) => {
  if (!price) return "Price Upon Request";
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${price.toLocaleString()}`;
};

const formatCapRate = (rate: number | null) => {
  if (!rate) return "—";
  return `${rate.toFixed(2)}%`;
};

const InvestmentListings = () => {
  const { data: listings, isLoading } = useInvestmentListings();
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollReveal();

  const getPlaceholderImage = (index: number) => {
    const images = [
      PLACEHOLDER_IMAGES.building.brownstone,
      PLACEHOLDER_IMAGES.building.residential,
      PLACEHOLDER_IMAGES.building.exterior,
      PLACEHOLDER_IMAGES.building.glass,
      PLACEHOLDER_IMAGES.building.apartment,
    ];
    return images[index % images.length];
  };

  return (
    <>
      <SEOHelmet
        title="Active Investment Listings | Bridge Investment Sales"
        description="Explore our exclusive portfolio of investment properties available for acquisition in New York City."
      />
      
      <ServicePageNav serviceKey="investment-sales" />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className={`relative pt-32 pb-20 px-6 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              Investment Sales
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Available Investment
              <br />
              <span className="text-primary">Opportunities</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our curated selection of investment properties across New York City's 
              most dynamic markets. Each opportunity has been carefully vetted by our team.
            </p>
          </div>
        </section>

        {/* Listings Grid */}
        <section 
          ref={gridRef} 
          className={`px-6 pb-24 transition-all duration-700 delay-200 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-white/[0.02] animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing, index) => (
                  <article
                    key={listing.id}
                    className="group relative bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Property Image */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={listing.image_url || getPlaceholderImage(index)}
                        alt={listing.property_address}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      
                      {/* Asset Class Badge */}
                      <Badge 
                        className="absolute top-4 left-4 bg-primary/90 text-primary-foreground border-0"
                      >
                        {listing.asset_class}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Address & Location */}
                      <div>
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {listing.property_address}
                        </h3>
                        {(listing.neighborhood || listing.borough) && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Key Metrics */}
                      <div className="flex items-center gap-4 text-sm">
                        {listing.units && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Layers className="w-4 h-4 text-primary/70" />
                            <span>{listing.units} Units</span>
                          </div>
                        )}
                        {listing.gross_sf && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Building2 className="w-4 h-4 text-primary/70" />
                            <span>{listing.gross_sf.toLocaleString()} SF</span>
                          </div>
                        )}
                      </div>

                      {/* Price & Cap Rate */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {formatPrice(listing.asking_price)}
                          </p>
                        </div>
                        {listing.cap_rate && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Cap Rate</p>
                            <p className="text-lg font-semibold text-primary flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {formatCapRate(listing.cap_rate)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        {listing.om_url ? (
                          <Button 
                            className="flex-1" 
                            asChild
                          >
                            <a href={listing.om_url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              Download OM
                            </a>
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1" 
                            disabled
                          >
                            <Download className="w-4 h-4 mr-2" />
                            OM Coming Soon
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          className="flex-1 border-white/20 hover:bg-white/5"
                          asChild
                        >
                          <Link to={`/services/investment-sales/deal-room/${listing.id}`}>
                            <Lock className="w-4 h-4 mr-2" />
                            Deal Room
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <Building2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  No Active Listings
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Our team is currently sourcing new investment opportunities. 
                  Contact us to discuss off-market deals.
                </p>
                <Button asChild>
                  <Link to="/contact">Contact Our Team</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Looking for Off-Market Opportunities?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Many of our best deals never make it to public listings. Connect with our 
                investment sales team to access exclusive opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/contact">Schedule a Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20" asChild>
                  <Link to="/services/investment-sales">Learn About Our Approach</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default InvestmentListings;
