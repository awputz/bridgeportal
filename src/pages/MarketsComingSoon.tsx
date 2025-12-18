import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const upcomingMarkets = [
  {
    name: "Bridge Florida",
    initials: "BF",
    location: "Miami & South Florida",
  },
  {
    name: "Bridge Los Angeles",
    initials: "BLA",
    location: "Greater Los Angeles",
  },
  {
    name: "Bridge Boston",
    initials: "BB",
    location: "Greater Boston",
  },
];

const MarketsComingSoon = () => {
  const heroReveal = useScrollReveal();
  const gridReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  return (
    <main className="min-h-screen bg-background pt-32 md:pt-40">
      {/* Hero Section */}
      <section className="pb-16 md:pb-24 border-b border-border/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div 
            ref={heroReveal.elementRef} 
            className={`max-w-3xl mx-auto text-center transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-light">
                Expansion
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
              Markets Coming Soon
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Bridge Advisory Group is expanding its platform into select new markets. 
              These future offices are in development and will be announced in more detail as they launch.
            </p>
          </div>
        </div>
      </section>

      {/* Markets Grid */}
      <section className="py-20 md:py-28 border-b border-border/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div 
            ref={gridReveal.elementRef} 
            className={`transition-all duration-700 ${gridReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {upcomingMarkets.map((market, index) => (
                <div
                  key={market.name}
                  className="group relative rounded-lg border border-white/10 bg-white/[0.02] p-8 md:p-10 text-center hover:border-accent/30 transition-all duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Placeholder Logo */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center">
                    <span className="text-2xl font-light text-muted-foreground tracking-wide">
                      {market.initials}
                    </span>
                  </div>

                  {/* Market Name */}
                  <h3 className="text-xl md:text-2xl font-light tracking-tight mb-2">
                    {market.name}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    {market.location}
                  </p>

                  {/* Coming Soon Badge */}
                  <span className="inline-block px-4 py-1.5 text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full font-light">
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>

            {/* Closing Paragraph */}
            <div className="max-w-2xl mx-auto text-center mt-16">
              <p className="text-muted-foreground font-light leading-relaxed">
                These markets represent the next phase of growth for Bridge Advisory Group. 
                As these offices come online, they will share the same standards for service, 
                process, and culture that define our New York platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-white/[0.02]">
        <div className="container mx-auto px-6 lg:px-8">
          <div 
            ref={ctaReveal.elementRef} 
            className={`max-w-2xl mx-auto text-center transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
              Stay Connected
            </h2>
            <p className="text-muted-foreground font-light mb-8">
              Be the first to know when we launch in new markets. 
              Get in touch to learn more about our expansion plans.
            </p>
            <Button asChild size="lg" className="group font-light">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MarketsComingSoon;
