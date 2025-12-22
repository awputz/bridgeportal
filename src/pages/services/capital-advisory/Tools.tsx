import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CapitalAdvisoryTools = () => {
  const calculatorReveal = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 bg-gradient-to-b from-background to-muted/30">
        <ServicesSubNav />
        <ServicePageNav serviceKey="capital-advisory" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Underwriting Tools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze potential investments with our comprehensive underwriting calculator
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-background">
        <div 
          ref={calculatorReveal.elementRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <InvestmentCalculator />
        </div>
      </section>
    </div>
  );
};

export default CapitalAdvisoryTools;
