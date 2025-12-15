import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SEOHelmet } from "@/components/SEOHelmet";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { 
  SignpostBig, 
  FileText, 
  Globe, 
  CalendarDays, 
  Newspaper,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintEvents() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const signageReveal = useScrollReveal(0.1);
  const printReveal = useScrollReveal(0.1);
  const websitesReveal = useScrollReveal(0.1);
  const eventsReveal = useScrollReveal(0.1);
  const prReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  return (
    <main className="min-h-screen bg-background">
      <SEOHelmet
        title="Print & Events | Bridge Marketing"
        description="Signage, print collateral, single property websites, event marketing, and PR services for New York City real estate."
      />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920')" }}
        />
        <div 
          ref={heroReveal.elementRef}
          className={`relative z-20 text-center px-6 transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-primary font-medium tracking-wider uppercase mb-4">Bridge Marketing</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Print & Events
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From street signage to broker events, we handle every touchpoint of your marketing campaign.
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="marketing" />

      {/* Signage */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={signageReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${signageReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <SignpostBig className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Signage & Street Presence</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Custom-designed signage that captures attention and drives foot traffic. 
                From yard signs to building wraps, we maximize your property's street visibility.
              </p>
              <ul className="space-y-3">
                {[
                  "Custom yard & post signs",
                  "Directional signage systems",
                  "Window & door graphics",
                  "Building banners & wraps",
                  "Open house signage kits",
                  "Installation & removal services"
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
                <SignpostBig className="h-20 w-20 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground">Street-Level Impact</p>
                <p className="text-muted-foreground">Maximum visibility for your listings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Print Collateral */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={printReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${printReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="order-2 md:order-1 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800" 
                alt="Print marketing materials"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Print Collateral</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Premium print materials that leave lasting impressions. Our in-house design team 
                creates everything from property brochures to targeted direct mail campaigns.
              </p>
              <ul className="space-y-3">
                {[
                  "Property brochures & flyers",
                  "Offering memorandums (OMs)",
                  "Just Listed / Just Sold postcards",
                  "Direct mail campaigns",
                  "Business cards & stationery",
                  "Premium paper & finishing options"
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

      {/* Single Property Websites */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={websitesReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${websitesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Single Property Websites</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Dedicated landing pages for each listing that capture leads, showcase all media, 
                and provide a premium digital experience for potential buyers.
              </p>
              <ul className="space-y-3">
                {[
                  "Custom domain setup (e.g., 123MainSt.com)",
                  "Photo galleries & video integration",
                  "3D tour embedding",
                  "Lead capture forms",
                  "Neighborhood information",
                  "Mobile-optimized responsive design"
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
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800" 
                alt="Property website on devices"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Event Marketing */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={eventsReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${eventsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="order-2 md:order-1 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" 
                alt="Real estate event"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Event Marketing</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                From intimate broker previews to large-scale launch events, we plan and execute 
                memorable experiences that generate buzz and close deals.
              </p>
              <ul className="space-y-3">
                {[
                  "Open house planning & promotion",
                  "Broker tour coordination",
                  "VIP buyer events",
                  "Building launch parties",
                  "Catering & vendor coordination",
                  "Event photography & video coverage"
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

      {/* PR & Media */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={prReveal.elementRef}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${prReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Newspaper className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">PR & Media Relations</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Strategic media outreach that gets your listings featured in top publications, 
                driving awareness and establishing market credibility.
              </p>
              <ul className="space-y-3">
                {[
                  "Press release writing & distribution",
                  "Media outlet relationships",
                  "Feature story pitching",
                  "Industry publication placements",
                  "Social media amplification",
                  "Crisis communications support"
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
                <Newspaper className="h-20 w-20 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground">Media Coverage</p>
                <p className="text-muted-foreground">Get featured where it matters</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            From street presence to press coverage, let us handle every aspect of your marketing.
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
