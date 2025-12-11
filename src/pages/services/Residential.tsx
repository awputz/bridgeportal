import { Link } from "react-router-dom";
import { Home, Award, TrendingUp, ArrowRight, Building2, Users, MapPin, CheckCircle, FileText, Calendar, BarChart3, Shield, Briefcase, Target, ExternalLink, Quote, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DIVISIONS } from "@/lib/constants";
import manhattanImg from "@/assets/manhattan-market.jpg";
import brooklynImg from "@/assets/brooklyn-market.jpg";
import queensImg from "@/assets/queens-market.jpg";
import neighborhoodsImg from "@/assets/neighborhoods-map.jpg";
import teamImg from "@/assets/team-collaboration.jpg";
import instagram1 from "@/assets/instagram-1.jpg";
import instagram2 from "@/assets/instagram-2.jpg";
import instagram3 from "@/assets/instagram-3.jpg";
import instagram4 from "@/assets/instagram-4.jpg";
import instagram5 from "@/assets/instagram-5.jpg";
import instagram6 from "@/assets/instagram-6.jpg";

const stats = [
  { label: "Units Represented", value: "500+" },
  { label: "Active Listings", value: "100+" },
  { label: "Landlord Relationships", value: "50+" },
  { label: "Occupancy Rate", value: "98%" },
];

const operationalStats = [
  { value: "30+", label: "Team Members" },
  { value: "$100M+", label: "Annual Volume" },
  { value: "98%", label: "Occupancy Rate" },
  { value: "15+", label: "Years Experience" },
];

