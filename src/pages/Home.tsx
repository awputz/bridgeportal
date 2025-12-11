import { Link } from "react-router-dom";
import { Building2, TrendingUp, Award, Users, CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DivisionSelector } from "@/components/DivisionSelector";
import { COMPANY_INFO } from "@/lib/constants";
import heroImage from "@/assets/brooklyn-bridge-hero-light.jpg";
import bridgeAdvisoryLogo from "@/assets/bridge-advisory-group-logo.png";

export default function Home() {
  const { data: transactions = [] } = useTransactions();
  const recentTransactions = transactions.slice(0, 3);
  
  // Scroll animation hooks for each section
  const statsReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const whyBridgeReveal = useScrollReveal(0.1);
  const transactionsReveal = useScrollReveal(0.1);
  const teamReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 md:px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: 'brightness(0.6) contrast(1.1)'
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        <div className="relative z-10 container mx-auto text-center max-w-4xl">
          <div 
            className="animate-fade-in"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
          >
            <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="mx-auto h-24 md:h-32 lg:h-40 invert mb-8 md:mb-12" />
          </div>
          
          <p 
            className="text-base md:text-xl lg:text-2xl xl:text-3xl text-foreground/70 mb-8 md:mb-12 lg:mb-16 max-w-xs md:max-w-2xl lg:max-w-3xl mx-auto font-light px-4 animate-fade-in"
            style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
          >
            {COMPANY_INFO.tagline}
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center px-4 animate-fade-in"
            style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
          >
            <Button asChild size="lg" className="font-light px-8 md:px-12 w-full sm:w-auto">
              <Link to="/commercial">Explore Commercial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8 md:px-12 w-full sm:w-auto border-white/30 hover:bg-white/10">
              <Link to="/residential">Explore Residential</Link>
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in" 
          style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}
        >
          <div className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer">
            <span className="text-sm tracking-wider uppercase font-light">Scroll to Explore</span>
            <ChevronDown className="h-6 w-6 animate-bounce-gentle" />
          </div>
        </div>
      </section>

      {/* Division Selector */}
      <DivisionSelector />

      {/* Stats Section */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-white/5" ref={statsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
            {[
              { value: "100+", label: "Transactions", delay: "0ms" },
              { value: "$750M+", label: "Total Volume", delay: "100ms" },
              { value: "3", label: "Divisions", delay: "200ms" },
              { value: "NYC", label: "Focus", delay: "300ms" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`text-center transition-all duration-700 ${
                  statsReveal.isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-10 scale-95'
                }`}
                style={{ transitionDelay: stat.delay }}
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-white/5" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`transition-all duration-700 ${
            servicesReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-center mb-6 font-light">Full-Service Platform</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light text-center mb-12 md:mb-16 max-w-3xl mx-auto">
              Comprehensive real estate services across commercial, residential, and capital markets
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Building2,
                title: "Commercial & Investment Sales",
                desc: "Office, retail, industrial, and investment properties with institutional-grade execution"
              },
              {
                icon: Users,
                title: "Residential Services",
                desc: "White-glove service for buyers and sellers across NYC's most desirable neighborhoods"
              },
              {
                icon: TrendingUp,
                title: "Capital Markets",
                desc: "Debt and equity advisory to optimize capital structure and maximize returns"
              },
              {
                icon: CheckCircle2,
                title: "Comprehensive Underwriting",
                desc: "Detailed valuation and financial analysis with market comps and projected returns"
              },
              {
                icon: Award,
                title: "Marketing Excellence",
                desc: "Professional materials from our dedicated in-house marketing team"
              }
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className={`group p-6 md:p-8 rounded-lg transition-all duration-700 hover:bg-white/3 hover:transform hover:-translate-y-1 border-l-2 border-accent/30 ${
                    servicesReveal.isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-10 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
                  <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Bridge Advisory Group */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-white/5 bg-white/[0.01]" ref={whyBridgeReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl text-center mb-12 md:mb-16 font-light transition-all duration-700 ${
            whyBridgeReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            Why Bridge Advisory Group
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                num: "01",
                title: "One Platform",
                desc: "Integrated services across commercial, residential, and capital markets"
              },
              {
                num: "02",
                title: "Local Expertise",
                desc: "Deep knowledge of every NYC neighborhood and submarket"
              },
              {
                num: "03",
                title: "Proven Results",
                desc: "Track record of successful transactions across all property types"
              },
              {
                num: "04",
                title: "Client Focus",
                desc: "Dedicated professionals committed to your success"
              }
            ].map((item, index) => (
              <div 
                key={item.num} 
                className={`text-center p-6 rounded-lg hover:bg-white/[0.02] transition-all duration-700 ${
                  whyBridgeReveal.isVisible 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl md:text-5xl font-light mb-4 text-accent">{item.num}</div>
                <h3 className="text-lg md:text-xl font-light mb-3">{item.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions Preview */}
      {recentTransactions.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32 border-b border-white/5" ref={transactionsReveal.elementRef}>
          <div className="container mx-auto px-4 md:px-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4 transition-all duration-700 ${
              transactionsReveal.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">Recent Transactions</h2>
              <Button asChild variant="outline" className="font-light w-full sm:w-auto group">
                <Link to="/commercial/track-record">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className={`p-4 md:p-6 rounded-lg transition-all duration-700 hover:bg-white/3 border-l-2 border-transparent hover:border-accent/30 hover:transform hover:-translate-y-1 ${
                    transactionsReveal.isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-base md:text-lg font-light mb-1">{transaction.property_address}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-3 md:mb-4">{transaction.neighborhood}</p>
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

      {/* Team Preview */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-white/5" ref={teamReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            teamReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Our Team</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Senior professionals with deep NYC market expertise across all property sectors
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              {
                icon: Users,
                title: "Expert Team",
                desc: "Specialists in commercial, residential, and capital markets"
              },
              {
                icon: TrendingUp,
                title: "Market Leaders",
                desc: "Deep relationships across NYC's real estate community"
              },
              {
                icon: CheckCircle2,
                title: "Client Focused",
                desc: "Dedicated to achieving optimal outcomes"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.title} 
                  className={`text-center p-6 rounded-lg hover:bg-white/[0.02] transition-all duration-700 ${
                    teamReveal.isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <Icon className="mx-auto mb-4 text-accent" size={36} />
                  <h3 className="text-base md:text-lg font-light mb-2">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-light">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className={`text-center transition-all duration-700 ${
            teamReveal.isVisible 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`} style={{ transitionDelay: '450ms' }}>
            <Button asChild variant="outline" className="font-light group">
              <Link to="/team">
                Meet the Team
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-light mb-6 transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            Ready to Get Started?
          </h2>
          <p className={`text-base md:text-lg text-muted-foreground font-light mb-8 md:mb-12 transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '100ms' }}>
            Whether you're buying, selling, or investing, our team is here to help you achieve your real estate goals.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-95'
          }`} style={{ transitionDelay: '200ms' }}>
            <Button asChild size="lg" className="font-light px-8 md:px-12">
              <Link to="/submit-deal">Submit a Deal</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8 md:px-12">
              <Link to="/team">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
