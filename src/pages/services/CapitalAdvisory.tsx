import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, Landmark, Construction, Handshake, RefreshCw, DollarSign, Briefcase, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { DIVISIONS } from "@/lib/constants";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { MobileStickyContact } from "@/components/MobileStickyContact";
export default function CapitalAdvisory() {
  const {
    openContactSheet
  } = useContactSheet();
  const heroReveal = useScrollReveal(0.1, true); // Hero always visible initially
  const statsReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const cardsReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);
  const stats = [{
    label: "Capital Raised",
    value: "$2B+"
  }, {
    label: "Deals Closed",
    value: "150+"
  }, {
    label: "Lender Network",
    value: "200+"
  }, {
    label: "Years Experience",
    value: "25+"
  }];
  const services = [{
    icon: Landmark,
    title: "Senior Loans",
    description: "Bank, agency, CMBS, and life company financing"
  }, {
    icon: RefreshCw,
    title: "Bridge Financing",
    description: "Value-add and transitional capital solutions"
  }, {
    icon: Construction,
    title: "Construction Loans",
    description: "Ground-up and renovation financing"
  }, {
    icon: TrendingUp,
    title: "Common Equity",
    description: "Institutional and family office capital"
  }, {
    icon: Handshake,
    title: "Joint Ventures",
    description: "JV structures with promote and co-GP arrangements"
  }, {
    icon: DollarSign,
    title: "Recapitalizations",
    description: "Capital stack resets and restructuring"
  }];
  return <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative min-h-[35vh] sm:min-h-[40vh] md:min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center pt-20 sm:pt-24 md:pt-20 lg:pt-24 xl:pt-28 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img src={PLACEHOLDER_IMAGES.finance.capital} alt="Capital markets and finance" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Bridge Capital Advisory
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            {DIVISIONS.capitalAdvisory.tagline}
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="capital-advisory" />

      {/* Stats Bar */}
      

      {/* Intro */}
      <section className="py-12 md:py-16 lg:py-20" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Bridge Capital Advisory works with owners, sponsors, and investors to structure financing and equity that supports the actual strategy of each asset. The team engages across senior debt, subordinated structures, and equity partnerships to deliver comprehensive capital solutions.
          </p>
        </div>
      </section>

      {/* Two-Column Feature Cards */}
      <section className="py-12 md:py-16 lg:py-20 bg-muted/20" ref={cardsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-6 md:gap-8 transition-all duration-700 ${cardsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Debt & Financing Card */}
            <div className="p-8 md:p-10 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-light">Debt & Financing</h2>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Comprehensive debt placement across traditional and alternative lenders, including banks, agencies, life companies, and private credit.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Senior & Agency Loans</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Bridge & Transitional Financing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Construction & Development</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Mezzanine & Preferred Equity</span>
                </li>
              </ul>
            </div>

            {/* Equity & Partnerships Card */}
            <div className="p-8 md:p-10 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-light">Equity & Partnerships</h2>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Matching operators with aligned capital partners for acquisitions, developments, and recapitalizations across all asset classes.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Institutional & Family Office Capital</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Joint Venture Structures</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Programmatic Partnerships</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Recapitalizations & Restructuring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 lg:py-20" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className={`text-2xl md:text-3xl font-light text-center mb-10 md:mb-12 transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Our Capital Solutions
          </h2>
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {services.map((service, index) => <div key={service.title} className="p-6 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300" style={{
            transitionDelay: `${index * 100}ms`
          }}>
                <service.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <div className={`transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">
              Ready to Structure Your Capital?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're refinancing, raising equity, or structuring a complex capital stack, our team is ready to help you find the right solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => openContactSheet()}>
                <Briefcase className="mr-2 h-5 w-5" />
                Contact Capital Advisory
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services/capital-advisory/tools">
                  <Calculator className="mr-2 h-5 w-5" />
                  Underwriting Tools
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MobileStickyContact onContactClick={openContactSheet} />
    </div>;
}