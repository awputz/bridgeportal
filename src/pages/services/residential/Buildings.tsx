import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useBridgeBuildings } from "@/hooks/useBridgeBuildings";
import { Building2, MapPin, Home, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Buildings = () => {
  const { data: buildings, isLoading } = useBridgeBuildings();
  const [selectedBorough, setSelectedBorough] = useState<string | null>(null);

  const boroughs = [...new Set(buildings?.map(b => b.borough).filter(Boolean) || [])];

  const filteredBuildings = selectedBorough
    ? buildings?.filter(b => b.borough === selectedBorough)
    : buildings;

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Buildings</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Exclusive Buildings
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Our portfolio of represented residential buildings across New York City.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Stats */}
      <section className="py-12 bg-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-foreground">{buildings?.length || 0}</p>
              <p className="text-muted-foreground text-sm">Buildings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {buildings?.reduce((acc, b) => acc + (b.unit_count || 0), 0) || 0}+
              </p>
              <p className="text-muted-foreground text-sm">Total Units</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{boroughs.length}</p>
              <p className="text-muted-foreground text-sm">Boroughs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {[...new Set(buildings?.map(b => b.neighborhood).filter(Boolean))].length}
              </p>
              <p className="text-muted-foreground text-sm">Neighborhoods</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">Filter by borough:</span>
            <Button
              variant={selectedBorough === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBorough(null)}
            >
              All
            </Button>
            {boroughs.map((borough) => (
              <Button
                key={borough}
                variant={selectedBorough === borough ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBorough(borough)}
              >
                {borough}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Buildings Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-secondary/20 rounded-lg p-6 border border-border">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuildings?.map((building) => (
                <div
                  key={building.id}
                  className="bg-secondary/20 rounded-lg p-6 border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-6 w-6 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{building.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {building.address}
                        </p>
                      </div>
                    </div>
                    {building.unit_count && (
                      <div className="flex items-center gap-1 text-sm text-foreground bg-secondary/50 px-2 py-1 rounded">
                        <Home className="h-3 w-3" />
                        {building.unit_count}
                      </div>
                    )}
                  </div>

                  {building.neighborhood && (
                    <p className="text-sm text-primary font-medium mb-3">
                      {building.neighborhood}
                      {building.borough && ` • ${building.borough}`}
                    </p>
                  )}

                  {building.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{building.description}</p>
                  )}

                  {(building as any).website_url && (
                    <a
                      href={(building as any).website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                    >
                      Visit Website <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && (!filteredBuildings || filteredBuildings.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No buildings found.</p>
            </div>
          )}
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Buildings;
