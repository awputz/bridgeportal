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
import manhattanImg from "@/assets/manhattan-market.jpg";
import brooklynImg from "@/assets/brooklyn-market.jpg";
import queensImg from "@/assets/queens-market.jpg";
import residentialHeroImg from "@/assets/residential-hero.jpg";

const defaultStats = [
  { label: "Units Represented", value: "500+" },
  { label: "Active Listings", value: "100+" },
  { label: "Landlord Relationships", value: "50+" },
  { label: "Occupancy Rate", value: "98%" },
];

const markets = [
  { borough: "Manhattan", image: manhattanImg, areas: ["Upper East Side", "Upper West Side", "Midtown", "Downtown", "Chelsea", "Tribeca"] },
  { borough: "Brooklyn", image: brooklynImg, areas: ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights", "Greenpoint"] },
  { borough: "Queens", image: queensImg, areas: ["Long Island City", "Astoria", "Forest Hills", "Flushing"] },
];

const processSteps = [
  { step: "01", title: "Discovery", description: "Share your needs and preferences." },
  { step: "02", title: "Curated Tours", description: "View hand-selected properties." },
  { step: "03", title: "Application", description: "Expert guidance through paperwork." },
  { step: "04", title: "Move-In", description: "Seamless closing coordination." },
];

export default function ResidentialServices() {
  const { data: buildings, isLoading: buildingsLoading } = useBridgeBuildings();
  const { openContactSheet } = useContactSheet();
  
  const statsReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const portfolioReveal = useScrollReveal(0.1);
  const listingsReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero with Background Image - Restructured Copy */}
      <section className="relative min-h-[40vh] sm:min-h-[45vh] md:min-h-[55vh] lg:min-h-[70vh] flex items-center justify-center pt-16 sm:pt-20 md:pt-28 lg:pt-32 xl:pt-40 pb-6 sm:pb-8 md:pb-12 lg:pb-16 xl:pb-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${residentialHeroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-3 sm:mb-4 md:mb-6 animate-fade-in">
            Bridge Residential
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-light animate-fade-in max-w-2xl mx-auto mb-5 sm:mb-6 md:mb-8" style={{ animationDelay: '100ms' }}>
            New York residential advisory for renters, buyers, landlords, and sellers
          </p>
          
          {/* Restructured Hero CTAs - Looking to Rent → Looking to Buy → Parameters */}
          <div className="flex flex-col gap-4 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="font-light border-white/30 hover:bg-white/10 flex-1" onClick={openContactSheet}>
                Looking to Rent
              </Button>
              <Button variant="outline" className="font-light border-white/30 hover:bg-white/10 flex-1" onClick={openContactSheet}>
                Looking to Buy
              </Button>
            </div>
            <Button className="font-light w-full" onClick={openContactSheet}>
              I'm a Landlord or Seller
            </Button>
          </div>
          
          {/* StreetEasy Link */}
          <a 
            href="https://streeteasy.com/profile/957575-bridge-advisory-group?tab_profile=active_listings" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-light transition-colors animate-fade-in text-sm md:text-base mt-6"
            style={{ animationDelay: '300ms' }}
          >
            View listings on StreetEasy <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="residential" />

      {/* Stats Bar */}
      <section className="py-8 sm:py-10 md:py-16 border-b border-white/5 bg-white/[0.02]" ref={statsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-12 transition-all duration-700 ${
            statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {defaultStats.map((stat, index) => (
              <div key={stat.label} className="text-center" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Portfolio - Enhanced */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={portfolioReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`transition-all duration-700 ${
            portfolioReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Exclusive Portfolio</h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              Buildings we exclusively manage across Manhattan, Brooklyn, and Queens
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {buildingsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))
              ) : (
                buildings?.slice(0, 4).map((building, index) => (
                  <div 
                    key={building.id}
                    className="p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <h3 className="text-lg font-light mb-1">{building.name}</h3>
                    <p className="text-sm text-muted-foreground font-light mb-3">{building.neighborhood || building.borough}</p>
                    {building.unit_count && (
                      <p className="text-accent text-sm font-medium">{building.unit_count} units</p>
                    )}
                  </div>
                ))
              )}
            </div>
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

      {/* Current Listings */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={listingsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center transition-all duration-700 ${
            listingsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Current Listings</h2>
            <p className="text-muted-foreground font-light mb-6 md:mb-8 max-w-2xl mx-auto">
              Browse our complete portfolio of available rentals and sales.
            </p>
            <Button asChild className="font-light">
              <a href="https://streeteasy.com/profile/957575-bridge-advisory-group?tab_profile=active_listings" target="_blank" rel="noopener noreferrer">
                View All Listings on StreetEasy
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Markets We Serve */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={marketsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            marketsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Markets We Serve</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 md:mb-10 max-w-3xl leading-relaxed">
              Deep expertise across NYC's most sought-after residential neighborhoods.
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
                        <span key={area} className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Renters & Buyers */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`transition-all duration-700 ${
            servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 md:mb-12 text-center">For Renters & Buyers</h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Rental Services */}
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-light text-white">Rental Services</h3>
                </div>
                <p className="text-white/70 font-light text-sm mb-4">
                  Dedicated representation for renters navigating NYC's competitive market.
                </p>
                <ul className="space-y-2 text-white/70 font-light text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Personalized search based on your criteria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Access to exclusive and off-market opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Application support and negotiation</span>
                  </li>
                </ul>
              </div>

              {/* Buyer Advisory */}
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-light text-white">Buyer Advisory</h3>
                </div>
                <p className="text-white/70 font-light text-sm mb-4">
                  Strategic guidance for buyers looking to purchase in NYC.
                </p>
                <ul className="space-y-2 text-white/70 font-light text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Advisory on value and neighborhood positioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Transaction support through closing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Co-op and condo board package prep</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simplified */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={processReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
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

      {/* Property Management Link */}
      <section className="py-12 md:py-16 lg:py-20 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-4">For Property Owners & Landlords</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Looking for full-service property management? We offer comprehensive solutions for landlords and investors.
          </p>
          <Button asChild variant="outline" className="font-light">
            <Link to="/services/property-management">View Property Management Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Meet the Residential Team */}
      <TeamHighlight 
        category="Residential"
        title="Meet the Residential Team"
        subtitle="Dedicated agents helping you find your next home in NYC."
        className="bg-muted/20"
      />

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6">Connect with Bridge Residential</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're looking for your next home or seeking to list your property, our team is ready to assist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Start Your Search
            </Button>
            <Button asChild variant="outline" size="lg" className="font-light">
              <Link to="/services/property-management">Property Management</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
