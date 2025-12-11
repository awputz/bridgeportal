import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Digital = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Marketing / Digital</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Digital Marketing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Multi-channel digital campaigns to reach qualified buyers and tenants.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="marketing" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Digital Channels</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Email campaigns", "Social media", "Paid advertising", "SEO/SEM", "Listing syndication", "Analytics & tracking"].map(item => (
              <div key={item} className="bg-secondary/20 rounded-lg p-6 border border-border flex items-center gap-4">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Boost Your Digital Presence</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Digital;
