import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DIVISIONS } from "@/lib/constants";

export default function CommercialLeasing() {
  const introReveal = useScrollReveal(0.1);
  const tenantReveal = useScrollReveal(0.1);
  const landlordReveal = useScrollReveal(0.1);
  const assetsReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Commercial Leasing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in" style={{ animationDelay: '100ms' }}>
            {DIVISIONS.commercialLeasing.tagline}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Commercial Leasing focuses on matching the right tenants with the right spaces while helping landlords position assets for long-term performance. The team covers office, retail, and select specialty assets across New York.
          </p>
        </div>
      </section>

      {/* Section 1: Tenant Representation */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={tenantReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            tenantReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Tenant Representation</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Strategic advisory for tenants seeking the right space for their business.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Needs assessment for location, size, and budget</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Shortlist and tour coordination across relevant spaces</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Negotiation of term sheets and support through lease execution</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Landlord Leasing */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={landlordReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            landlordReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Landlord Leasing</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Full-service leasing programs for office and retail assets.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Strategy for lease-up or repositioning of office and retail assets</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Marketing plans, offering materials, and targeted outreach</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Reporting on activity, tours, and offers</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Asset Types */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={assetsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            assetsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Asset Types</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Bridge Commercial Leasing handles a range of commercial asset types across New York.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {["Office", "Retail", "Industrial & Specialty"].map((type, index) => (
                <div key={type} className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
                  <h3 className="text-lg font-light">{type}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're a tenant or landlord, Bridge Commercial is ready to help you achieve your leasing goals.
          </p>
          <Button asChild size="lg" className="font-light">
            <Link to="/contact">Contact Bridge Commercial</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
