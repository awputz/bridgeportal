import { TrendingUp, Mail, Share2, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

export default function DigitalCampaigns() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const paidReveal = useScrollReveal(0.1);
  const emailReveal = useScrollReveal(0.1);
  const socialReveal = useScrollReveal(0.1);
  const analyticsReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.marketing.digital} 
            alt="Digital campaigns" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Digital & Campaigns
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            Multi-channel distribution that reaches the right audience
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
            Bridge Marketing's digital team builds and executes campaigns that put properties in front of qualified audiences. We combine paid media, organic content, and direct outreach to drive results.
          </p>
        </div>
      </section>

      {/* Paid Media */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={paidReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            paidReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Paid & Organic</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Strategic campaigns that maximize reach and engagement.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Google Ads and display campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Social media advertising (Meta, LinkedIn)</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Retargeting and audience building</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.marketing.campaign} 
                alt="Digital campaigns" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Email Marketing */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={emailReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            emailReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1">
              <img 
                src={PLACEHOLDER_IMAGES.marketing.creative} 
                alt="Email marketing" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Mail className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Email Marketing</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Direct outreach that drives engagement and conversions.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>List building and segmentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Campaign design and automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Performance tracking and optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={socialReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            socialReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Share2 className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Social Media</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Content that builds awareness and drives engagement.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Project-specific content calendars</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Firm-level brand building</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Influencer and partnership outreach</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={analyticsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            analyticsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <BarChart3 className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Analytics & Reporting</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Data-driven insights that improve performance over time.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Campaign performance tracking and attribution</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>A/B testing for creative and messaging</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Regular reporting with actionable recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Ready To Launch A Campaign?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Contact Bridge Marketing to discuss your digital strategy.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Contact Marketing
          </Button>
        </div>
      </section>
    </div>
  );
}
