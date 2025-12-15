import { Shield, TrendingUp, BarChart3, FileText, Target, Building2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { RentOptimizationCalculator } from "@/components/RentOptimizationCalculator";

const services = [
  {
    icon: Shield,
    title: "Tenant Screening",
    description: "Comprehensive background, credit, and employment verification to ensure quality tenants."
  },
  {
    icon: TrendingUp,
    title: "Marketing",
    description: "Professional photography, StreetEasy premium listings, and syndication across major platforms."
  },
  {
    icon: BarChart3,
    title: "Rent Optimization",
    description: "Data-driven pricing to maximize income while minimizing vacancy periods."
  },
  {
    icon: FileText,
    title: "Underwriting",
    description: "Comparative financial analysis and absorption tracking for informed decision-making."
  },
  {
    icon: Target,
    title: "Market Intelligence",
    description: "Real-time market data and quarterly reporting to stay ahead of trends."
  },
  {
    icon: Building2,
    title: "Portfolio Management",
    description: "Full-service management for multi-unit portfolios with dedicated account teams."
  }
];

export default function ServicesOffered() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.building.apartment} 
            alt="Property management services" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Our Services
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            Comprehensive property management designed to maximize your portfolio's potential
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="property-management" />

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Property Management delivers institutional-quality services for landlords and investors seeking lower vacancy, better quality tenants, and consistent reporting. Our integrated platform combines technology, data, and experienced operators.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">What We Offer</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => (
              <div 
                key={service.title}
                className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 ${
                  servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <service.icon className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-light mb-2">{service.title}</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Calculator className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Underwriting Tools</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Model the impact of vacancy reduction and rent optimization on your portfolio's performance.
            </p>
          </div>
          <div className={`transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '200ms' }}>
            <RentOptimizationCalculator />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Contact us to learn how Bridge Property Management can help optimize your portfolio.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Schedule a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
