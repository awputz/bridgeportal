import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, ArrowRight, Calculator, Landmark, Construction, Handshake, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { DIVISIONS } from "@/lib/constants";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

export default function CapitalAdvisory() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const debtReveal = useScrollReveal(0.1);
  const equityReveal = useScrollReveal(0.1);
  const recapReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.finance.charts} 
            alt="Capital markets and finance" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Bridge Capital Advisory
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            {DIVISIONS.capitalAdvisory.tagline}
          </p>
        </div>
      </section>

      <ServicesSubNav />

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Capital Advisory works with owners, sponsors, and investors to structure financing and equity that supports the actual strategy of each asset. The team engages across senior debt, subordinated structures, and equity partnerships to deliver comprehensive capital solutions.
          </p>
        </div>
      </section>

      {/* Section 1: Debt Placement */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={debtReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-start transition-all duration-700 ${
            debtReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Building2 className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Debt Placement</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 leading-relaxed">
                Sourcing and structuring financing across a broad lender network, from traditional banks to alternative capital sources.
              </p>
              
              {/* Debt Sub-Services Grid */}
              <div className="grid gap-6">
                <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                  debtReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`} style={{ transitionDelay: '100ms' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Landmark className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-light">Senior Loans</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Bank and credit union financing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Agency and CMBS execution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Life company permanent loans</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                  debtReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`} style={{ transitionDelay: '200ms' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-light">Bridge & Transitional</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Value-add and repositioning loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Lease-up financing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Mezzanine and preferred equity</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                  debtReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`} style={{ transitionDelay: '300ms' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Construction className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-light">Construction & Development</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Ground-up construction financing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Major renovation and conversion loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>EB-5 and tax-exempt financing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all duration-700 ${
              debtReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '150ms' }}>
              <img 
                src={PLACEHOLDER_IMAGES.building.glass}
                alt="Commercial building financing" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Equity And Joint Ventures */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={equityReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-start transition-all duration-700 ${
            equityReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className={`relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1 transition-all duration-700 ${
              equityReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '150ms' }}>
              <img 
                src={PLACEHOLDER_IMAGES.office.meeting}
                alt="Partnership meeting" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Users className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Equity & Joint Ventures</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 leading-relaxed">
                Matching operators with aligned capital partners for acquisitions, developments, and recapitalizations.
              </p>
              
              {/* Equity Sub-Services Grid */}
              <div className="grid gap-6">
                <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                  equityReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`} style={{ transitionDelay: '100ms' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-light">Common Equity</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Institutional and family office capital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>LP equity for acquisitions and developments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Recapitalization and growth equity</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                  equityReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`} style={{ transitionDelay: '200ms' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Handshake className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-light">Joint Venture Structures</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Traditional JV with promote structures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Co-GP and co-invest arrangements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Preferred equity with participation</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                  equityReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`} style={{ transitionDelay: '300ms' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-light">Programmatic Partnerships</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Discretionary capital commitments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Platform-level partnerships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Long-term capital relationships</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Recapitalizations And Restructuring */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={recapReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            recapReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Recapitalizations & Restructuring</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Advisory support for capital stack resets, partnership transitions, and assets facing maturity or stress.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                recapReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: '100ms' }}>
                <h3 className="text-lg font-light mb-3">Capital Stack Resets</h3>
                <p className="text-sm text-muted-foreground font-light">Strategic refinancing and debt restructuring to optimize capital costs and extend runway.</p>
              </div>
              
              <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                recapReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: '200ms' }}>
                <h3 className="text-lg font-light mb-3">Partner Buyouts</h3>
                <p className="text-sm text-muted-foreground font-light">Structuring LP buyouts, GP stake sales, and partnership transitions.</p>
              </div>
              
              <div className={`p-6 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] ${
                recapReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: '300ms' }}>
                <h3 className="text-lg font-light mb-3">Workouts & Restructuring</h3>
                <p className="text-sm text-muted-foreground font-light">Advisory for assets facing maturity, covenant issues, or capital structure stress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Underwriting Tools Section */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Calculator className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Underwriting Tools</h2>
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
      <section className="py-12 md:py-20 lg:py-28" ref={ctaReveal.elementRef}>
        <div className={`container mx-auto px-4 md:px-6 text-center transition-all duration-700 ${
          ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you need debt, equity, or strategic capital advisory, Bridge Capital is ready to help structure the right solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Contact Capital Advisory
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light border-white/20 hover:bg-white/5">
              <Link to="/tear-sheet">
                <FileText className="h-4 w-4 mr-2" />
                Tear Sheet
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
