import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Download, Lock, Building2, MapPin, TrendingUp, Layers, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHelmet } from "@/components/SEOHelmet";
import { ServicePageNav } from "@/components/ServicePageNav";
import { useInvestmentListings, InvestmentListing } from "@/hooks/useInvestmentListings";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { InvestmentListingDialog } from "@/components/InvestmentListingDialog";
import brooklynBridgeHero from "@/assets/brooklyn-bridge-hero.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const PRICE_RANGES = [
  { label: "All Prices", value: "all", min: 0, max: Infinity },
  { label: "Under $1M", value: "under-1m", min: 0, max: 1000000 },
  { label: "$1M - $5M", value: "1m-5m", min: 1000000, max: 5000000 },
  { label: "$5M - $10M", value: "5m-10m", min: 5000000, max: 10000000 },
  { label: "$10M - $25M", value: "10m-25m", min: 10000000, max: 25000000 },
  { label: "$25M+", value: "25m-plus", min: 25000000, max: Infinity },
];

const InvestmentListings = () => {
  const { data: listings, isLoading } = useInvestmentListings();
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollReveal();

  // Selected listing for dialog
  const [selectedListing, setSelectedListing] = useState<InvestmentListing | null>(null);

  // Filter states
  const [selectedBorough, setSelectedBorough] = useState<string>("all");
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");

  // Extract unique boroughs and asset classes from listings
  const { boroughs, assetClasses } = useMemo(() => {
    if (!listings) return { boroughs: [], assetClasses: [] };
    
    const boroughSet = new Set<string>();
    const assetClassSet = new Set<string>();
    
    listings.forEach((listing) => {
      if (listing.borough) boroughSet.add(listing.borough);
      if (listing.asset_class) assetClassSet.add(listing.asset_class);
    });
    
    return {
      boroughs: Array.from(boroughSet).sort(),
      assetClasses: Array.from(assetClassSet).sort(),
    };
  }, [listings]);

  // Filter listings based on selected filters
  const filteredListings = useMemo(() => {
    if (!listings) return [];
    
    return listings.filter((listing) => {
      // Borough filter
      if (selectedBorough !== "all" && listing.borough !== selectedBorough) {
        return false;
      }
      
      // Asset class filter
      if (selectedAssetClass !== "all" && listing.asset_class !== selectedAssetClass) {
        return false;
      }
      
      // Price range filter
      if (selectedPriceRange !== "all") {
        const priceRange = PRICE_RANGES.find((r) => r.value === selectedPriceRange);
        if (priceRange && listing.asking_price) {
          if (listing.asking_price < priceRange.min || listing.asking_price >= priceRange.max) {
            return false;
          }
        } else if (priceRange && !listing.asking_price) {
          return false; // Exclude "Price Upon Request" when filtering by price
        }
      }
      
      return true;
    });
  }, [listings, selectedBorough, selectedAssetClass, selectedPriceRange]);

  const hasActiveFilters = selectedBorough !== "all" || selectedAssetClass !== "all" || selectedPriceRange !== "all";

  const clearFilters = () => {
    setSelectedBorough("all");
    setSelectedAssetClass("all");
    setSelectedPriceRange("all");
  };

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
          className={`relative h-[35vh] sm:h-[40vh] md:h-[45vh] min-h-[280px] sm:min-h-[320px] md:min-h-[400px] flex items-center justify-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <img 
            src={brooklynBridgeHero} 
            alt="New York City" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white mb-2 sm:mb-4 tracking-tight">
              Investment Sales Exclusives
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto">
              Curated investment opportunities across New York City's most dynamic markets
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="px-4 sm:px-6 py-4 sm:py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Filter by:</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Borough Filter */}
                <Select value={selectedBorough} onValueChange={setSelectedBorough}>
                  <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs sm:text-sm bg-white/[0.02] border-white/10">
                    <SelectValue placeholder="Borough" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Boroughs</SelectItem>
                    {boroughs.map((borough) => (
                      <SelectItem key={borough} value={borough}>
                        {borough}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Asset Class Filter */}
                <Select value={selectedAssetClass} onValueChange={setSelectedAssetClass}>
                  <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs sm:text-sm bg-white/[0.02] border-white/10">
                    <SelectValue placeholder="Asset Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Asset Classes</SelectItem>
                    {assetClasses.map((assetClass) => (
                      <SelectItem key={assetClass} value={assetClass}>
                        {assetClass}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Range Filter */}
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs sm:text-sm bg-white/[0.02] border-white/10">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-xs sm:text-sm text-muted-foreground">
                {filteredListings.length} {filteredListings.length === 1 ? "listing" : "listings"}
              </div>
            </div>
          </div>
        </section>

        {/* Split Layout: Listings + Map */}
        <section 
          ref={gridRef} 
          className={`px-4 sm:px-6 py-8 sm:py-12 transition-all duration-700 delay-200 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left: Listings Grid */}
              <div className="lg:w-[60%]">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-[4/3] bg-white/[0.02] animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {filteredListings.map((listing, index) => (
                      <article
                        key={listing.id}
                        onClick={() => setSelectedListing(listing)}
                        className="group relative bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 cursor-pointer"
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

                        {/* Content - Fixed Height for Consistency */}
                        <div className="p-4 flex flex-col h-[200px]">
                          {/* Address & Location */}
                          <div className="flex-none">
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
                          <div className="flex items-center gap-3 text-xs mt-3 flex-none">
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

                          {/* Price & Cap Rate - Always Same Height */}
                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 flex-none">
                            <p className="text-lg font-bold text-foreground">
                              {formatPrice(listing.asking_price)}
                            </p>
                            <div className="text-right min-w-[60px]">
                              {listing.cap_rate ? (
                                <>
                                  <p className="text-xs text-muted-foreground">Cap</p>
                                  <p className="text-sm font-semibold text-primary flex items-center justify-end gap-0.5">
                                    <TrendingUp className="w-3 h-3" />
                                    {formatCapRate(listing.cap_rate)}
                                  </p>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons - Push to Bottom */}
                          <div className="flex gap-2 mt-auto pt-3 flex-none">
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
                      {hasActiveFilters ? "No Matching Listings" : "No Active Listings"}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                      {hasActiveFilters 
                        ? "Try adjusting your filters to see more results."
                        : "Our team is currently sourcing new investment opportunities. Contact us to discuss off-market deals."
                      }
                    </p>
                    {hasActiveFilters ? (
                      <Button size="sm" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    ) : (
                      <Button size="sm" asChild>
                        <Link to="/contact">Contact Our Team</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Interactive Map */}
              <div className="lg:w-[40%] hidden lg:block">
                <div className="sticky top-24 h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/10">
                  <iframe 
                    src="https://my.atlist.com/map/56e87263-fdcd-4bad-9e1f-645a9fd7096e?share=true" 
                    allow="geolocation 'self' https://my.atlist.com" 
                    width="100%" 
                    height="100%" 
                    loading="lazy" 
                    frameBorder="0" 
                    scrolling="no" 
                    allowFullScreen 
                    title="Investment Listings Map"
                    className="w-full h-full"
                  />
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

      {/* Listing Detail Dialog */}
      <InvestmentListingDialog
        listing={selectedListing}
        open={!!selectedListing}
        onOpenChange={(open) => !open && setSelectedListing(null)}
      />
    </>
  );
};

export default InvestmentListings;
