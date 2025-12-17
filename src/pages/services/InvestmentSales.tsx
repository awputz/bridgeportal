import { Link } from "react-router-dom";
import { Building2, TrendingUp, Users, ArrowRight, BarChart3, Calculator, Target, FileText, Handshake } from "lucide-react";
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
import { useInvestmentSalesSection, getSectionMetadata, type ProcessStep, type ServiceItem, type ClientProfile, type BoroughData } from "@/hooks/useBridgeInvestmentSalesContent";

// Consolidated process steps
const consolidatedProcess = [{
  number: "01",
  title: "Strategy & Analysis",
  description: "Define objectives, conduct market analysis, and establish valuation parameters.",
  icon: Target
}, {
  number: "02",
  title: "Marketing & Outreach",
  description: "Targeted buyer/seller outreach, professional materials, and market positioning.",
  icon: FileText
}, {
  number: "03",
  title: "Negotiation & Execution",
  description: "Deal structuring, due diligence coordination, and closing support.",
  icon: Handshake
}];

// Full-service capabilities as concise cards
const capabilities = [{
  title: "Buy-Side Advisory",
  description: "Targeted sourcing and due diligence support"
}, {
  title: "Sell-Side Execution",
  description: "Comprehensive marketing and buyer outreach"
}, {
  title: "Financial Modeling",
  description: "Cash flow analysis and return projections"
}, {
  title: "Valuation Services",
  description: "Market comps and broker opinions of value"
}, {
  title: "Portfolio Strategy",
  description: "Hold-sell analysis and repositioning guidance"
}, {
  title: "Off-Market Deals",
  description: "Access to proprietary deal flow"
}];
export default function InvestmentSales() {
  const {
    openContactSheet
  } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const capabilitiesReveal = useScrollReveal(0.1);
  const clientsReveal = useScrollReveal(0.1);
  const differentiatorReveal = useScrollReveal(0.1);
  const closingsReveal = useScrollReveal(0.1);
  const marketReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);
  const {
    data: transactions = []
  } = useTransactions();
  const recentTransactions = transactions.slice(0, 6);

  // Fetch CMS content
  const {
    data: heroSection
  } = useInvestmentSalesSection("investment_sales_approach", "hero");
  const {
    data: clientSection
  } = useInvestmentSalesSection("investment_sales_approach", "client_profile");
  const {
    data: differentiatorSection
  } = useInvestmentSalesSection("investment_sales_approach", "differentiators");
  const {
    data: marketsSection
  } = useInvestmentSalesSection("investment_sales_markets", "boroughs");
  const clientProfiles = getSectionMetadata<{
    clients: ClientProfile[];
  }>(clientSection)?.clients || [];
  const differentiators = getSectionMetadata<{
    points: string[];
  }>(differentiatorSection)?.points || [];
  const boroughs = getSectionMetadata<{
    boroughs: BoroughData[];
  }>(marketsSection)?.boroughs || [];
  return <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img src={PLACEHOLDER_IMAGES.building.exterior} alt="Investment properties in NYC" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            <Button size="lg" variant="outline" className="font-light border-white/30 hover:bg-white/10" asChild>
              <a href="https://www.costar.com/agent/alexander-smotritsky/broker-profile" target="_blank" rel="noopener noreferrer">
                View Our Listings
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="investment-sales" />

      {/* Consolidated Process Section */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={processReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Our Process</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              A disciplined approach from first conversation through closing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {consolidatedProcess.map((step, index) => <div key={index} className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 ${processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
            transitionDelay: `${index * 100}ms`
          }}>
                <step.icon className="h-8 w-8 text-accent mb-4" />
                <div className="text-3xl md:text-4xl font-light text-accent/50 mb-3">{step.number}</div>
                <h3 className="text-lg md:text-xl font-light mb-2">{step.title}</h3>
                <p className="text-muted-foreground font-light text-sm">{step.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Full-Service Capabilities Card Grid */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={capabilitiesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${capabilitiesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Full-Service Capabilities</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              End-to-end advisory for acquisitions and dispositions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {capabilities.map((item, index) => <div key={index} className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-300 ${capabilitiesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
            transitionDelay: `${index * 50}ms`
          }}>
                <h3 className="text-lg font-light mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-light">{item.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Who We Work With - From CMS */}
      {clientProfiles.length > 0}

      {/* What Sets Us Apart - Simplified */}
      {differentiators.length > 0}

      {/* Borough Coverage - From CMS */}
      {boroughs.length > 0 && <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${marketReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">{marketsSection?.title || "Borough Coverage"}</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">{marketsSection?.content}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {boroughs.map((borough, index) => <div key={index} className="p-4 md:p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                  <h3 className="text-lg md:text-xl font-light mb-2">{borough.name}</h3>
                  <p className="text-accent text-sm font-medium mb-3">{borough.stats}</p>
                  <p className="text-sm text-muted-foreground font-light mb-2">{borough.focus}</p>
                  <p className="text-xs text-muted-foreground/70 font-light">{borough.neighborhoods}</p>
                </div>)}
            </div>
          </div>
        </section>}

      {/* Market Intelligence Section - Enhanced with clarification */}
      

      {/* Investment Calculator Section */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calculator className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Investment Calculator</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Model your acquisition scenarios with our comprehensive underwriting tool.
            </p>
          </div>
          <div className={`transition-all duration-700 ${calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '200ms'
        }}>
            <InvestmentCalculator />
          </div>
        </div>
      </section>

      {/* Selected Closings */}
      {recentTransactions.length > 0 && <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={closingsReveal.elementRef}>
          <div className="container mx-auto px-4 md:px-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4 transition-all duration-700 ${closingsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-light">Selected Closings</h2>
              <Button asChild variant="outline" className="font-light group">
                <Link to="/transactions">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTransactions.map((transaction, index) => <div key={transaction.id} className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700 ${closingsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
            transitionDelay: `${index * 100}ms`
          }}>
                  <h3 className="text-lg font-light mb-1">{transaction.property_address}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-3">{transaction.neighborhood}</p>
                  <div className="space-y-2 text-sm font-light">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{transaction.property_type}</span>
                    </div>
                    {transaction.sale_price && <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span>${transaction.sale_price.toLocaleString()}</span>
                      </div>}
                  </div>
                </div>)}
            </div>
          </div>
        </section>}

      {/* Meet the Investment Sales Team */}
      <TeamHighlight category="Investment Sales" title="Meet the Investment Sales Team" subtitle="Experienced advisors dedicated to maximizing value for our clients." className="bg-muted/20" />

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or evaluate your options, we're ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Submit a Deal
            </Button>
            <Button size="lg" variant="outline" className="font-light" asChild>
              <a href="https://www.costar.com/agent/alexander-smotritsky/broker-profile" target="_blank" rel="noopener noreferrer">
                View Our Listings
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>;
}