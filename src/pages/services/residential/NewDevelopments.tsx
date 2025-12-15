import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Megaphone,
  Compass,
  Users,
  Building2,
  TrendingUp,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const NewDevelopments = () => {
  const stats = useScrollReveal();
  const pillars = useScrollReveal();
  const projects = useScrollReveal();
  const timeline = useScrollReveal();
  const benefits = useScrollReveal();
  const cta = useScrollReveal();

  const servicePillars = [
    {
      icon: BarChart3,
      title: "Research & Analysis",
      description: "Market studies, competitive analysis, pricing strategy, and absorption projections to position your development for success.",
      services: [
        "Market & Demographic Studies",
        "Competitive Analysis",
        "Pricing Strategy",
        "Absorption Modeling",
      ],
    },
    {
      icon: Megaphone,
      title: "Marketing & Branding",
      description: "Full-service creative development from brand identity to sales gallery design and comprehensive digital campaigns.",
      services: [
        "Brand Identity Development",
        "Sales Gallery Design",
        "Digital Marketing Campaigns",
        "Collateral & Signage",
      ],
    },
    {
      icon: Compass,
      title: "Planning & Design",
      description: "Strategic input on unit mix optimization, finish selections, and amenity programming to maximize market appeal.",
      services: [
        "Unit Mix Optimization",
        "Finish Selection Advisory",
        "Amenity Programming",
        "Floor Plan Review",
      ],
    },
    {
      icon: Users,
      title: "Sales & Operations",
      description: "Full-service sales team staffing, CRM management, buyer qualification, and contract processing from launch to sellout.",
      services: [
        "Sales Team Staffing",
        "CRM Management",
        "Buyer Qualification",
        "Contract Administration",
      ],
    },
  ];

  const featuredProjects = [
    {
      name: "The Linden",
      location: "Williamsburg, Brooklyn",
      units: 48,
      status: "Sold Out",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    },
    {
      name: "One Clinton",
      location: "Clinton Hill, Brooklyn",
      units: 72,
      status: "Selling",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    },
    {
      name: "The Heights",
      location: "Washington Heights",
      units: 120,
      status: "Coming Soon",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    },
    {
      name: "Prospect Gardens",
      location: "Prospect Heights, Brooklyn",
      units: 36,
      status: "Sold Out",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    },
  ];

  const timelineSteps = [
    { phase: "Pre-Development", description: "Market research, feasibility analysis, positioning strategy" },
    { phase: "Pre-Marketing", description: "Brand development, sales gallery, website launch" },
    { phase: "Launch", description: "Sales team deployment, marketing activation, VIP events" },
    { phase: "Stabilization", description: "Ongoing sales, market feedback, strategy adjustments" },
    { phase: "Sellout", description: "Final sales push, closing coordination, project completion" },
  ];

  const developerBenefits = [
    "Deep local market expertise across all NYC boroughs",
    "Full-service in-house marketing and creative team",
    "Proven track record with 50+ development projects",
    "Comprehensive sales reporting and analytics",
    "Seamless coordination from pre-dev to sellout",
    "Dedicated project management and oversight",
  ];

  return (
    <ServicePageLayout
      serviceKey="residential"
      heroContent={
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${PLACEHOLDER_IMAGES.hero.newDevelopments}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <p className="text-primary font-medium tracking-widest uppercase mb-4 text-sm">
              Development Marketing & Sales
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              New Developments
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Full-cycle development marketing and sales services, from market research to sellout, 
              for developers across New York City.
            </p>
            <Button size="lg" className="group" asChild>
              <Link to="/contact">
                Partner With Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
      }
    >
      {/* Stats Section */}
      <section
        ref={stats.elementRef}
        className={`py-16 bg-muted/30 border-y border-border transition-all duration-700 ${
          stats.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</p>
              <p className="text-muted-foreground">Projects Represented</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">2,500+</p>
              <p className="text-muted-foreground">Units Sold</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">$1.8B+</p>
              <p className="text-muted-foreground">Total Volume</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</p>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Pillars */}
      <section
        ref={pillars.elementRef}
        className={`py-20 md:py-28 transition-all duration-700 ${
          pillars.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-medium tracking-widest uppercase mb-4 text-sm">
              Full-Service Approach
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Four Pillars of Development Success
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our integrated approach covers every aspect of new development marketing and sales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicePillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="group bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {pillar.description}
                </p>
                <ul className="space-y-2">
                  {pillar.services.map((service) => (
                    <li key={service} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section
        ref={projects.elementRef}
        className={`py-20 md:py-28 bg-muted/30 transition-all duration-700 ${
          projects.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-medium tracking-widest uppercase mb-4 text-sm">
              Our Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Development Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A selection of new developments we've successfully marketed and sold across NYC.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project, index) => (
              <div
                key={project.name}
                className="group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                      project.status === "Sold Out"
                        ? "bg-muted text-muted-foreground"
                        : project.status === "Selling"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {project.status}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-1">{project.name}</h3>
                  <p className="text-muted-foreground text-sm">{project.location}</p>
                  <p className="text-primary text-sm font-medium">{project.units} Units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        ref={timeline.elementRef}
        className={`py-20 md:py-28 transition-all duration-700 ${
          timeline.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-medium tracking-widest uppercase mb-4 text-sm">
              Full-Cycle Support
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              From Pre-Development to Sellout
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We partner with developers at every stage of the project lifecycle.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

            <div className="grid md:grid-cols-5 gap-8">
              {timelineSteps.map((step, index) => (
                <div key={step.phase} className="relative text-center">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.phase}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Developer Benefits */}
      <section
        ref={benefits.elementRef}
        className={`py-20 md:py-28 bg-muted/30 transition-all duration-700 ${
          benefits.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary font-medium tracking-widest uppercase mb-4 text-sm">
                Why Bridge
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Bridge Advantage for Developers
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Partner with a team that understands the unique challenges of new development 
                marketing and sales in New York City's competitive market.
              </p>
              <ul className="space-y-4">
                {developerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Building2 className="h-10 w-10 text-primary mx-auto mb-4" />
                <p className="text-3xl font-bold text-foreground mb-2">50+</p>
                <p className="text-muted-foreground text-sm">Development Projects</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
                <p className="text-3xl font-bold text-foreground mb-2">98%</p>
                <p className="text-muted-foreground text-sm">Sellout Rate</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Target className="h-10 w-10 text-primary mx-auto mb-4" />
                <p className="text-3xl font-bold text-foreground mb-2">12mo</p>
                <p className="text-muted-foreground text-sm">Avg. Sellout Time</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <p className="text-3xl font-bold text-foreground mb-2">25+</p>
                <p className="text-muted-foreground text-sm">Sales Professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={cta.elementRef}
        className={`py-20 md:py-28 transition-all duration-700 ${
          cta.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Launch Your Next Development?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Partner with Bridge for full-service development marketing and sales. 
              Let's discuss your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="group" asChild>
                <Link to="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/services/investment-sales/track-record">
                  View Track Record
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default NewDevelopments;
