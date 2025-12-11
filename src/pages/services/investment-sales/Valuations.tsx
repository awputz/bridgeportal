import { ServicePageLayout } from "@/components/ServicePageLayout";
import { BarChart3, Calculator, FileText, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";

const Valuations = () => {
  const { openContactSheet } = useContactSheet();

  const valuationServices = [
    {
      icon: Calculator,
      title: "Broker Opinion of Value (BOV)",
      description: "Comprehensive market analysis providing current market value estimates for acquisition, disposition, or refinancing purposes.",
      features: ["Market comparable analysis", "Income approach valuation", "Cap rate analysis", "Value-add assessment"],
    },
    {
      icon: BarChart3,
      title: "Financial Underwriting",
      description: "Detailed financial modeling and analysis to support investment decisions and financing applications.",
      features: ["Pro forma modeling", "Cash flow projections", "IRR/equity multiple analysis", "Sensitivity testing"],
    },
    {
      icon: FileText,
      title: "Investment Memorandums",
      description: "Professional offering memorandums that present your property in the best light to potential buyers or lenders.",
      features: ["Market positioning", "Financial summaries", "Property highlights", "Investment thesis"],
    },
    {
      icon: TrendingUp,
      title: "Market Research",
      description: "In-depth market analysis providing insights on trends, comparables, and investment opportunities.",
      features: ["Submarket analysis", "Rent comp studies", "Sales comp analysis", "Trend forecasting"],
    },
  ];

  const valuationApproaches = [
    {
      title: "Income Approach",
      description: "Values property based on its income-generating potential, using capitalization rates derived from comparable sales.",
      metrics: ["Net Operating Income (NOI)", "Cap Rate Analysis", "Cash Flow Projections"],
    },
    {
      title: "Sales Comparison Approach",
      description: "Values property by comparing recent sales of similar properties, adjusted for differences in characteristics.",
      metrics: ["Price Per Unit", "Price Per Square Foot", "Location Adjustments"],
    },
    {
      title: "Cost Approach",
      description: "Values property based on land value plus replacement cost of improvements, less depreciation.",
      metrics: ["Land Value", "Construction Costs", "Depreciation Analysis"],
    },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Investment Sales / Valuations</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Valuation & Underwriting
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Data-driven property valuations and financial analysis to support your investment 
          decisions, financing needs, and transaction execution.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="investment-sales" heroContent={heroContent}>
      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Precision Valuations for Informed Decisions
            </h2>
            <p className="text-muted-foreground text-lg">
              Our valuation team combines deep market knowledge with sophisticated financial 
              modeling to deliver accurate, defensible property valuations. Whether you're 
              buying, selling, refinancing, or planning, our analysis provides the clarity 
              you need to move forward with confidence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuationServices.map((service) => (
              <div key={service.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                <service.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valuation Approaches */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Our Valuation Methodology
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We employ multiple valuation approaches to provide comprehensive, defensible value conclusions.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {valuationApproaches.map((approach) => (
              <div key={approach.title} className="bg-background rounded-lg p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">{approach.title}</h3>
                <p className="text-muted-foreground mb-6">{approach.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Key Metrics:</p>
                  {approach.metrics.map((metric) => (
                    <div key={metric} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Calculator */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Investment Calculator
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Model potential returns with our interactive investment calculator.
          </p>
          <InvestmentCalculator />
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Market Intelligence Platform
              </h2>
              <p className="text-muted-foreground mb-6">
                Our valuations are powered by proprietary market data and analytics that 
                provide unmatched insight into New York City's real estate markets.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time transaction data",
                  "Rent comparable database",
                  "Cap rate tracking by submarket",
                  "Development pipeline monitoring",
                  "Zoning and regulatory analysis",
                  "Demographic and economic indicators",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-background rounded-lg p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Data Sources</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-bold text-primary">10K+</p>
                  <p className="text-sm text-muted-foreground">Transaction Records</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Submarkets Tracked</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-bold text-primary">Daily</p>
                  <p className="text-sm text-muted-foreground">Data Updates</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-bold text-primary">15 Yrs</p>
                  <p className="text-sm text-muted-foreground">Historical Data</p>
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
            Need a Property Valuation?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Contact us for a complimentary broker opinion of value on your property.
          </p>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>
            Request Valuation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Valuations;
