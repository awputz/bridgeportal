import { useScrollReveal } from "@/hooks/useScrollReveal";

const partners = [
  { name: "Partner 1", placeholder: true },
  { name: "Partner 2", placeholder: true },
  { name: "Partner 3", placeholder: true },
  { name: "Partner 4", placeholder: true },
  { name: "Partner 5", placeholder: true },
];

export const PartnerLogos = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section 
      ref={elementRef}
      className={`py-12 md:py-16 border-t border-border/30 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-wider mb-8">
          Trusted By Industry Leaders
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="w-24 h-12 md:w-32 md:h-16 flex items-center justify-center"
            >
              {partner.placeholder ? (
                <div className="w-full h-full rounded bg-muted/50 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground/50">Logo</span>
                </div>
              ) : (
                <img 
                  src={partner.name} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