const markets = [
  { borough: "Manhattan", image: manhattanImg, areas: ["Upper East Side", "Upper West Side", "Midtown", "Downtown", "Chelsea", "Tribeca", "SoHo", "Greenwich Village"] },
  { borough: "Brooklyn", image: brooklynImg, areas: ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights", "Greenpoint", "Bushwick", "Bed-Stuy"] },
  { borough: "Queens", image: queensImg, areas: ["Long Island City", "Astoria", "Forest Hills", "Flushing", "Jackson Heights"] },
];

const processSteps = [
  { step: "01", title: "Discovery", description: "Share your needs and preferences. Our team analyzes your requirements to understand exactly what you're looking for." },
  { step: "02", title: "Curated Tours", description: "View hand-selected properties that match your criteria. No wasted time on irrelevant options." },
  { step: "03", title: "Application & Negotiation", description: "Expert guidance through paperwork, terms, and any negotiations needed." },
  { step: "04", title: "Move-In Ready", description: "Seamless closing coordination ensuring you're ready to move in on schedule." },
];

const landlordServices = [
  { icon: Shield, title: "Tenant Screening", description: "Comprehensive background, credit, and employment verification" },
  { icon: TrendingUp, title: "Marketing", description: "Professional photography, StreetEasy premium, and syndication" },
  { icon: BarChart3, title: "Rent Optimization", description: "Data-driven pricing to maximize income while minimizing vacancy" },
  { icon: FileText, title: "Underwriting", description: "Comparative financial analysis and absorption tracking" },
  { icon: Target, title: "Market Intelligence", description: "Real-time market data and quarterly reporting" },
  { icon: Building2, title: "Portfolio Management", description: "Full-service management for multi-unit portfolios" },
];

const recentDeals = [
  { address: "250 West 50th Street, #42C", neighborhood: "Hell's Kitchen", type: "Rental", price: "$5,200/mo", date: "Nov 2024", agent: "Sarah Mitchell" },
  { address: "180 Myrtle Avenue, #8F", neighborhood: "Downtown Brooklyn", type: "Rental", price: "$4,800/mo", date: "Nov 2024", agent: "James Chen" },
  { address: "42-15 Crescent Street, #5B", neighborhood: "Long Island City", type: "Sale", price: "$875,000", date: "Oct 2024", agent: "Maria Rodriguez" },
  { address: "301 East 78th Street, #12A", neighborhood: "Upper East Side", type: "Rental", price: "$6,500/mo", date: "Oct 2024", agent: "David Park" },
];

const instagramImages = [instagram1, instagram2, instagram3, instagram4, instagram5, instagram6];

export default function ResidentialServices() {
  const introReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const hpgReveal = useScrollReveal(0.1);
  const underwritingReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const operationalReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const rentersReveal = useScrollReveal(0.1);
  const buyersReveal = useScrollReveal(0.1);
  const portfolioReveal = useScrollReveal(0.1);
  const listingsReveal = useScrollReveal(0.1);
  const testimonialsReveal = useScrollReveal(0.1);
  const dealsReveal = useScrollReveal(0.1);
  const exploreReveal = useScrollReveal(0.1);
  const instagramReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Residential
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in max-w-2xl mx-auto mb-10" style={{ animationDelay: '100ms' }}>
            New York residential advisory for renters, buyers, landlords, and sellers
          </p>
          
          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Button asChild variant="outline" className="font-light">
              <Link to="/contact">Looking to Rent</Link>
            </Button>
            <Button asChild variant="outline" className="font-light">
              <Link to="/contact">Looking to Buy</Link>
            </Button>
            <Button asChild className="font-light">
              <Link to="/contact">Landlord or Seller</Link>
            </Button>
          </div>
          
          {/* StreetEasy Link */}
          <a 
            href="https://streeteasy.com/building/bridge-advisory-group" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-light transition-colors animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            View listings on StreetEasy <ExternalLink className="h-4 w-4" />
          </a>
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

      {/* Platform Intro */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Residential is the dedicated residential division of Bridge Advisory Group, led by Jacob Neiderfer as Director of Residential Leasing and Alex Putzer as co-founder. Operating as a platform managing more than 500 units and over one hundred active listings across Manhattan, Brooklyn, and Queens, we partner with landlords, investors, and residents who expect a sharp process, accurate pricing guidance, and marketing that actually converts.
          </p>
        </div>
      </section>

      {/* Exclusive Portfolio */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={portfolioReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            portfolioReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Exclusive Portfolio</h2>
            <p className="text-muted-foreground font-light mb-8 text-center max-w-2xl mx-auto">
              Buildings we manage across Manhattan, Brooklyn, and Queens
            </p>
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              <Button variant="outline" size="sm" className="font-light">All Boroughs</Button>
              <Button variant="ghost" size="sm" className="font-light">Manhattan</Button>
              <Button variant="ghost" size="sm" className="font-light">Brooklyn</Button>
              <Button variant="ghost" size="sm" className="font-light">Queens</Button>
            </div>
            <div className="p-12 rounded-lg border border-white/10 bg-white/[0.02] text-center">
              <p className="text-muted-foreground font-light">Our exclusive portfolio will be displayed here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Listings */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={listingsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center transition-all duration-700 ${
            listingsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Current Listings</h2>
            <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
              Browse our complete portfolio of available rentals and sales across Manhattan, Brooklyn, and Queens.
            </p>
            <Button asChild className="font-light">
              <a href="https://streeteasy.com/building/bridge-advisory-group" target="_blank" rel="noopener noreferrer">
                View All Listings on StreetEasy <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* For Property Owners - Header */}
      <section className="py-12 md:py-16 border-b border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">For Property Owners & Landlords</h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Full-service solutions for landlords and investors seeking lower vacancy, better quality tenants, and consistent reporting.
          </p>
        </div>
      </section>

      {/* HPG Partnership */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={hpgReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 ${
            hpgReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* HPG Partnership Card */}
            <div className="p-8 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <Building2 className="h-10 w-10 text-accent" />
                <h3 className="text-2xl font-light">HPG Partnership</h3>
              </div>
              <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                Exclusive in-house brokerage for Hudson Property Group's 500+ unit portfolio across New York City.
              </p>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Direct access to ownership and decision-makers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Coordinated marketing and positioning strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Integrated workflows and streamlined communication</span>
                </li>
              </ul>
            </div>

            {/* Backend Underwriting Card */}
            <div className="p-8 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <BarChart3 className="h-10 w-10 text-accent" />
                <h3 className="text-2xl font-light">Backend Underwriting & Analysis</h3>
              </div>
              <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                Data-driven insights and financial analysis to optimize your portfolio's performance.
              </p>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Rent optimization and pricing strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Comparative financial analysis by submarket</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Real-time absorption data and market tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Landlord Services Grid */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Our Services</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Comprehensive residential services designed to maximize your property's potential.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landlordServices.map((service, index) => (
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
                  className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={market.image} 
                      alt={market.borough} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operational Excellence */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.02]" ref={operationalReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            operationalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Operational Excellence</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Backed by the full resources of Bridge Advisory Group
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {operationalStats.map((stat, index) => (
                <div key={stat.label} className="text-center" style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="text-3xl md:text-4xl font-light text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-light">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                <h3 className="text-lg font-light mb-2">In-House Underwriting Team</h3>
                <p className="text-muted-foreground font-light text-sm">Dedicated analysts for pricing and market research</p>
              </div>
              <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                <h3 className="text-lg font-light mb-2">Technology Infrastructure</h3>
                <p className="text-muted-foreground font-light text-sm">Modern tools for tracking, reporting, and communication</p>
              </div>
              <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                <h3 className="text-lg font-light mb-2">Bridge Advisory Ecosystem</h3>
                <p className="text-muted-foreground font-light text-sm">Access to investment sales, capital markets, and advisory</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Renters & Buyers - Header */}
      <section className="py-12 md:py-16 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">For Renters & Buyers</h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Expert representation for those seeking their next home in New York City's competitive market.
          </p>
        </div>
      </section>

      {/* Rental Services */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={rentersReveal.elementRef}>
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

      {/* Buyer Advisory */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={buyersReveal.elementRef}>
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

      {/* Market Intelligence Preview */}
      <section className="py-20 md:py-28 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Market Intelligence</h2>
          <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
            Real-time data and insights from across New York City's residential market.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center">
              <div className="text-3xl font-light text-foreground mb-1">$3,850</div>
              <div className="text-sm text-muted-foreground font-light mb-2">Average Manhattan Rent</div>
              <div className="text-xs text-accent">↑ 4.2% YoY</div>
            </div>
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center">
              <div className="text-3xl font-light text-foreground mb-1">21 Days</div>
              <div className="text-sm text-muted-foreground font-light mb-2">Average Days to Lease</div>
              <div className="text-xs text-accent">↓ 12% YoY</div>
            </div>
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center">
              <div className="text-3xl font-light text-foreground mb-1">96.8%</div>
              <div className="text-sm text-muted-foreground font-light mb-2">Portfolio Occupancy</div>
              <div className="text-xs text-accent">↑ 1.8% YoY</div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" className="font-light">
              <Link to="/research">Quarterly Market Reports</Link>
            </Button>
            <Button asChild variant="outline" className="font-light">
              <Link to="/insights">Neighborhood Insights</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={testimonialsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">What Our Clients Say</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Real stories from renters, buyers, and landlords who've worked with BRIDGE
            </p>
            <div className="max-w-3xl mx-auto p-8 rounded-lg border border-white/10 bg-white/[0.02]">
              <Quote className="h-10 w-10 text-accent/30 mb-6" />
              <p className="text-lg md:text-xl font-light leading-relaxed mb-6 italic">
                "BRIDGE made finding my dream apartment effortless. Their team knew exactly what I was looking for and the AI recommendations were spot-on. Moved in within 3 weeks!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sm font-light">SC</span>
                </div>
                <div>
                  <p className="font-light">Sarah Chen</p>
                  <p className="text-sm text-muted-foreground font-light">Renter • Upper West Side</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Deals */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={dealsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            dealsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Recent Deals</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              A snapshot of our latest transactions across Manhattan, Brooklyn, and Queens
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {recentDeals.map((deal, index) => (
                <div 
                  key={deal.address} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${deal.type === 'Sale' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-muted-foreground'}`}>
                      {deal.type}
                    </span>
                    <span className="text-sm text-muted-foreground font-light">{deal.date}</span>
                  </div>
                  <h3 className="text-lg font-light mb-1">{deal.address}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-3">{deal.neighborhood}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-light text-accent">{deal.price}</span>
                    <span className="text-sm text-muted-foreground font-light">{deal.agent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={exploreReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            exploreReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">Explore More</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <a 
                href="https://streeteasy.com/neighborhoods" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative rounded-lg overflow-hidden aspect-[16/9]"
              >
                <img src={neighborhoodsImg} alt="Neighborhoods" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-light mb-2">Neighborhoods</h3>
                  <p className="text-sm text-muted-foreground font-light">Detailed neighborhood profiles and market insights</p>
                </div>
              </a>
              <Link 
                to="/team"
                className="group relative rounded-lg overflow-hidden aspect-[16/9]"
              >
                <img src={teamImg} alt="Team" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-light mb-2">Team</h3>
                  <p className="text-sm text-muted-foreground font-light">Meet the BRIDGE Residential team</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={instagramReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            instagramReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center mb-12">
              <Instagram className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-light mb-4">Follow BRIDGE Residential</h2>
              <p className="text-muted-foreground font-light mb-6">
                View current listings and stories on Instagram
              </p>
              <Button asChild variant="outline" className="font-light">
                <a href="https://instagram.com/bridgeresidential" target="_blank" rel="noopener noreferrer">
                  Follow on Instagram <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {instagramImages.map((img, index) => (
                <a 
                  key={index}
                  href="https://instagram.com/bridgeresidential" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden group"
                >
                  <img 
                    src={img} 
                    alt={`Instagram post ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Connect with Bridge Residential</h2>
          <p className="text-muted-foreground font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you're looking to rent, buy, or maximize the value of your property, our team is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-light">
              <Link to="/contact">List Your Property</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-light">
              <Link to="/contact">Find Your Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}