import { Link } from "react-router-dom";
import { Home, Award, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DIVISIONS } from "@/lib/constants";

export default function ResidentialServices() {
  const introReveal = useScrollReveal(0.1);
  const landlordReveal = useScrollReveal(0.1);
  const buyersReveal = useScrollReveal(0.1);
  const advisoryReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Residential
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in" style={{ animationDelay: '100ms' }}>
            {DIVISIONS.residential.tagline}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Residential partners with landlords, investors, and residents who expect a sharp process, accurate pricing guidance, and marketing that actually converts. The team manages leasing pipelines, listing strategy, and transactions across prime New York neighborhoods.
          </p>
        </div>
      </section>

      {/* Section 1: Landlord Programs */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={landlordReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            landlordReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Home className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Landlord Programs</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Full-service leasing programs for owners seeking lower vacancy, better quality tenants, and consistent reporting.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Building-wide leasing and listing programs</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Pricing and unit positioning strategy</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Weekly reporting and real-time feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Renters And Buyers */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={buyersReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            buyersReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Award className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Renters And Buyers</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Representation for consumers looking for their next home in New York City.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Representation for renters seeking quality units in competitive markets</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Advisory for buyers on value, timing, and neighborhood positioning</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Access to exclusive and off-market opportunities through Bridge relationships</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Advisory And Market Intel */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={advisoryReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            advisoryReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Advisory And Market Intel</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Data-driven support for owners and clients making informed real estate decisions.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Market rent analysis by building and submarket</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Renewal and retention strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Opinions of value for single units and small portfolios</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're a landlord, buyer, or renter, Bridge Residential is ready to help you achieve your goals.
          </p>
          <Button asChild size="lg" className="font-light">
            <Link to="/contact">Contact Bridge Residential</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
