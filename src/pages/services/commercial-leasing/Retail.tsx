import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Store, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBridgePageContent } from "@/hooks/useBridgePageContent";

interface CorridorItem {
  name: string;
  description: string;
}

const Retail = () => {
  const { data: pageContent } = useBridgePageContent("commercial_retail");

  // Get content from CMS or use defaults
  const heroSection = pageContent?.find(s => s.section_key === "hero");
  const corridorsSection = pageContent?.find(s => s.section_key === "corridors");

  const corridors: CorridorItem[] = corridorsSection?.metadata?.items as CorridorItem[] || [
    { name: "Fifth Avenue", description: "Flagship retail destination" },
    { name: "Madison Avenue", description: "Luxury boutiques & brands" },
    { name: "SoHo", description: "Fashion & lifestyle retail" },
    { name: "Bleecker Street", description: "Village shopping corridor" },
    { name: "Brooklyn Heights", description: "Neighborhood retail" },
    { name: "Williamsburg", description: "Emerging retail hub" },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Commercial Leasing / Retail</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          {heroSection?.title || "Retail Leasing"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {heroSection?.content || "From flagship storefronts to neighborhood shops, we connect retailers with premium NYC locations that drive foot traffic and build brands."}
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="commercial-leasing" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            {corridorsSection?.title || "Premier Retail Corridors"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corridors.map(area => (
              <div key={area.name} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <Store className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground">{area.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Find Your Retail Space</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Retail;
