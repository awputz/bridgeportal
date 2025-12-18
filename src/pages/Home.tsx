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
import bridgeAdvisoryLogo from "@/assets/bridge-advisory-group-logo.png";
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
  const commercialReveal = useScrollReveal(0.1);
  const residentialReveal = useScrollReveal(0.1);
  const capitalReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);
  return <div className="min-h-screen">
      <SEOHelmet title="Bridge Advisory Group | NYC Real Estate Brokerage" description="New York City's premier multi-division real estate platform. Investment sales, commercial leasing, residential services, and capital advisory." path="/" />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col overflow-hidden px-3 sm:px-4 md:px-6">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${heroImage})`,
        filter: "brightness(0.6) contrast(1.1)"
      }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

        {/* Zone 1: Logo at top */}
        <div className="relative z-10 flex-shrink-0 pt-10 sm:pt-12 md:pt-16 text-center">
          <div className="animate-fade-in" style={{
          animationDelay: "200ms",
          animationFillMode: "backwards"
        }}>
            <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="mx-auto w-[220px] xs:w-[260px] sm:w-[320px] md:w-[400px] lg:w-[500px] xl:w-[600px] invert" />
          </div>
        </div>

        {/* Zone 2: Content centered in middle */}
        <div className="relative z-10 flex-1 flex items-center justify-center pb-20 sm:pb-28 md:pb-40">
          <div className="container mx-auto text-center max-w-5xl -translate-y-4 sm:-translate-y-8 md:-translate-y-16">
            

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/60 mb-4 md:mb-5 max-w-3xl mx-auto font-light px-4 animate-fade-in line-clamp-3 sm:line-clamp-none" style={{
            animationDelay: "500ms",
            animationFillMode: "backwards"
          }}>
              {COMPANY_INFO.description.full}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center px-4 animate-fade-in" style={{
            animationDelay: "600ms",
            animationFillMode: "backwards"
          }}>
              <Button asChild size="default" className="font-light text-sm md:text-base px-5 md:px-10 w-full sm:w-auto">
                <a href="#mission">Explore Services</a>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="default" className="font-light text-sm md:text-base px-5 md:px-10 w-full sm:w-auto bg-white text-black hover:bg-white/90">
                    Current Listings
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-white border-border text-black">
                  {LISTINGS_ITEMS.items.map(item => <DropdownMenuItem key={item.name} asChild>
                      {item.external ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full cursor-pointer">
                          {item.name}
                          <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
                        </a> : <Link to={item.url} className="cursor-pointer">{item.name}</Link>}
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Access Service Buttons */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 justify-center px-2 sm:px-4 mt-3 sm:mt-4 animate-fade-in" style={{
            animationDelay: "700ms",
            animationFillMode: "backwards"
          }}>
              <Button asChild variant="outline" size="sm" className="font-light px-2.5 sm:px-3 md:px-5 text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
                <Link to="/services/residential">Residential</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="font-light px-2.5 sm:px-3 md:px-5 text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
                <Link to="/services/commercial-leasing">Commercial</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="font-light px-2.5 sm:px-3 md:px-5 text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
                <Link to="/services/investment-sales">Investment Sales</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="font-light px-2.5 sm:px-3 md:px-5 text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white hidden sm:inline-flex">
                <Link to="/services/capital-advisory">Capital Markets</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Zone 3: Scroll Indicator - absolutely positioned at bottom */}
        <div className="absolute bottom-6 left-0 right-0 z-10 animate-fade-in hidden md:flex justify-center" style={{
        animationDelay: "900ms",
        animationFillMode: "backwards"
      }}>
          <a href="#mission" className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8">
            <div className={`p-4 sm:p-6 md:p-8 rounded-xl border border-border/50 bg-card/50 transition-all duration-500 ease-out ${missionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: missionReveal.isVisible ? "100ms" : "0ms"
          }}>
              <Target className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">Mission</h3>
              <p className="text-muted-foreground font-light text-xs sm:text-sm leading-relaxed">
                Deliver exceptional real estate advisory through integrity, expertise, and client-first service.
              </p>
            </div>
            <div className={`p-4 sm:p-6 md:p-8 rounded-xl border border-border/50 bg-card/50 transition-all duration-500 ease-out ${missionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: missionReveal.isVisible ? "200ms" : "0ms"
          }}>
              <Eye className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">Vision</h3>
              <p className="text-muted-foreground font-light text-xs sm:text-sm leading-relaxed">
                Be New York's most trusted real estate platform—where every transaction builds lasting relationships.
              </p>
            </div>
            <div className={`p-4 sm:p-6 md:p-8 rounded-xl border border-border/50 bg-card/50 transition-all duration-500 ease-out ${missionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: missionReveal.isVisible ? "300ms" : "0ms"
          }}>
              <Compass className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">Approach</h3>
              <p className="text-muted-foreground font-light text-xs sm:text-sm leading-relaxed">
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

      {/* Commercial & Investment Expertise Section */}
      <section className="py-16 md:py-24 bg-secondary" ref={commercialReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-12 transition-all duration-500 ease-out ${commercialReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Commercial & Investment Expertise</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto text-sm md:text-base">
              Strategic leasing and investment advisory for office, retail, mixed-use, and multifamily assets across New York.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
            {[{
            icon: Users,
            title: "Tenant & Landlord Rep",
            desc: "Full-service representation for tenants and landlords"
          }, {
            icon: TrendingUp,
            title: "Investment Sales Advisory",
            desc: "Acquisition and disposition strategies that maximize value"
          }, {
            icon: Briefcase,
            title: "Portfolio & Asset Strategy",
            desc: "Comprehensive analysis for stabilized and value-add assets"
          }].map((item, index) => <div key={item.title} className={`p-4 md:p-6 rounded-xl border border-border/50 bg-card/30 text-center transition-all duration-500 ease-out ${commercialReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: commercialReveal.isVisible ? `${150 + index * 100}ms` : "0ms"
          }}>
                <item.icon className="h-6 w-6 md:h-7 md:w-7 text-primary mx-auto mb-2 md:mb-3" />
                <h3 className="text-sm md:text-base font-medium mb-1 md:mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-light text-xs line-clamp-2">{item.desc}</p>
              </div>)}
          </div>

          <div className={`flex flex-wrap gap-4 justify-center transition-all duration-500 ease-out ${commercialReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
          transitionDelay: commercialReveal.isVisible ? "450ms" : "0ms"
        }}>
            <Button asChild variant="link" className="font-light group text-muted-foreground hover:text-foreground">
              <Link to="/services/investment-sales">
                Explore Investment Sales
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button asChild variant="link" className="font-light group text-muted-foreground hover:text-foreground">
              <Link to="/services/commercial-leasing">
                Explore Commercial Leasing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Residential Section */}
      <section className="py-16 md:py-24" ref={residentialReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-12 transition-all duration-500 ease-out ${residentialReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Residential In A City That Never Slows Down</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto text-sm md:text-base">
              High-quality apartments, townhomes, and condos. Sharp process, clear communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
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
          }].map((item, index) => <div key={item.title} className={`p-4 md:p-6 rounded-xl border border-border/50 bg-card/30 text-center transition-all duration-500 ease-out ${residentialReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: residentialReveal.isVisible ? `${150 + index * 100}ms` : "0ms"
          }}>
                <item.icon className="h-6 w-6 md:h-7 md:w-7 text-primary mx-auto mb-2 md:mb-3" />
                <h3 className="text-sm md:text-base font-medium mb-1 md:mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-light text-xs line-clamp-2">{item.desc}</p>
              </div>)}
          </div>

          <div className={`text-center transition-all duration-500 ease-out ${residentialReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
          transitionDelay: residentialReveal.isVisible ? "450ms" : "0ms"
        }}>
            <Button asChild variant="link" className="font-light group text-muted-foreground hover:text-foreground">
              <Link to="/services/residential">
                Explore Residential
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Capital Advisory Section */}
      <section className="py-16 md:py-24 bg-secondary" ref={capitalReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-12 transition-all duration-500 ease-out ${capitalReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Capital Advisory That Understands The Real Asset</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto text-sm md:text-base">
              Debt, equity, and structured finance solutions tailored to your real estate objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
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
          }].map((item, index) => <div key={item.title} className={`p-4 md:p-6 rounded-xl border border-border/50 bg-card/30 text-center transition-all duration-500 ease-out ${capitalReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: capitalReveal.isVisible ? `${150 + index * 100}ms` : "0ms"
          }}>
                <item.icon className="h-6 w-6 md:h-7 md:w-7 text-primary mx-auto mb-2 md:mb-3" />
                <h3 className="text-sm md:text-base font-medium mb-1 md:mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-light text-xs line-clamp-2">{item.desc}</p>
              </div>)}
          </div>

          <div className={`text-center transition-all duration-500 ease-out ${capitalReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
          transitionDelay: capitalReveal.isVisible ? "450ms" : "0ms"
        }}>
            <Button asChild variant="link" className="font-light group text-muted-foreground hover:text-foreground">
              <Link to="/services/capital-advisory">
                View Capital Advisory
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Additional Services Teaser */}
      <section className="py-16 md:py-24 bg-muted/30" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-10 transition-all duration-500 ease-out ${servicesReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-2xl md:text-3xl font-light mb-4">More Ways We Can Help</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
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
            transitionDelay: servicesReveal.isVisible ? `${150 + index * 100}ms` : "0ms"
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