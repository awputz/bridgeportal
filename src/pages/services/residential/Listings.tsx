import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useProperties } from "@/hooks/useProperties";
import { Building2, MapPin, ArrowRight, Bed, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const Listings = () => {
  const { data: properties, isLoading } = useProperties();

  const residentialProperties = properties?.filter(p => 
    p.listing_type === "residential" || p.property_type?.toLowerCase().includes("residential")
  ) || [];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Listings</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Current Listings
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Browse our exclusive portfolio of residential properties available for rent and sale 
          across New York City.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Listings Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-secondary/20 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-secondary/50" />
                  <div className="p-6">
                    <div className="h-6 bg-secondary/50 rounded mb-4 w-3/4" />
                    <div className="h-4 bg-secondary/50 rounded mb-2 w-1/2" />
                    <div className="h-4 bg-secondary/50 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : residentialProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {residentialProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-secondary/20 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="h-48 bg-secondary/30 flex items-center justify-center">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address}, {property.city}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms} BR</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{property.bathrooms} BA</span>
                        </div>
                      )}
                      {property.square_feet && (
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          <span>{property.square_feet.toLocaleString()} SF</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary">
                        {property.price_on_request ? "Price on Request" : `$${property.price.toLocaleString()}`}
                      </p>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/contact">Inquire</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-4">
                No Current Listings
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Our inventory is constantly changing. Contact us to learn about upcoming 
                listings and off-market opportunities.
              </p>
              <Button asChild>
                <Link to="/contact">
                  Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Off-Market CTA */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Looking for Off-Market Properties?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Many of our best properties never hit the public market. Contact us to access 
            our exclusive inventory.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">
              Access Off-Market Listings <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Listings;
