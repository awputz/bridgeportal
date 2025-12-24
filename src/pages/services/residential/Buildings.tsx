import { Link } from "react-router-dom";
import { Building2, MapPin, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useBridgeBuildings } from "@/hooks/useBridgeBuildings";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
    <section className="relative bg-gradient-to-b from-secondary to-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-3 text-sm">Residential / Exclusive Portfolio</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Exclusive Building Portfolio
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mb-6">
          Premier residential properties exclusively represented by Bridge across New York City
        </p>
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-2xl font-bold text-primary">{totalBuildings}</div>
            <div className="text-xs text-muted-foreground">Buildings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{totalUnits}+</div>
            <div className="text-xs text-muted-foreground">Total Units</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{Object.keys(buildingsByBorough).length}</div>
            <div className="text-xs text-muted-foreground">Boroughs</div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Buildings Grid by Borough */}
      <section className="py-10 md:py-14" ref={gridReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`transition-all duration-700 ${gridReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2].map(i => (
                  <div key={i}>
                    <Skeleton className="h-6 w-28 mb-4" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[1, 2, 3].map(j => <Skeleton key={j} className="h-64 rounded-lg" />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(buildingsByBorough).map(([borough, boroughBuildings], boroughIndex) => (
                  <div key={borough}>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4 text-accent" />
                      <h2 className="text-lg md:text-xl font-medium">{borough}</h2>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        {boroughBuildings?.length} {boroughBuildings?.length === 1 ? 'building' : 'buildings'}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {boroughBuildings?.map((building, index) => (
                        <div
                          key={building.id}
                          className="group rounded-lg border border-border/50 bg-card hover:border-accent/30 hover:shadow-md transition-all duration-300 overflow-hidden"
                          style={{ transitionDelay: `${(boroughIndex * 3 + index) * 50}ms` }}
                        >
                          {/* Building Photo */}
                          <AspectRatio ratio={16 / 10} className="bg-muted">
                            {building.image_url ? (
                              <img
                                src={building.image_url}
                                alt={building.name}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                                <Building2 className="w-8 h-8 text-muted-foreground/30" />
                              </div>
                            )}
                          </AspectRatio>
                          
                          {/* Card Content */}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-1.5">
                              <h3 className="text-base font-medium group-hover:text-accent transition-colors line-clamp-1">
                                {building.name}
                              </h3>
                              {building.unit_count && (
                                <span className="text-xs text-accent bg-accent/10 px-1.5 py-0.5 rounded shrink-0 ml-2">
                                  {building.unit_count} units
                                </span>
                              )}
                            </div>
                            {building.neighborhood && (
                              <p className="text-xs text-muted-foreground mb-0.5">
                                {building.neighborhood}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground/70 line-clamp-1">
                              {building.address}
                            </p>
                            {building.tags && building.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {building.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
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
      <section className="py-10 md:py-14 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-xl md:text-2xl font-medium mb-6 text-center">Why Our Portfolio</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg border border-border/50 bg-card">
              <Home className="h-5 w-5 text-accent mb-3" />
              <h3 className="text-base font-medium mb-1.5">Exclusive Access</h3>
              <p className="text-xs text-muted-foreground">
                Priority access to units before they hit the market. Many apartments never get publicly listed.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border/50 bg-card">
              <Building2 className="h-5 w-5 text-accent mb-3" />
              <h3 className="text-base font-medium mb-1.5">Quality Assured</h3>
              <p className="text-xs text-muted-foreground">
                Every building in our portfolio meets strict standards for maintenance, amenities, and management.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border/50 bg-card">
              <MapPin className="h-5 w-5 text-accent mb-3" />
              <h3 className="text-base font-medium mb-1.5">Prime Locations</h3>
              <p className="text-xs text-muted-foreground">
                Strategically located across NYC's most desirable neighborhoods with excellent transit access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 border-t border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium mb-3">
            Interested in Our Buildings?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact us to learn about current availability and upcoming units in our exclusive portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="default" onClick={openContactSheet}>
              Inquire About Availability
            </Button>
            <Button asChild variant="outline" size="default">
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
