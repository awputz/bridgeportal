import { Link } from "react-router-dom";
import { Building2, BarChart3, Shield, TrendingUp, FileText, Target, Users, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import propertyManagementHeroImg from "@/assets/property-management-hero.jpg";
import { MobileStickyContact } from "@/components/MobileStickyContact";

const services = [
  {
    icon: Shield,
    title: "Tenant Screening",
    description: "Comprehensive background, credit, and employment verification"
  },
  {
    icon: TrendingUp,
    title: "Marketing",
    description: "Professional photography, StreetEasy premium, and syndication"
  },
  {
    icon: BarChart3,
    title: "Rent Optimization",
    description: "Data-driven pricing to maximize income while minimizing vacancy"
  },
  {
    icon: FileText,
    title: "Underwriting",
    description: "Comparative financial analysis and absorption tracking"
  },
  {
    icon: Target,
    title: "Market Intelligence",
    description: "Real-time market data and quarterly reporting"
  },
  {
    icon: Building2,
    title: "Portfolio Management",
    description: "Full-service management for multi-unit portfolios"
  }
];

const markets = [
  {
    borough: "Manhattan",
    areas: ["Upper East Side", "Upper West Side", "Midtown", "Downtown", "Chelsea", "Tribeca"]
  },
  {
    borough: "Brooklyn",
    areas: ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights", "Greenpoint", "Bushwick"]
  },
  {
    borough: "Queens",
    areas: ["Long Island City", "Astoria", "Forest Hills", "Flushing", "Jackson Heights"]
  },
  {
    borough: "Bronx",
    areas: ["Riverdale", "Pelham Bay", "Fordham", "Kingsbridge", "Morris Park"]
  }
];

export default function PropertyManagement() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1, true); // Hero always visible initially
  const introReveal = useScrollReveal(0.1);
  const partnershipReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const capabilitiesReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero with Image */}
      <section
        className="relative min-h-[40vh] sm:min-h-[45vh] md:min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-6 sm:pb-8 md:pb-10 lg:pb-12"
        ref={heroReveal.elementRef}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={propertyManagementHeroImg}
            alt="New York City skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        </div>
        <div
          className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
            heroReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-3 md:mb-4">
            Bridge Property Management
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-5 md:mb-6">
            Professional property management services for landlords and investors across New York City
          </p>
          <Button className="font-light" onClick={openContactSheet}>
            Partner With Us
          </Button>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="property-management" />

      {/* Intro */}
      <section className="py-10 md:py-12 lg:py-16 border-b border-border/10" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p
            className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
              introReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Bridge Property Management delivers professional, hands-on services for landlords seeking lower vacancy, quality tenants, and clear communication. We bring institutional-level expertise to portfolios of all sizes across New York City.
          </p>
        </div>
      </section>

      {/* Institutional Partnership & Underwriting */}
      <section
        className="py-10 md:py-14 lg:py-16 border-b border-border/10"
        ref={partnershipReveal.elementRef}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div
            className={`grid md:grid-cols-2 gap-4 md:gap-6 transition-all duration-700 ${
              partnershipReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Institutional Partnership Card */}
            <div className="p-5 md:p-6 rounded-lg border border-border/30 bg-white/[0.02] hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-light">Institutional Partnership</h3>
              </div>
              <p className="text-muted-foreground font-light mb-4 text-sm">
                Exclusive in-house brokerage backed by institutional partners managing portfolios across New York City.
              </p>
              <ul className="space-y-2 text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Direct access to ownership and decision-makers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Coordinated marketing and positioning strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Integrated workflows and streamlined communication</span>
                </li>
              </ul>
            </div>

            {/* Backend Underwriting Card */}
            <div className="p-5 md:p-6 rounded-lg border border-border/30 bg-white/[0.02] hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-light">Backend Underwriting & Analysis</h3>
              </div>
              <p className="text-muted-foreground font-light mb-4 text-sm">
                Data-driven insights and financial analysis to optimize your portfolio's performance.
              </p>
              <ul className="space-y-2 text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Rent optimization and pricing strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Comparative financial analysis by submarket</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Real-time absorption data and market tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid with Image */}
      <section className="py-10 md:py-14 lg:py-16 border-b border-border/10" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div
            className={`grid md:grid-cols-2 gap-6 md:gap-8 items-start transition-all duration-700 ${
              servicesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-3">Our Services</h2>
              <p className="text-muted-foreground font-light mb-5 text-sm">
                Comprehensive property management services designed to maximize your portfolio's potential.
              </p>
              <div className="grid gap-3">
                {services.map((service, index) => (
                  <div
                    key={service.title}
                    className="group p-3.5 rounded-lg border border-border/30 bg-white/[0.02] flex items-start gap-3 hover:border-primary/20 transition-all duration-300"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <service.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="text-sm font-medium mb-0.5">{service.title}</h3>
                      <p className="text-muted-foreground font-light text-xs">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={PLACEHOLDER_IMAGES.building.apartment}
                alt="Modern apartment interior"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Citywide Coverage */}
      <section
        className="py-10 md:py-14 lg:py-16 border-b border-border/10"
        ref={marketsReveal.elementRef}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div
            className={`transition-all duration-700 ${
              marketsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center gap-3 mb-3 md:mb-4 justify-center">
              <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-light">Citywide Coverage</h2>
            </div>
            <p className="text-muted-foreground font-light mb-6 md:mb-8 max-w-3xl text-sm text-center mx-auto">
              We manage properties across New York City's boroughs, with deep expertise in the city's most sought-after residential neighborhoods.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {markets.map((market, index) => (
                <div
                  key={market.borough}
                  className="p-4 md:p-5 rounded-lg border border-border/30 bg-white/[0.02] hover:border-primary/20 transition-all duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-base font-medium mb-3">{market.borough}</h3>
                  <ul className="space-y-1.5">
                    {market.areas.map((area) => (
                      <li
                        key={area}
                        className="text-muted-foreground font-light text-xs flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Built for Performance */}
      <section className="py-10 md:py-14 lg:py-16 border-b border-border/10" ref={capabilitiesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div
            className={`transition-all duration-700 ${
              capabilitiesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-2 md:mb-3 text-center">
              Built for Performance
            </h2>
            <p className="text-muted-foreground font-light mb-5 md:mb-6 text-center max-w-2xl mx-auto text-sm">
              Backed by the full resources of Bridge Advisory Group
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <div className="p-4 md:p-5 rounded-lg border border-border/30 bg-white/[0.02] text-center hover:border-primary/20 transition-all duration-300">
                <h3 className="text-base font-medium mb-1.5">In-House Underwriting Team</h3>
                <p className="text-muted-foreground font-light text-xs">
                  Dedicated analysts for pricing and market research
                </p>
              </div>
              <div className="p-4 md:p-5 rounded-lg border border-border/30 bg-white/[0.02] text-center hover:border-primary/20 transition-all duration-300">
                <h3 className="text-base font-medium mb-1.5">Technology Infrastructure</h3>
                <p className="text-muted-foreground font-light text-xs">
                  Modern tools for tracking, reporting, and communication
                </p>
              </div>
              <div className="p-4 md:p-5 rounded-lg border border-border/30 bg-white/[0.02] text-center hover:border-primary/20 transition-all duration-300">
                <h3 className="text-base font-medium mb-1.5">Bridge Advisory Ecosystem</h3>
                <p className="text-muted-foreground font-light text-xs">
                  Access to investment sales, capital markets, and advisory
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-3 md:mb-4">
            Partner with Bridge Property Management
          </h2>
          <p className="text-muted-foreground font-light mb-5 md:mb-6 text-sm md:text-base max-w-2xl mx-auto">
            Whether you're managing a single building or a multi-property portfolio, our team is ready to help you optimize performance and reduce vacancy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="font-light" onClick={openContactSheet}>
              Schedule a Consultation
            </Button>
            <Button asChild variant="outline" className="font-light">
              <Link to="/services/residential">View Residential Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <MobileStickyContact onContactClick={openContactSheet} />
    </div>
  );
}
