import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { RentOptimizationCalculator } from "@/components/RentOptimizationCalculator";
import { Calculator } from "lucide-react";

export default function PropertyManagementTools() {
  const calculatorReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 md:py-24 lg:py-32 flex items-center justify-center bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-6">
            Property Management Tools
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Interactive calculators to help you optimize your portfolio's performance.
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="property-management" />

      {/* Rent Optimization Calculator */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calculator className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Rent Optimization Calculator</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Model the impact of vacancy reduction and rent optimization on your portfolio's performance.
            </p>
          </div>
          <div className={`transition-all duration-700 ${calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            <RentOptimizationCalculator />
          </div>
        </div>
      </section>
    </div>
  );
}
