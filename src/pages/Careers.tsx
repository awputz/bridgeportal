import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Briefcase, Users, TrendingUp, Award, MapPin, Clock, ArrowRight, Shield, Zap, Target, Heart } from "lucide-react";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { SEOHelmet } from "@/components/SEOHelmet";

const openPositions = [
  {
    title: "Investment Sales Associate",
    department: "Investment Sales",
    location: "Manhattan, NY",
    type: "Full-time",
    description: "Join our investment sales team to work on acquisitions and dispositions across NYC. Ideal for candidates with 2-4 years of commercial real estate experience."
  },
  {
    title: "Residential Leasing Agent",
    department: "Residential",
    location: "Manhattan, NY",
    type: "Full-time",
    description: "Work with renters and landlords across our exclusive portfolio of 500+ units. Looking for licensed agents with strong client service skills."
  },
  {
    title: "Commercial Leasing Associate",
    department: "Commercial Leasing",
    location: "Manhattan, NY",
    type: "Full-time",
    description: "Represent tenants and landlords in retail and office leasing transactions. Experience in NYC commercial real estate preferred."
  },
  {
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Manhattan, NY",
    type: "Full-time",
    description: "Support our in-house marketing team with property marketing, digital campaigns, and creative production. Design and marketing experience required."
  },
];

// Combined "Why Bridge" values - tight, scannable
const whyBridgeValues = [
  { icon: TrendingUp, title: "Growth", desc: "Clear career paths with mentorship from senior leadership." },
  { icon: Users, title: "Culture", desc: "Collaborative environment where wins are celebrated." },
  { icon: Award, title: "Compensation", desc: "Industry-leading commission structures and benefits." },
  { icon: Shield, title: "Integrity", desc: "Transparency and honest communication in everything." },
  { icon: Zap, title: "Speed", desc: "Streamlined processes that respect your time." },
  { icon: Target, title: "Excellence", desc: "Highest standards in every transaction." },
];

export default function Careers() {
  const heroReveal = useScrollReveal(0.1);
  const positionsReveal = useScrollReveal(0.1);
  const whyBridgeReveal = useScrollReveal(0.1);
  const cultureReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      <SEOHelmet 
        title="Careers | Bridge Advisory Group - Join Our Team"
        description="Build your career at one of NYC's fastest-growing real estate advisory firms. Explore open positions in investment sales, residential, commercial leasing, and more."
        path="/careers"
      />
      
      {/* Hero with Image */}
      <section className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] min-h-[280px] sm:min-h-[320px] md:min-h-[400px] flex items-end pb-8 sm:pb-12 md:pb-16" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.office.modern} 
            alt="Modern office workspace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-3 sm:mb-4">
            Join Our Team
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-4 sm:mb-6">
            Build your career at one of NYC's fastest-growing real estate advisory firms
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10">
            <div className="text-center">
              <div className="text-lg sm:text-2xl md:text-3xl font-light text-accent">50+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-light">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl md:text-3xl font-light text-accent">7</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-light">Divisions</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl md:text-3xl font-light text-accent">5</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-light">Boroughs Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions - MOVED UP */}
      <section className="py-10 sm:py-12 md:py-20 border-b border-white/5" ref={positionsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`transition-all duration-700 ${
            positionsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-3 sm:mb-4 text-center">Open Positions</h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-light mb-6 sm:mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              Explore current opportunities to join the Bridge team.
            </p>
            <div className="space-y-3 sm:space-y-4">
              {openPositions.map((position, index) => (
                <div 
                  key={position.title} 
                  className="p-3 sm:p-4 md:p-5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-light mb-1">{position.title}</h3>
                      <p className="text-sm text-accent font-light">{position.department}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-light">
                        <MapPin className="h-3 w-3" />
                        {position.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-light">
                        <Clock className="h-3 w-3" />
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-light text-sm mb-3">{position.description}</p>
                  <Button asChild variant="outline" size="sm" className="font-light">
                    <Link to="/contact">
                      Apply Now <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Bridge - COMBINED with Values */}
      <section className="py-12 md:py-20 border-b border-white/5 bg-white/[0.01]" ref={whyBridgeReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            whyBridgeReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-3 sm:mb-4 text-center">Why Bridge Advisory Group</h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-light mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
              We invest in our people and provide the tools, training, and support to help you succeed.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {whyBridgeValues.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.title} 
                    className="p-3 sm:p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent mb-1.5 sm:mb-2" />
                    <h3 className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{item.title}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section with Image */}
      <section className="py-12 md:py-20 border-b border-white/5" ref={cultureReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            cultureReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.office.teamWork} 
                alt="Team collaboration at Bridge" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-light mb-4">Our Culture</h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-4 text-sm">
                At Bridge, great work happens when talented people collaborate in a supportive environment. Our team is built on mutual respect, open communication, and a shared commitment to excellence.
              </p>
              <p className="text-muted-foreground font-light leading-relaxed text-sm">
                We celebrate wins together, learn from challenges, and continuously push each other to grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-4">Don't See a Fit?</h2>
          <p className="text-muted-foreground font-light mb-6 max-w-2xl mx-auto text-sm">
            We're always looking for talented individuals. Send us your resume and tell us how you can contribute.
          </p>
          <Button asChild size="lg" className="font-light">
            <Link to="/contact">Submit Your Resume</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}