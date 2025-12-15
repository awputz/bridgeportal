import { DollarSign, Clock, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";

const pricingTiers = [
  {
    category: "Highway Boards",
    description: "High-traffic highway-facing billboards",
    priceRange: "$15,000 - $50,000/month",
    minTerm: "3 months",
    includes: ["Production coordination", "Installation", "Basic reporting"]
  },
  {
    category: "Building Wraps",
    description: "Large-format building installations",
    priceRange: "$25,000 - $100,000/month",
    minTerm: "6 months",
    includes: ["Creative sizing", "Permitting support", "Installation & removal"]
  },
  {
    category: "Street Level",
    description: "Neighborhood and transit-adjacent boards",
    priceRange: "$5,000 - $20,000/month",
    minTerm: "1 month",
    includes: ["Flexible terms", "Quick turnaround", "Location selection"]
  },
  {
    category: "Digital Displays",
    description: "Rotating digital billboard placements",
    priceRange: "$8,000 - $35,000/month",
    minTerm: "1 month",
    includes: ["Multiple creatives", "Dayparting options", "Real-time updates"]
  }
];

export default function Rates() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const pricingReveal = useScrollReveal(0.1);
  const termsReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16" ref={heroReveal.elementRef}>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Rates & Availability
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            Competitive pricing with flexible terms for campaigns of all sizes
          </p>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="billboard" />

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Billboard offers direct landlord pricing without the markup of traditional media buyers. Our rates vary by location, format, and campaign duration. Contact us for a custom quote based on your specific needs.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={pricingReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            pricingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Pricing Guide</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              General pricing ranges by format. Actual rates depend on specific location and availability.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {pricingTiers.map((tier, index) => (
              <div 
                key={tier.category}
                className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${
                  pricingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-light mb-2">{tier.category}</h3>
                <p className="text-sm text-muted-foreground font-light mb-4">{tier.description}</p>
                <div className="text-2xl font-light text-accent mb-2">{tier.priceRange}</div>
                <p className="text-sm text-muted-foreground font-light mb-4">Min term: {tier.minTerm}</p>
                <ul className="space-y-2">
                  {tier.includes.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground font-light flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms & Process */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={termsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 transition-all duration-700 ${
            termsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Clock className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl font-light">Flexible Terms</h2>
              </div>
              <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                We work with clients to structure agreements that match campaign objectives and budgets.
              </p>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Short-term campaigns from 1 month</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Annual placements with volume discounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Seasonal and event-based campaigns</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <FileText className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-accent" />
                <h2 className="text-2xl md:text-3xl font-light">Process</h2>
              </div>
              <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                From inquiry to installation, we handle the details.
              </p>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Location selection and availability check</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Creative sizing and production coordination</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Installation and campaign monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Get A Custom Quote</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Contact Bridge Billboard to discuss your campaign and receive a tailored proposal.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Request Rates
          </Button>
        </div>
      </section>
    </div>
  );
}
