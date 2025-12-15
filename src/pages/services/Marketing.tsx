import { Link } from "react-router-dom";
import { Megaphone, TrendingUp, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { DIVISIONS } from "@/lib/constants";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

export default function Marketing() {
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const creativeReveal = useScrollReveal(0.1);
  const digitalReveal = useScrollReveal(0.1);
  const analyticsReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.marketing.creative} 
            alt="Creative marketing studio" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Bridge Marketing
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            {DIVISIONS.marketing.tagline}
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="marketing" />

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Marketing powers the visual identity and storytelling behind Bridge listings and select client assignments. The team focuses on clean design, focused narratives, and distribution channels that align with where the audience actually is.
          </p>
        </div>
      </section>

      {/* Section 1: Creative Studio */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={creativeReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center transition-all duration-700 ${
            creativeReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Megaphone className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Creative Studio</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Full-service creative production for properties and brands.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Property branding and naming</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Offering memorandums and pitch decks</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Photography, video, and render direction</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.marketing.campaign} 
                alt="Marketing campaign materials" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Digital And Campaigns */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={digitalReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center transition-all duration-700 ${
            digitalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1">
              <img 
                src={PLACEHOLDER_IMAGES.marketing.digital} 
                alt="Digital marketing analytics" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Digital And Campaigns</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Multi-channel distribution that reaches the right audience.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Paid and organic digital campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Email marketing and list management</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Social media content for specific projects and for the firm</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Analytics And Optimization */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={analyticsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            analyticsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Award className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Analytics And Optimization</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Data-driven insights that improve performance over time.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Performance tracking for campaigns and listings</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Testing of creative and messaging</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Reporting that feeds back into pricing and positioning</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you need creative, digital distribution, or strategic marketing support, Bridge Marketing is ready to help.
          </p>
          <Button asChild size="lg" className="font-light">
            <Link to="/contact">Contact Marketing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
