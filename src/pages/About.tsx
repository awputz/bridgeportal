import { Link } from "react-router-dom";
import { Building2, Users, TrendingUp, Award, ArrowRight, Target, Eye, Heart, MessageSquare, Trophy, Compass, HelpCircle, PenLine, DollarSign, Briefcase, Clock, Home, Calendar, Zap, Handshake, Shield, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SEOHelmet } from "@/components/SEOHelmet";
import { TeamHighlight } from "@/components/TeamHighlight";
import { useBridgeSettings } from "@/hooks/useBridgeSettings";
import heroImage from "@/assets/brooklyn-bridge-hero-light.jpg";
export default function About() {
  const {
    openContactSheet
  } = useContactSheet();
  const {
    data: settings
  } = useBridgeSettings();
  const heroReveal = useScrollReveal(0.1);
  const storyReveal = useScrollReveal(0.1);
  const missionReveal = useScrollReveal(0.1);
  const howWeWorkReveal = useScrollReveal(0.1);
  const philosophyReveal = useScrollReveal(0.1);
  const whyReveal = useScrollReveal(0.1);
  const clientsCount = settings?.clients_count || 100;
  const stats = [{
    icon: DollarSign,
    value: 100,
    suffix: "M+",
    label: "Closed"
  }, {
    icon: Briefcase,
    value: clientsCount,
    suffix: "+",
    label: "Clients"
  }, {
    icon: Clock,
    value: 15,
    suffix: "+",
    label: "Years Exp."
  }, {
    icon: Home,
    value: 500,
    suffix: "+",
    label: "Listings"
  }, {
    icon: Calendar,
    value: 2024,
    suffix: "",
    label: "Founded"
  }];
  const howWeWork = [{
    icon: Zap,
    title: "Move Fast",
    desc: "Streamlined processes that respect your time."
  }, {
    icon: Handshake,
    title: "Client-First",
    desc: "Your goals drive every recommendation."
  }, {
    icon: Shield,
    title: "Full Transparency",
    desc: "Honest assessments and clear communication."
  }, {
    icon: LineChart,
    title: "Data-Driven",
    desc: "Market intelligence informs all strategies."
  }, {
    icon: Users,
    title: "Collaborative",
    desc: "Cross-divisional expertise on every engagement."
  }];
  return <div className="min-h-screen">
      <SEOHelmet title="About Bridge Advisory Group | NYC Real Estate Advisory" description="Learn about Bridge Advisory Group, a multi-division real estate platform at the intersection of brokerage, ownership, and capital in New York City." path="/about" />
      {/* Hero with Stats */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-28 md:pt-32 pb-24" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="New York City skyline" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            About Bridge Advisory Group
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light mb-4">
            A multi-division real estate platform at the intersection of brokerage, ownership, and capital.
          </p>
          
          {/* Est. 2024 Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-8">
            <span className="text-sm text-accent font-light tracking-wide">Est. 2024</span>
          </div>
          
          {/* Stats inline */}
          <div className="grid grid-cols-5 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => {
            const Icon = stat.icon;
            return <div key={stat.label} className="text-center" style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <Icon className="h-5 w-5 text-accent mx-auto mb-2" />
                  <div className="text-xl md:text-2xl font-light">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000} />
                  </div>
                  <p className="text-xs text-muted-foreground font-light">{stat.label}</p>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Firm Story */}
      <section className="py-16 md:py-24 border-b border-white/5" ref={storyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${storyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <h2 className="text-3xl md:text-4xl font-light mb-6">Firm Story</h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-4">
                Founded in 2024, Bridge Advisory Group was established to build a real estate platform that brings together brokerage execution with principal-level thinking. Headquartered in NYC, we serve owners, operators, investors, and occupiers across every stage of the real estate cycle.
              </p>
              <p className="text-muted-foreground font-light leading-relaxed">
                What sets Bridge apart is the integration of residential, commercial leasing, investment sales, capital advisory, and marketing into a unified platform.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img src={heroImage} alt="Bridge Advisory Group" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Leadership */}
      <TeamHighlight title="Meet Our Leadership" subtitle="The principals guiding Bridge Advisory Group's strategy and client relationships." className="bg-muted/20" />

      {/* Mission and Vision */}
      <section className="py-16 md:py-24 border-b border-white/5 bg-white/[0.01]" ref={missionReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-light mb-10 text-center">Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Target className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-xl font-light mb-3">Mission</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                To redefine real estate service excellence across New York through expert-led strategies that maximize value and foster long-term relationships.
              </p>
            </div>
            <div className={`p-6 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
            transitionDelay: '100ms'
          }}>
              <Eye className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-xl font-light mb-3">Vision</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                To be New York's leading real estate advisory firm, known for innovative approaches and unwavering commitment to client success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work (replaces Our Values) */}
      

      {/* Philosophy */}
      <section className="py-16 md:py-24 border-b border-white/5 bg-white/[0.01]" ref={philosophyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${philosophyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1">
              <img src={heroImage} alt="Modern building" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl font-light mb-6">Philosophy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-light mb-2">Precision</h3>
                  <p className="text-sm text-muted-foreground font-light">
                    Every transaction deserves careful attention to detail with rigorous analysis and clear communication.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-light mb-2">Transparency</h3>
                  <p className="text-sm text-muted-foreground font-light">
                    Honest assessments, realistic timelines, and regular updates throughout every engagement.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-light mb-2">Long-Term Relationships</h3>
                  <p className="text-sm text-muted-foreground font-light">
                    We invest in understanding client goals and delivering value that compounds over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bridge */}
      <section className="py-16 md:py-24" ref={whyReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">Why Bridge</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{
            icon: Building2,
            title: "Integrated View",
            desc: "Cross-functional insights across all divisions."
          }, {
            icon: TrendingUp,
            title: "Speed",
            desc: "Streamlined processes that move fast."
          }, {
            icon: Award,
            title: "Creative Marketing",
            desc: "In-house team for compelling narratives."
          }, {
            icon: Users,
            title: "Principal Thinking",
            desc: "Advisory beyond just brokerage."
          }].map((item, index) => {
            const Icon = item.icon;
            return <div key={item.title} className={`text-center p-4 rounded-lg hover:bg-white/[0.02] transition-all duration-700 ${whyReveal.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <Icon className="mx-auto mb-3 text-accent" size={28} />
                  <h3 className="text-sm font-light mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground font-light">{item.desc}</p>
                </div>;
          })}
          </div>
          
          <div className={`text-center mt-10 transition-all duration-700 ${whyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '400ms'
        }}>
            <Button size="lg" className="font-light" onClick={openContactSheet}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>;
}