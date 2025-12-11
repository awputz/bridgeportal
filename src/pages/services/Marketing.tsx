import { Link } from "react-router-dom";
import { Megaphone, TrendingUp, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { DIVISIONS } from "@/lib/constants";

export default function Marketing() {
  const introReveal = useScrollReveal(0.1);
  const creativeReveal = useScrollReveal(0.1);
  const digitalReveal = useScrollReveal(0.1);
  const analyticsReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Marketing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in" style={{ animationDelay: '100ms' }}>
            {DIVISIONS.marketing.tagline}
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="marketing" />

      {/* Intro */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Marketing powers the visual identity and storytelling behind Bridge listings and select client assignments. The team focuses on clean design, focused narratives, and distribution channels that align with where the audience actually is.
          </p>
        </div>
      </section>

      {/* Section 1: Creative Studio */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={creativeReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            creativeReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Megaphone className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Creative Studio</h2>
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
        </div>
      </section>

      {/* Section 2: Digital And Campaigns */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={digitalReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            digitalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Digital And Campaigns</h2>
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
      </section>

      {/* Section 3: Analytics And Optimization */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={analyticsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            analyticsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Award className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Analytics And Optimization</h2>
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
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
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
