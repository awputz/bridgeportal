import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Home, Search, FileText, CheckCircle, ArrowRight, DollarSign, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sales = () => {
  const buyerServices = [
    {
      icon: Search,
      title: "Property Search",
      description: "Access to on-market and off-market properties across NYC's residential market.",
    },
    {
      icon: DollarSign,
      title: "Financial Guidance",
      description: "Pre-approval assistance and connections to preferred lenders for competitive rates.",
    },
    {
      icon: FileText,
      title: "Due Diligence",
      description: "Comprehensive review of financials, building history, and potential issues.",
    },
    {
      icon: Key,
      title: "Closing Support",
      description: "Coordination with attorneys, lenders, and managing agents through closing.",
    },
  ];

  const propertyTypes = [
    { type: "Condos", description: "Full ownership with building amenities and minimal restrictions" },
    { type: "Co-ops", description: "Share ownership with typically lower prices and strong communities" },
    { type: "Townhouses", description: "Multi-story homes with private outdoor space and autonomy" },
    { type: "New Development", description: "Brand new construction with modern finishes and tax abatements" },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Sales</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Purchase Advisory
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Expert guidance for buyers navigating New York City's complex residential 
          real estate market.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Services */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Buyer Representation Services
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We advocate for your interests from search through closing.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerServices.map((service) => (
              <div key={service.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <service.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Property Types We Cover
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((item) => (
              <div key={item.type} className="bg-background rounded-lg p-6 border border-border text-center">
                <Home className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.type}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Why Buyers Choose Bridge
              </h2>
              <div className="space-y-4">
                {[
                  "Access to off-market opportunities",
                  "Expert negotiation on price and terms",
                  "Deep knowledge of NYC neighborhoods",
                  "Co-op and condo board package expertise",
                  "Trusted lender and attorney referrals",
                  "Post-purchase support and referrals",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">500+</p>
                  <p className="text-muted-foreground text-sm">Homes Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">$750M+</p>
                  <p className="text-muted-foreground text-sm">Sales Volume</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">98%</p>
                  <p className="text-muted-foreground text-sm">Client Satisfaction</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">15+</p>
                  <p className="text-muted-foreground text-sm">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to Buy in NYC?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Schedule a consultation to discuss your home buying goals.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">
              Start Your Search <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Sales;
