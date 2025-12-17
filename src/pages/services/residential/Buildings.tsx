import { Link } from "react-router-dom";
import { Building2, MapPin, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { useBridgeBuildings } from "@/hooks/useBridgeBuildings";
import { Skeleton } from "@/components/ui/skeleton";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

export default function ResidentialBuildings() {
  const { openContactSheet } = useContactSheet();
  const { data: buildings, isLoading } = useBridgeBuildings();
  
  const heroReveal = useScrollReveal(0.1);
  const gridReveal = useScrollReveal(0.1);

  // Group buildings by borough
  const buildingsByBorough = buildings?.reduce((acc, building) => {
    const borough = building.borough || "Other";
    if (!acc[borough]) acc[borough] = [];
    acc[borough].push(building);
    return acc;
  }, {} as Record<string, typeof buildings>) || {};

  const totalUnits = buildings?.reduce((sum, b) => sum + (b.unit_count || 0), 0) || 0;
  const totalBuildings = buildings?.length || 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center pt-20 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${PLACEHOLDER_IMAGES.building.apartment})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10" ref={heroReveal.elementRef}>
          <div className={`transition-all duration-700 ${
            heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Link to="/services/residential" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Residential
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm">Buildings</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
              Exclusive Building Portfolio
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto mb-6">
              Premier residential properties exclusively represented by Bridge across New York City
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-light text-foreground">{totalBuildings}</div>
                <div className="text-sm text-muted-foreground">Buildings</div>
              </div>
              <div className="w-px bg-white/10 hidden sm:block" />
              <div>
                <div className="text-2xl md:text-3xl font-light text-foreground">{totalUnits}+</div>
                <div className="text-sm text-muted-foreground">Total Units</div>
              </div>
              <div className="w-px bg-white/10 hidden sm:block" />
              <div>
                <div className="text-2xl md:text-3xl font-light text-foreground">{Object.keys(buildingsByBorough).length}</div>
                <div className="text-sm text-muted-foreground">Boroughs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="residential" />

      {/* Buildings Grid by Borough */}
      <section className="py-12 md:py-20 lg:py-28" ref={gridReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`transition-all duration-700 ${
            gridReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {isLoading ? (
              <div className="space-y-12">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-8 w-32 mb-6" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-48 rounded-lg" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(buildingsByBorough).map(([borough, boroughBuildings], boroughIndex) => (
                  <div key={borough}>
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="h-5 w-5 text-accent" />
                      <h2 className="text-xl md:text-2xl font-light">{borough}</h2>
                      <span className="text-sm text-muted-foreground">
                        ({boroughBuildings?.length} {boroughBuildings?.length === 1 ? 'building' : 'buildings'})
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {boroughBuildings?.map((building, index) => (
                        <div
                          key={building.id}
                          className="group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
                          style={{ transitionDelay: `${(boroughIndex * 3 + index) * 50}ms` }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <Building2 className="h-5 w-5 text-accent" />
                            {building.unit_count && (
                              <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">
                                {building.unit_count} units
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-light mb-1 group-hover:text-accent transition-colors">
                            {building.name}
                          </h3>
                          {building.neighborhood && (
                            <p className="text-sm text-muted-foreground font-light mb-2">
                              {building.neighborhood}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground/70 font-light">
                            {building.address}
                          </p>
                          {building.tags && building.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {building.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Our Portfolio Section */}
      <section className="py-12 md:py-20 border-t border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">Why Our Portfolio</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <Home className="h-6 w-6 text-accent mb-4" />
              <h3 className="text-lg font-light mb-2">Exclusive Access</h3>
              <p className="text-sm text-muted-foreground font-light">
                Priority access to units before they hit the market. Many apartments never get publicly listed.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <Building2 className="h-6 w-6 text-accent mb-4" />
              <h3 className="text-lg font-light mb-2">Quality Assured</h3>
              <p className="text-sm text-muted-foreground font-light">
                Every building in our portfolio meets strict standards for maintenance, amenities, and management.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <MapPin className="h-6 w-6 text-accent mb-4" />
              <h3 className="text-lg font-light mb-2">Prime Locations</h3>
              <p className="text-sm text-muted-foreground font-light">
                Strategically located across NYC's most desirable neighborhoods with excellent transit access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 lg:py-28 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">
            Interested in Our Buildings?
          </h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Contact us to learn about current availability and upcoming units in our exclusive portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Inquire About Availability
            </Button>
            <Button asChild variant="outline" size="lg" className="font-light">
              <Link to="/services/residential">
                Back to Residential <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
