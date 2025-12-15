import { Building2, MapPin, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

const portfolioStats = [
  { value: "500+", label: "Units Managed" },
  { value: "3", label: "Boroughs" },
  { value: "50+", label: "Buildings" },
  { value: "98%", label: "Occupancy" },
];

const markets = [
  {
    borough: "Manhattan",
    areas: ["Upper East Side", "Upper West Side", "Midtown East", "Chelsea", "Tribeca", "Financial District"],
    units: "200+"
  },
  {
    borough: "Brooklyn",
    areas: ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights", "Greenpoint", "Bushwick"],
    units: "200+"
  },
  {
    borough: "Queens",
    areas: ["Long Island City", "Astoria", "Forest Hills", "Sunnyside", "Jackson Heights"],
    units: "100+"
  }
];

export default function Portfolio() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const hpgReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.building.residential} 
            alt="Portfolio properties" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Our Portfolio
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            500+ units across Manhattan, Brooklyn, and Queens
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="property-management" />

      {/* Stats Bar */}
      <section className="py-12 md:py-16 border-b border-white/5 bg-white/[0.02]" ref={statsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 transition-all duration-700 ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {portfolioStats.map((stat, index) => (
              <div key={stat.label} className="text-center" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-light text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Property Management oversees a diverse portfolio of residential properties across New York City's most desirable neighborhoods. Our portfolio includes luxury rentals, boutique buildings, and institutional-quality multifamily assets.
          </p>
        </div>
      </section>

      {/* Markets */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={marketsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            marketsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Markets We Serve</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {markets.map((market, index) => (
              <div 
                key={market.borough} 
                className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${
                  marketsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-light">{market.borough}</h3>
                  <span className="text-sm text-accent font-light">{market.units} units</span>
                </div>
                <ul className="space-y-2">
                  {market.areas.map(area => (
                    <li key={area} className="text-muted-foreground font-light text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HPG Partnership */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={hpgReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center transition-all duration-700 ${
            hpgReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Building2 className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">HPG Partnership</h2>
              </div>
              <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                Exclusive in-house brokerage for Hudson Property Group's 500+ unit portfolio across New York City.
              </p>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Direct access to ownership and decision-makers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Coordinated marketing and positioning strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Integrated workflows and streamlined communication</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.building.apartment} 
                alt="HPG property" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Add Your Building To Our Portfolio</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Partner with Bridge Property Management to optimize your portfolio's performance.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Schedule a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
