import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Debt = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Capital Advisory / Debt Placement</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Debt Placement</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Access to competitive financing from banks, debt funds, and agency lenders.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="capital-advisory" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Debt Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Senior Debt", "Mezzanine Financing", "Bridge Loans", "Construction Loans", "Agency Lending", "CMBS"].map(product => (
              <div key={product} className="bg-secondary/20 rounded-lg p-6 border border-border flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold text-foreground">{product}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Need Financing?</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Debt;
