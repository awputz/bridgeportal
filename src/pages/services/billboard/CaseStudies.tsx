import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CaseStudies = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Billboard / Case Studies</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Success Stories</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">See how brands have achieved results with Bridge Billboard.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="billboard" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { client: "Tech Startup", campaign: "Product Launch", result: "2M impressions, 40% brand awareness lift" },
              { client: "Restaurant Group", campaign: "Grand Opening", result: "150% increase in foot traffic" },
              { client: "Real Estate Developer", campaign: "New Development", result: "Sold out within 6 months" },
              { client: "Fashion Brand", campaign: "Seasonal Campaign", result: "3x ROI on ad spend" },
            ].map(study => (
              <div key={study.client} className="bg-secondary/20 rounded-lg p-8 border border-border">
                <Trophy className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{study.client}</h3>
                <p className="text-muted-foreground mb-4">{study.campaign}</p>
                <p className="text-primary font-medium">{study.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Start Your Campaign</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default CaseStudies;
