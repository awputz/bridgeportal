import { Link } from "react-router-dom";
import { Building2, TrendingUp, Home as HomeIcon, Megaphone, ArrowRight, ChevronDown, Landmark, Settings, Presentation, Calendar, Target, Eye, Users, Briefcase, DollarSign, LineChart, Key, Building, BarChart3, CreditCard, Handshake, RefreshCw, PenTool, Globe, MapPin, Compass, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { COMPANY_INFO, LISTINGS_ITEMS } from "@/lib/constants";
import { TrustBadges } from "@/components/TrustBadges";
import { SEOHelmet } from "@/components/SEOHelmet";
import heroImage from "@/assets/brooklyn-bridge-hero-light.jpg";
import bridgeAdvisoryLogoWhite from "@/assets/bridge-advisory-group-white.png";
import floridaLogo from "@/assets/market-logos/florida.png";
import losAngelesLogo from "@/assets/market-logos/los-angeles.png";
import bostonLogo from "@/assets/market-logos/boston.png";
import newJerseyLogo from "@/assets/market-logos/new-jersey.png";
const upcomingMarkets = [{
  name: "Bridge Florida",
  logo: floridaLogo,
  location: "Palm Beach · West Palm Beach · Miami"
}, {
  name: "Bridge Los Angeles",
  logo: losAngelesLogo,
  location: "Los Angeles & Malibu"
}, {
  name: "Bridge Boston",
  logo: bostonLogo,
  location: "Greater Boston"
}, {
  name: "Bridge New Jersey",
  logo: newJerseyLogo,
  location: "New Jersey"
}];
export default function Home() {
  const {
    openContactSheet
  } = useContactSheet();
  const missionReveal = useScrollReveal(0.1);
  const divisionsReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);
  return <div className="min-h-screen">
      <SEOHelmet title="Bridge Advisory Group | NYC Real Estate Brokerage" description="New York City's premier multi-division real estate platform. Investment sales, commercial leasing, residential services, and capital advisory." path="/" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden px-4 md:px-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: "brightness(0.6) contrast(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-28 md:pb-32">
          <div
            className="animate-fade-in overflow-hidden"
            style={{
              animationDelay: "200ms",
              animationFillMode: "backwards",
            }}
          >
            <img
              alt="Bridge Advisory Group"
              className="mx-auto w-[200px] sm:w-[280px] md:w-[360px] lg:w-[450px] xl:w-[550px] h-auto object-contain drop-shadow-lg mb-6 sm:mb-8 md:mb-10"
              src={bridgeAdvisoryLogoWhite}
            />
          </div>

          <div className="container mx-auto max-w-5xl">
            <h1 className="sr-only">NYC Real Estate Brokerage | Bridge Advisory Group</h1>
            <p
              style={{
                animationDelay: "500ms",
                animationFillMode: "backwards",
              }}
              className="text-sm sm:text-base md:text-lg lg:text-xl mb-5 md:mb-5 max-w-3xl mx-auto px-2 sm:px-4 animate-fade-in text-primary bg-black/0 font-medium leading-relaxed"
            >
              {COMPANY_INFO.description.full}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 justify-center px-2 sm:px-4 animate-fade-in"
              style={{
                animationDelay: "600ms",
                animationFillMode: "backwards",
              }}
            >
              <Button
                asChild
                size="default"
                className="font-light text-sm md:text-base px-5 md:px-10 w-full sm:w-auto bg-white text-black hover:bg-white/90 min-h-[48px]"
              >
                <a href="#mission">Explore Services</a>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="default"
                    className="font-light text-sm md:text-base px-5 md:px-10 w-full sm:w-auto bg-white text-black hover:bg-white/90 min-h-[48px]"
                  >
                    Current Listings
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-white border-border text-black z-50">
                  {LISTINGS_ITEMS.items.map(item => (
                    <DropdownMenuItem key={item.name} asChild>
                      {item.external ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full cursor-pointer min-h-[44px]"
                        >
                          {item.name}
                          <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
                        </a>
                      ) : (
                        <Link to={item.url} className="cursor-pointer bg-white min-h-[44px] flex items-center">
                          {item.name}
                        </Link>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Access Service Buttons */}
            <div
              className="flex flex-wrap gap-2 justify-center px-2 sm:px-4 mt-4 animate-fade-in"
              style={{
                animationDelay: "700ms",
                animationFillMode: "backwards",
              }}
            >
              <Button
                asChild
                variant="outline"
                size="sm"
                className="font-light px-3 sm:px-4 text-xs sm:text-sm bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white min-h-[40px]"
              >
                <Link to="/services/residential">Residential</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="font-light px-3 sm:px-4 text-xs sm:text-sm bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white min-h-[40px]"
              >
                <Link to="/services/commercial-leasing">Commercial</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="font-light px-3 sm:px-4 text-xs sm:text-sm bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white min-h-[40px]"
              >
                <Link to="/services/investment-sales">Investment</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="font-light px-3 sm:px-4 text-xs sm:text-sm bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white min-h-[40px] hidden sm:inline-flex"
              >
                <Link to="/services/capital-advisory">Capital</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - absolutely positioned at bottom */}
        <div
          className="absolute bottom-6 left-0 right-0 z-10 animate-fade-in hidden md:flex justify-center"
          style={{
            animationDelay: "900ms",
            animationFillMode: "backwards",
          }}
        >
          <a
            href="#mission"
            className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer"
          >
            <span className="text-sm tracking-wider uppercase font-light">Scroll to Explore</span>
            <ChevronDown className="h-6 w-6 animate-bounce-gentle" />
          </a>
        </div>
      </section>

      {/* About Bridge Advisory Group Section */}
      <section id="mission" className="py-16 md:py-24 bg-muted/30" ref={missionReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {/* Part 1: Header, Mission, Vision, Values */}
          <div className={`text-center mb-10 transition-all duration-500 ease-out ${missionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">About Bridge Advisory Group</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto text-sm md:text-base">
              A full-service real estate advisory platform built on integrity, expertise, and long-term relationships.
            </p>
          </div>

          {/* Mission, Vision & Approach Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`glass-card p-6 md:p-8 transition-all duration-500 ease-out ${missionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: missionReveal.isVisible ? "100ms" : "0ms"
          }}>
            <Target className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-3 text-white">Mission</h3>
            <p className="text-white/70 font-light text-sm leading-relaxed">
              Deliver exceptional real estate advisory through integrity, expertise, and client-first service.
            </p>
          </div>
          <div className={`glass-card p-6 md:p-8 transition-all duration-500 ease-out ${missionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: missionReveal.isVisible ? "200ms" : "0ms"
          }}>
            <Eye className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-3 text-white">Vision</h3>
            <p className="text-white/70 font-light text-sm leading-relaxed">
              Be New York's most trusted real estate platform—where every transaction builds lasting relationships.
            </p>
          </div>
          <div className={`glass-card p-6 md:p-8 transition-all duration-500 ease-out ${missionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: missionReveal.isVisible ? "300ms" : "0ms"
          }}>
            <Compass className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-3 text-white">Approach</h3>
            <p className="text-white/70 font-light text-sm leading-relaxed">
              Principal-level thinking combined with hands-on execution across every transaction.
            </p>
          </div>
          </div>

          {/* About Us Button */}
          <div className={`flex justify-center transition-all duration-500 ease-out ${missionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
          transitionDelay: missionReveal.isVisible ? "400ms" : "0ms"
        }}>
            <Button asChild variant="outline" className="font-light">
              <Link to="/about">About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Divisions - Unified Services Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-secondary" ref={divisionsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Main Section Header */}
          <div className={`text-center mb-8 sm:mb-10 md:mb-14 transition-all duration-500 ease-out ${divisionsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-3 md:mb-4">Our Divisions</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto text-sm md:text-base px-2">
              A full-service real estate advisory platform with specialized expertise across commercial, residential, and capital markets.
            </p>
          </div>

          {/* Investment Sales Division */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 transition-all duration-500 ease-out ${divisionsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: "100ms"
          }}>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-foreground">Investment Sales Division</h3>
                <p className="text-muted-foreground font-light text-xs sm:text-sm">Strategic acquisition and disposition advisory</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="font-light text-[11px] sm:text-xs text-muted-foreground hover:text-foreground px-2 sm:px-3 h-8 min-h-[32px] self-start sm:self-auto">
                <Link to="/services/investment-sales">Explore <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[{
              icon: TrendingUp,
              title: "Investment Sales Advisory",
              desc: "Acquisition and disposition strategies that maximize value"
            }, {
              icon: Briefcase,
              title: "Portfolio & Asset Strategy",
              desc: "Comprehensive analysis for stabilized and value-add assets"
            }].map((item, index) => <div key={item.title} className={`p-4 md:p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/15 text-center transition-all duration-300 ease-out hover:bg-black/50 hover:border-white/25 ${divisionsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
              transitionDelay: `${150 + index * 50}ms`
            }}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                  <h4 className="text-sm font-medium mb-1 text-white">{item.title}</h4>
                  <p className="text-white/70 font-light text-xs leading-relaxed">{item.desc}</p>
                </div>)}
            </div>
          </div>

          {/* Commercial Leasing Division */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 transition-all duration-500 ease-out ${divisionsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: "250ms"
          }}>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-foreground">Commercial Leasing Division</h3>
                <p className="text-muted-foreground font-light text-xs sm:text-sm">Full-service tenant and landlord representation</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="font-light text-[11px] sm:text-xs text-muted-foreground hover:text-foreground px-2 sm:px-3 h-8 min-h-[32px] self-start sm:self-auto">
                <Link to="/services/commercial-leasing">Explore <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[{
              icon: Users,
              title: "Tenant Representation",
              desc: "Strategic site selection and lease negotiation for occupiers"
            }, {
              icon: Building2,
              title: "Landlord Representation",
              desc: "Maximize occupancy and rental income for property owners"
            }].map((item, index) => <div key={item.title} className={`p-4 md:p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/15 text-center transition-all duration-300 ease-out hover:bg-black/50 hover:border-white/25 ${divisionsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
              transitionDelay: `${300 + index * 50}ms`
            }}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                  <h4 className="text-sm font-medium mb-1 text-white">{item.title}</h4>
                  <p className="text-white/70 font-light text-xs leading-relaxed">{item.desc}</p>
                </div>)}
            </div>
          </div>

          {/* Residential Division */}
          <div>
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 transition-all duration-500 ease-out ${divisionsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: "400ms"
          }}>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-foreground">Residential Division</h3>
                <p className="text-muted-foreground font-light text-xs sm:text-sm">High-quality apartments, townhomes, and condos</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="font-light text-[11px] sm:text-xs text-muted-foreground hover:text-foreground px-2 sm:px-3 h-8 min-h-[32px] self-start sm:self-auto">
                <Link to="/services/residential">Explore <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[{
              icon: Key,
              title: "Landlord Leasing Programs",
              desc: "Maximize occupancy and rental income"
            }, {
              icon: Building,
              title: "Rentals And Sales",
              desc: "Find your next home or investment property"
            }, {
              icon: BarChart3,
              title: "Residential Market Intel",
              desc: "Data-driven insights for informed decisions"
            }].map((item, index) => <div key={item.title} className={`p-4 md:p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/15 text-center transition-all duration-300 ease-out hover:bg-black/50 hover:border-white/25 ${divisionsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
              transitionDelay: `${450 + index * 50}ms`
            }}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                  <h4 className="text-sm font-medium mb-1 text-white">{item.title}</h4>
                  <p className="text-white/70 font-light text-xs leading-relaxed">{item.desc}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* More Ways We Can Help */}
      <section className="py-16 md:py-24 bg-muted/30" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-10 transition-all duration-500 ease-out ${servicesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-2xl md:text-3xl font-light mb-4">More Ways We Can Help</h2>
          </div>

          {/* Capital Advisory */}
          <div className="mb-10 md:mb-12">
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 transition-all duration-500 ease-out ${servicesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: "100ms"
          }}>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-foreground">Capital Advisory</h3>
                <p className="text-muted-foreground font-light text-xs sm:text-sm">Debt, equity, and structured finance solutions</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="font-light text-[11px] sm:text-xs text-muted-foreground hover:text-foreground px-2 sm:px-3 h-8 min-h-[32px] self-start sm:self-auto">
                <Link to="/services/capital-advisory">Explore <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[{
              icon: CreditCard,
              title: "Debt Placement",
              desc: "Access to competitive financing across lender types"
            }, {
              icon: Handshake,
              title: "Equity And Joint Ventures",
              desc: "Strategic partnerships for growth and scale"
            }, {
              icon: RefreshCw,
              title: "Recapitalization",
              desc: "Restructure capital stacks to optimize returns"
            }].map((item, index) => <div key={item.title} className={`p-4 md:p-5 rounded-xl border border-border/50 bg-card/50 text-center transition-all duration-500 ease-out hover:border-border hover:bg-card ${servicesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
              transitionDelay: `${150 + index * 50}ms`
            }}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                  <h4 className="text-sm font-medium mb-1">{item.title}</h4>
                  <p className="text-muted-foreground font-light text-xs leading-relaxed">{item.desc}</p>
                </div>)}
            </div>
          </div>

          {/* Other Services */}
          <div className="grid md:grid-cols-3 gap-5">
            {[{
            icon: Settings,
            title: "Property Management",
            desc: "Full-service asset management and operations",
            path: "/services/property-management"
          }, {
            icon: PenTool,
            title: "Marketing & Creative",
            desc: "Branding, campaigns, and creative production",
            path: "/services/marketing"
          }, {
            icon: MapPin,
            title: "Billboard Advertising",
            desc: "Premium outdoor advertising placements",
            path: "/services/billboard"
          }].map((item, index) => <Link key={item.title} to={item.path} className={`group p-5 md:p-6 rounded-xl border border-border/50 bg-card/50 text-center transition-all duration-500 ease-out hover:border-border hover:bg-card ${servicesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: servicesReveal.isVisible ? `${350 + index * 100}ms` : "0ms"
          }}>
                <item.icon className="h-7 w-7 text-primary mx-auto mb-3" />
                <h3 className="text-base font-medium mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground font-light text-xs">{item.desc}</p>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Markets Coming Soon Section */}
      

      {/* Final CTA */}
      <section className="py-16 md:py-24 border-t border-border/30" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <div className={`transition-all duration-500 ease-out ${ctaReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground font-light mb-8 max-w-xl mx-auto text-sm md:text-base">
              Our team is ready to help you navigate New York real estate.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 ease-out ${ctaReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: ctaReveal.isVisible ? "150ms" : "0ms"
          }}>
              <Button size="lg" className="font-light px-8" onClick={openContactSheet}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule a Call
              </Button>
              <Button asChild size="lg" variant="outline" className="font-light px-8">
                <Link to="/team">Meet Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>;
}