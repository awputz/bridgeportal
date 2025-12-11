import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Briefcase, Users, TrendingUp, Award, MapPin, Clock, ArrowRight } from "lucide-react";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

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

const benefits = [
  { icon: TrendingUp, title: "Growth Opportunities", description: "Clear career paths and mentorship from senior leadership" },
  { icon: Users, title: "Collaborative Culture", description: "Work alongside experienced professionals in a supportive environment" },
  { icon: Award, title: "Competitive Compensation", description: "Industry-leading commission structures and base salaries" },
  { icon: Briefcase, title: "Comprehensive Benefits", description: "Health, dental, vision, and 401(k) matching" },
];

const values = [
  { title: "Excellence", description: "We hold ourselves to the highest standards in everything we do." },
  { title: "Integrity", description: "We build trust through transparency and honest communication." },
  { title: "Collaboration", description: "We succeed together by supporting each other's growth." },
  { title: "Innovation", description: "We embrace new ideas and continuously improve our approach." },
];

export default function Careers() {
  const heroReveal = useScrollReveal(0.1);
  const whyReveal = useScrollReveal(0.1);
  const valuesReveal = useScrollReveal(0.1);
  const positionsReveal = useScrollReveal(0.1);
  const cultureReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative h-[45vh] md:h-[50vh] min-h-[320px] md:min-h-[400px] flex items-center justify-center" ref={heroReveal.elementRef}>
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Join Our Team
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-8">
            Build your career at one of NYC's fastest-growing real estate advisory firms
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-light text-accent">50+</div>
              <div className="text-sm text-muted-foreground font-light">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-light text-accent">7</div>
              <div className="text-sm text-muted-foreground font-light">Divisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-light text-accent">5</div>
              <div className="text-sm text-muted-foreground font-light">Boroughs Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bridge */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={whyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            whyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Why Bridge Advisory Group</h2>
            <p className="text-sm md:text-base text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              We invest in our people and provide the tools, training, and support to help you succeed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02]"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <benefit.icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="text-lg font-light mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section with Image */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={cultureReveal.elementRef}>
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
              <h2 className="text-3xl md:text-4xl font-light mb-6">Our Culture</h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">
                At Bridge, we believe that great work happens when talented people collaborate in a supportive environment. Our team is built on mutual respect, open communication, and a shared commitment to excellence.
              </p>
              <p className="text-muted-foreground font-light leading-relaxed">
                We celebrate wins together, learn from challenges, and continuously push each other to grow. Whether you're just starting your career or bringing years of experience, you'll find opportunities to make an impact here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={valuesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`transition-all duration-700 ${
            valuesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Our Values</h2>
            <p className="text-sm md:text-base text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              The principles that guide how we work and serve our clients.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {values.map((value, index) => (
                <div 
                  key={value.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] text-center"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <h3 className="text-xl font-light mb-3 text-accent">{value.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={positionsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`transition-all duration-700 ${
            positionsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Open Positions</h2>
            <p className="text-sm md:text-base text-muted-foreground font-light mb-8 md:mb-12 text-center max-w-2xl mx-auto">
              Explore current opportunities to join the Bridge team.
            </p>
            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <div 
                  key={position.title} 
                  className="p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-light mb-1">{position.title}</h3>
                      <p className="text-sm text-accent font-light">{position.department}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground font-light">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground font-light">
                        <Clock className="h-4 w-4" />
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-light text-sm mb-4">{position.description}</p>
                  <Button asChild variant="outline" size="sm" className="font-light">
                    <Link to="/contact">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6">Don't See a Fit?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and tell us how you can contribute to Bridge Advisory Group.
          </p>
          <Button asChild size="lg" className="font-light">
            <Link to="/contact">Submit Your Resume</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
