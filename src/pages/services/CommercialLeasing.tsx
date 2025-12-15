import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, ArrowRight, Store, Briefcase, MapPin, Target, BarChart3, Handshake, CheckCircle, XCircle, Megaphone, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { DIVISIONS } from "@/lib/constants";
import LeaseCalculator from "@/components/LeaseCalculator";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { useBridgeCalculatorBySection } from "@/hooks/useBridgeCalculators";

const stats = [
  { label: "Spaces Leased", value: "100+" },
  { label: "Square Feet", value: "500K+" },
  { label: "Active Listings", value: "50+" },
  { label: "NYC Focus", value: "100%" },
];

const processSteps = [
  { 
    step: "01", 
    title: "Space Assessment & Positioning", 
    description: "Comprehensive analysis of your space or requirements. Market survey and comparable analysis to establish optimal positioning and pricing." 
  },
  { 
    step: "02", 
    title: "Marketing & Tenant Outreach", 
    description: "For landlords: targeted property marketing and broker outreach. For tenants: curated space search and coordinated tours." 
  },
  { 
    step: "03", 
    title: "Negotiation & Lease Execution", 
    description: "Term sheet negotiation, deal structuring, and full support through lease execution and closing." 
  },
];

const services = [
  { icon: Target, title: "Space Positioning & Marketing", description: "Strategic positioning and comprehensive marketing to attract qualified tenants" },
  { icon: Handshake, title: "Lease Structuring & Negotiation", description: "Creative deal structures and expert negotiation that protect your interests" },
  { icon: Users, title: "Tenant Representation", description: "Full-service guidance for businesses seeking the right space to grow" },
  { icon: Building2, title: "Landlord Representation", description: "Complete leasing services for property owners and investors" },
  { icon: Megaphone, title: "In-House Marketing Team", description: "Professional photography, materials, and digital campaigns created in-house" },
  { icon: BarChart3, title: "Market Intelligence", description: "Data-driven insights and reporting for informed decision-making" },
];

const tenantCategories = [
  { icon: Store, title: "Retail Tenants", description: "From flagship storefronts to neighborhood shops—fashion, F&B, specialty retail, and consumer services" },
  { icon: Briefcase, title: "Restaurant & Hospitality", description: "Full-service support for restaurants, bars, and hospitality concepts from site selection to lease execution" },
  { icon: Users, title: "Wellness & Medical", description: "Healthcare and wellness tenants requiring specialized spaces—fitness studios, medical offices, spas" },
  { icon: Building2, title: "Professional Services", description: "Office space for law firms, financial services, creative agencies, and professional service firms" },
];

const whyBridge = [
  { number: "01", title: "Market Expertise", description: "Deep knowledge of NYC retail corridors and office markets, block by block" },
  { number: "02", title: "Speed to Lease", description: "Efficient process from listing to tenant placement, minimizing vacancy" },
  { number: "03", title: "Dual Representation", description: "Full-service support for both landlords and tenants under one roof" },
  { number: "04", title: "Hands-On Execution", description: "Direct involvement in every step—no handoffs, no dropped balls" },
];

const comparisonItems = [
  { feature: "Market Analysis", bridge: true, basic: false },
  { feature: "Professional Marketing Materials", bridge: true, basic: false },
  { feature: "Extensive Tenant Network", bridge: true, basic: false },
  { feature: "In-House Marketing Team", bridge: true, basic: false },
  { feature: "Lease Negotiation Support", bridge: true, basic: true },
  { feature: "Post-Lease Transaction Support", bridge: true, basic: false },
  { feature: "Regular Activity Reporting", bridge: true, basic: false },
];

const serviceDetails = [
  {
    title: "Landlord Representation",
    description: "Full-service leasing programs for commercial property owners seeking to maximize asset performance.",
    deliverables: ["Space positioning strategy", "Professional marketing materials", "Tenant qualification and screening", "Lease negotiation and execution", "Regular activity reporting"],
    timeline: "2-6 months typical",
    bestFor: "Property owners, investors, developers"
  },
  {
    title: "Tenant Representation",
    description: "Strategic advisory for businesses seeking the right space to operate and grow.",
    deliverables: ["Needs assessment and site criteria", "Market survey and space shortlist", "Tour coordination", "Term sheet negotiation", "Lease review and execution support"],
    timeline: "1-4 months typical",
    bestFor: "Retailers, restaurants, office tenants"
  },
  {
    title: "Lease Structuring & Negotiation",
    description: "Expert deal structuring to protect your interests and maximize value.",
    deliverables: ["Base rent optimization", "Escalation and expense structures", "Concession negotiations (TI, free rent)", "Use clause and exclusivity terms", "Renewal and termination options"],
    timeline: "Integrated with representation",
    bestFor: "Both landlords and tenants"
  },
  {
    title: "Marketing & Listing Services",
    description: "Powered by our fully integrated in-house marketing team.",
    deliverables: ["Professional photography and video", "Brochures and offering memoranda", "Digital marketing campaigns", "Broker outreach and networking", "StreetEasy and platform syndication"],
    timeline: "Ongoing throughout engagement",
    bestFor: "Landlords seeking maximum exposure"
  },
];

