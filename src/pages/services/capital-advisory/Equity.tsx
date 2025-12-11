import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Equity = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Capital Advisory / Equity</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Equity & Joint Ventures</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Strategic capital partnerships for acquisitions, developments, and recapitalizations.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="capital-advisory" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Equity Solutions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Joint Ventures", desc: "Strategic partnerships with institutional and private equity partners" },
              { title: "Preferred Equity", desc: "Flexible capital solutions for complex capital stacks" },
              { title: "GP/LP Structures", desc: "Fund formation and co-investment opportunities" },
              { title: "Programmatic JVs", desc: "Long-term partnership programs for serial acquirers" },
            ].map(item => (
              <div key={item.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Seeking Capital Partners?</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Equity;
