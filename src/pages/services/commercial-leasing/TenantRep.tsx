import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Users, Building2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TenantRep = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Commercial Leasing / Tenant Representation</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Tenant Representation</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Expert advocacy for businesses seeking the perfect commercial space in New York City.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="commercial-leasing" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Tenant Rep Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {["Market analysis & site selection", "Lease negotiation & restructuring", "Renewal strategy", "Sublease assistance", "Build-out coordination"].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-secondary/30 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div><p className="text-4xl font-bold text-primary">500+</p><p className="text-muted-foreground text-sm">Tenants Represented</p></div>
                <div><p className="text-4xl font-bold text-primary">2M+</p><p className="text-muted-foreground text-sm">SF Leased</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Need Space?</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default TenantRep;
