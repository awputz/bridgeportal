import { Link } from "react-router-dom";
import { Home, Award, TrendingUp, ArrowRight, Users, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { TeamHighlight } from "@/components/TeamHighlight";
import { useBridgeBuildings } from "@/hooks/useBridgeBuildings";
import { Skeleton } from "@/components/ui/skeleton";
import { SwipeHint } from "@/components/SwipeHint";
import { MobileStickyContact } from "@/components/MobileStickyContact";
import manhattanImg from "@/assets/manhattan-market.jpg";
import brooklynImg from "@/assets/brooklyn-market.jpg";
import queensImg from "@/assets/queens-market.jpg";
import residentialHeroImg from "@/assets/residential-services-hero.jpg";

const services = [
  {
    icon: Users,
    title: "Renter Representation",
    description: "Dedicated agents helping you navigate NYC's competitive rental market.",
    features: ["Personalized search", "Off-market access", "Application support"],
    link: "/services/residential/find-a-home"
  },
  {
    icon: Award,
    title: "Buyer Advisory",
    description: "Strategic guidance for purchasing in NYC.",
    features: ["Market analysis", "Negotiation support", "Board package prep"],
    link: "/services/residential/find-a-home"
  },
  {
    icon: TrendingUp,
    title: "Landlord Services",
    description: "Maximize your property's potential with expert leasing.",
    features: ["Tenant screening", "Marketing & pricing", "Lease management"],
    link: "/services/residential/landlords"
  },
  {
    icon: Home,
    title: "Seller Advisory",
    description: "Position and sell your property for top dollar.",
    features: ["Pricing strategy", "Marketing campaign", "Transaction support"],
    link: "/services/residential/sellers"
  }
];

const markets = [
  {
    borough: "Manhattan",
    image: manhattanImg,
    areas: ["Upper East Side", "Upper West Side", "Midtown", "Downtown", "Chelsea", "Tribeca"]
  },
  {
    borough: "Brooklyn",
    image: brooklynImg,
    areas: ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights", "Greenpoint"]
  },
  {
    borough: "Queens",
    image: queensImg,
    areas: ["Long Island City", "Astoria", "Forest Hills", "Flushing"]
  }
];

const processSteps = [
  { step: "01", title: "Discovery", description: "Share your needs and preferences." },
  { step: "02", title: "Curated Tours", description: "View hand-selected properties." },
  { step: "03", title: "Application", description: "Expert guidance through paperwork." },
  { step: "04", title: "Move-In", description: "Seamless closing coordination." }
];

export default function ResidentialServices() {
  const { data: buildings, isLoading: buildingsLoading } = useBridgeBuildings();
  const { openContactSheet } = useContactSheet();
  const servicesReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const portfolioReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[35vh] sm:min-h-[40vh] md:min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center pt-20 sm:pt-24 md:pt-20 lg:pt-24 xl:pt-28 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${residentialHeroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />

        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-2 sm:mb-3 md:mb-4 animate-fade-in">
            Bridge Residential
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-light animate-fade-in max-w-2xl mx-auto mb-4 sm:mb-5 md:mb-6"
            style={{ animationDelay: "100ms" }}
          >
            New York residential advisory for renters, buyers, landlords, and sellers
          </p>

          <div
            className="flex flex-col gap-3 max-w-md mx-auto animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Button
                variant="outline"
                className="font-light border-white/30 hover:bg-white/10 flex-1"
                onClick={openContactSheet}
              >
                Looking to Rent
              </Button>
              <Button
                variant="outline"
                className="font-light border-white/30 hover:bg-white/10 flex-1"
                onClick={openContactSheet}
              >
                Looking to Buy
              </Button>
            </div>
            <Button className="font-light w-full" onClick={openContactSheet}>
              I'm a Landlord or Seller
            </Button>
          </div>

          <a
            href="https://streeteasy.com/profile/957575-bridge-advisory-group?tab_profile=active_listings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-light transition-colors animate-fade-in text-sm md:text-base mt-4 sm:mt-5"
            style={{ animationDelay: "300ms" }}
          >
            View listings on StreetEasy <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="residential" />

      {/* Our Services */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div
            className={`transition-all duration-700 ${
              servicesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Our Services</h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              Full-service residential advisory for every stage of your real estate journey
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {services.map((service, index) => (
                <Link
                  key={service.title}
                  to={service.link}
                  className="group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <service.icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="text-lg font-light mb-2 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light mb-4">{service.description}</p>
                  <ul className="space-y-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-xs text-muted-foreground/80 flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]"
        ref={processReveal.elementRef}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div
            className={`transition-all duration-700 ${
              processReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center gap-4 mb-6 justify-center">
              <Calendar className="h-8 w-8 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">How It Works</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {processSteps.map((item, index) => (
                <div
                  key={item.step}
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl font-light text-accent/50 mb-3">{item.step}</div>
                  <h3 className="text-base font-light mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Markets We Serve */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={marketsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div
            className={`transition-all duration-700 ${
              marketsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 justify-center">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Markets We Serve</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 md:mb-10 max-w-3xl mx-auto text-center">
              Deep expertise across NYC's most sought-after residential neighborhoods
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {markets.map((market, index) => (
                <div
                  key={market.borough}
                  className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={market.image}
                      alt={market.borough}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-light mb-3">{market.borough}</h3>
                    <div className="flex flex-wrap gap-2">
                      {market.areas.map((area) => (
                        <span
                          key={area}
                          className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SwipeHint 
              text="Scroll to explore neighborhoods" 
              direction="vertical"
              storageKey="residential-markets"
            />
          </div>
        </div>
      </section>

      {/* Exclusive Portfolio */}
      <section
        className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]"
        ref={portfolioReveal.elementRef}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div
            className={`transition-all duration-700 ${
              portfolioReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">
              Exclusive Portfolio
            </h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              Buildings we exclusively manage across Manhattan, Brooklyn, and Queens
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {buildingsLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24 mb-3" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                : buildings?.slice(0, 4).map((building, index) => (
                    <div
                      key={building.id}
                      className="p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <h3 className="text-lg font-light mb-1">{building.name}</h3>
                      <p className="text-sm text-muted-foreground font-light mb-3">
                        {building.neighborhood || building.borough}
                      </p>
                      {building.unit_count && (
                        <p className="text-accent text-sm font-medium">{building.unit_count} units</p>
                      )}
                    </div>
                  ))}
            </div>
            <SwipeHint 
              text="Tap to learn more" 
              storageKey="residential-portfolio"
              className="mt-4"
            />
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="font-light">
                <Link to="/services/residential/buildings">
                  View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Highlight */}
      <TeamHighlight
        category="Residential"
        title="Meet the Residential Team"
        subtitle="Dedicated agents helping you find your next home in NYC."
        className="bg-muted/20"
      />

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're searching for your next home or looking to list your property, our team is here to help.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Contact Us
          </Button>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <MobileStickyContact onContactClick={openContactSheet} />
    </div>
  );
}
