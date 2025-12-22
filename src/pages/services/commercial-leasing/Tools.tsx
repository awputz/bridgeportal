import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import LeaseCalculator from "@/components/LeaseCalculator";
import { useBridgeCalculatorBySection } from "@/hooks/useBridgeCalculators";
import { Calculator } from "lucide-react";

export default function CommercialLeasingTools() {
  const { data: calculatorConfig } = useBridgeCalculatorBySection("commercial-leasing", "main_calculator");
  const calculatorReveal = useScrollReveal(0.1, true);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-10 sm:pb-14 md:pb-24 lg:pb-32 flex items-center justify-center bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 sm:mb-4 md:mb-6">
            Commercial Leasing Tools
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Interactive calculators to help you analyze and plan your commercial lease.
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="commercial-leasing" />

      {/* Lease Calculator */}
      <section className="py-8 sm:py-12 md:py-20 lg:py-28 border-b border-white/5" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-6 sm:mb-8 md:mb-12 transition-all duration-700 ${calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <Calculator className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-accent" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">Lease Calculator</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground font-light max-w-2xl mx-auto">
              {calculatorConfig?.subtitle || "Estimate your total lease costs and compare scenarios."}
            </p>
          </div>
          <div className={`transition-all duration-700 ${calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            <LeaseCalculator />
          </div>
        </div>
      </section>
    </div>
  );
}
