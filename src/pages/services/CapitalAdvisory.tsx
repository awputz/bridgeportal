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
      <section className="relative min-h-[40vh] sm:min-h-[45vh] md:min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-6 sm:pb-8 md:pb-10 lg:pb-12" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img src={PLACEHOLDER_IMAGES.finance.capital} alt="Capital markets and finance" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-3 md:mb-4">
            Bridge Capital Advisory
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            {DIVISIONS.capitalAdvisory.tagline}
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="capital-advisory" />

      {/* Intro */}
      <section className="py-10 md:py-12 lg:py-16 border-b border-border/10" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <p className={`text-base md:text-lg text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Bridge Capital Advisory works with owners, sponsors, and investors to structure financing and equity that supports the actual strategy of each asset. The team engages across senior debt, subordinated structures, and equity partnerships to deliver comprehensive capital solutions.
          </p>
        </div>
      </section>

      {/* Two-Column Feature Cards */}
      <section className="py-10 md:py-14 lg:py-16 border-b border-border/10" ref={cardsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`grid md:grid-cols-2 gap-4 md:gap-6 transition-all duration-700 ${cardsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Debt & Financing Card */}
            <div className="p-6 md:p-8 rounded-lg bg-white/[0.02] border border-border/30 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl md:text-2xl font-light">Debt & Financing</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Comprehensive debt placement across traditional and alternative lenders, including banks, agencies, life companies, and private credit.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Senior & Agency Loans</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Bridge & Transitional Financing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Construction & Development</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Mezzanine & Preferred Equity</span>
                </li>
              </ul>
            </div>

            {/* Equity & Partnerships Card */}
            <div className="p-6 md:p-8 rounded-lg bg-white/[0.02] border border-border/30 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl md:text-2xl font-light">Equity & Partnerships</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Matching operators with aligned capital partners for acquisitions, developments, and recapitalizations across all asset classes.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Institutional & Family Office Capital</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Joint Venture Structures</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Programmatic Partnerships</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Recapitalizations & Restructuring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 md:py-14 lg:py-16 border-b border-border/10" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className={`text-xl md:text-2xl font-light text-center mb-8 md:mb-10 transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Our Capital Solutions
          </h2>
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {services.map((service, index) => <div key={service.title} className="p-5 rounded-lg bg-white/[0.02] border border-border/30 hover:border-primary/20 transition-all duration-300" style={{
            transitionDelay: `${index * 50}ms`
          }}>
                <service.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="text-base font-medium mb-1.5">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <div className={`transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-3">
              Ready to Structure Your Capital?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-xl mx-auto">
              Whether you're refinancing, raising equity, or structuring a complex capital stack, our team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="default" onClick={() => openContactSheet()}>
                <Briefcase className="mr-2 h-4 w-4" />
                Contact Capital Advisory
              </Button>
              <Button variant="outline" size="default" asChild>
                <Link to="/services/capital-advisory/tools">
                  <Calculator className="mr-2 h-4 w-4" />
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