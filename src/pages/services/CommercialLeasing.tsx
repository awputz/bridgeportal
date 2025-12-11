import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, ArrowRight, Store, Briefcase, MapPin, Target, BarChart3, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DIVISIONS } from "@/lib/constants";
import LeaseCalculator from "@/components/LeaseCalculator";

const stats = [
  { label: "Spaces Leased", value: "500+" },
  { label: "Square Feet", value: "2M+" },
  { label: "Active Listings", value: "75+" },
  { label: "NYC Focus", value: "100%" },
];

const processSteps = [
  { 
    step: "01", 
    title: "Assessment", 
    description: "Space analysis and requirements gathering. Market survey and comparable analysis to establish positioning." 
  },
  { 
    step: "02", 
    title: "Marketing / Search", 
    description: "For landlords: property marketing and targeted outreach. For tenants: curated space search and tours." 
  },
  { 
    step: "03", 
    title: "Negotiation", 
    description: "Term sheet negotiation, deal structuring, and support through lease execution." 
  },
];

const services = [
  { icon: Target, title: "Space Positioning", description: "Strategic positioning to attract the right tenants" },
  { icon: Handshake, title: "Lease Structuring", description: "Creative deal structures that work for both parties" },
  { icon: Users, title: "Tenant Representation", description: "Expert guidance for businesses seeking space" },
  { icon: Building2, title: "Landlord Representation", description: "Full-service leasing for property owners" },
  { icon: TrendingUp, title: "Marketing & Outreach", description: "Targeted campaigns to qualified prospects" },
  { icon: BarChart3, title: "Market Intelligence", description: "Data-driven insights for informed decisions" },
];

const tenantCategories = [
  { icon: Store, title: "Retail Tenants", description: "Fashion, F&B, specialty retail, and consumer services" },
  { icon: Briefcase, title: "Restaurant & Hospitality", description: "Full-service, fast casual, bars, and entertainment venues" },
  { icon: Users, title: "Wellness & Medical", description: "Fitness studios, medical offices, spas, and health services" },
  { icon: Building2, title: "Professional Services", description: "Office users, co-working, legal, financial, and creative firms" },
];

const assetTypes = [
  { 
    title: "Office", 
    types: ["Class A & B", "Creative & Loft", "Flex Space", "Medical Office"],
    description: "From trophy towers to creative lofts, we handle the full spectrum of office assets."
  },
  { 
    title: "Retail", 
    types: ["Street-Level", "Mall & Shopping Center", "Pop-Up & Short-Term", "Restaurant Space"],
    description: "Prime retail corridors and emerging neighborhoods across all five boroughs."
  },
  { 
    title: "Industrial & Specialty", 
    types: ["Warehouse", "Showroom", "Studio", "Specialty"],
    description: "Unique spaces for unique businesses, from showrooms to production facilities."
  },
];

const whyBridge = [
  { title: "Local Expertise", description: "Deep knowledge of NYC's commercial landscape, block by block" },
  { title: "Principal-Level Thinking", description: "We approach every deal as if it were our own" },
  { title: "Full-Service Platform", description: "Investment sales, leasing, and advisory under one roof" },
  { title: "Data-Driven Approach", description: "Market intelligence that drives smarter decisions" },
];

export default function CommercialLeasing() {
  const statsReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const categoriesReveal = useScrollReveal(0.1);
  const tenantReveal = useScrollReveal(0.1);
  const landlordReveal = useScrollReveal(0.1);
  const assetsReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);
  const whyReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Commercial Leasing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '100ms' }}>
            NYC Retail & Office Leasing Specialists
          </p>
        </div>
      </section>

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
      <section className="py-20 md:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Commercial Leasing focuses on matching the right tenants with the right spaces while helping landlords position assets for long-term performance. Our team provides tenant and landlord representation across office, retail, and specialty assets throughout New York City.
          </p>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={processReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Our Process</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              A proven three-step approach that delivers results for both tenants and landlords.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
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
      <section className="py-20 md:py-28 border-b border-white/5" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Our Services</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Comprehensive commercial leasing services tailored to your needs.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Tenant Categories */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={categoriesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            categoriesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Tenant Categories We Serve</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Experience across a wide range of commercial tenant types.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tenantCategories.map((category, index) => (
                <div 
                  key={category.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <category.icon className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-lg font-light mb-2">{category.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Tenants */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={tenantReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            tenantReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">For Tenants</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Strategic advisory for businesses seeking the right space to grow and thrive.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Comprehensive needs assessment for location, size, and budget requirements</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Curated shortlist and coordinated tours across relevant spaces</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Term sheet negotiation and support through lease execution</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Post-lease support including build-out coordination</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Renewal and expansion advisory for existing locations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* For Landlords */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={landlordReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            landlordReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">For Landlords</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Full-service leasing programs designed to maximize asset performance and NOI.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Lease-up and repositioning strategy for office and retail assets</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Professional marketing plans, offering materials, and digital presence</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Targeted outreach to qualified tenants and broker community</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Regular reporting on activity, tours, offers, and market feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Deal structuring and negotiation to protect your interests</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Asset Types */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={assetsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            assetsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Asset Types</h2>
            </div>
            <p className="text-muted-foreground font-light mb-10 max-w-3xl leading-relaxed">
              Expertise across the full spectrum of commercial real estate assets in New York City.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {assetTypes.map((asset, index) => (
                <div 
                  key={asset.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-light mb-3">{asset.title}</h3>
                  <p className="text-muted-foreground font-light text-sm mb-4">{asset.description}</p>
                  <ul className="space-y-2">
                    {asset.types.map((type) => (
                      <li key={type} className="text-muted-foreground font-light text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-accent rounded-full" />
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lease Calculator */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={calculatorReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            calculatorReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Lease Calculator</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Estimate total lease value and monthly payments for your commercial space.
            </p>
            <LeaseCalculator />
          </div>
        </div>
      </section>

      {/* Why Bridge */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={whyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            whyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Why Bridge</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              What sets us apart in NYC's competitive commercial leasing market.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyBridge.map((item, index) => (
                <div 
                  key={item.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <h3 className="text-lg font-light mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're a tenant seeking space or a landlord looking to lease up, Bridge Commercial is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-light">
              <Link to="/contact">List Your Space</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light">
              <Link to="/contact">Find Your Space</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
