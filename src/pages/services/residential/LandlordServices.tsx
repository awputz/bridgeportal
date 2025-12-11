import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useBridgePageSection } from "@/hooks/useBridgePageContent";
import { Building2, Users, FileText, TrendingUp, Shield, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";

const LandlordServices = () => {
  const { openContactSheet } = useContactSheet();
  const { data: heroData } = useBridgePageSection("residential_landlord_services", "hero");
  const { data: partnershipData } = useBridgePageSection("residential_landlord_services", "partnership");

  const services = [
    {
      icon: Users,
      title: "Tenant Placement",
      description: "Comprehensive tenant screening, background checks, and placement services to find qualified renters for your property.",
    },
    {
      icon: FileText,
      title: "Lease Administration",
      description: "Professional lease preparation, renewals, and compliance management to protect your interests.",
    },
    {
      icon: TrendingUp,
      title: "Market Analysis",
      description: "Data-driven rental pricing strategies to maximize your property's income potential.",
    },
    {
      icon: Building2,
      title: "Property Marketing",
      description: "Professional photography, virtual tours, and strategic listing placement across major platforms.",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Thorough applicant vetting and lease structuring to minimize vacancy and default risk.",
    },
    {
      icon: Headphones,
      title: "Ongoing Support",
      description: "Dedicated account management and 24/7 support for landlords and property owners.",
    },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Landlord Services</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          {heroData?.title || "Services for Property Owners"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {heroData?.content || "Comprehensive leasing and management solutions for landlords and property owners throughout New York City."}
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Partnership Section */}
      <section className="py-12 bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {partnershipData?.title || "Hudson Property Group Partnership"}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                {partnershipData?.content || "Our exclusive partnership with Hudson Property Group provides landlords with end-to-end property management services, from tenant placement to building operations."}
              </p>
            </div>
            <Button onClick={openContactSheet}>
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Our Services
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Full-service solutions for landlords of all portfolio sizes.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-secondary/20 rounded-lg p-6 border border-border hover:border-primary/50 transition-colors"
              >
                <service.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Backend Services */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Backend Underwriting Services
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Comprehensive financial analysis and tenant qualification services.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Income Verification</h3>
              <ul className="space-y-3">
                {[
                  "Employment verification with HR departments",
                  "Pay stub and W-2 analysis",
                  "Self-employment income documentation",
                  "Asset verification for alternative qualifications",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background rounded-lg p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Credit & Background</h3>
              <ul className="space-y-3">
                {[
                  "Comprehensive credit report analysis",
                  "Criminal background screening",
                  "Eviction history search",
                  "Landlord reference verification",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application Requirements - Merged from Resources */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Standard Application Requirements
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Help your applicants prepare with these standard requirements.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Photo ID", description: "Government-issued identification for all applicants" },
              { title: "Proof of Income", description: "Recent pay stubs, tax returns, or employment letter" },
              { title: "Bank Statements", description: "Last 2-3 months of bank statements" },
              { title: "References", description: "Previous landlord and personal references" },
            ].map((req) => (
              <div key={req.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{req.title}</h3>
                <p className="text-sm text-muted-foreground">{req.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Partner With BRIDGE
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Let us help you maximize your property's potential with our comprehensive landlord services.
          </p>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default LandlordServices;
