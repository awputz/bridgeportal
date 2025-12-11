import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Store, CheckCircle, ArrowRight, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBridgePageContent } from "@/hooks/useBridgePageContent";
import { useContactSheet } from "@/contexts/ContactSheetContext";

interface CorridorItem {
  name: string;
  description: string;
}

interface ServiceItem {
  title: string;
  description: string;
}

interface CategoryItem {
  title: string;
  description: string;
}

const Retail = () => {
  const { openContactSheet } = useContactSheet();
  const { data: pageContent } = useBridgePageContent("commercial_retail");

  // Get content from CMS or use defaults
  const heroSection = pageContent?.find(s => s.section_key === "hero");
  const corridorsSection = pageContent?.find(s => s.section_key === "corridors");
  const landlordServicesSection = pageContent?.find(s => s.section_key === "landlord_services");
  const tenantCategoriesSection = pageContent?.find(s => s.section_key === "tenant_categories");

  const corridors: CorridorItem[] = corridorsSection?.metadata?.items as CorridorItem[] || [
    { name: "Fifth Avenue", description: "Flagship retail destination" },
    { name: "Madison Avenue", description: "Luxury boutiques & brands" },
    { name: "SoHo", description: "Fashion & lifestyle retail" },
    { name: "Bleecker Street", description: "Village shopping corridor" },
    { name: "Brooklyn Heights", description: "Neighborhood retail" },
    { name: "Williamsburg", description: "Emerging retail hub" },
  ];

  const landlordServices: ServiceItem[] = landlordServicesSection?.metadata?.items as ServiceItem[] || [
    { title: "Space Positioning", description: "Strategic rent pricing and tenant targeting based on location and foot traffic analysis." },
    { title: "Tenant Outreach", description: "Direct marketing to qualified retailers, restaurants, and service tenants." },
    { title: "Lease Negotiation", description: "Structure deals that protect landlord interests while attracting quality tenants." },
    { title: "Market Analysis", description: "Competitive intelligence on rents, vacancies, and tenant demand in your corridor." },
  ];

  const tenantCategories: CategoryItem[] = tenantCategoriesSection?.metadata?.items as CategoryItem[] || [
    { title: "Fashion & Apparel", description: "Boutiques, footwear, and accessories" },
    { title: "Food & Beverage", description: "Restaurants, cafes, and specialty food" },
    { title: "Health & Wellness", description: "Fitness studios, spas, and medical" },
    { title: "Professional Services", description: "Banks, salons, and service retail" },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Commercial Leasing / Retail</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          {heroSection?.title || "Retail Leasing"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {heroSection?.content || "From flagship storefronts to neighborhood shops, we connect retailers with premium NYC locations that drive foot traffic and build brands."}
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="commercial-leasing" heroContent={heroContent}>
      {/* Premier Retail Corridors */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            {corridorsSection?.title || "Premier Retail Corridors"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corridors.map(area => (
              <div key={area.name} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <Store className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground">{area.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landlord Services */}
      <section className="py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {landlordServicesSection?.title || "Landlord Services"}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            {landlordServicesSection?.content || "Comprehensive leasing services for retail property owners seeking to maximize asset performance."}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {landlordServices.map(service => (
              <div key={service.title} className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border">
                <Building2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tenant Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {tenantCategoriesSection?.title || "Tenant Categories We Serve"}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            {tenantCategoriesSection?.content || "Experience across a wide range of retail tenant types."}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenantCategories.map(category => (
              <div key={category.title} className="p-6 bg-secondary/20 rounded-lg border border-border text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Find Your Retail Space</h2>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>
            Contact Us <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Retail;