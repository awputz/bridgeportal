import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBridgePageSection } from "@/hooks/useBridgePageContent";

const LandlordRep = () => {
  const { data: landlordRepSection } = useBridgePageSection("commercial_services", "landlord_rep");

  // Get content from CMS or use defaults
  const deliverables = landlordRepSection?.metadata?.deliverables as string[] || [
    "Space positioning and pricing strategy",
    "Professional marketing materials and photos",
    "Targeted tenant outreach and screening",
    "Lease negotiation and execution support",
  ];

  const defaultServices = [
    { title: "Tenant Procurement", items: ["Market positioning", "Targeted outreach", "Qualification screening"] },
    { title: "Lease Management", items: ["Renewal negotiations", "Rent optimization", "Lease administration"] },
    { title: "Property Marketing", items: ["Professional materials", "Digital campaigns", "Broker relationships"] },
  ];

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
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Landlord Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {defaultServices.map(service => (
              <div key={service.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">{service.title}</h3>
                <ul className="space-y-2">{service.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />{item}</li>
                ))}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Have Space to Lease?</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default LandlordRep;
