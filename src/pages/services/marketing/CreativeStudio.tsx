import { Megaphone, Camera, FileText, Palette, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

export default function CreativeStudio() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const brandingReveal = useScrollReveal(0.1);
  const collateralReveal = useScrollReveal(0.1);
  const visualReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.marketing.creative} 
            alt="Creative studio" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Creative Studio
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            Full-service creative production for properties and brands
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
            Bridge Marketing's Creative Studio develops distinctive visual identities and compelling narratives for real estate properties and brands. From initial concept through final execution, our team delivers work that stands out in a competitive market.
          </p>
        </div>
      </section>

      {/* Branding */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={brandingReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            brandingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Palette className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Property Branding</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Creating memorable identities that resonate with target audiences.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Building naming and positioning strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Logo design and visual identity systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Brand guidelines and asset libraries</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.marketing.campaign} 
                alt="Branding materials" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collateral */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={collateralReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            collateralReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1">
              <img 
                src={PLACEHOLDER_IMAGES.marketing.digital} 
                alt="Marketing collateral" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <FileText className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Sales Collateral</h2>
              </div>
              <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
                Professional materials that support the sales and leasing process.
              </p>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Offering memorandums and investment packages</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Pitch decks and presentation materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Brochures, flyers, and leave-behinds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Content */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={visualReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            visualReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Camera className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Visual Content Direction</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              High-quality imagery and video that showcases properties at their best.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Professional photography direction and art direction</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Video production and drone footage</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>3D renders and virtual staging</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Ready To Elevate Your Brand?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Contact Bridge Marketing to discuss your creative needs.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Contact Marketing
          </Button>
        </div>
      </section>
    </div>
  );
}
