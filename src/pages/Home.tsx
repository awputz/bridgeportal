import { Link } from "react-router-dom";
import { Building2, TrendingUp, Award, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvestmentOfferings } from "@/hooks/useInvestmentOfferings";
import { useTransactions } from "@/hooks/useTransactions";
import logo from "@/assets/bridge-logo-white.png";
import heroImage from "@/assets/brooklyn-bridge-hero.jpg";

export default function Home() {
  const { data: offerings = [] } = useInvestmentOfferings();
  const { data: transactions = [] } = useTransactions();

  const activeOfferings = offerings.filter(o => o.offering_status === 'Active');
  const recentTransactions = transactions.slice(0, 3);

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
          <img src={logo} alt="BRIDGE" className="h-12 md:h-16 lg:h-20 mx-auto mb-8 md:mb-12 opacity-90" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-6 md:mb-8 tracking-tight leading-tight text-foreground">
            NYC Investment Sales
          </h1>
          <p className="text-base md:text-xl lg:text-2xl xl:text-3xl text-foreground/70 mb-8 md:mb-12 lg:mb-16 max-w-xs md:max-w-2xl lg:max-w-3xl mx-auto font-light px-4">
            Institutional execution for middle market multifamily and mixed-use properties
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button asChild size="lg" className="font-light px-8 md:px-12 w-full sm:w-auto">
              <Link to="/submit-deal">Submit a Deal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 lg:py-32 border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">50+</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-light">Buildings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">$500M+</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-light">Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">1M+</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-light">Square Feet</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">NYC</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-light">Focus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Preview */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Our Process</h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-8">
                BRIDGE Investment Sales combines aggressive marketing, disciplined underwriting, and capital markets access to run full sale and recapitalization processes for middle market owners and investors.
              </p>
              <Button asChild variant="outline" className="font-light group">
                <Link to="/approach">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { num: "1", title: "Preparation & Underwriting" },
                { num: "2", title: "Market Coverage & Outreach" },
                { num: "3", title: "Bidding & Execution" }
              ].map((step) => (
                <div key={step.num} className="p-6 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-400">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-light">{step.num}</span>
                    </div>
                    <h3 className="text-base md:text-lg font-light">{step.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-center mb-6 font-light">Our Services</h2>
          <p className="text-base md:text-lg text-muted-foreground font-light text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            Strategic advisory services for property owners, developers, and investors throughout NYC
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="group p-6 md:p-8 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1 border-l-2 border-accent/30">
              <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
              <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">Comprehensive Underwriting</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Detailed valuation and financial analysis with market comps, rent roll assessments, and projected returns
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1 border-l-2 border-accent/30">
              <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
              <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">Complex Deal Structures</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Expertise in 1031 exchanges, off-market assignments, note sales, and value-add opportunities
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1 border-l-2 border-accent/30">
              <Users className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
              <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">Curated Buyer Network</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Access to institutional capital and high-net-worth individuals with active acquisition mandates
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1 border-l-2 border-accent/30">
              <Building2 className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
              <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">Integrated Capital Advisory</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                In-house debt and equity coordination to support optimal pricing and smooth closings
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1 border-l-2 border-accent/30 md:col-span-2 lg:col-span-1">
              <Award className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
              <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">Custom Marketing</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Professional materials and digital visibility across major platforms with direct buyer engagement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bridge Advisory Group */}
      <section className="py-16 md:py-24 lg:py-32 border-b border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-center mb-12 md:mb-16 font-light">Why Bridge Advisory Group</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-lg hover:bg-white/[0.02] transition-all">
              <div className="text-4xl md:text-5xl font-light mb-4 text-accent">01</div>
              <h3 className="text-lg md:text-xl font-light mb-3">Data-Driven Approach</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Institutional rigor combined with entrepreneurial execution
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-white/[0.02] transition-all">
              <div className="text-4xl md:text-5xl font-light mb-4 text-accent">02</div>
              <h3 className="text-lg md:text-xl font-light mb-3">Speed to Close</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Efficient process management from listing through closing
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-white/[0.02] transition-all">
              <div className="text-4xl md:text-5xl font-light mb-4 text-accent">03</div>
              <h3 className="text-lg md:text-xl font-light mb-3">Middle Market Specialists</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                $2M–$50M sweet spot where relationships and process deliver results
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-white/[0.02] transition-all">
              <div className="text-4xl md:text-5xl font-light mb-4 text-accent">04</div>
              <h3 className="text-lg md:text-xl font-light mb-3">Full-Service Platform</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Sales, capital advisory, and market intelligence under one roof
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transactions Preview */}
      {recentTransactions.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32 border-b border-white/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">Recent Transactions</h2>
              <Button asChild variant="outline" className="font-light w-full sm:w-auto group">
                <Link to="/transactions">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 md:p-6 rounded-lg transition-all duration-400 hover:bg-white/3 border-l-2 border-transparent hover:border-accent/30 hover:transform hover:-translate-y-1">
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
      <section className="py-16 md:py-24 lg:py-32 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Our Team</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Senior professionals with deep NYC market expertise and proven investment sales track records
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              { icon: Users, title: "Senior Talent", desc: "Team with $100M+ in career transactions" },
              { icon: TrendingUp, title: "Middle Market Focus", desc: "$2M–$50M transaction expertise" },
              { icon: CheckCircle2, title: "Institutional Process", desc: "Disciplined underwriting and marketing" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center p-6 rounded-lg hover:bg-white/[0.02] transition-all">
                  <Icon className="mx-auto mb-4 text-accent" size={36} />
                  <h3 className="text-base md:text-lg font-light mb-2">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-light">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
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
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 font-light">Ready to maximize your property value?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 font-light">
            Connect with our team to discuss your investment goals
          </p>
          <Button asChild size="lg" className="font-light px-8 md:px-12 w-full sm:w-auto">
            <Link to="/submit-deal">Submit a Deal</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
