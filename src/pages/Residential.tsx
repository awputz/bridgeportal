import { Link } from "react-router-dom";
import { Home, Search, Key, ArrowRight, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DIVISIONS } from "@/lib/constants";
import heroImage from "@/assets/brooklyn-bridge-hero-light.jpg";

// Placeholder logo for Residential division
const ResidentialLogo = () => (
  <div className="flex items-center gap-3 text-white">
    <Home className="w-10 h-10" />
    <span className="text-2xl md:text-3xl font-light">
      <span className="font-medium">BRIDGE</span> Residential
    </span>
  </div>
);

export default function Residential() {
  const servicesReveal = useScrollReveal(0.1);
  const neighborhoodsReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Sub-Brand Header */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 md:px-6 pt-24">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: 'brightness(0.5) contrast(1.1) sepia(0.1)'
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(35,85%,55%)]/10 via-black/50 to-black/70" />
        
        <div className="relative z-10 container mx-auto text-center max-w-5xl">
          {/* Sub-Brand Logo */}
          <div 
            className="flex justify-center mb-8 animate-fade-in"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
          >
            <ResidentialLogo />
          </div>
          
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in"
            style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
          >
            Residential Services
          </h1>
          
          <p 
            className="text-lg md:text-xl text-foreground/70 mb-10 max-w-3xl mx-auto font-light animate-fade-in"
            style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
          >
            {DIVISIONS.residential.tagline}. Discover your perfect home in New York City's 
            most desirable neighborhoods.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}
          >
            <Button asChild size="lg" className="font-light px-8 bg-[hsl(35,85%,50%)] hover:bg-[hsl(35,85%,45%)] text-black">
              <Link to="/residential/listings">Find a Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8 border-white/30 hover:bg-white/10">
              <Link to="/residential/sell">List Your Home</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            servicesReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">Our Services</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Personalized guidance for every step of your real estate journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Find a Home */}
            <Link
              to="/residential/listings"
              className={`group p-8 md:p-10 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-[hsl(35,85%,55%)]/10 hover:border-[hsl(35,85%,55%)]/30 transition-all duration-500 ${
                servicesReveal.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <Search className="w-12 h-12 text-[hsl(35,85%,60%)] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-light mb-3 group-hover:text-[hsl(35,85%,70%)] transition-colors">
                Find a Home
              </h3>
              <p className="text-muted-foreground font-light mb-6">
                Whether you're searching for a pied-à-terre, family home, or investment property, 
                our agents will guide you to the perfect match.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground font-light mb-6">
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[hsl(35,85%,55%)]" />
                  Personalized property matching
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[hsl(35,85%,55%)]" />
                  Neighborhood expertise
                </li>
                <li className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[hsl(35,85%,55%)]" />
                  Off-market access
                </li>
              </ul>
              <div className="flex items-center gap-2 text-[hsl(35,85%,60%)] font-light">
                <span>Browse Listings</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* List Your Home */}
            <Link
              to="/residential/sell"
              className={`group p-8 md:p-10 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-[hsl(35,85%,55%)]/10 hover:border-[hsl(35,85%,55%)]/30 transition-all duration-500 ${
                servicesReveal.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <Key className="w-12 h-12 text-[hsl(35,85%,60%)] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-light mb-3 group-hover:text-[hsl(35,85%,70%)] transition-colors">
                List Your Home
              </h3>
              <p className="text-muted-foreground font-light mb-6">
                Maximize your home's value with our comprehensive marketing approach and 
                extensive buyer network.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground font-light mb-6">
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[hsl(35,85%,55%)]" />
                  Professional staging & photography
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[hsl(35,85%,55%)]" />
                  Strategic pricing analysis
                </li>
                <li className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[hsl(35,85%,55%)]" />
                  Targeted buyer outreach
                </li>
              </ul>
              <div className="flex items-center gap-2 text-[hsl(35,85%,60%)] font-light">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Neighborhoods */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={neighborhoodsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            neighborhoodsReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">Featured Neighborhoods</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Local expertise across New York City's most sought-after areas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {[
              "Upper East Side",
              "Upper West Side",
              "Tribeca",
              "SoHo",
              "West Village",
              "Brooklyn Heights",
              "Park Slope",
              "Williamsburg",
              "DUMBO",
              "Chelsea",
              "Midtown",
              "Financial District"
            ].map((neighborhood, index) => (
              <div 
                key={neighborhood}
                className={`p-4 text-center rounded-lg border border-white/10 bg-white/[0.02] hover:bg-[hsl(35,85%,55%)]/10 hover:border-[hsl(35,85%,55%)]/30 transition-all duration-500 cursor-pointer ${
                  neighborhoodsReveal.isVisible 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="text-sm font-light">{neighborhood}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-12 md:mb-16">
            The BRIDGE Difference
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                num: "01",
                title: "White-Glove Service",
                desc: "Personalized attention from experienced agents who understand your needs"
              },
              {
                num: "02",
                title: "Market Intelligence",
                desc: "Data-driven insights and neighborhood expertise to inform your decisions"
              },
              {
                num: "03",
                title: "Global Network",
                desc: "Access to qualified buyers and sellers through our extensive relationships"
              },
              {
                num: "04",
                title: "Seamless Experience",
                desc: "End-to-end support from first showing to closing and beyond"
              }
            ].map((item, index) => (
              <div key={item.num} className="text-center p-6">
                <div className="text-4xl font-light mb-4 text-[hsl(35,85%,55%)]">{item.num}</div>
                <h3 className="text-lg font-light mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-light mb-6 transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            Let's Find Your Perfect Home
          </h2>
          <p className={`text-muted-foreground font-light mb-8 transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '100ms' }}>
            Connect with one of our residential specialists to begin your search or 
            schedule a complimentary home valuation.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
            ctaReveal.isVisible 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`} style={{ transitionDelay: '200ms' }}>
            <Button asChild size="lg" className="font-light px-8 bg-[hsl(35,85%,50%)] hover:bg-[hsl(35,85%,45%)] text-black">
              <Link to="/residential/listings">Browse Listings</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8">
              <Link to="/team">Meet Our Agents</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
