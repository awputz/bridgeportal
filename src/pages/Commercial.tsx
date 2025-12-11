import { Link } from "react-router-dom";
import { Building2, TrendingUp, BarChart3, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTransactions } from "@/hooks/useTransactions";
import { DIVISIONS } from "@/lib/constants";
import heroImage from "@/assets/brooklyn-bridge-hero-light.jpg";

// Placeholder logos for Commercial and Investment Sales divisions
const CommercialLogo = () => (
  <div className="flex items-center gap-3 text-white">
    <Building2 className="w-8 h-8" />
    <span className="text-xl font-light">
      <span className="font-medium">BRIDGE</span> Commercial
    </span>
  </div>
);

const InvestmentSalesLogo = () => (
  <div className="flex items-center gap-3 text-white">
    <TrendingUp className="w-8 h-8" />
    <span className="text-xl font-light">
      <span className="font-medium">BRIDGE</span> Investment Sales
    </span>
  </div>
);

export default function Commercial() {
  const { data: transactions = [] } = useTransactions();
  const recentTransactions = transactions.slice(0, 4);
  
  const servicesReveal = useScrollReveal(0.1);
  const sectorsReveal = useScrollReveal(0.1);
  const transactionsReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Sub-Brand Headers */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 md:px-6 pt-24">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: 'brightness(0.5) contrast(1.1)'
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,100%,45%)]/20 via-black/50 to-black/70" />
        
        <div className="relative z-10 container mx-auto text-center max-w-5xl">
          {/* Sub-Brand Logos */}
          <div 
            className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8 animate-fade-in"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
          >
            <CommercialLogo />
            <div className="hidden md:block w-px h-10 bg-white/30" />
            <InvestmentSalesLogo />
          </div>
          
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in"
            style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
          >
            Commercial & Investment Sales
          </h1>
          
          <p 
            className="text-lg md:text-xl text-foreground/70 mb-10 max-w-3xl mx-auto font-light animate-fade-in"
            style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
          >
            {DIVISIONS.commercial.tagline}. Specialized expertise in office, retail, industrial, 
            and investment properties throughout New York City.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}
          >
            <Button asChild size="lg" className="font-light px-8 bg-[hsl(210,100%,45%)] hover:bg-[hsl(210,100%,40%)] text-white">
              <Link to="/commercial/investment-sales">View Offerings</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8 border-white/30 hover:bg-white/10">
              <Link to="/commercial/track-record">Track Record</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Property Sectors */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={sectorsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            sectorsReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">Property Sectors</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Deep expertise across all major commercial property types
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                title: "Office", 
                path: "/commercial/office",
                desc: "Class A & B office properties across Manhattan and the outer boroughs",
                icon: Building2
              },
              { 
                title: "Retail", 
                path: "/commercial/retail",
                desc: "Street retail, shopping centers, and mixed-use retail assets",
                icon: MapPin
              },
              { 
                title: "Industrial", 
                path: "/commercial/industrial",
                desc: "Warehouses, distribution centers, and manufacturing facilities",
                icon: BarChart3
              },
              { 
                title: "Investment Sales", 
                path: "/commercial/investment-sales",
                desc: "Multifamily, mixed-use, and development site opportunities",
                icon: TrendingUp
              }
            ].map((sector, index) => {
              const Icon = sector.icon;
              return (
                <Link
                  key={sector.title}
                  to={sector.path}
                  className={`group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-[hsl(210,100%,45%)]/10 hover:border-[hsl(210,100%,45%)]/30 transition-all duration-500 ${
                    sectorsReveal.isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-10 h-10 text-[hsl(210,100%,55%)] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-light mb-2 group-hover:text-[hsl(210,100%,65%)] transition-colors">
                    {sector.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light mb-4">{sector.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-[hsl(210,100%,55%)] font-light">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            servicesReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">Our Services</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Comprehensive advisory for sophisticated commercial real estate transactions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Disposition Advisory",
                desc: "Strategic marketing and sale execution to maximize value for owners"
              },
              {
                title: "Acquisition Advisory",
                desc: "Off-market sourcing and underwriting for qualified buyers"
              },
              {
                title: "Capital Markets",
                desc: "Debt and equity placement to optimize capital structure"
              },
              {
                title: "Valuation Analysis",
                desc: "Detailed underwriting with comparable sales and market projections"
              },
              {
                title: "1031 Exchange Services",
                desc: "Seamless identification and execution for tax-deferred exchanges"
              },
              {
                title: "Development Advisory",
                desc: "Site selection, feasibility analysis, and entitlement support"
              }
            ].map((service, index) => (
              <div 
                key={service.title}
                className={`p-6 border-l-2 border-[hsl(210,100%,45%)]/30 transition-all duration-700 ${
                  servicesReveal.isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-light mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground font-light">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <section className="py-20 md:py-28 border-b border-white/5" ref={transactionsReveal.elementRef}>
          <div className="container mx-auto px-4 md:px-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4 transition-all duration-700 ${
              transactionsReveal.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-2">Recent Transactions</h2>
                <p className="text-muted-foreground font-light">Proven execution across all property types</p>
              </div>
              <Button asChild variant="outline" className="font-light group">
                <Link to="/commercial/track-record">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id}
                  className={`p-5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 ${
                    transactionsReveal.isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="font-light mb-1">{transaction.property_address}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-3">{transaction.neighborhood}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-light">{transaction.property_type}</span>
                    </div>
                    {transaction.sale_price && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-light">${transaction.sale_price.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-28" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-light mb-6 transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            Ready to Discuss Your Property?
          </h2>
          <p className={`text-muted-foreground font-light mb-8 transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '100ms' }}>
            Our commercial team is ready to provide a confidential valuation and strategic advisory.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`} style={{ transitionDelay: '200ms' }}>
            <Button asChild size="lg" className="font-light px-8 bg-[hsl(210,100%,45%)] hover:bg-[hsl(210,100%,40%)] text-white">
              <Link to="/submit-deal">Submit a Deal</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8">
              <Link to="/team">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