export default function CommercialLeasing() {
  const { openContactSheet } = useContactSheet();
  const { data: calculatorConfig } = useBridgeCalculatorBySection("commercial-leasing", "main_calculator");
  const heroReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const categoriesReveal = useScrollReveal(0.1);
  const whyReveal = useScrollReveal(0.1);
  const detailsReveal = useScrollReveal(0.1);
  const comparisonReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);
  const teamReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.retail.street} 
            alt="NYC retail and commercial streets" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Bridge Commercial
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-6 md:mb-10">
            NYC Retail & Office Leasing Specialists
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              List Your Space
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="font-light border-white/30 hover:bg-white/10"
              asChild
            >
              <a href="https://www.costar.com/agent/alexander-smotritsky/broker-profile" target="_blank" rel="noopener noreferrer">
                View Our Listings
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="commercial-leasing" />

      {/* Stats Bar */}
      <section className="py-12 md:py-16 border-b border-white/5 bg-white/[0.02]" ref={statsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 transition-all duration-700 ${
            statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-light text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Commercial provides strategic leasing services for retail and office spaces throughout NYC. We focus on matching the right tenants with the right spaces while helping landlords position assets for long-term performance.
          </p>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={processReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Our Process</h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              A proven three-step approach that delivers results for both tenants and landlords.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {processSteps.map((item, index) => (
                <div 
                  key={item.step} 
                  className="p-8 rounded-lg border border-white/10 bg-white/[0.02] text-center"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-5xl font-light text-accent/50 mb-4">{item.step}</div>
                  <h3 className="text-xl font-light mb-3">{item.title}</h3>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Our Services</h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              Comprehensive commercial leasing services tailored to your needs.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {services.map((service, index) => (
                <div 
                  key={service.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <service.icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="text-lg font-light mb-2">{service.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve with Image */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={categoriesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center transition-all duration-700 ${
            categoriesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Who We Serve</h2>
              <p className="text-muted-foreground font-light mb-8">
                Experience across a wide range of commercial tenant types.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {tenantCategories.map((category, index) => (
                  <div 
                    key={category.title} 
                    className="p-4 rounded-lg border border-white/10 bg-white/[0.02] flex items-start gap-4"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <category.icon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base font-light mb-1">{category.title}</h3>
                      <p className="text-muted-foreground font-light text-sm">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.retail.storefront} 
                alt="NYC retail storefront" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Bridge Advisory Group */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={whyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            whyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Why Bridge Advisory Group</h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              What sets us apart in NYC's competitive commercial leasing market.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {whyBridge.map((item, index) => (
                <div 
                  key={item.number} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02]"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="text-4xl font-light text-accent/50 mb-4">{item.number}</div>
                  <h3 className="text-lg font-light mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={detailsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            detailsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Service Details</h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              Comprehensive support at every stage of your commercial real estate transaction.
            </p>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {serviceDetails.map((service, index) => (
                <div 
                  key={service.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-light mb-3">{service.title}</h3>
                  <p className="text-muted-foreground font-light text-sm mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    {service.deliverables.map((item) => (
                      <li key={item} className="text-muted-foreground font-light text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-light">Timeline:</span>
                      <span className="font-light">{service.timeline}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground font-light">Best for:</span>
                      <span className="font-light">{service.bestFor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={comparisonReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className={`transition-all duration-700 ${
            comparisonReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Bridge Commercial vs. Basic Broker</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              See what sets our full-service approach apart.
            </p>
            <div className="rounded-lg border border-white/10 overflow-hidden">
              <div className="grid grid-cols-3 bg-white/[0.04] p-4">
                <div className="font-light">Feature</div>
                <div className="font-light text-center">Bridge Commercial</div>
                <div className="font-light text-center">Basic Broker</div>
              </div>
              {comparisonItems.map((item, index) => (
                <div key={item.feature} className="grid grid-cols-3 p-4 border-t border-white/10">
                  <div className="text-muted-foreground font-light text-sm">{item.feature}</div>
                  <div className="text-center">
                    {item.bridge ? <CheckCircle className="h-5 w-5 text-accent mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground/30 mx-auto" />}
                  </div>
                  <div className="text-center">
                    {item.basic ? <CheckCircle className="h-5 w-5 text-accent mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground/30 mx-auto" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lease Calculator */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              {calculatorConfig?.title || "Lease Calculator"}
            </h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              {calculatorConfig?.subtitle || "Estimate your total lease costs and compare different lease structures."}
            </p>
          </div>
          <div className={`transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '200ms' }}>
            <LeaseCalculator config={calculatorConfig ? {
              title: calculatorConfig.title || undefined,
              subtitle: calculatorConfig.subtitle || undefined,
              defaults: calculatorConfig.input_config?.defaults as any,
            } : undefined} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-10 max-w-2xl mx-auto">
            Whether you're looking to lease space or find the perfect tenant, Bridge Commercial is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              List Your Space
            </Button>
            <Button asChild variant="outline" size="lg" className="font-light">
              <Link to="/contact">Find Space</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
