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
import bridgeLogoWhite from "@/assets/bridge-logo-white.png";

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

      {/* Hero Section */}
      <section 
        className="relative min-h-[75vh] md:min-h-[85vh] flex items-center justify-center px-4 sm:px-6 pt-24 md:pt-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
            BRIDGE Investment Sales
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto px-2">
            $60M+ in closings this year with another $50M+ currently in contract. Led by senior talent including a recent recruit from RIPCO with $100M+ in career closings.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto md:max-w-none">
            <Button 
              asChild 
              size="lg" 
              className="rounded-full w-full md:w-auto text-sm md:text-base shadow-xl hover:shadow-2xl"
            >
              <Link to="/offerings">View Current Offerings</Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              size="lg" 
              className="rounded-full w-full md:w-auto text-sm md:text-base border-white/30 text-white hover:bg-white hover:text-background shadow-xl"
            >
              <Link to="/contact">Speak with the Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics Band */}
      <section 
        ref={metricsReveal.elementRef}
        className={`py-12 md:py-16 px-4 sm:px-6 bg-background border-y border-border transition-all duration-1000 ${
          metricsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 text-foreground">
                <CountUpNumber end={60} suffix="M" />
              </div>
              <p className="text-base md:text-lg text-muted-foreground">Closed in New York investment sales this year</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 text-foreground">
                <CountUpNumber end={50} suffix="M" />
              </div>
              <p className="text-base md:text-lg text-muted-foreground">Currently in contract and active mandates</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 text-foreground">
                <CountUpNumber end={100} suffix="M" />
              </div>
              <p className="text-base md:text-lg text-muted-foreground">Career closings by our newest senior recruit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section 
        ref={impactReveal.elementRef}
        className={`py-16 md:py-24 px-6 lg:px-8 transition-all duration-1000 ${
          impactReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">A focused investment sales platform</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                BRIDGE Investment Sales runs a concentrated team inside a broader advisory platform. The group focuses on middle market transactions where institutional process and direct capital relationships can move the outcome.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Assignments range from walk-up multifamily and mixed-use assets to larger development and recapitalization work. Every mandate runs through a structured process from valuation and underwriting through targeted outreach, bidding, and execution.
              </p>
              <Link to="/approach" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all">
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
        className={`py-16 md:py-24 px-6 lg:px-8 bg-card border-y border-border transition-all duration-1000 ${
          servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">What we do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Building and portfolio sales",
                description: "Sell-side advisory for multifamily, mixed-use, and development assets in New York City and the surrounding region."
              },
              {
                title: "Recapitalizations and partner solutions",
                description: "Advisory on bringing in new equity, buying out partners, or restructuring ownership while keeping control of the asset."
              },
              {
                title: "Note and loan sales",
                description: "Marketing and sale of performing and non-performing loans secured by commercial and mixed-use properties."
              },
              {
                title: "Sale-leasebacks for owner-users",
                description: "Structuring and marketing sale-leasebacks for owners that want to unlock capital while retaining long-term occupancy."
              },
              {
                title: "Development and land sales",
                description: "Site and assemblage sales with a focus on zoning, air rights, and redevelopment potential."
              },
              {
                title: "Strategic valuation and positioning",
                description: "Broker opinion of value, underwriting, and go-to-market strategy for owners considering a sale in the next six to eighteen months."
              }
            ].map((service, index) => (
              <Card key={index} className="p-6 hover-lift border border-border">
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Coverage */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Asset coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Multifamily and walk-ups",
                description: "5–50 unit buildings across all boroughs with focus on $2M–$20M range"
              },
              {
                title: "Mixed-use and retail corridors",
                description: "Ground floor retail with residential or office above in high-traffic locations"
              },
              {
                title: "Office and creative office",
                description: "Smaller office buildings and conversions in emerging neighborhoods"
              },
              {
                title: "Development sites and land",
                description: "Entitled sites, assemblages, and air rights opportunities"
              },
              {
                title: "Special situations and distressed",
                description: "Restructurings, foreclosures, and time-sensitive transactions"
              }
            ].map((asset, index) => (
              <Card key={index} className="p-6 hover-lift border border-border bg-card">
                <Building2 className="mb-4 text-accent" size={32} />
                <h3 className="text-xl font-semibold mb-2">{asset.title}</h3>
                <p className="text-sm text-muted-foreground">{asset.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capital and Financing Band */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Integrated capital and execution</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                BRIDGE Investment Sales works alongside the capital advisory group to align sale processes with debt and equity markets. Buyers and sellers get real-time feedback on pricing, financing, and structure while a deal is in motion.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Debt and structured finance support</h3>
                  <p className="text-sm text-muted-foreground">During marketing and through closing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Refinance versus sale guidance</h3>
                  <p className="text-sm text-muted-foreground">Or recapitalization strategy analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Lender relationship coordination</h3>
                  <p className="text-sm text-muted-foreground">Between sale processes and financing partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Coverage */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Who we work with</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Private capital and family offices",
                description: "We help long-term owners protect and grow value across cycles with a focus on preservation and strategic positioning."
              },
              {
                title: "Institutions and funds",
                description: "Middle market execution for larger buyers and sellers that want local coverage and disciplined process."
              },
              {
                title: "Owner-users and operators",
                description: "Support for businesses that occupy their buildings with sale-leasebacks, relocations, and balance sheet strategies."
              }
            ].map((client, index) => (
              <Card key={index} className="p-8 hover-lift border border-border">
                <Users className="mb-4 text-accent" size={36} />
                <h3 className="text-2xl font-semibold mb-4">{client.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{client.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Offerings Preview */}
      <section 
        ref={offeringsReveal.elementRef}
        className={`py-16 md:py-24 px-6 lg:px-8 bg-card border-y border-border transition-all duration-1000 ${
          offeringsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3">Current offerings</h2>
              <p className="text-lg text-muted-foreground">Active exclusive assignments represented by BRIDGE Investment Sales</p>
            </div>
            <Link to="/offerings" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all">
              View all offerings
              <ArrowRight size={20} />
            </Link>
          </div>
          {featuredOfferings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredOfferings.map((offering) => (
                <Link key={offering.id} to={`/offerings/${offering.id}`}>
                  <Card className="p-6 hover-lift border border-border h-full">
                    <h3 className="text-xl font-semibold mb-2">{offering.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{offering.city}</p>
                    <div className="space-y-2 text-sm">
                      {offering.asset_type && (
                        <p><span className="font-medium">Type:</span> {offering.asset_type}</p>
                      )}
                      {offering.price && (
                        <p><span className="font-medium">Price:</span> ${offering.price.toLocaleString()}</p>
                      )}
                      {offering.units && (
                        <p><span className="font-medium">Units:</span> {offering.units}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Current offerings will be displayed here</p>
            </div>
          )}
        </div>
      </section>

      {/* Track Record Preview */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3">Selected transactions</h2>
              <p className="text-lg text-muted-foreground">A sample of recent and representative sales</p>
            </div>
            <Link to="/track-record" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all">
              View full track record
              <ArrowRight size={20} />
            </Link>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-6 hover-lift border border-border">
                  <h3 className="text-xl font-semibold mb-2">{transaction.property_address}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {transaction.asset_type && <p>{transaction.asset_type}</p>}
                    {transaction.sale_price && (
                      <p className="font-semibold text-foreground">${transaction.sale_price.toLocaleString()}</p>
                    )}
                    {transaction.units && <p>{transaction.units} units</p>}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Transaction history will be displayed here</p>
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