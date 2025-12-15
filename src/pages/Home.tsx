import { Link } from "react-router-dom";
import { Building2, TrendingUp, Home as HomeIcon, Megaphone, ArrowRight, ChevronDown, Landmark, Settings, Presentation, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { COMPANY_INFO, DIVISIONS } from "@/lib/constants";
import { TrustBadges } from "@/components/TrustBadges";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { CoverageMap } from "@/components/CoverageMap";
import { CalculatorTeaser } from "@/components/CalculatorTeaser";
import { PartnerLogos } from "@/components/PartnerLogos";
import { SEOHelmet } from "@/components/SEOHelmet";
import heroImage from "@/assets/brooklyn-bridge-hero-light.jpg";
import bridgeAdvisoryLogo from "@/assets/bridge-advisory-group-logo.png";
export default function Home() {
  const {
    openContactSheet
  } = useContactSheet();
  const platformReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);
  return <div className="min-h-screen">
      <SEOHelmet title="Bridge Advisory Group | NYC Real Estate Brokerage" description="New York City's premier multi-division real estate platform. Investment sales, commercial leasing, residential services, and capital advisory." path="/" />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 md:px-6">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${heroImage})`,
        filter: "brightness(0.6) contrast(1.1)"
      }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

        <div className="relative z-10 container mx-auto text-center max-w-5xl">
          <div className="animate-fade-in" style={{
          animationDelay: "200ms",
          animationFillMode: "backwards"
        }}>
            <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="mx-auto w-[280px] md:w-[400px] lg:w-[500px] xl:w-[600px] invert mb-4 md:mb-6" />
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-foreground/90 mb-4 md:mb-6 max-w-4xl mx-auto font-light px-4 animate-fade-in" style={{
          animationDelay: "400ms",
          animationFillMode: "backwards"
        }}>
            {COMPANY_INFO.tagline}
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-foreground/60 mb-6 md:mb-8 max-w-3xl mx-auto font-light px-4 animate-fade-in" style={{
          animationDelay: "500ms",
          animationFillMode: "backwards"
        }}>
            {COMPANY_INFO.description.full}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 animate-fade-in" style={{
          animationDelay: "600ms",
          animationFillMode: "backwards"
        }}>
            <Button asChild size="lg" className="font-light px-6 md:px-10 w-full sm:w-auto">
              <a href="#services">Explore Our Services</a>
            </Button>
            <Button size="lg" variant="outline" className="font-light px-6 md:px-10 w-full sm:w-auto border-white/30 hover:bg-white/10" onClick={openContactSheet}>
              
              Contact us 
            </Button>
          </div>

          {/* Quick Access Service Buttons */}
          <div className="hidden md:flex flex-wrap gap-3 justify-center px-4 mt-6 mb-20 animate-fade-in" style={{
          animationDelay: "700ms",
          animationFillMode: "backwards"
        }}>
            <Button asChild variant="outline" className="font-light px-5 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
              <Link to="/services/residential">Residential</Link>
            </Button>
            <Button asChild variant="outline" className="font-light px-5 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
              <Link to="/services/commercial-leasing">Commercial</Link>
            </Button>
            <Button asChild variant="outline" className="font-light px-5 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
              <Link to="/services/investment-sales">Investment Sales</Link>
            </Button>
            <Button asChild variant="outline" className="font-light px-5 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
              <Link to="/services/capital-advisory">Capital Markets</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in hidden md:block" style={{
        animationDelay: "900ms",
        animationFillMode: "backwards"
      }}>
          <div className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer">
            <span className="text-sm tracking-wider uppercase font-light">Scroll to Explore</span>
            <ChevronDown className="h-6 w-6 animate-bounce-gentle" />
          </div>
        </div>
      </section>

      {/* Section 1: Who We Are + Our Divisions */}
      <section id="services" ref={platformReveal.elementRef} className="py-16 md:py-24 border-b border-white/5 pt-0">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center transition-all duration-700 ${platformReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Who We Are</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light mb-12 max-w-3xl mx-auto leading-relaxed">
              Bridge Advisory Group is a multi-division real estate platform serving owners, operators, and occupiers across every stage of the real estate cycle—from luxury residential to complex commercial transactions, investment sales, and capital markets solutions.
            </p>
          </div>

          {/* Division Cards */}
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12 transition-all duration-700 ${platformReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{
          transitionDelay: "200ms"
        }}>
            {Object.values(DIVISIONS).map((division, index) => {
            const iconMap: Record<string, React.ReactNode> = {
              Home: <HomeIcon className="h-6 w-6 md:h-8 md:w-8 text-accent mb-3" />,
              Building2: <Building2 className="h-6 w-6 md:h-8 md:w-8 text-accent mb-3" />,
              TrendingUp: <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-accent mb-3" />,
              Landmark: <Landmark className="h-6 w-6 md:h-8 md:w-8 text-accent mb-3" />,
              Settings: <Settings className="h-6 w-6 md:h-8 md:w-8 text-accent mb-3" />,
              Megaphone: <Megaphone className="h-6 w-6 md:h-8 md:w-8 text-accent mb-3" />,
              Presentation: <Presentation className="h-6 w-6 md:h-8 md:w-8 text-accent mb-3" />
            };
            return <Link key={division.name} to={division.path} style={{
              transitionDelay: `${index * 50}ms`
            }} className="group p-4 md:p-6 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 text-center flex flex-col items-center pb-0">
                  {iconMap[division.icon]}
                  <h3 className="text-sm md:text-base font-light mb-1 group-hover:text-foreground transition-colors">
                    {division.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light line-clamp-2 hidden md:block">
                    {division.tagline}
                  </p>
                </Link>;
          })}
          </div>

          <div className={`text-center transition-all duration-700 ${platformReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{
          transitionDelay: "400ms"
        }}>
            <Button asChild variant="link" className="font-light group">
              <Link to="/about">
                Learn more about the firm
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: NYC Coverage Map */}
      <CoverageMap />

      {/* Section 3: Trust Badges */}
      <TrustBadges />

      {/* Section 4: Featured Deals */}
      <FeaturedDeals />

      {/* Section 5: Calculator Teaser */}
      <CalculatorTeaser />

      {/* Section 6: Partner Logos */}
      <PartnerLogos />

      {/* Section 7: Final CTA */}
      <section className="py-16 md:py-24 border-t border-white/5" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <div className={`transition-all duration-700 ${ctaReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Ready to Get Started?</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
              Whether you're buying, selling, leasing, or investing, our team is ready to help you navigate New York real estate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-light px-10" onClick={openContactSheet}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule a Consultation
              </Button>
              <Button asChild size="lg" variant="outline" className="font-light px-10">
                <Link to="/team">Meet Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>;
}