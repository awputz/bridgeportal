import { Link } from "react-router-dom";
import { Building2, Eye, Clock, ArrowRight, Megaphone, TrendingUp, Users, MapPin, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import billboardHero from "@/assets/bridge-billboard-hero.png";

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

const pricingTiers = [
  {
    category: "Highway Boards",
    description: "High-traffic highway-facing billboards",
    priceRange: "$15,000 - $50,000/month",
    minTerm: "3 months",
    includes: ["Production coordination", "Installation", "Basic reporting"]
  },
  {
    category: "Building Wraps",
    description: "Large-format building installations",
    priceRange: "$25,000 - $100,000/month",
    minTerm: "6 months",
    includes: ["Creative sizing", "Permitting support", "Installation & removal"]
  },
  {
    category: "Street Level",
    description: "Neighborhood and transit-adjacent boards",
    priceRange: "$5,000 - $20,000/month",
    minTerm: "1 month",
    includes: ["Flexible terms", "Quick turnaround", "Location selection"]
  },
  {
    category: "Digital Displays",
    description: "Rotating digital billboard placements",
    priceRange: "$8,000 - $35,000/month",
    minTerm: "1 month",
    includes: ["Multiple creatives", "Dayparting options", "Real-time updates"]
  }
];

export default function Billboard() {
  const { openContactSheet } = useContactSheet();
  const introReveal = useScrollReveal(0.1);
  const boroughsReveal = useScrollReveal(0.1);
  const inventoryReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const pricingReveal = useScrollReveal(0.1);
  const termsReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-24 md:pt-32 lg:pt-40">
      {/* Hero with Image */}
      <section className="pb-12 md:pb-16 lg:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6 animate-fade-in">
                Bridge Billboard
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                Direct landlord access to NYC's most visible outdoor advertising inventory.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Button size="lg" className="font-light" onClick={openContactSheet}>
                  View Inventory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="font-light" onClick={openContactSheet}>
                  Request Rates
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '300ms' }}>
              <img src={billboardHero} alt="Bridge Billboard - NYC Outdoor Advertising" className="rounded-lg shadow-2xl w-full" />
              <div className="absolute -bottom-4 -right-4 bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-light text-sm">
                50+ Premium Locations
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSubNav />

      {/* Stats Bar */}
      <section className="py-12 md:py-16 border-b border-white/5 bg-white/[0.02]" ref={statsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center transition-all duration-700 ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { value: "50+", label: "Board Locations" },
              { value: "100M+", label: "Monthly Impressions" },
              { value: "5", label: "NYC Boroughs" },
              { value: "Direct", label: "LL Access" }
            ].map((stat, index) => (
              <div key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-light text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`transition-all duration-700 ${introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 md:mb-8">Out-of-Home Advertising in New York</h2>
            <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
              <p>
                Bridge Billboard connects brands and advertisers directly with premium outdoor advertising inventory across New York City. Through long-standing relationships with landlords and property owners, Bridge offers access to high-visibility placements that are often unavailable through traditional channels.
              </p>
              <p>
                Whether you're launching a campaign, building brand awareness, or targeting specific neighborhoods, Bridge Billboard provides the inventory, strategy, and execution support to make your out-of-home advertising work harder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage By Borough */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={boroughsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${boroughsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Coverage By Borough</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {boroughs.map((borough, index) => (
              <div 
                key={borough.name}
                className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-center transition-all duration-700 ${boroughsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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

      {/* Featured Inventory */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={inventoryReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${inventoryReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Eye className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Featured Inventory</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Premium billboard locations across all five boroughs with direct landlord relationships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {featuredLocations.map((location, index) => (
              <div 
                key={index}
                className={`group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 ${inventoryReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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

      {/* Services Section */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">What We Offer</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Premium Board Inventory",
                desc: "Access to high-traffic billboard locations across Manhattan, Brooklyn, Queens, and the Bronx. From major arterials to neighborhood intersections."
              },
              {
                icon: Building2,
                title: "Direct Landlord Relationships",
                desc: "Exclusive inventory through direct relationships with building owners and landlords. No middlemen, better rates, and priority access."
              },
              {
                icon: Megaphone,
                title: "Campaign Strategy",
                desc: "End-to-end support from location selection and creative sizing to installation coordination and campaign optimization."
              }
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className={`group p-6 md:p-8 rounded-lg transition-all duration-700 hover:bg-white/[0.03] border-l-2 border-accent/30 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  <Icon className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
                  <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Guide */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={pricingReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${pricingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Pricing Guide</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              General pricing ranges by format. Actual rates depend on specific location and availability.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {pricingTiers.map((tier, index) => (
              <div 
                key={tier.category}
                className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 ${pricingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-light mb-2">{tier.category}</h3>
                <p className="text-sm text-muted-foreground font-light mb-4">{tier.description}</p>
                <div className="text-2xl font-light text-accent mb-2">{tier.priceRange}</div>
                <p className="text-sm text-muted-foreground font-light mb-4">Min term: {tier.minTerm}</p>
                <ul className="space-y-2">
                  {tier.includes.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground font-light flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms & Process */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={termsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 transition-all duration-700 ${termsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Clock className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl font-light">Flexible Terms</h2>
              </div>
              <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                We work with clients to structure agreements that match campaign objectives and budgets.
              </p>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Short-term campaigns from 1 month</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Annual placements with volume discounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Seasonal and event-based campaigns</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <FileText className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl font-light">Process</h2>
              </div>
              <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                From inquiry to installation, we handle the details.
              </p>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Location selection and availability check</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Creative sizing and production coordination</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Installation and campaign monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Client Types */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 md:mb-12 text-center">Who We Work With</h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            <div>
              <Users className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent mb-3 md:mb-4" />
              <h3 className="text-2xl font-light mb-4">Brands & Agencies</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                National brands and creative agencies looking for high-impact placements in New York's most desirable locations. We provide strategic guidance and inventory access for campaigns of all sizes.
              </p>
            </div>
            <div>
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent mb-3 md:mb-4" />
              <h3 className="text-xl md:text-2xl font-light mb-3 md:mb-4">Local Businesses</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Regional businesses and startups seeking to build awareness in specific neighborhoods. Our hyperlocal inventory options make outdoor advertising accessible at every budget level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6 transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Ready to Go Big?
          </h2>
          <p className={`text-base md:text-lg text-muted-foreground font-light mb-8 md:mb-12 transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
            Contact Bridge Billboard to learn about available inventory and campaign opportunities.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`} style={{ transitionDelay: '200ms' }}>
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Contact Billboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
