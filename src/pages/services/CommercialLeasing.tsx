import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, ArrowRight, Store, Briefcase, MapPin, Target, BarChart3, Handshake, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { ServicePageNav } from "@/components/ServicePageNav";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import commercialLeasingHeroImg from "@/assets/commercial-leasing-hero.jpg";
import { MobileStickyContact } from "@/components/MobileStickyContact";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfGrJYsVrcgm0VGWHtaDD3OGv2loKRqqT8x0cdpZyeT69Qktw/viewform?usp=header";
const stats = [{
  label: "Spaces Leased",
  value: "100+"
}, {
  label: "Square Feet",
  value: "500K+"
}, {
  label: "Active Listings",
  value: "50+"
}, {
  label: "NYC Focus",
  value: "100%"
}];
const processSteps = [{
  step: "01",
  title: "Space Assessment & Positioning",
  description: "Market analysis and optimal pricing strategy."
}, {
  step: "02",
  title: "Marketing & Tenant Outreach",
  description: "Targeted property marketing and curated tenant search."
}, {
  step: "03",
  title: "Negotiation & Lease Execution",
  description: "Deal structuring through closing."
}];
const services = [{
  icon: Target,
  title: "Space Positioning & Marketing",
  description: "Strategic positioning to attract qualified tenants"
}, {
  icon: Handshake,
  title: "Lease Structuring",
  description: "Creative deal structures that protect your interests"
}, {
  icon: Users,
  title: "Tenant Representation",
  description: "Full-service guidance for businesses seeking space"
}, {
  icon: Building2,
  title: "Landlord Representation",
  description: "Complete leasing services for property owners"
}, {
  icon: BarChart3,
  title: "Market Intelligence",
  description: "Data-driven insights for informed decisions"
}, {
  icon: Clock,
  title: "Pop-Up & Short-Term Leasing",
  description: "Flexible lease arrangements for seasonal, temporary, or experiential retail"
}];

// Tenant categories with distinct images for hover effects
const tenantCategories = [{
  icon: Store,
  title: "Retail Tenants",
  description: "Fashion, F&B, specialty retail, and consumer services",
  image: PLACEHOLDER_IMAGES.retail.street
}, {
  icon: Briefcase,
  title: "Restaurant & Hospitality",
  description: "Full-service support from site selection to lease execution",
  image: PLACEHOLDER_IMAGES.retail.storefront
}, {
  icon: Users,
  title: "Wellness & Medical",
  description: "Fitness studios, medical offices, and spas",
  image: PLACEHOLDER_IMAGES.building.glass
}, {
  icon: Building2,
  title: "Professional Services",
  description: "Law firms, financial services, and creative agencies",
  image: PLACEHOLDER_IMAGES.building.exterior
}];

// Simplified Why Bridge - one sentence each
const whyBridge = [{
  number: "01",
  title: "Market Expertise",
  description: "Deep knowledge of NYC retail corridors and office markets."
}, {
  number: "02",
  title: "Speed to Lease",
  description: "Efficient process minimizing vacancy."
}, {
  number: "03",
  title: "Dual Representation",
  description: "Full support for landlords and tenants."
}, {
  number: "04",
  title: "Hands-On Execution",
  description: "Direct involvement at every step."
}];

// Simplified service details - one sentence summaries
const serviceDetails = [{
  title: "Landlord Representation",
  description: "Full-service leasing programs to maximize asset performance.",
  features: ["Space positioning", "Marketing materials", "Tenant screening", "Lease execution"]
}, {
  title: "Tenant Representation",
  description: "Strategic advisory for businesses seeking the right space.",
  features: ["Needs assessment", "Market survey", "Tour coordination", "Negotiation support"]
}, {
  title: "Lease Structuring",
  description: "Expert deal structuring to protect your interests.",
  features: ["Rent optimization", "Concession negotiations", "Use clause terms", "Renewal options"]
}, {
  title: "Marketing Services",
  description: "Powered by our in-house marketing team.",
  features: ["Professional photography", "Digital campaigns", "Broker outreach", "Platform syndication"]
}];
// Landlord Rep details
const landlordRepServices = [
  "Space positioning & pricing strategy",
  "Professional marketing materials",
  "Tenant screening & qualification",
  "Lease negotiation & execution"
];

