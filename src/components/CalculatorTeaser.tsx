import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, DollarSign, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const CalculatorTeaser = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section 
      ref={elementRef}
      className={`py-16 md:py-24 bg-black/20 backdrop-blur-lg transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Calculator className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Calculate Your Investment Returns
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Use our powerful investment calculator to model potential returns, analyze cap rates, 
            and make informed decisions about your NYC real estate investments.
          </p>

          {/* Sample Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/10">
              <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">$2.5M</p>
              <p className="text-sm text-muted-foreground">Sample Investment</p>
            </div>
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/10">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">5.2%</p>
              <p className="text-sm text-muted-foreground">Projected Cap Rate</p>
            </div>
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/10">
              <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">$130K</p>
              <p className="text-sm text-muted-foreground">Annual NOI</p>
            </div>
          </div>

          <Button asChild size="lg" className="rounded-full">
            <Link to="/services/investment-sales#calculator">
              Try the Calculator
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
