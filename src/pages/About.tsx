import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, Award, ArrowRight, Target, Eye, Heart, MessageSquare, Trophy, Compass, HelpCircle, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { DIVISIONS } from "@/lib/constants";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

export default function About() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const storyReveal = useScrollReveal(0.1);
  const missionReveal = useScrollReveal(0.1);
  const valuesReveal = useScrollReveal(0.1);
  const philosophyReveal = useScrollReveal(0.1);
  const divisionsReveal = useScrollReveal(0.1);
  const whyReveal = useScrollReveal(0.1);

  const culturalValues = [
    { icon: Heart, title: "Lead with Optimism and Compassion" },
    { icon: MessageSquare, title: "Cultivate Frequent Feedback" },
    { icon: Trophy, title: "Celebrate the Wins" },
    { icon: Compass, title: "Embrace Process Over Outcome" },
    { icon: HelpCircle, title: "Start with Why" },
    { icon: PenLine, title: "Cherish Writing" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero with Image */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-[350px] md:min-h-[450px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.hero.nycSkyline} 
            alt="New York City skyline" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            About Bridge Advisory Group
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            A multi-division real estate platform at the intersection of brokerage, ownership, and capital.
          </p>
        </div>
      </section>

      {/* Platform Story with Image */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={storyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            storyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <h2 className="text-3xl md:text-4xl font-light mb-8">Firm Story</h2>
              <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                <p>
                  Bridge Advisory Group was founded with a clear vision: to build a real estate platform that brings together the best of brokerage execution with principal-level thinking. Headquartered in New York City, Bridge serves owners, operators, investors, and occupiers across every stage of the real estate cycle.
                </p>
                <p>
                  What sets Bridge apart is the integration of services under one roof. Rather than operating as siloed divisions, Bridge brings together residential, commercial leasing, investment sales, capital advisory, and marketing into a unified platform.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={PLACEHOLDER_IMAGES.office.teamWork} 
                alt="Bridge Advisory Group team collaboration" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={missionReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`transition-all duration-700 ${
            missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">Mission And Vision</h2>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${
                missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: '100ms' }}>
                <Target className="h-10 w-10 text-accent mb-6" />
                <h3 className="text-2xl font-light mb-4">Mission Statement</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  At Bridge Advisory Group, our mission is to redefine real estate service excellence across the New York market. We aim to empower our clients through informed, expert-led strategies that maximize value and foster long-term relationships.
                </p>
              </div>
              
              <div className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${
                missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: '200ms' }}>
                <Eye className="h-10 w-10 text-accent mb-6" />
                <h3 className="text-2xl font-light mb-4">Vision Statement</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Our vision is to be the leading real estate advisory firm in New York, known for our innovative approaches and unwavering commitment to client success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Values */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={valuesReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`transition-all duration-700 ${
            valuesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-center">Cultural Values</h2>
            <p className="text-sm md:text-base text-muted-foreground font-light text-center mb-8 md:mb-12">
              These values are reviewed in every onboarding meeting and guide how we work as a firm.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {culturalValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={value.title}
                    className={`p-4 md:p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 ${
                      valuesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Icon className="h-6 w-6 md:h-8 md:w-8 text-accent mb-3 md:mb-4" />
                    <h3 className="text-sm md:text-lg font-light">{value.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy with Image */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={philosophyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            philosophyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1">
              <img 
                src={PLACEHOLDER_IMAGES.building.exterior} 
                alt="Modern building architecture" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-light mb-8">Philosophy</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-light mb-3">Precision</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Every transaction deserves careful attention to detail. Bridge approaches each assignment with rigorous analysis, clear communication, and disciplined execution.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-light mb-3">Transparency</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Clients deserve to know where they stand. Bridge provides honest assessments, realistic timelines, and regular updates throughout every engagement.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-light mb-3">Long-Term Relationships</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    The best client relationships are built over years, not transactions. Bridge invests in understanding client goals and delivering value that compounds over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisions Overview */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={divisionsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            divisionsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Our Divisions</h2>
            <p className="text-sm md:text-base text-muted-foreground font-light">Specialized expertise across every sector of New York City real estate</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Object.values(DIVISIONS).map((division, index) => (
              <Link
                key={division.name}
                to={division.path}
                className={`group p-6 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 ${
                  divisionsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-light mb-2 group-hover:text-foreground transition-colors">{division.name}</h3>
                <p className="text-sm text-muted-foreground font-light mb-4">{division.tagline}</p>
                <div className="flex items-center gap-2 text-sm font-light text-foreground/60 group-hover:text-foreground transition-colors">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bridge */}
      <section className="py-12 md:py-20 lg:py-28" ref={whyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            whyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Why Bridge</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Building2,
                title: "Integrated View",
                desc: "Cross-functional insights from residential, commercial, investment, and capital teams working together."
              },
              {
                icon: TrendingUp,
                title: "Speed Of Execution",
                desc: "Streamlined processes and dedicated resources that move transactions forward without unnecessary delays."
              },
              {
                icon: Award,
                title: "Creative Marketing",
                desc: "In-house marketing team that creates compelling narratives and reaches the right audience."
              },
              {
                icon: Users,
                title: "Principal Thinking",
                desc: "Advisory that goes beyond brokerage to consider long-term value creation and strategic positioning."
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.title}
                  className={`text-center p-6 rounded-lg hover:bg-white/[0.02] transition-all duration-700 ${
                    whyReveal.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className="mx-auto mb-4 text-accent" size={36} />
                  <h3 className="text-lg font-light mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                </div>
              );
            })}
          </div>
          
          <div className={`text-center mt-12 transition-all duration-700 ${
            whyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '400ms' }}>
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
