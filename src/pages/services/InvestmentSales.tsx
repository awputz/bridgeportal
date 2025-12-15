import { Link } from "react-router-dom";
import { Building2, TrendingUp, Users, ArrowRight, BarChart3, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTransactions } from "@/hooks/useTransactions";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { DIVISIONS } from "@/lib/constants";
import { MarketStats } from "@/components/MarketStats";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { TeamHighlight } from "@/components/TeamHighlight";
import { 
  useInvestmentSalesSection, 
  getSectionMetadata,
  type ProcessStep,
  type ServiceItem,
  type ClientProfile,
  type BoroughData,
} from "@/hooks/useBridgeInvestmentSalesContent";

export default function InvestmentSales() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const acquisitionReveal = useScrollReveal(0.1);
  const analysisReveal = useScrollReveal(0.1);
  const strategyReveal = useScrollReveal(0.1);
  const closingsReveal = useScrollReveal(0.1);
  const marketReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const clientsReveal = useScrollReveal(0.1);
  const differentiatorReveal = useScrollReveal(0.1);
  
  const { data: transactions = [] } = useTransactions();
  const recentTransactions = transactions.slice(0, 6);

  // Fetch CMS content
  const { data: heroSection } = useInvestmentSalesSection("investment_sales_approach", "hero");
  const { data: processSection } = useInvestmentSalesSection("investment_sales_approach", "process_steps");
  const { data: servicesSection } = useInvestmentSalesSection("investment_sales_approach", "services");
  const { data: clientSection } = useInvestmentSalesSection("investment_sales_approach", "client_profile");
  const { data: differentiatorSection } = useInvestmentSalesSection("investment_sales_approach", "differentiators");
  const { data: marketsSection } = useInvestmentSalesSection("investment_sales_markets", "boroughs");

  const processSteps = getSectionMetadata<{ steps: ProcessStep[] }>(processSection)?.steps || [];
  const serviceItems = getSectionMetadata<{ services: ServiceItem[] }>(servicesSection)?.services || [];
  const clientProfiles = getSectionMetadata<{ clients: ClientProfile[] }>(clientSection)?.clients || [];
  const differentiators = getSectionMetadata<{ points: string[] }>(differentiatorSection)?.points || [];
  const boroughs = getSectionMetadata<{ boroughs: BoroughData[] }>(marketsSection)?.boroughs || [];

  return (
    <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.hero.investmentSales} 
            alt="Investment properties in NYC"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            {heroSection?.title || "Bridge Investment Sales"}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light mb-4 md:mb-6 lg:mb-8">
            {heroSection?.content || DIVISIONS.investmentSales.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Submit a Deal
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="font-light border-white/30 hover:bg-white/10"
              asChild
            >
              <a href="https://www.costar.com/agent/alexander-smotritsky/broker-profile" target="_blank" rel="noopener noreferrer">
                View Our Listings
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="investment-sales" />

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            The Investment Sales team at Bridge advises owners and investors on acquisitions and dispositions across New York. The focus is on clear underwriting, precise positioning, and disciplined process from first conversation through closing.
          </p>
        </div>
      </section>

      {/* Our Process - From CMS */}
      {processSteps.length > 0 && (
        <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={processReveal.elementRef}>
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${
              processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">{processSection?.title || "Our Three-Phase Process"}</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">{processSection?.content}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`p-4 md:p-6 lg:p-8 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${
                    processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-light text-accent mb-3 md:mb-4">{step.number}</div>
                  <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">{step.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 1: Acquisition And Disposition Advisory */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={acquisitionReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center transition-all duration-700 ${
            acquisitionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Building2 className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Acquisition And Disposition Advisory</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Strategic guidance for buyers and sellers across the transaction lifecycle.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Buy-side advisory with targeted sourcing and due diligence support</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Sell-side execution with comprehensive marketing and buyer outreach</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Off-market transaction facilitation</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.building.glass} 
                alt="NYC commercial buildings" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Full-Service Capabilities - From CMS */}
      {serviceItems.length > 0 && (
        <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${
              acquisitionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">{servicesSection?.title || "Full-Service Capabilities"}</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">{servicesSection?.content}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {serviceItems.map((service, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  <h3 className="text-lg font-light mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Financial Analysis And Valuation */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={analysisReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            analysisReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Financial Analysis And Valuation</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Rigorous underwriting that provides clarity on value and risk.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Detailed cash flow modeling and return analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Comparable sales analysis and market positioning</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Broker opinions of value for internal planning</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Who We Work With - From CMS */}
      {clientProfiles.length > 0 && (
        <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={clientsReveal.elementRef}>
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${
              clientsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">{clientSection?.title || "Who We Work With"}</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">{clientSection?.content}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {clientProfiles.map((client, index) => (
                <div 
                  key={index}
                  className={`p-4 md:p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center transition-all duration-700 ${
                    clientsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-base md:text-lg font-light mb-2">{client.type}</h3>
                  <p className="text-sm text-muted-foreground font-light">{client.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Portfolio And Owner Strategy */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={strategyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            strategyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Users className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Portfolio And Owner Strategy</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Advisory that goes beyond individual transactions to consider long-term portfolio positioning.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Hold-sell analysis for individual assets and portfolios</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Value creation strategies and repositioning guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Partnership structuring and capital stack optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart - From CMS */}
      {differentiators.length > 0 && (
        <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={differentiatorReveal.elementRef}>
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className={`transition-all duration-700 ${
              differentiatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">{differentiatorSection?.title || "What Sets Us Apart"}</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto text-center mb-8 md:mb-12">{differentiatorSection?.content}</p>
              <ul className="space-y-4 max-w-3xl mx-auto">
                {differentiators.map((point, index) => (
                  <li 
                    key={index}
                    className={`flex items-start gap-3 text-muted-foreground font-light transition-all duration-700 ${
                      differentiatorReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Borough Coverage - From CMS */}
      {boroughs.length > 0 && (
        <section className="py-12 md:py-20 lg:py-28 border-b border-white/5">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${
              marketReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">{marketsSection?.title || "Borough Coverage"}</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">{marketsSection?.content}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {boroughs.map((borough, index) => (
                <div 
                  key={index}
                  className="p-4 md:p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  <h3 className="text-lg md:text-xl font-light mb-2">{borough.name}</h3>
                  <p className="text-accent text-sm font-medium mb-3">{borough.stats}</p>
                  <p className="text-sm text-muted-foreground font-light mb-2">{borough.focus}</p>
                  <p className="text-xs text-muted-foreground/70 font-light">{borough.neighborhoods}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Market Intelligence Section */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={marketReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${
            marketReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Market Intelligence</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Real-time transaction data and market analytics to inform your investment decisions.
            </p>
          </div>
          <div className={`transition-all duration-700 ${
            marketReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '200ms' }}>
            <MarketStats />
          </div>
        </div>
      </section>

      {/* Investment Calculator Section */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calculator className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Investment Calculator</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Model your acquisition scenarios with our comprehensive underwriting tool.
            </p>
          </div>
          <div className={`transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '200ms' }}>
            <InvestmentCalculator />
          </div>
        </div>
      </section>

      {/* Section 4: Selected Closings */}
      {recentTransactions.length > 0 && (
        <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={closingsReveal.elementRef}>
          <div className="container mx-auto px-4 md:px-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4 transition-all duration-700 ${
              closingsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl md:text-4xl font-light">Selected Closings</h2>
              <Button asChild variant="outline" className="font-light group">
                <Link to="/track-record">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id}
                  className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700 ${
                    closingsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-lg font-light mb-1">{transaction.property_address}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-3">{transaction.neighborhood}</p>
                  <div className="space-y-2 text-sm font-light">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{transaction.property_type}</span>
                    </div>
                    {transaction.sale_price && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span>${transaction.sale_price.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meet the Investment Sales Team */}
      <TeamHighlight 
        category="Investment Sales"
        title="Meet the Investment Sales Team"
        subtitle="Experienced advisors dedicated to maximizing value for our clients."
        className="bg-muted/20"
        includeNames={["Eric Delafraz", "Joshua S. Malekan"]}
        maxMembers={6}
      />

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or evaluate your options, Bridge Investment Sales is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Submit a Deal
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="font-light"
              asChild
            >
              <a href="https://www.costar.com/agent/alexander-smotritsky/broker-profile" target="_blank" rel="noopener noreferrer">
                View Our Listings
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
