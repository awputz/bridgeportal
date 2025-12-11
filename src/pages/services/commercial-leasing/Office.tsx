import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Office = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Commercial Leasing / Office</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Office Leasing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Modern office solutions from traditional spaces to flexible co-working environments.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="commercial-leasing" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Office Markets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Midtown", "Downtown/FiDi", "Hudson Yards", "Flatiron", "DUMBO", "Long Island City"].map(area => (
              <div key={area} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <Building2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground">{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Find Your Office</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Office;
