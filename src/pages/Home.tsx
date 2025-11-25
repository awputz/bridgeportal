import { Link } from "react-router-dom";
import { Building2, TrendingUp, Award } from "lucide-react";
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
      {/* Hero Section - Dark Background */}
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
            <Button size="lg" className="font-light px-8 md:px-12 w-full sm:w-auto" onClick={() => window.location.href = '/submit-deal'}>
              Submit a Deal
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section - Ultra Minimal */}
      <section className="py-16 md:py-24 lg:py-32 border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">50+</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Buildings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">$500M+</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">1M+</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Square Feet</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4">NYC</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Focus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-center mb-12 md:mb-16 font-light">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="group p-6 md:p-8 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <Building2 className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
              <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">Building Sales</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Complete transaction management for multifamily and mixed-use properties
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
              <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">Advisory</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Strategic guidance on market positioning and transaction structuring
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <Award className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
              <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">Valuation</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Comprehensive market analysis and property valuation services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32 border-y border-white/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">Recent Transactions</h2>
              <Button asChild variant="outline" className="font-light w-full sm:w-auto">
                <Link to="/transactions">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 md:p-6 rounded-lg transition-all duration-400 hover:bg-white/3 border-l-2 border-transparent hover:border-accent/30 hover:transform hover:-translate-y-1">
                  <h3 className="text-base md:text-lg font-light mb-1">{transaction.property_address}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-3 md:mb-4">{transaction.neighborhood}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-light">Type:</span>
                      <span className="font-light">{transaction.property_type}</span>
                    </div>
                    {transaction.sale_price && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-light">Price:</span>
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 font-light">Ready to maximize your property value?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 font-light">
            Connect with our team to discuss your investment goals
          </p>
          <Button asChild size="lg" className="font-light px-8 md:px-12 w-full sm:w-auto">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
