import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Building2, ArrowRight, Briefcase, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { useBridgePageContent } from "@/hooks/useBridgePageContent";

interface SubmarketItem {
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

const Office = () => {
  const { openContactSheet } = useContactSheet();
  const { data: pageContent } = useBridgePageContent("commercial_office");

  // Get content from CMS or use defaults
  const heroSection = pageContent?.find(s => s.section_key === "hero");
  const submarketSection = pageContent?.find(s => s.section_key === "submarkets");
  const landlordServicesSection = pageContent?.find(s => s.section_key === "landlord_services");
  const professionalServicesSection = pageContent?.find(s => s.section_key === "professional_services");

  const submarkets: SubmarketItem[] = submarketSection?.metadata?.items as SubmarketItem[] || [
    { name: "Midtown Manhattan", description: "Premier corporate address" },
    { name: "Financial District", description: "Financial services hub" },
    { name: "Hudson Yards", description: "Modern office campus" },
    { name: "Brooklyn Tech Triangle", description: "Tech & creative offices" },
    { name: "Long Island City", description: "Emerging office market" },
    { name: "Chelsea", description: "Creative office district" },
  ];

  const landlordServices: ServiceItem[] = landlordServicesSection?.metadata?.items as ServiceItem[] || [
    { title: "Space Marketing", description: "Comprehensive marketing campaigns to reach qualified office tenants actively seeking space." },
    { title: "Lease Structuring", description: "Navigate complex lease terms including base rent, escalations, and tenant improvement allowances." },
    { title: "Market Analysis", description: "In-depth analysis of comparable spaces, vacancy rates, and rental trends in your submarket." },
    { title: "Tenant Representation", description: "Advocate for tenants seeking office space, from site selection to lease execution." },
  ];

  const professionalServices: CategoryItem[] = professionalServicesSection?.metadata?.items as CategoryItem[] || [
    { title: "Law Firms", description: "Professional office space for legal practices" },
    { title: "Financial Services", description: "Banking, investment, and wealth management" },
    { title: "Creative Agencies", description: "Advertising, design, and media companies" },
    { title: "Consulting Firms", description: "Strategy, management, and advisory services" },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Commercial Leasing / Office</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          {heroSection?.title || "Office Leasing"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {heroSection?.content || "Professional office space for law firms, financial services, creative agencies, and consulting firms seeking strategic locations across NYC's premier submarkets."}
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="commercial-leasing" heroContent={heroContent}>
      {/* Key Office Submarkets */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            {submarketSection?.title || "Key Office Submarkets"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submarkets.map(area => (
              <div key={area.name} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <Building2 className="h-8 w-8 text-primary mb-4" />
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
            {landlordServicesSection?.content || "Full-service leasing support for office property owners and managers."}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {landlordServices.map(service => (
              <div key={service.title} className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Services Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {professionalServicesSection?.title || "Tenants We Serve"}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            {professionalServicesSection?.content || "Experience across professional services firms of all sizes."}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {professionalServices.map(category => (
              <div key={category.title} className="p-6 bg-secondary/20 rounded-lg border border-border text-center">
                <Briefcase className="h-8 w-8 text-primary mx-auto mb-4" />
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
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Find Your Office</h2>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>
            Contact Us <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Office;