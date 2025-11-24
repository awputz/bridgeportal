import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, TrendingUp, Users, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInvestmentOfferings } from "@/hooks/useInvestmentOfferings";
import { useTransactions } from "@/hooks/useTransactions";
import { useResearchNotes } from "@/hooks/useResearchNotes";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroBg from "@/assets/office-headquarters.jpg";
import bridgeLogo from "@/assets/bridge-investment-sales-logo-dark.png";

const CountUpNumber = ({ end, suffix = "", duration = 1000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <div ref={elementRef}>${count}{suffix}+</div>;
};

const Home = () => {
  const { data: offerings = [], refetch: refetchOfferings } = useInvestmentOfferings({ offering_status: "active" });
  const { data: transactions = [] } = useTransactions();
  const { data: researchNotes = [] } = useResearchNotes();
  
  const metricsReveal = useScrollReveal();
  const impactReveal = useScrollReveal();
  const servicesReveal = useScrollReveal();
  const offeringsReveal = useScrollReveal();

  const handleRefresh = async () => {
    await refetchOfferings();
  };

  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(handleRefresh);

  const featuredOfferings = offerings.slice(0, 3);
  const recentTransactions = transactions.slice(0, 3);
  const recentResearch = researchNotes.slice(0, 3);

  return (
    <div className="min-h-screen">
      <PullToRefreshIndicator
        isPulling={isPulling}
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />

      {/* Hero Section - BKREA Inspired with Achievement Badge */}
      <section 
        className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center px-4 sm:px-6 pt-24 md:pt-28 overflow-hidden"
      >
        {/* Background with Professional Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            filter: 'brightness(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/80 to-background" />
        
        {/* Built in NYC Badge - Top Right */}
        <div className="absolute top-32 right-8 lg:right-16 z-20 hidden md:block">
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-accent bg-background/30 backdrop-blur-md flex items-center justify-center shadow-2xl">
            <div className="text-center">
              <div className="text-xs lg:text-sm font-bold text-accent uppercase tracking-wider mb-1">Built in</div>
              <div className="text-2xl lg:text-3xl font-bold">NYC</div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-6xl">
          {/* Large Logo */}
          <div className="mb-10 md:mb-12 animate-fade-in text-center md:text-left">
            <img 
              src={bridgeLogo} 
              alt="BRIDGE Investment Sales" 
              className="w-72 md:w-[450px] lg:w-[550px] h-auto mx-auto md:mx-0"
            />
          </div>
          
          {/* Achievement Counter Badge */}
          <div className="mb-8 md:mb-10 animate-fade-in text-center md:text-left" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-baseline gap-3 bg-accent/10 border-2 border-accent/30 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-sm font-medium text-muted-foreground">We've done it</span>
              <span className="text-3xl md:text-4xl font-bold text-accent">60+</span>
              <span className="text-sm font-medium text-muted-foreground">times and counting!</span>
            </div>
          </div>
          
          {/* Powerful Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight animate-fade-in max-w-4xl" style={{ animationDelay: '0.2s' }}>
            Maximizing Commercial Property Owner's Sales Prices in NYC!
          </h1>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-5 max-w-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              asChild 
              size="lg"
              className="text-base font-semibold px-8 py-7 rounded-xl bg-accent hover:bg-accent/90 text-background"
            >
              <Link to="/offerings" className="flex items-center gap-2">
                Go to Exclusive Listings
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stamp-Style Metrics Band - Matches BKREA */}
      <section 
        ref={metricsReveal.elementRef}
        className={`relative py-24 md:py-32 px-4 sm:px-6 bg-dark-bg border-y border-border transition-all duration-1000 ${
          metricsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-accent rounded-full" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-accent rounded-full" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            <div className="text-center">
              <div className="mb-4">
                <Building2 className="w-12 h-12 text-accent mx-auto" />
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3 text-white tracking-tight">
                60+
              </div>
              <p className="text-base text-white/70 font-medium uppercase tracking-wide">Buildings Sold</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-12 h-12 text-accent mx-auto flex items-center justify-center">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3 text-white tracking-tight">
                $110M+
              </div>
              <p className="text-base text-white/70 font-medium uppercase tracking-wide">Total Building Sales</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-12 h-12 text-accent mx-auto flex items-center justify-center">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3 text-white tracking-tight">
                8.9M+
              </div>
              <p className="text-base text-white/70 font-medium uppercase tracking-wide">Total Square Feet Sold</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-12 h-12 text-accent mx-auto flex items-center justify-center">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3 text-white tracking-tight">
                Proven
              </div>
              <p className="text-base text-white/70 font-medium uppercase tracking-wide">NYC Track Record</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section 
        ref={impactReveal.elementRef}
        className={`py-20 md:py-28 px-6 lg:px-8 transition-all duration-1000 ${
          impactReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
                A focused investment sales platform
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                BRIDGE Investment Sales runs a concentrated team inside Bridge Advisory Group. We focus on middle-market transactions where institutional process and direct capital relationships move outcomes.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Assignments range from walk-up multifamily to larger development work. Every mandate runs through valuation, underwriting, targeted outreach, and execution.
              </p>
              <Link to="/approach" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all text-base font-semibold pt-2">
                Learn about our approach
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        ref={servicesReveal.elementRef}
        className={`py-20 md:py-28 px-6 lg:px-8 bg-surface transition-all duration-1000 ${
          servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">What we do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Building and portfolio sales",
                description: "Sell-side advisory for multifamily, mixed-use, and development assets across New York City"
              },
              {
                title: "Recapitalizations",
                description: "Bringing in new equity, partner buyouts, and ownership restructuring"
              },
              {
                title: "Note and loan sales",
                description: "Marketing performing and non-performing debt secured by commercial and mixed-use properties"
              },
              {
                title: "Sale-leasebacks",
                description: "Structuring for owner-users who want capital while retaining occupancy"
              },
              {
                title: "Development and land",
                description: "Site sales with focus on zoning, air rights, and redevelopment potential"
              },
              {
                title: "Strategic valuation",
                description: "Opinion of value and go-to-market strategy for owners considering a sale"
              }
            ].map((service, index) => (
              <Card key={index} className="p-7 hover-lift border border-border bg-card shadow-card">
                <h3 className="text-lg font-bold mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Coverage */}
      <section className="py-20 md:py-28 px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">Asset coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Multifamily and walk-ups",
                description: "5–50 unit buildings, $2M–$20M range"
              },
              {
                title: "Mixed-use and retail",
                description: "Ground floor retail in high-traffic corridors"
              },
              {
                title: "Office and creative",
                description: "Smaller buildings and conversions"
              },
              {
                title: "Development and land",
                description: "Entitled sites and air rights"
              },
              {
                title: "Special situations",
                description: "Restructurings and time-sensitive deals"
              }
            ].map((asset, index) => (
              <Card key={index} className="p-7 hover-lift border border-border bg-card shadow-card">
                <Building2 className="mb-4 text-accent" size={32} />
                <h3 className="text-lg font-bold mb-3">{asset.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{asset.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capital Band */}
      <section className="py-20 md:py-28 px-6 lg:px-8 bg-surface">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight tracking-tight">
                Integrated capital and execution
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                BRIDGE Investment Sales works alongside capital advisory to align sale processes with debt and equity markets. Real-time feedback on pricing, financing, and structure.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-accent mt-1 flex-shrink-0" size={24} />
                <p className="text-base">Debt and structured finance during marketing</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="text-accent mt-1 flex-shrink-0" size={24} />
                <p className="text-base">Refinance versus sale analysis</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="text-accent mt-1 flex-shrink-0" size={24} />
                <p className="text-base">Lender relationship coordination</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Coverage */}
      <section className="py-20 md:py-28 px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">Who we work with</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Private capital",
                description: "Long-term owners focused on value preservation across market cycles"
              },
              {
                title: "Institutions and funds",
                description: "Middle-market execution with local coverage and disciplined process"
              },
              {
                title: "Owner-users",
                description: "Sale-leasebacks and balance sheet strategies for occupying businesses"
              }
            ].map((client, index) => (
              <Card key={index} className="p-7 hover-lift border border-border bg-card shadow-card">
                <Users className="mb-4 text-accent" size={32} />
                <h3 className="text-lg font-bold mb-3">{client.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{client.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Offerings Preview */}
      <section 
        ref={offeringsReveal.elementRef}
        className={`py-20 md:py-28 px-6 lg:px-8 bg-surface transition-all duration-1000 ${
          offeringsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Explore Our {offerings.length} Active Listings
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Exclusive assignments represented by BRIDGE Investment Sales
              </p>
            </div>
            <Link 
              to="/offerings" 
              className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all font-semibold text-base"
            >
              View all offerings
              <ArrowRight size={20} />
            </Link>
          </div>
          {featuredOfferings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredOfferings.map((offering) => (
                <Link key={offering.id} to={`/offerings/${offering.id}`}>
                  <Card className="p-7 hover-lift border border-border bg-card h-full shadow-card">
                    <h3 className="text-xl font-bold mb-3">{offering.title}</h3>
                    <p className="text-sm text-muted-foreground mb-5">{offering.city}</p>
                    <div className="space-y-2.5 text-sm">
                      {offering.asset_type && (
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span> 
                          <span className="font-semibold">{offering.asset_type}</span>
                        </p>
                      )}
                      {offering.price && (
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span> 
                          <span className="font-bold text-base">${offering.price.toLocaleString()}</span>
                        </p>
                      )}
                      {offering.units && (
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Units:</span> 
                          <span className="font-semibold">{offering.units}</span>
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Building2 size={56} className="mx-auto mb-5 opacity-30" />
              <p className="text-lg">Current offerings will be displayed here</p>
            </div>
          )}
        </div>
      </section>

      {/* Track Record Preview */}
      <section className="py-20 md:py-28 px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Our {transactions.length} Closed Transactions
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                A sample of recent and representative sales
              </p>
            </div>
            <Link 
              to="/track-record" 
              className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all font-semibold text-base"
            >
              View full track record
              <ArrowRight size={20} />
            </Link>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-7 hover-lift border border-border bg-card shadow-card">
                  <h3 className="text-xl font-bold mb-3">{transaction.property_address}</h3>
                  <div className="space-y-2.5 text-sm">
                    {transaction.asset_type && (
                      <p className="text-muted-foreground">{transaction.asset_type}</p>
                    )}
                    {transaction.sale_price && (
                      <p className="font-bold text-lg text-foreground">
                        ${transaction.sale_price.toLocaleString()}
                      </p>
                    )}
                    {transaction.units && (
                      <p className="text-muted-foreground">{transaction.units} units</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Building2 size={56} className="mx-auto mb-5 opacity-30" />
              <p className="text-lg">Transaction history will be displayed here</p>
            </div>
          )}
        </div>
      </section>

      {/* Research Preview */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-card border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3">Research and insights</h2>
              <p className="text-lg text-muted-foreground">Focused notes on New York sales volume, pricing, and capital flows</p>
            </div>
            <Link to="/research" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all">
              View all research
              <ArrowRight size={20} />
            </Link>
          </div>
          {recentResearch.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentResearch.map((note) => (
                <Link key={note.id} to={`/research/${note.id}`}>
                  <Card className="p-6 hover-lift border border-border h-full">
                    <FileText className="mb-4 text-accent" size={32} />
                    <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                    {note.category && (
                      <p className="text-xs text-muted-foreground mb-3">{note.category}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-3">{note.summary}</p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Research notes will be displayed here</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;