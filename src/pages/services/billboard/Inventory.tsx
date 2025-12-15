import { MapPin, Building2, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";

const featuredLocations = [
  { name: "Times Square", borough: "Manhattan", impressions: "25M+/month", type: "Digital & Static" },
  { name: "BQE Corridor", borough: "Brooklyn/Queens", impressions: "15M+/month", type: "Highway Boards" },
  { name: "Downtown Brooklyn", borough: "Brooklyn", impressions: "8M+/month", type: "Building Wraps" },
  { name: "LIC Waterfront", borough: "Queens", impressions: "6M+/month", type: "Rooftop & Wall" },
  { name: "Third Avenue", borough: "Bronx", impressions: "4M+/month", type: "Street Level" },
  { name: "125th Street", borough: "Manhattan", impressions: "5M+/month", type: "Transit Adjacent" },
  { name: "FDR Drive", borough: "Manhattan", impressions: "10M+/month", type: "Highway Boards" },
  { name: "Gowanus", borough: "Brooklyn", impressions: "3M+/month", type: "Wall Murals" },
  { name: "Williamsburg", borough: "Brooklyn", impressions: "4M+/month", type: "Rooftop" },
];

const boroughs = [
  { name: "Manhattan", locations: 15, impressions: "45M+/month" },
  { name: "Brooklyn", locations: 20, impressions: "30M+/month" },
  { name: "Queens", locations: 10, impressions: "15M+/month" },
  { name: "Bronx", locations: 5, impressions: "8M+/month" },
  { name: "Staten Island", locations: 2, impressions: "2M+/month" },
];

export default function Inventory() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const boroughsReveal = useScrollReveal(0.1);
  const locationsReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16" ref={heroReveal.elementRef}>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Inventory Map
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            50+ premium billboard locations across all five boroughs
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="billboard" />

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Billboard maintains direct relationships with landlords across New York City, providing access to high-visibility placements that are often unavailable through traditional channels. Our inventory includes highway boards, building wraps, rooftop installations, and street-level displays.
          </p>
        </div>
      </section>

      {/* Borough Overview */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={boroughsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            boroughsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Coverage By Borough</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {boroughs.map((borough, index) => (
              <div 
                key={borough.name}
                className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center transition-all duration-700 ${
                  boroughsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-light mb-2">{borough.name}</h3>
                <div className="text-2xl font-light text-accent mb-1">{borough.locations}</div>
                <p className="text-xs text-muted-foreground font-light">locations</p>
                <p className="text-sm text-muted-foreground font-light mt-2">{borough.impressions}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={locationsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            locationsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Eye className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Featured Locations</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {featuredLocations.map((location, index) => (
              <div 
                key={index}
                className={`group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700 ${
                  locationsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-light mb-1">{location.name}</h3>
                    <p className="text-sm text-muted-foreground font-light">{location.borough}</p>
                  </div>
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-2 text-sm font-light">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impressions:</span>
                    <span>{location.impressions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{location.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Request Full Inventory</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Contact Bridge Billboard for a complete inventory list with current availability.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Contact Billboard
          </Button>
        </div>
      </section>
    </div>
  );
}
