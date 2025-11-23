import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import { useBuildings } from "@/hooks/useBuildings";

const Buildings = () => {
  const { data: buildings = [], isLoading } = useBuildings();

  return (
    <div className="min-h-screen pt-40 pb-20">
      {/* Hero Section */}
      <section className="px-6 lg:px-8 mb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="mb-6">Buildings We Represent</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              BRIDGE Residential represents {buildings.length}+ buildings across Manhattan, Brooklyn, and Queens. Each property benefits from our platform approach to leasing, marketing, and operations.
            </p>
          </div>
        </div>
      </section>

      {/* Buildings Grid */}
      <section className="px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">Loading buildings...</p>
            </div>
          ) : buildings.length === 0 ? (
            <div className="text-center py-20">
              <Building2 size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No buildings available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {buildings.map((building) => (
                <Card 
                  key={building.id} 
                  className="overflow-hidden border border-border bg-card hover-lift group"
                >
                  {/* Image */}
                  {building.images && building.images.length > 0 ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={building.images[0]} 
                        alt={building.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      <Building2 size={48} className="text-muted-foreground" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{building.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin size={16} />
                      <p className="text-sm">{building.address}, {building.city}</p>
                    </div>

                    {building.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {building.description}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="flex flex-col gap-2">
                      <Button asChild className="rounded-full w-full" size="sm">
                        <Link to="/contact">
                          Inquire
                          <ArrowRight size={14} className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 mt-32">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 lg:p-16 text-center border border-border bg-card">
            <h2 className="mb-6">Represent Your Building with BRIDGE Residential</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We provide comprehensive building representation services including leasing, marketing, tenant relations, and strategic advisory for landlords and developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/landlords-sellers">
                  Landlord Services
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/contact">
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Buildings;
