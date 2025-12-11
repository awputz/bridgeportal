import { ServicePageLayout } from "@/components/ServicePageLayout";
import { RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";

const Refinance = () => {
  const { openContactSheet } = useContactSheet();
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Capital Advisory / Refinance</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Refinancing Services</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Optimize your capital structure with competitive refinancing solutions.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="capital-advisory" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Refinancing Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Rate optimization", "Cash-out refinancing", "Loan consolidation", "Term extensions", "Covenant modifications", "Maturity management"].map(item => (
              <div key={item} className="bg-secondary/20 rounded-lg p-6 border border-border flex items-center gap-4">
                <RefreshCw className="h-6 w-6 text-primary" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Time to Refinance?</h2>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Refinance;
