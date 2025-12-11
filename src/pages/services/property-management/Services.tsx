import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Wrench, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PMServices = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Property Management / Services</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Full-Service Management</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Comprehensive property management services for multifamily and commercial assets.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="property-management" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Tenant Management", items: ["Screening & placement", "Lease administration", "Renewal negotiations", "Move-in/out coordination"] },
              { title: "Financial Management", items: ["Rent collection", "AP/AR management", "Budget preparation", "Financial reporting"] },
              { title: "Maintenance", items: ["24/7 emergency response", "Preventive maintenance", "Vendor management", "Capital improvements"] },
            ].map(service => (
              <div key={service.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <Wrench className="h-8 w-8 text-primary mb-4" />
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
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Need Property Management?</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default PMServices;
