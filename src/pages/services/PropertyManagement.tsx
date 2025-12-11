import { Link } from "react-router-dom";
import { Building2, BarChart3, Shield, TrendingUp, FileText, Target, Users, CheckCircle, MapPin, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
const stats = [{
  label: "Units Managed",
  value: "500+"
}, {
  label: "Occupancy Rate",
  value: "98%"
}, {
  label: "Landlord Relationships",
  value: "50+"
}, {
  label: "Years Experience",
  value: "15+"
}];
const services = [{
  icon: Shield,
  title: "Tenant Screening",
  description: "Comprehensive background, credit, and employment verification"
}, {
  icon: TrendingUp,
  title: "Marketing",
  description: "Professional photography, StreetEasy premium, and syndication"
}, {
  icon: BarChart3,
  title: "Rent Optimization",
  description: "Data-driven pricing to maximize income while minimizing vacancy"
}, {
  icon: FileText,
  title: "Underwriting",
  description: "Comparative financial analysis and absorption tracking"
}, {
  icon: Target,
  title: "Market Intelligence",
  description: "Real-time market data and quarterly reporting"
}, {
  icon: Building2,
  title: "Portfolio Management",
  description: "Full-service management for multi-unit portfolios"
}];
const operationalStats = [{
  value: "30+",
  label: "Team Members"
}, {
  value: "$100M+",
  label: "Annual Volume"
}, {
  value: "98%",
  label: "Occupancy Rate"
}, {
  value: "15+",
  label: "Years Experience"
}];
const markets = [{
  borough: "Manhattan",
  areas: ["Upper East Side", "Upper West Side", "Midtown", "Downtown", "Chelsea", "Tribeca"]
}, {
  borough: "Brooklyn",
  areas: ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights", "Greenpoint", "Bushwick"]
}, {
  borough: "Queens",
  areas: ["Long Island City", "Astoria", "Forest Hills", "Flushing", "Jackson Heights"]
}];
export default function PropertyManagement() {
  const {
    openContactSheet
  } = useContactSheet();
  const statsReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const hpgReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const marketsReveal = useScrollReveal(0.1);
  const operationalReveal = useScrollReveal(0.1);
  const calculatorReveal = useScrollReveal(0.1);
  return <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
            Bridge Property Management
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light animate-fade-in max-w-2xl mx-auto mb-10" style={{
          animationDelay: '100ms'
        }}>
            Full-service portfolio management for landlords and institutional investors across New York City
          </p>
          <Button size="lg" className="font-light animate-fade-in" style={{
          animationDelay: '200ms'
        }} onClick={openContactSheet}>
            Partner With Us
          </Button>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="property-management" />

      {/* Stats Bar */}
      <section className="py-12 md:py-16 border-b border-white/5 bg-white/[0.02]" ref={statsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 transition-all duration-700 ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat, index) => <div key={stat.label} className="text-center" style={{
            transitionDelay: `${index * 100}ms`
          }}>
                <div className="text-3xl md:text-4xl font-light text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-light">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Bridge Property Management delivers institutional-quality services for landlords and investors seeking lower vacancy, better quality tenants, and consistent reporting. Our platform manages 500+ units across Manhattan, Brooklyn, and Queens with a focus on operational excellence and data-driven decision making.
          </p>
        </div>
      </section>

      {/* HPG Partnership & Underwriting */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={hpgReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 ${hpgReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

      {/* Services Grid */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Our Services</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Comprehensive property management services designed to maximize your portfolio's potential.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => <div key={service.title} className="p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]" style={{
              transitionDelay: `${index * 50}ms`
            }}>
                  <service.icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="text-lg font-light mb-2">{service.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{service.description}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Markets We Serve */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-white/[0.01]" ref={marketsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${marketsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-4 mb-6 justify-center">
              <MapPin className="h-10 w-10 text-accent" />
              <h2 className="text-3xl md:text-4xl font-light">Markets We Serve</h2>
            </div>
            <p className="text-muted-foreground font-light mb-10 max-w-3xl leading-relaxed text-center mx-auto">
              Deep expertise across New York City's most sought-after residential neighborhoods.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {markets.map((market, index) => <div key={market.borough} className="p-6 rounded-lg border border-white/10 bg-white/[0.02]" style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <h3 className="text-xl font-light mb-4">{market.borough}</h3>
                  <ul className="space-y-2">
                    {market.areas.map(area => <li key={area} className="text-muted-foreground font-light text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-accent rounded-full" />
                        {area}
                      </li>)}
                  </ul>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Operational Excellence */}
      <section className="py-20 md:py-28 border-b border-white/5" ref={operationalReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${operationalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-center">Operational Excellence</h2>
            <p className="text-muted-foreground font-light mb-12 text-center max-w-2xl mx-auto">
              Backed by the full resources of Bridge Advisory Group
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {operationalStats.map((stat, index) => <div key={stat.label} className="text-center" style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <div className="text-3xl md:text-4xl font-light text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-light">{stat.label}</div>
                </div>)}
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

      {/* Portfolio Analysis Calculator */}
      

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Partner with Bridge Property Management</h2>
          <p className="text-muted-foreground font-light mb-10 max-w-2xl mx-auto">
            Whether you're managing a single building or a multi-property portfolio, our team is ready to help you optimize performance and reduce vacancy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Schedule a Consultation
            </Button>
            <Button asChild variant="outline" size="lg" className="font-light">
              <Link to="/services/residential">View Residential Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>;
}