// Tenant Rep details
const tenantRepServices = [
  "Requirements analysis & budgeting",
  "Market survey & property tours",
  "Lease term negotiation",
  "Move-in coordination"
];

export default function CommercialLeasing() {
  const {
    openContactSheet
  } = useContactSheet();
  const heroReveal = useScrollReveal(0.1, true); // Hero always visible initially
  const statsReveal = useScrollReveal(0.1);
  const processReveal = useScrollReveal(0.1);
  const servicesReveal = useScrollReveal(0.1);
  const categoriesReveal = useScrollReveal(0.1);
  const repReveal = useScrollReveal(0.1);
  const lookingReveal = useScrollReveal(0.1);
  return <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative min-h-[35vh] sm:min-h-[40vh] md:min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center pt-20 sm:pt-24 md:pt-20 lg:pt-24 xl:pt-28 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img src={commercialLeasingHeroImg} alt="NYC retail and commercial streets" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            <Button size="lg" variant="outline" className="font-light border-white/30 hover:bg-white/10" asChild>
              <Link to="/commercial-listings">
                View Our Listings
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ServicesSubNav />
      <ServicePageNav serviceKey="commercial-leasing" />

      {/* Stats Bar */}
      

      {/* Our Services */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={servicesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Our Services</h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              Comprehensive commercial leasing services.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {services.map((service, index) => <div key={service.title} className="px-6 pt-6 pb-4 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]" style={{
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

      {/* Who We Serve - With Hover Effects */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={categoriesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${categoriesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Who We Serve</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Experience across a wide range of commercial tenant types.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {tenantCategories.map((category, index) => <div key={category.title} className={`group relative rounded-lg overflow-hidden aspect-[3/4] cursor-pointer transition-all duration-700 ${categoriesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
            transitionDelay: `${index * 100}ms`
          }}>
                {/* Background Image */}
                <img src={category.image} alt={category.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                  <category.icon className="h-6 w-6 text-accent mb-2" />
                  <h3 className="text-lg font-light mb-1">{category.title}</h3>
                  <p className="text-sm text-muted-foreground font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Landlord & Tenant Rep Combined Section */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={repReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${repReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Full-Service Representation</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Whether you own space or need space, we've got you covered.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Landlord Rep */}
            <div className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${repReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Building2 className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl md:text-2xl font-light mb-2">For Landlords</h3>
              <p className="text-muted-foreground font-light mb-6">
                Full-service leasing programs to maximize your asset's performance and minimize vacancy.
              </p>
              <ul className="space-y-3 mb-6">
                {landlordRepServices.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm font-light">{service}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">100+ Properties</span>
                <span>•</span>
                <span className="font-medium text-foreground">98% Occupancy</span>
              </div>
            </div>
            {/* Tenant Rep */}
            <div className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 delay-100 ${repReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Users className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl md:text-2xl font-light mb-2">For Tenants</h3>
              <p className="text-muted-foreground font-light mb-6">
                Strategic advisory for businesses seeking the right space at the right terms.
              </p>
              <ul className="space-y-3 mb-6">
                {tenantRepServices.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm font-light">{service}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">500+ Tenants</span>
                <span>•</span>
                <span className="font-medium text-foreground">2M+ SF Leased</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Looking for Space? CTA */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-accent/5" ref={lookingReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <div className={`transition-all duration-700 ${lookingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <MapPin className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Looking for Commercial Space?</h2>
            <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
              Tell us about your requirements and our team will curate the perfect options for your business. Fill out our quick intake form to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-light gap-2" asChild>
                <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                  Fill Out Client Form
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="font-light" asChild>
                <Link to="/commercial-listings">
                  View Available Listings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you're leasing space or looking for your next location, we're ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              List Your Space
            </Button>
            <Button size="lg" variant="outline" className="font-light gap-2" asChild>
              <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                Find Your Space
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <MobileStickyContact onContactClick={openContactSheet} />
    </div>;
}