import { Users, ArrowRight, Briefcase, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

export default function EquityJV() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const equityReveal = useScrollReveal(0.1);
  const jvReveal = useScrollReveal(0.1);
  const programReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.finance.handshake} 
            alt="Equity partnerships" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Equity & Joint Ventures
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            Matching operators with aligned capital partners
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="capital-advisory" />

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Capital Advisory works with sponsors and operators to identify equity partners whose investment criteria, return targets, and operating preferences align with specific opportunities. We focus on partnerships that work over time, not just at closing.
          </p>
        </div>
      </section>

      {/* Common Equity */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={equityReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            equityReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Briefcase className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Common Equity</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Equity capital for acquisitions, developments, and recapitalizations.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Institutional equity for stabilized acquisitions</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Development equity for ground-up projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Value-add equity for repositioning plays</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.finance.charts} 
                alt="Equity investment analysis" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Joint Ventures */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={jvReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            jvReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1">
              <img 
                src={PLACEHOLDER_IMAGES.finance.documents} 
                alt="JV partnership documentation" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Users className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Joint Venture Structures</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Partnership structures that align risk, return, and control.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Traditional JV structures with promotes and waterfalls</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Co-GP arrangements for emerging sponsors</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Preferred equity and mezzanine positions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programmatic Partnerships */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={programReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            programReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Target className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Programmatic Partnerships</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Long-term capital relationships for repeat transactions.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Discretionary capital commitments for qualified sponsors</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Defined investment criteria and approval processes</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Platform-level partnerships for scaled operators</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Looking For A Capital Partner?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Contact Bridge Capital Advisory to discuss your equity needs and explore partnership opportunities.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Contact Capital Advisory
          </Button>
        </div>
      </section>
    </div>
  );
}
