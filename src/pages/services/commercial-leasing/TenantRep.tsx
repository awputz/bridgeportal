import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Users, Building2, CheckCircle, ArrowRight, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { useBridgePageSection } from "@/hooks/useBridgePageContent";

const TenantRep = () => {
  const { openContactSheet } = useContactSheet();
  const { data: tenantRepSection } = useBridgePageSection("commercial_services", "tenant_rep");

  // Get content from CMS or use defaults
  const services = tenantRepSection?.metadata?.deliverables as string[] || [
    "Requirements analysis and space criteria",
    "Market survey and space identification",
    "Tour coordination and space comparison",
    "Lease negotiation and TI coordination",
  ];

  const timeline = tenantRepSection?.metadata?.timeline as string || "1-4 months from search to lease execution";
  const bestFor = tenantRepSection?.metadata?.best_for as string || "Retailers, restaurants, professional services, medical practices, and office users";

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Commercial Leasing / Tenant Representation</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          {tenantRepSection?.title || "Tenant Representation"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {tenantRepSection?.content || "Expert guidance for retail, restaurant, wellness, medical, and office tenants seeking the right space at the right terms."}
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="commercial-leasing" heroContent={heroContent}>
      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Tenant Rep Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {services.map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-secondary/30 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-primary">500+</p>
                  <p className="text-muted-foreground text-sm">Tenants Represented</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">2M+</p>
                  <p className="text-muted-foreground text-sm">SF Leased</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline and Best For */}
      <section className="py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Timeline</h3>
              </div>
              <p className="text-muted-foreground">{timeline}</p>
            </div>
            <div className="p-6 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Best For</h3>
              </div>
              <p className="text-muted-foreground">{bestFor}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Need Space?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Let us help you find the perfect location for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/commercial-listings">
                  View Available Spaces <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={openContactSheet}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default TenantRep;