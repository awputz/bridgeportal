import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { DIVISIONS } from "@/lib/constants";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";

export default function CapitalAdvisory() {
  const { openContactSheet } = useContactSheet();
  const introReveal = useScrollReveal(0.1);
  const debtReveal = useScrollReveal(0.1);
  const equityReveal = useScrollReveal(0.1);
  const recapReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Capital Advisory
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in" style={{ animationDelay: '100ms' }}>
            {DIVISIONS.capitalAdvisory.tagline}
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="capital-advisory" />

      {/* Intro */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Capital Advisory works with owners, sponsors, and investors to structure financing and equity that supports the actual strategy of each asset. The team engages across senior debt, subordinated structures, and equity partnerships.
          </p>
        </div>
      </section>

      {/* Section 1: Debt Placement */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={debtReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            debtReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Debt Placement</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Sourcing and structuring financing across a broad lender network.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Senior loans from banks and credit unions</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Bridge and transitional financing</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Construction and redevelopment financing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Equity And Joint Ventures */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={equityReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            equityReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Equity And Joint Ventures</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Matching operators with aligned capital partners.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Common equity for acquisitions and developments</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Programmatic partnerships for repeat transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Joint venture structures that align risk and return</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Recapitalizations And Restructuring */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={recapReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            recapReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Recapitalizations And Restructuring</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Advisory support for capital stack resets and partnership transitions.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Capital stack resets and refinancing</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Partner buyouts and recapitalizations</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Advisory for assets facing maturity or capital structure stress</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Underwriting Tools Section */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calculator className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Underwriting Tools</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Model financing scenarios and analyze returns with our comprehensive underwriting calculator.
            </p>
          </div>
          <div className={`transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '200ms' }}>
            <InvestmentCalculator />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you need debt, equity, or strategic capital advisory, Bridge Capital is ready to help structure the right solution.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Contact Capital Advisory
          </Button>
        </div>
      </section>
    </div>
  );
}
