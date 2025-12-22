import { Link } from "react-router-dom";
import { Building2, TrendingUp, Users, ArrowRight, BarChart3, Target, FileText, Handshake, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTransactions } from "@/hooks/useTransactions";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { DIVISIONS } from "@/lib/constants";
import { MarketStats } from "@/components/MarketStats";
import investmentSalesHeroImg from "@/assets/investment-sales-hero.jpg";
import { TeamHighlight } from "@/components/TeamHighlight";
import { useInvestmentSalesSection, getSectionMetadata, type ProcessStep, type ServiceItem, type ClientProfile, type BoroughData } from "@/hooks/useBridgeInvestmentSalesContent";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { MobileStickyContact } from "@/components/MobileStickyContact";

// Helper functions for formatting
const formatExactCurrency = (value: number | null) => {
  if (!value) return null;
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", { 
    month: "short", 
    year: "numeric" 
  });
};

const getPlaceholderImage = (assetType: string | null) => {
  const type = assetType?.toLowerCase() || "";
  if (type.includes("retail")) return PLACEHOLDER_IMAGES.retail.storefront;
  if (type.includes("office")) return PLACEHOLDER_IMAGES.building.exterior;
  if (type.includes("multifamily") || type.includes("residential")) return PLACEHOLDER_IMAGES.building.residential;
  return PLACEHOLDER_IMAGES.building.glass;
};
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
  const heroReveal = useScrollReveal(0.1, true); // Hero always visible initially
  const processReveal = useScrollReveal(0.1);
  const capabilitiesReveal = useScrollReveal(0.1);
  const clientsReveal = useScrollReveal(0.1);
  const differentiatorReveal = useScrollReveal(0.1);
  const closingsReveal = useScrollReveal(0.1);
  const marketReveal = useScrollReveal(0.1);
  const {
    data: transactions = []
  } = useTransactions();
  const recentTransactions = transactions
    .filter(t => t.division === "Investment Sales")
    .slice(0, 6);

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
      <section className="relative min-h-[35vh] sm:min-h-[40vh] md:min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center pt-14 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img src={investmentSalesHeroImg} alt="Aerial view of SoHo New York City skyline" className="w-full h-full object-cover" />
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
              <Link to="/services/investment-sales/listings">
                View Our Listings
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="investment-sales" />

      {/* Consolidated Process Section */}
      

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
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Areas We Cover</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">{marketsSection?.content || "Comprehensive coverage across the five boroughs"}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {boroughs.map((borough, index) => <div key={index} className="p-4 md:p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                  <h3 className="text-lg md:text-xl font-light mb-2">{borough.name}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-2">{borough.focus}</p>
                  <p className="text-xs text-muted-foreground/70 font-light">{borough.neighborhoods}</p>
                </div>)}
            </div>
          </div>
        </section>}

      {/* Market Intelligence Section - Enhanced with clarification */}

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
              {recentTransactions.map((transaction, index) => (
                <Link
                  key={transaction.id}
                  to="/transactions"
                  className={`rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-700 cursor-pointer group overflow-hidden ${closingsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Property Image */}
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={transaction.image_url || getPlaceholderImage(transaction.asset_type)} 
                      alt={transaction.property_address}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 md:p-5">
                    <h3 className="text-base font-light mb-1 group-hover:text-accent transition-colors line-clamp-1">
                      {transaction.property_address}
                    </h3>
                    {transaction.neighborhood && (
                      <p className="text-sm text-muted-foreground font-light mb-3 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {transaction.neighborhood}{transaction.borough && `, ${transaction.borough}`}
                      </p>
                    )}

                    {/* Asset Type Badge */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {transaction.asset_type && (
                        <span className="inline-block text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          {transaction.asset_type}
                        </span>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="space-y-1 text-sm">
                      {transaction.sale_price && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-light">Sale Price</span>
                          <span className="font-light">{formatExactCurrency(transaction.sale_price)}</span>
                        </div>
                      )}
                      {transaction.gross_square_feet && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-light">Size</span>
                          <span className="font-light">{transaction.gross_square_feet.toLocaleString()} SF</span>
                        </div>
                      )}
                      {transaction.closing_date && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-light">Closed</span>
                          <span className="font-light">{formatDate(transaction.closing_date)}</span>
                        </div>
                      )}
                    </div>

                    {/* View Details */}
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <span className="text-xs text-accent font-light group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
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
              <Link to="/services/investment-sales/listings">
                View Our Listings
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MobileStickyContact onContactClick={openContactSheet} />
    </div>;
}