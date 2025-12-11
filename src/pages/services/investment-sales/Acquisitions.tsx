import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Building2, TrendingUp, Users, Target, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";

const Acquisitions = () => {
  const { openContactSheet } = useContactSheet();
  const acquisitionProcess = [
    {
      step: "01",
      title: "Investment Criteria Definition",
      description: "We work with you to define clear acquisition parameters including asset type, location, price range, return thresholds, and risk tolerance.",
    },
    {
      step: "02",
      title: "Market Sourcing",
      description: "Our team leverages deep relationships and proprietary deal flow to identify on-market and off-market opportunities that match your criteria.",
    },
    {
      step: "03",
      title: "Underwriting & Analysis",
      description: "Comprehensive financial modeling, rent roll analysis, and market comparables to validate pricing and identify value-add opportunities.",
    },
    {
      step: "04",
      title: "Due Diligence Management",
      description: "We coordinate all aspects of due diligence including physical inspections, title review, environmental assessments, and lease audits.",
    },
    {
      step: "05",
      title: "Negotiation & Closing",
      description: "Strategic negotiation of purchase terms, contract execution, and seamless coordination through closing with all parties involved.",
    },
  ];

  const investorTypes = [
    {
      icon: Building2,
      title: "Private Investors",
      description: "High-net-worth individuals seeking income-producing assets with appreciation potential in New York's resilient real estate market.",
    },
    {
      icon: Users,
      title: "Family Offices",
      description: "Multi-generational wealth preservation through strategic real estate acquisitions with long-term hold strategies.",
    },
    {
      icon: TrendingUp,
      title: "Institutional Investors",
      description: "REITs, pension funds, and private equity firms seeking scalable investment opportunities with institutional-grade execution.",
    },
    {
      icon: Target,
      title: "1031 Exchange Buyers",
      description: "Time-sensitive acquisitions for tax-deferred exchanges, with rapid identification and execution capabilities.",
    },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Investment Sales / Acquisitions</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Acquisition Advisory
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Strategic guidance for investors seeking to acquire multifamily, mixed-use, and commercial 
          properties across New York City's most dynamic markets.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="investment-sales" heroContent={heroContent}>
      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Your Partner in Strategic Acquisitions
              </h2>
              <p className="text-muted-foreground mb-6">
                Bridge Investment Sales has advised on over $2 billion in acquisition transactions, 
                helping investors identify and secure properties that align with their investment 
                objectives. Our deep market knowledge and established relationships provide access 
                to opportunities before they reach the broader market.
              </p>
              <p className="text-muted-foreground mb-6">
                Whether you're a first-time investor or a seasoned institution, our acquisition 
                advisory services are tailored to your specific goals, timeline, and risk profile.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Off-Market Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Institutional Underwriting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Full Transaction Support</span>
                </div>
              </div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">$2B+</p>
                  <p className="text-muted-foreground text-sm">Acquisitions Advised</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">150+</p>
                  <p className="text-muted-foreground text-sm">Properties Acquired</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">40%</p>
                  <p className="text-muted-foreground text-sm">Off-Market Deals</p>
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

      {/* Investor Types */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Who We Serve
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We work with a diverse range of investors, each with unique objectives and requirements.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investorTypes.map((type) => (
              <div key={type.title} className="bg-background rounded-lg p-6 border border-border">
                <type.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{type.title}</h3>
                <p className="text-muted-foreground text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acquisition Process */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Our Acquisition Process
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A systematic approach to identifying, evaluating, and closing on investment properties.
          </p>
          <div className="space-y-6">
            {acquisitionProcess.map((step, index) => (
              <div
                key={step.step}
                className="flex gap-6 items-start bg-secondary/20 rounded-lg p-6 border border-border"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{step.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Criteria */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Target Asset Classes
              </h2>
              <div className="space-y-4">
                {[
                  "Multifamily (5-500+ units)",
                  "Mixed-Use Properties",
                  "Retail & Commercial",
                  "Development Sites",
                  "Value-Add Opportunities",
                  "Stabilized Assets",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Target Markets
              </h2>
              <div className="space-y-4">
                {[
                  "Manhattan - All neighborhoods",
                  "Brooklyn - Williamsburg to Flatbush",
                  "Queens - Astoria to Jamaica",
                  "Bronx - South Bronx emerging markets",
                  "Northern New Jersey",
                  "Westchester & Long Island",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to Acquire Your Next Property?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Let's discuss your investment criteria and explore opportunities that match your goals.
          </p>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>
            Schedule a Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Acquisitions;
