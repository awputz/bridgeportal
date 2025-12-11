import { Link } from "react-router-dom";
import { Home, Award, TrendingUp, ArrowRight, Building2, Users, MapPin, CheckCircle, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DIVISIONS } from "@/lib/constants";

const stats = [
  { label: "Transactions Closed", value: "500+" },
  { label: "Properties Managed", value: "150+" },
  { label: "Neighborhoods Served", value: "25+" },
  { label: "Client Satisfaction", value: "98%" },
];

const markets = [
  { borough: "Manhattan", areas: ["Upper East Side", "Upper West Side", "Midtown", "Downtown", "Chelsea", "Tribeca"] },
  { borough: "Brooklyn", areas: ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights", "Greenpoint"] },
  { borough: "Queens", areas: ["Long Island City", "Astoria", "Forest Hills", "Flushing"] },
];

const processSteps = [
  { step: "01", title: "Initial Consultation", description: "We discuss your goals, requirements, and timeline to understand exactly what you need." },
  { step: "02", title: "Search & Strategy", description: "For renters/buyers, we curate options. For landlords, we develop pricing and marketing strategy." },
  { step: "03", title: "Showings & Marketing", description: "Coordinated tours for seekers. Professional listings and outreach for owners." },
  { step: "04", title: "Negotiation & Close", description: "Expert negotiation and support through application, contract, and closing." },
];

export default function ResidentialServices() {
  const introReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const landlordReveal = useScrollReveal(0.1);
  const managementReveal = useScrollReveal(0.1);
  const marketingReveal = useScrollReveal(0.1);
  const rentersReveal = useScrollReveal(0.1);
  const buyersReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const advisoryReveal = useScrollReveal(0.1);
  const resourcesReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Residential
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '100ms' }}>
            Luxury leasing and sales for owners, renters, and buyers across New York
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
            Bridge Residential is the dedicated residential division of Bridge Advisory Group. We partner with landlords, investors, and residents who expect a sharp process, accurate pricing guidance, and marketing that actually converts. Our team manages leasing pipelines, listing strategy, and transactions across prime New York neighborhoods.
          </p>
        </div>
      </section>

      {/* For Property Owners - Header */}
      <section className="py-12 md:py-16 border-b border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">For Property Owners</h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Full-service solutions for landlords and investors seeking lower vacancy, better quality tenants, and consistent reporting.
          </p>
        </div>
      </section>

      {/* Section 1: Building-Wide Leasing Programs */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={landlordReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            landlordReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Home className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Building-Wide Leasing Programs</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Comprehensive leasing programs designed to maximize occupancy and rental income across your entire portfolio.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Full-service leasing and listing programs tailored to your building</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Pricing and unit positioning strategy based on real-time market data</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Weekly reporting and real-time feedback on showings and inquiries</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Vacancy reduction strategies and tenant retention programs</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Property Management Support */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={managementReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            managementReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Property Management Support</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Operational support to ensure your properties run smoothly and profitably.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Comprehensive tenant screening and placement services</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Lease administration and renewal management</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Market rent analysis by building and submarket</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Coordination with property management teams</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Marketing & Positioning */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={marketingReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            marketingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Marketing & Positioning</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Professional marketing that showcases your property's best features and reaches qualified tenants.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Professional photography, video tours, and floor plans</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>StreetEasy premium listings and syndication to major platforms</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Social media and digital marketing campaigns</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Broker outreach and exclusive network access</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* For Renters & Buyers - Header */}
      <section className="py-12 md:py-16 border-b border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">For Renters & Buyers</h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Expert representation for those seeking their next home in New York City's competitive market.
          </p>
        </div>
      </section>

      {/* Section 4: Rental Services */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={rentersReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            rentersReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Rental Services</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Dedicated representation for renters navigating New York's competitive rental market.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Personalized search based on your budget, neighborhood preferences, and must-haves</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Access to exclusive and off-market opportunities through Bridge relationships</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Neighborhood expertise and guidance on emerging areas</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Application support and negotiation assistance</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Buyer Advisory */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={buyersReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            buyersReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Award className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Buyer Advisory</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Strategic guidance for buyers looking to purchase in New York City.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Advisory on value, timing, and neighborhood positioning</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Transaction support from initial offer through closing</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Investment analysis for buyer-investors seeking rental income</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Co-op and condo board package preparation assistance</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Markets We Serve */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={marketsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            marketsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Markets We Serve</h2>
            </div>
            <p className="text-muted-foreground font-light mb-10 max-w-3xl leading-relaxed">
              Deep expertise across New York City's most sought-after residential neighborhoods.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {markets.map((market, index) => (
                <div 
                  key={market.borough} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-light mb-4">{market.borough}</h3>
                  <ul className="space-y-2">
                    {market.areas.map((area) => (
                      <li key={area} className="text-muted-foreground font-light text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-accent rounded-full" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={processReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <Calendar className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">How It Works</h2>
            </div>
            <p className="text-muted-foreground font-light mb-10 max-w-3xl leading-relaxed">
              A streamlined process designed to get you results efficiently.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((item, index) => (
                <div 
                  key={item.step} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl font-light text-accent/50 mb-4">{item.step}</div>
                  <h3 className="text-lg font-light mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advisory And Market Intel */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={advisoryReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            advisoryReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Advisory & Market Intelligence</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8 max-w-3xl leading-relaxed">
              Data-driven support for owners and clients making informed real estate decisions.
            </p>
            <ul className="space-y-4 text-muted-foreground font-light">
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Market rent analysis by building and submarket</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Renewal and retention strategies to minimize turnover</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Opinions of value for single units and small portfolios</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Quarterly market reports and trend analysis</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={resourcesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            resourcesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <FileText className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Resources</h2>
            </div>
            <p className="text-muted-foreground font-light mb-10 max-w-3xl leading-relaxed">
              Helpful guides and documents for renters and property owners.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]">
                <CheckCircle className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-light mb-2">Rental Application Requirements</h3>
                <p className="text-muted-foreground font-light text-sm">What you need to apply for an apartment in NYC.</p>
              </div>
              <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]">
                <FileText className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-light mb-2">Legal Documents Guide</h3>
                <p className="text-muted-foreground font-light text-sm">Understanding leases, rider clauses, and your rights.</p>
              </div>
              <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]">
                <TrendingUp className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-light mb-2">Market Reports</h3>
                <p className="text-muted-foreground font-light text-sm">Quarterly insights on NYC's residential market.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're a landlord looking to maximize your investment or seeking your next home, Bridge Residential is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-light">
              <Link to="/contact">List Your Property</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light">
              <Link to="/contact">Find Your Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
