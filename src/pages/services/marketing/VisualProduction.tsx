import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SEOHelmet } from "@/components/SEOHelmet";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { Camera, Video, Plane, Sofa, Box, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VisualProduction() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const photoReveal = useScrollReveal(0.1);
  const droneReveal = useScrollReveal(0.1);
  const videoReveal = useScrollReveal(0.1);
  const stagingReveal = useScrollReveal(0.1);
  const toursReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  return (
    <main className="min-h-screen bg-background">
      <SEOHelmet
        title="Visual Production | Bridge Marketing"
        description="Professional photography, drone footage, video production, virtual staging, and 3D tours for New York City real estate."
      />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920')" }}
        />
        <div 
          ref={heroReveal.elementRef}
          className={`relative z-20 text-center px-6 transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-primary font-medium tracking-wider uppercase mb-4">Bridge Marketing</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Visual Production
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            In-house photography, video, drone, and 3D capabilities that bring properties to life.
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="marketing" />

      {/* Professional Photography */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={photoReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${photoReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Professional Photography</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Our in-house photographers capture every property in its best light with HDR imaging, 
                twilight shoots, and architectural precision that sets your listing apart.
              </p>
              <ul className="space-y-3">
                {[
                  "HDR interior & exterior photography",
                  "Twilight & blue hour shoots",
                  "Architectural detail captures",
                  "Lifestyle & neighborhood context shots",
                  "24-48 hour turnaround",
                  "Full retouching & color correction"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" 
                alt="Professional real estate photography"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Drone & Aerial */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={droneReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${droneReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="order-2 md:order-1 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" 
                alt="Aerial drone photography of property"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Drone & Aerial</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                FAA-certified pilots capture stunning aerial perspectives that showcase property scale, 
                neighborhood context, and unique selling points from above.
              </p>
              <ul className="space-y-3">
                {[
                  "FAA Part 107 certified pilots",
                  "4K aerial video footage",
                  "High-resolution still photography",
                  "Neighborhood & proximity mapping",
                  "Rooftop & building detail shots",
                  "NYC-compliant flight operations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Video Production */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={videoReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${videoReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Video Production</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Cinematic property tours, testimonial videos, and social media content that 
                engage buyers and generate qualified leads across all platforms.
              </p>
              <ul className="space-y-3">
                {[
                  "Cinematic property walkthroughs",
                  "Agent & broker testimonials",
                  "Social media reels & shorts",
                  "Building amenity showcases",
                  "Neighborhood lifestyle videos",
                  "Professional editing & color grading"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800" 
                alt="Video production setup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Staging */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={stagingReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${stagingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="order-2 md:order-1 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800" 
                alt="Virtually staged interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Sofa className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Virtual Staging</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Transform empty or outdated spaces with photorealistic virtual staging that 
                helps buyers visualize potential and increases engagement rates.
              </p>
              <ul className="space-y-3">
                {[
                  "Photorealistic furniture & decor",
                  "Multiple style options per room",
                  "Before/after comparisons",
                  "Vacant to furnished transformations",
                  "Renovation visualizations",
                  "Quick 48-72 hour delivery"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Tours & Floor Plans */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={toursReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${toursReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Box className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">3D Tours & Floor Plans</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Immersive Matterport 3D walkthroughs and detailed floor plans that let buyers 
                explore properties from anywhere, reducing unqualified showings.
              </p>
              <ul className="space-y-3">
                {[
                  "Matterport 3D virtual tours",
                  "Interactive floor plan navigation",
                  "Measurement tools for buyers",
                  "Dollhouse & floor plan views",
                  "Embeddable tour links",
                  "VR headset compatibility"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center p-8">
                <Box className="h-20 w-20 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground">Interactive 3D Experience</p>
                <p className="text-muted-foreground">Explore every corner virtually</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary/5">
        <div 
          ref={ctaReveal.elementRef}
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Showcase Your Property?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let our in-house visual production team create stunning content that sells.
          </p>
          <Button 
            size="lg" 
            onClick={() => openContactSheet()}
            className="group"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </main>
  );
}
