import { Link } from "react-router-dom";
import { Building2, MapPin, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useBridgeBuildings } from "@/hooks/useBridgeBuildings";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResidentialBuildings() {
  const { openContactSheet } = useContactSheet();
  const { data: buildings, isLoading } = useBridgeBuildings();
  
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

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Buildings</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Exclusive Building Portfolio
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mb-8">
          Premier residential properties exclusively represented by Bridge across New York City
        </p>
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-3xl font-bold text-primary">{totalBuildings}</div>
            <div className="text-sm text-muted-foreground">Buildings</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{totalUnits}+</div>
            <div className="text-sm text-muted-foreground">Total Units</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{Object.keys(buildingsByBorough).length}</div>
            <div className="text-sm text-muted-foreground">Boroughs</div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
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
                          className="group p-6 rounded-lg border border-border/50 bg-card hover:border-accent/30 transition-all duration-300"
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
                                <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
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
      <section className="py-12 md:py-20 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">Why Our Portfolio</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border/50 bg-card">
              <Home className="h-6 w-6 text-accent mb-4" />
              <h3 className="text-lg font-light mb-2">Exclusive Access</h3>
              <p className="text-sm text-muted-foreground font-light">
                Priority access to units before they hit the market. Many apartments never get publicly listed.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border/50 bg-card">
              <Building2 className="h-6 w-6 text-accent mb-4" />
              <h3 className="text-lg font-light mb-2">Quality Assured</h3>
              <p className="text-sm text-muted-foreground font-light">
                Every building in our portfolio meets strict standards for maintenance, amenities, and management.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border/50 bg-card">
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
      <section className="py-12 md:py-20 lg:py-28 border-t border-border">
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
    </ServicePageLayout>
  );
}