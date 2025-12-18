import { Link } from "react-router-dom";
import { Download, Lock, Building2, MapPin, TrendingUp, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHelmet } from "@/components/SEOHelmet";
import { ServicePageNav } from "@/components/ServicePageNav";
import { useInvestmentListings } from "@/hooks/useInvestmentListings";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import brooklynBridgeHero from "@/assets/brooklyn-bridge-hero.jpg";

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
        title="Exclusive Listings | Bridge Investment Sales"
        description="Explore our exclusive portfolio of investment properties available for acquisition in New York City."
      />
      
      <ServicePageNav serviceKey="investment-sales" />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section with Background Image */}
        <section 
          ref={heroRef}
          className={`relative h-[45vh] min-h-[400px] flex items-center justify-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <img 
            src={brooklynBridgeHero} 
            alt="New York City" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center px-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Exclusive Listings
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Curated investment opportunities across New York City's most dynamic markets
            </p>
          </div>
        </section>

        {/* Split Layout: Listings + Map */}
        <section 
          ref={gridRef} 
          className={`px-6 py-12 transition-all duration-700 delay-200 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Listings Grid */}
              <div className="lg:w-[60%]">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-[4/3] bg-white/[0.02] animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : listings && listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listings.map((listing, index) => (
                      <article
                        key={listing.id}
                        className="group relative bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Property Image - Compact */}
                        <div className="aspect-[16/10] relative overflow-hidden">
                          <img
                            src={listing.image_url || getPlaceholderImage(index)}
                            alt={listing.property_address}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                          
                          {/* Asset Class Badge */}
                          <Badge 
                            className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 text-xs"
                          >
                            {listing.asset_class}
                          </Badge>
                        </div>

                        {/* Content - Compact */}
                        <div className="p-4 space-y-3">
                          {/* Address & Location */}
                          <div>
                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {listing.property_address}
                            </h3>
                            {(listing.neighborhood || listing.borough) && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
                              </p>
                            )}
                          </div>

                          {/* Key Metrics - Compact */}
                          <div className="flex items-center gap-3 text-xs">
                            {listing.units && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Layers className="w-3 h-3 text-primary/70" />
                                <span>{listing.units} Units</span>
                              </div>
                            )}
                            {listing.gross_sf && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Building2 className="w-3 h-3 text-primary/70" />
                                <span>{listing.gross_sf.toLocaleString()} SF</span>
                              </div>
                            )}
                          </div>

                          {/* Price & Cap Rate - Compact */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <p className="text-lg font-bold text-foreground">
                              {formatPrice(listing.asking_price)}
                            </p>
                            {listing.cap_rate && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Cap</p>
                                <p className="text-sm font-semibold text-primary flex items-center gap-0.5">
                                  <TrendingUp className="w-3 h-3" />
                                  {formatCapRate(listing.cap_rate)}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons - Fixed Spacing */}
                          <div className="flex gap-2 pt-1">
                            {listing.om_url ? (
                              <Button 
                                size="sm"
                                className="flex-1 text-xs" 
                                asChild
                              >
                                <a href={listing.om_url} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-3 h-3 mr-1" />
                                  Download OM
                                </a>
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                className="flex-1 text-xs" 
                                disabled
                              >
                                <Download className="w-3 h-3 mr-1" />
                                OM Soon
                              </Button>
                            )}
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="flex-1 text-xs border-white/20 hover:bg-white/5"
                              asChild
                            >
                              <Link to={`/services/investment-sales/deal-room/${listing.id}`}>
                                <Lock className="w-3 h-3 mr-1" />
                                Deal Room
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Building2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Active Listings
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                      Our team is currently sourcing new investment opportunities. 
                      Contact us to discuss off-market deals.
                    </p>
                    <Button size="sm" asChild>
                      <Link to="/contact">Contact Our Team</Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Right: Mapbox Placeholder */}
              <div className="lg:w-[40%]">
                <div className="sticky top-24 h-[500px] lg:h-[600px] bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <span className="text-2xl font-light text-muted-foreground">Mapbox</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Looking for Off-Market Opportunities?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm">
                Many of our best deals never make it to public listings. Connect with our 
                investment sales team to access exclusive opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button size="default" asChild>
                  <Link to="/contact">Schedule a Consultation</Link>
                </Button>
                <Button size="default" variant="outline" className="border-white/20" asChild>
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
