import { Link } from "react-router-dom";
import { Building2, TrendingUp, Users, ArrowRight, BarChart3, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTransactions } from "@/hooks/useTransactions";
import { DIVISIONS } from "@/lib/constants";
import { MarketStats } from "@/components/MarketStats";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";

export default function InvestmentSales() {
  const introReveal = useScrollReveal(0.1);
  const acquisitionReveal = useScrollReveal(0.1);
  const analysisReveal = useScrollReveal(0.1);
  const strategyReveal = useScrollReveal(0.1);
  const closingsReveal = useScrollReveal(0.1);
  const marketReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);
  
  const { data: transactions = [] } = useTransactions();
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Investment Sales
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in" style={{ animationDelay: '100ms' }}>
            {DIVISIONS.investmentSales.tagline}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            The Investment Sales team at Bridge advises owners and investors on acquisitions and dispositions across New York. The focus is on clear underwriting, precise positioning, and disciplined process from first conversation through closing.
          </p>
        </div>
      </section>

      {/* Section 1: Acquisition And Disposition Advisory */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={acquisitionReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            acquisitionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Acquisition And Disposition Advisory</h2>
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
        </div>
      </section>

      {/* Section 2: Financial Analysis And Valuation */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={analysisReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            analysisReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Financial Analysis And Valuation</h2>
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

      {/* Section 3: Portfolio And Owner Strategy */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={strategyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            strategyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Portfolio And Owner Strategy</h2>
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

      {/* Market Intelligence Section */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={marketReveal.elementRef}>
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
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={calculatorReveal.elementRef}>
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
        <section className="py-20 md:py-28 border-b border-white/5" ref={closingsReveal.elementRef}>
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

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or evaluate your options, Bridge Investment Sales is ready to help.
          </p>
          <Button asChild size="lg" className="font-light">
            <Link to="/contact">Contact Investment Sales</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
