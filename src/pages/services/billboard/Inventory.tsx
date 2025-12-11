import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Inventory = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Billboard / Inventory</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Billboard Inventory</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Premium outdoor advertising locations across New York City.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="billboard" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured Locations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { location: "Times Square", impressions: "1.5M/week" },
              { location: "Holland Tunnel", impressions: "800K/week" },
              { location: "BQE", impressions: "600K/week" },
              { location: "FDR Drive", impressions: "500K/week" },
              { location: "Williamsburg", impressions: "400K/week" },
              { location: "Downtown Brooklyn", impressions: "350K/week" },
            ].map(item => (
              <div key={item.location} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <MapPin className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground">{item.location}</h3>
                <p className="text-muted-foreground">{item.impressions}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">View Full Inventory</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Request Media Kit <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Inventory;
