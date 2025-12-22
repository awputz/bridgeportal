import { BarChart3, Calculator, FileText, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import investmentSalesHero from "@/assets/investment-sales-hero.jpg";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { SEOHelmet } from "@/components/SEOHelmet";

const Valuations = () => {
  const { openContactSheet } = useContactSheet();
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollReveal(0.1, true);
  const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollReveal(0.1);
  const { elementRef: approachesRef, isVisible: approachesVisible } = useScrollReveal(0.1);
  const { elementRef: calculatorRef, isVisible: calculatorVisible } = useScrollReveal(0.1);
  const { elementRef: ctaRef, isVisible: ctaVisible } = useScrollReveal(0.1);

  const valuationServices = [
    {
      icon: Calculator,
      title: "Broker Opinion of Value (BOV)",
      description: "Comprehensive market analysis providing current market value estimates for acquisition, disposition, or refinancing purposes.",
      features: ["Market comparable analysis", "Income approach valuation", "Cap rate analysis", "Value-add assessment"]
    },
    {
      icon: BarChart3,
      title: "Financial Underwriting",
      description: "Detailed financial modeling and analysis to support investment decisions and financing applications.",
      features: ["Pro forma modeling", "Cash flow projections", "IRR/equity multiple analysis", "Sensitivity testing"]
    },
    {
      icon: FileText,
      title: "Investment Memorandums",
      description: "Professional offering memorandums that present your property in the best light to potential buyers or lenders.",
      features: ["Market positioning", "Financial summaries", "Property highlights", "Investment thesis"]
    },
    {
      icon: TrendingUp,
      title: "Market Research",
      description: "In-depth market analysis providing insights on trends, comparables, and investment opportunities.",
      features: ["Submarket analysis", "Rent comp studies", "Sales comp analysis", "Trend forecasting"]
    }
  ];

  const valuationApproaches = [
    {
      title: "Income Approach",
      description: "Values property based on its income-generating potential, using capitalization rates derived from comparable sales.",
      metrics: ["Net Operating Income (NOI)", "Cap Rate Analysis", "Cash Flow Projections"]
    },
    {
      title: "Sales Comparison Approach",
      description: "Values property by comparing recent sales of similar properties, adjusted for differences in characteristics.",
      metrics: ["Price Per Unit", "Price Per Square Foot", "Location Adjustments"]
    },
    {
      title: "Cost Approach",
      description: "Values property based on land value plus replacement cost of improvements, less depreciation.",
      metrics: ["Land Value", "Construction Costs", "Depreciation Analysis"]
    }
  ];

  return (
    <>
      <SEOHelmet
        title="Valuation & Underwriting | Bridge Investment Sales"
        description="Data-driven property valuations and financial analysis to support your investment decisions, financing needs, and transaction execution."
      />

      <main className="min-h-screen bg-background">
        {/* Hero Section with Background Image */}
        <section 
          ref={heroRef}
          className={`relative overflow-hidden flex items-center justify-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{
            minHeight: 'calc(280px + var(--app-nav-h))',
            paddingTop: 'var(--app-nav-h)',
          }}
        >
          {/* Background image container - extends behind the nav */}
          <div 
            className="absolute inset-0"
            style={{
              top: 'calc(-1 * var(--app-nav-h))',
              height: 'calc(100% + var(--app-nav-h))',
            }}
          >
            <img 
              src={investmentSalesHero} 
              alt="Investment Sales Valuations" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          </div>
          
          {/* Hero content */}
          <div className="relative z-10 text-center px-4 sm:px-6 py-12 md:py-20">
            <p className="text-accent/80 font-light mb-3 tracking-wide text-sm uppercase">
              Investment Sales
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 tracking-tight">
              Valuation & Underwriting
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Data-driven property valuations and financial analysis to support your investment decisions.
            </p>
          </div>
        </section>

        <ServicesSubNav />
        <ServicePageNav serviceKey="investment-sales" />

        {/* Introduction & Services Section */}
        <section 
          ref={servicesRef}
          className={`py-12 md:py-20 lg:py-28 border-b border-white/5 transition-all duration-700 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground mb-6">
                Precision Valuations for Informed Decisions
              </h2>
              <p className="text-muted-foreground font-light text-base md:text-lg leading-relaxed">
                Our valuation team combines deep market knowledge with sophisticated financial 
                modeling to deliver accurate, defensible property valuations. Whether you're 
                buying, selling, refinancing, or planning, our analysis provides the clarity 
                you need to move forward with confidence.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {valuationServices.map((service, index) => (
                <div 
                  key={service.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <service.icon className="h-8 w-8 text-accent/70 mb-4" />
                  <h3 className="text-lg font-light text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm font-light mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80 font-light">
                        <CheckCircle className="h-3.5 w-3.5 text-accent/60 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valuation Approaches Section */}
        <section 
          ref={approachesRef}
          className={`py-12 md:py-20 lg:py-28 border-b border-white/5 transition-all duration-700 ${approachesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground mb-4">
                Our Valuation Methodology
              </h2>
              <p className="text-muted-foreground font-light">
                We employ multiple approaches to ensure comprehensive and accurate valuations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {valuationApproaches.map((approach, index) => (
                <div 
                  key={approach.title}
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-lg font-light text-foreground mb-3">{approach.title}</h3>
                  <p className="text-muted-foreground text-sm font-light mb-4 leading-relaxed">{approach.description}</p>
                  <div className="space-y-2">
                    {approach.metrics.map(metric => (
                      <div key={metric} className="text-sm text-foreground/70 font-light flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-accent/50" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Calculator Section */}
        <section 
          ref={calculatorRef}
          className={`py-12 md:py-20 lg:py-28 border-b border-white/5 transition-all duration-700 ${calculatorVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calculator className="h-6 w-6 text-accent/70" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground">
                  Investment Calculator
                </h2>
              </div>
              <p className="text-muted-foreground font-light">
                Model your next acquisition with our interactive calculator.
              </p>
            </div>
            
            <InvestmentCalculator />
          </div>
        </section>

        {/* CTA Section */}
        <section 
          ref={ctaRef}
          className={`py-12 md:py-20 lg:py-28 transition-all duration-700 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground mb-4">
              Need a Property Valuation?
            </h2>
            <p className="text-muted-foreground font-light mb-8 max-w-xl mx-auto">
              Contact us for a complimentary broker opinion of value on your property.
            </p>
            <Button 
              size="lg" 
              onClick={openContactSheet}
              className="font-light"
            >
              Request Valuation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Valuations;
