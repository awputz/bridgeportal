import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Palette, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Creative = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Marketing / Creative</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Creative Services</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Professional design and content creation for real estate marketing.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="marketing" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Creative Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Brand development", "Property photography", "Video production", "3D renderings", "Offering memorandums", "Brochure design"].map(item => (
              <div key={item} className="bg-secondary/20 rounded-lg p-6 border border-border flex items-center gap-4">
                <Palette className="h-6 w-6 text-primary" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Need Creative Work?</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Creative;
