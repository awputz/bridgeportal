import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";

const Strategy = () => {
  const { openContactSheet } = useContactSheet();
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Marketing / Strategy</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Brand Strategy</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Strategic positioning and go-to-market planning for real estate assets.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="marketing" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Strategic Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Market Positioning", desc: "Differentiate your property in a competitive market" },
              { title: "Target Audience", desc: "Identify and reach your ideal buyers or tenants" },
              { title: "Campaign Planning", desc: "Coordinated marketing across all channels" },
              { title: "Performance Analysis", desc: "Data-driven optimization of marketing spend" },
            ].map(item => (
              <div key={item.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Develop Your Strategy</h2>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Strategy;
