import { Link } from "react-router-dom";
import { Building2, Home, ArrowRight } from "lucide-react";
import { DIVISIONS } from "@/lib/constants";

export const DivisionSelector = () => {
  return (
    <section className="py-20 md:py-28 lg:py-36 border-b border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            Choose Your Path
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Specialized expertise across every sector of New York City real estate
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Commercial & Investment Path */}
          <Link 
            to="/commercial" 
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 hover:border-white/20"
          >
            <div className="p-8 md:p-10 lg:p-12">
              {/* Division Logos Placeholder */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[hsl(210,100%,45%)]/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[hsl(210,100%,55%)]" />
                </div>
                <div className="text-sm text-muted-foreground font-light">
                  <span className="block font-medium text-foreground">{DIVISIONS.commercial.name}</span>
                  <span className="block">{DIVISIONS.investmentSales.name}</span>
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-light mb-3 group-hover:text-foreground transition-colors">
                Commercial & Investment
              </h3>
              
              <p className="text-muted-foreground font-light mb-4">
                {DIVISIONS.commercial.description}
              </p>
              
              <p className="text-sm text-muted-foreground/80 font-light mb-6">
                {DIVISIONS.commercial.tagline}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-light text-foreground/80 group-hover:text-foreground transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210,100%,45%)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          {/* Residential Path */}
          <Link 
            to="/residential" 
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 hover:border-white/20"
          >
            <div className="p-8 md:p-10 lg:p-12">
              {/* Division Logo Placeholder */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[hsl(35,85%,55%)]/20 flex items-center justify-center">
                  <Home className="w-6 h-6 text-[hsl(35,85%,60%)]" />
                </div>
                <div className="text-sm font-medium text-foreground">
                  {DIVISIONS.residential.name}
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-light mb-3 group-hover:text-foreground transition-colors">
                Residential Services
              </h3>
              
              <p className="text-muted-foreground font-light mb-4">
                {DIVISIONS.residential.description}
              </p>
              
              <p className="text-sm text-muted-foreground/80 font-light mb-6">
                {DIVISIONS.residential.tagline}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-light text-foreground/80 group-hover:text-foreground transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(35,85%,55%)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};
