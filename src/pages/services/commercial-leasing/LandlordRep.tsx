import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Building2, CheckCircle, ArrowRight, Clock, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { useBridgePageSection } from "@/hooks/useBridgePageContent";

const LandlordRep = () => {
  const { openContactSheet } = useContactSheet();
  const { data: landlordRepSection } = useBridgePageSection("commercial_services", "landlord_rep");

  // Get content from CMS or use defaults
  const deliverables = landlordRepSection?.metadata?.deliverables as string[] || [
    "Space positioning and pricing strategy",
    "Professional marketing materials and photos",
    "Targeted tenant outreach and screening",
    "Lease negotiation and execution support",
  ];

  const timeline = landlordRepSection?.metadata?.timeline as string || "2-6 months from listing to lease signing";
  const bestFor = landlordRepSection?.metadata?.best_for as string || "Retail storefronts, office spaces, medical suites, and mixed-use commercial";

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Commercial Leasing / Landlord Representation</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          {landlordRepSection?.title || "Landlord Representation"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {landlordRepSection?.content || "Comprehensive landlord services to position, market, and lease your retail or office space quickly and at optimal terms."}
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="commercial-leasing" heroContent={heroContent}>
      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Landlord Rep Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {deliverables.map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-secondary/30 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-primary">100+</p>
                  <p className="text-muted-foreground text-sm">Properties Represented</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">98%</p>
                  <p className="text-muted-foreground text-sm">Occupancy Rate</p>
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

      {/* What Sets Us Apart */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-secondary/20 rounded-lg border border-border">
              <Building2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">In-House Marketing</h3>
              <p className="text-sm text-muted-foreground">Professional photography, brochures, and digital campaigns created by our integrated marketing team.</p>
            </div>
            <div className="p-6 bg-secondary/20 rounded-lg border border-border">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Tenant Network</h3>
              <p className="text-sm text-muted-foreground">Direct relationships with qualified retailers, restaurants, and professional service tenants.</p>
            </div>
            <div className="p-6 bg-secondary/20 rounded-lg border border-border">
              <Target className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Market Intelligence</h3>
              <p className="text-sm text-muted-foreground">Data-driven insights on rents, vacancies, and tenant demand to inform positioning strategy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">List Your Space</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Let us help you find quality tenants and maximize your property's performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/services/commercial-leasing/listings">
                View Current Listings <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={openContactSheet}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default LandlordRep;
