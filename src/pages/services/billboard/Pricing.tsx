import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Billboard / Pricing</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Rates & Packages</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Flexible pricing options for campaigns of all sizes.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="billboard" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Campaign Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", duration: "4 weeks", locations: "1-2", price: "From $5,000" },
              { name: "Growth", duration: "8 weeks", locations: "3-5", price: "From $15,000" },
              { name: "Enterprise", duration: "12+ weeks", locations: "5+", price: "Custom" },
            ].map(pkg => (
              <div key={pkg.name} className="bg-secondary/20 rounded-lg p-8 border border-border text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">{pkg.name}</h3>
                <p className="text-3xl font-bold text-primary mb-4">{pkg.price}</p>
                <div className="text-muted-foreground text-sm space-y-2">
                  <p>{pkg.duration}</p>
                  <p>{pkg.locations} locations</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Get Custom Quote</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Request Quote <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Pricing;
