import { Link } from "react-router-dom";
import { Building2, TrendingUp, Award, Users, Home as HomeIcon, Megaphone, ArrowRight, ChevronDown, Target, Eye, Landmark, Settings, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { COMPANY_INFO, DIVISIONS } from "@/lib/constants";
import { Testimonials } from "@/components/Testimonials";
import { TrustBadges } from "@/components/TrustBadges";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import heroImage from "@/assets/brooklyn-bridge-hero-light.jpg";
import bridgeAdvisoryLogo from "@/assets/bridge-advisory-group-logo.png";
export default function Home() {
  const {
    data: transactions = []
  } = useTransactions();
  const recentTransactions = transactions.slice(0, 3);
  const {
    openContactSheet
  } = useContactSheet();
  const platformReveal = useScrollReveal(0.1);
  const missionReveal = useScrollReveal(0.1);
  const commercialReveal = useScrollReveal(0.1);
  const residentialReveal = useScrollReveal(0.1);
  const capitalReveal = useScrollReveal(0.1);
  const marketingReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 md:px-6">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${heroImage})`,
        filter: 'brightness(0.6) contrast(1.1)'
      }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        <div className="relative z-10 container mx-auto text-center max-w-5xl">
          <div className="animate-fade-in" style={{
          animationDelay: '200ms',
          animationFillMode: 'backwards'
        }}>
            <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="mx-auto w-[280px] md:w-[400px] lg:w-[500px] xl:w-[600px] invert mb-4 md:mb-6" />
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-foreground/90 mb-4 md:mb-6 max-w-4xl mx-auto font-light px-4 animate-fade-in" style={{
          animationDelay: '400ms',
          animationFillMode: 'backwards'
        }}>
            {COMPANY_INFO.tagline}
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-foreground/60 mb-6 md:mb-8 max-w-3xl mx-auto font-light px-4 animate-fade-in" style={{
          animationDelay: '500ms',
          animationFillMode: 'backwards'
        }}>
            {COMPANY_INFO.description.full}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 animate-fade-in" style={{
          animationDelay: '600ms',
          animationFillMode: 'backwards'
        }}>
            <Button asChild size="lg" className="font-light px-6 md:px-10 w-full sm:w-auto">
              <a href="#services">Explore Our Services</a>
            </Button>
            <Button size="lg" variant="outline" className="font-light px-6 md:px-10 w-full sm:w-auto border-white/30 hover:bg-white/10" onClick={openContactSheet}>
              Contact Us
            </Button>
          </div>

          {/* Quick Access Service Buttons - Hidden on mobile for cleaner look */}
          <div className="hidden md:flex flex-wrap gap-3 justify-center px-4 mt-6 mb-20 animate-fade-in" style={{
          animationDelay: '700ms',
          animationFillMode: 'backwards'
        }}>
            <Button asChild variant="outline" className="font-light px-5 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
              <Link to="/services/residential">Residential</Link>
            </Button>
            <Button asChild variant="outline" className="font-light px-5 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
              <Link to="/services/commercial-leasing">Commercial</Link>
            </Button>
            <Button asChild variant="outline" className="font-light px-5 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
              <Link to="/services/investment-sales">Investment Sales</Link>
            </Button>
            <Button asChild variant="outline" className="font-light px-5 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 hover:border-white/50 text-white">
              <Link to="/services/capital-advisory">Capital Markets  </Link>
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in hidden md:block" style={{
        animationDelay: '900ms',
        animationFillMode: 'backwards'
      }}>
          <div className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer">
            <span className="text-sm tracking-wider uppercase font-light">Scroll to Explore</span>
            <ChevronDown className="h-6 w-6 animate-bounce-gentle" />
          </div>
        </div>
      </section>

      {/* Section 1: Who We Are */}
      <section id="services" className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={platformReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center transition-all duration-700 ${platformReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Who We Are</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light mb-12 max-w-3xl mx-auto leading-relaxed">
              Bridge Advisory Group is a multi-division real estate platform built to serve owners, operators, and occupiers across every stage of the real estate cycle. From luxury residential leasing and sales to complex commercial transactions, investment sales assignments, and capital markets solutions, Bridge combines brokerage execution with principal-level thinking.
            </p>
          </div>
          
          <div className={`flex flex-wrap justify-center gap-3 md:gap-4 mb-12 transition-all duration-700 ${platformReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '200ms'
        }}>
            {Object.values(DIVISIONS).map((division, index) => {
            const iconMap: Record<string, React.ReactNode> = {
              Home: <HomeIcon className="h-4 w-4 md:h-5 md:w-5 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />,
              Building2: <Building2 className="h-4 w-4 md:h-5 md:w-5 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />,
              TrendingUp: <TrendingUp className="h-4 w-4 md:h-5 md:w-5 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />,
              Landmark: <Landmark className="h-4 w-4 md:h-5 md:w-5 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />,
              Settings: <Settings className="h-4 w-4 md:h-5 md:w-5 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />,
              Megaphone: <Megaphone className="h-4 w-4 md:h-5 md:w-5 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />,
              Presentation: <Presentation className="h-4 w-4 md:h-5 md:w-5 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            };
            return <Link key={division.name} to={division.path} className="px-4 pt-2 pb-1 md:px-6 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 text-center group flex flex-col items-center py-px my-0 md:pb-px md:pt-[20px]">
                  {iconMap[division.icon]}
                  <p className="text-xs md:text-sm font-light group-hover:text-foreground transition-colors">{division.name}</p>
                </Link>;
          })}
          </div>
          
          <div className={`text-center transition-all duration-700 ${platformReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '400ms'
        }}>
            <Button asChild variant="link" className="font-light group">
              <Link to="/about">
                Learn more about the firm
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: Mission And Vision */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={missionReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Mission And Vision</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto mb-12">
            <div className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
            transitionDelay: '100ms'
          }}>
              <Target className="h-8 w-8 md:h-10 md:w-10 text-accent mb-4" />
              <h3 className="text-xl md:text-2xl font-light mb-4">Our Mission</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                At Bridge Advisory Group, our mission is to redefine real estate service excellence across the New York market and empower clients through informed, expert-led strategies that maximize value and foster long-term relationships.
              </p>
            </div>
            
            <div className={`p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-700 ${missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
            transitionDelay: '200ms'
          }}>
              <Eye className="h-8 w-8 md:h-10 md:w-10 text-accent mb-4" />
              <h3 className="text-xl md:text-2xl font-light mb-4">Our Vision</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Our vision is to set new standards in New York real estate, driven by innovation, integrity, and a focus on long-term value creation for our clients and our community.
              </p>
            </div>
          </div>
          
          <div className={`text-center transition-all duration-700 ${missionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '300ms'
        }}>
            <Button asChild variant="link" className="font-light group">
              <Link to="/about">
                View our full Mission, Vision, and Values
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 3: Commercial And Investment Expertise */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={commercialReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${commercialReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Commercial And Investment Expertise</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Bridge Commercial and Bridge Investment Sales work together to support owners, tenants, and investors across New York. The platform focuses on strategic leasing, repositioning, and disposition work for office, retail, mixed-use, and multifamily assets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
            {[{
            icon: Users,
            title: "Tenant and Landlord Representation",
            desc: "Support for tenants seeking the right footprint and landlords working to stabilize or reposition their assets."
          }, {
            icon: TrendingUp,
            title: "Investment Sales Advisory",
            desc: "Acquisition and disposition advisory grounded in data, underwriting, and real-time market intelligence."
          }, {
            icon: Building2,
            title: "Portfolio And Asset Strategy",
            desc: "Guidance for ownership groups on hold-sell decisions, recapitalizations, and value creation strategies."
          }].map((service, index) => {
            const Icon = service.icon;
            return <div key={index} className={`group p-6 md:p-8 rounded-lg transition-all duration-700 hover:bg-white/3 border-l-2 border-accent/30 ${commercialReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
              transitionDelay: `${(index + 1) * 100}ms`
            }}>
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
                  <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">{service.desc}</p>
                </div>;
          })}
          </div>
          
          <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 ${commercialReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '400ms'
        }}>
            <Button asChild variant="link" className="font-light group">
              <Link to="/services/commercial-leasing">
                Explore Commercial Leasing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="link" className="font-light group">
              <Link to="/services/investment-sales">
                Explore Investment Sales
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 4: Residential Platform */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={residentialReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${residentialReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Residential In A City That Never Slows Down</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Bridge Residential focuses on high-quality apartments, townhomes, and condominiums across New York. The team works with landlords, buyers, and renters who expect a sharp, straightforward process and clear communication at every step.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
            {[{
            icon: HomeIcon,
            title: "Landlord Leasing Programs",
            desc: "Building-level leasing programs that reduce vacancy and improve tenant quality."
          }, {
            icon: Award,
            title: "Rentals And Sales",
            desc: "Representation for renters and buyers across prime neighborhoods, with access to exclusive and off-market opportunities."
          }, {
            icon: TrendingUp,
            title: "Residential Market Intel",
            desc: "Pricing guidance, unit positioning, and feedback that helps owners stay ahead of the market."
          }].map((service, index) => {
            const Icon = service.icon;
            return <div key={index} className={`group p-6 md:p-8 rounded-lg transition-all duration-700 hover:bg-white/3 border-l-2 border-accent/30 ${residentialReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
              transitionDelay: `${(index + 1) * 100}ms`
            }}>
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
                  <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">{service.desc}</p>
                </div>;
          })}
          </div>
          
          <div className={`text-center transition-all duration-700 ${residentialReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '400ms'
        }}>
            <Button asChild variant="link" className="font-light group">
              <Link to="/services/residential">
                Explore Residential
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 5: Capital Advisory */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={capitalReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${capitalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">Capital Advisory That Understands The Real Asset</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Bridge Capital Advisory works with owners, investors, and developers to structure debt and equity solutions around the actual business plan of each asset. The team focuses on clarity, speed, and alignment across lenders, investors, and sponsors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
            {[{
            icon: Building2,
            title: "Debt Placement",
            desc: "Sourcing and structuring senior and subordinate financing across banks, private lenders, and alternative capital providers."
          }, {
            icon: Users,
            title: "Equity And Joint Ventures",
            desc: "Matching operators and developers with equity partners aligned with the risk and return profile of each deal."
          }, {
            icon: TrendingUp,
            title: "Recapitalization And Restructuring",
            desc: "Advisory support for capital stack resets, partnership buyouts, and asset-level restructuring."
          }].map((service, index) => {
            const Icon = service.icon;
            return <div key={index} className={`group p-6 md:p-8 rounded-lg transition-all duration-700 hover:bg-white/3 border-l-2 border-accent/30 ${capitalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
              transitionDelay: `${(index + 1) * 100}ms`
            }}>
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
                  <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">{service.desc}</p>
                </div>;
          })}
          </div>
          
          <div className={`text-center transition-all duration-700 ${capitalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '400ms'
        }}>
            <Button asChild variant="link" className="font-light group">
              <Link to="/services/capital-advisory">
                View Capital Advisory
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 6: Marketing Engine */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={marketingReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${marketingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">A Marketing Engine Behind Every Assignment</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Bridge Marketing powers the visual identity and storytelling behind Bridge listings and select client assignments, with a focus on clean design, clear messaging, and thoughtful distribution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
            {[{
            icon: Megaphone,
            title: "Creative For Properties And Brands",
            desc: "Property branding, offering memorandums, pitch decks, photography, video, and render direction."
          }, {
            icon: TrendingUp,
            title: "Digital Distribution And Campaigns",
            desc: "Paid and organic digital campaigns, email marketing, list management, and social media content."
          }, {
            icon: Award,
            title: "Data-Driven Strategy And Performance",
            desc: "Performance tracking, creative testing, and reporting that feeds back into pricing and positioning."
          }].map((service, index) => {
            const Icon = service.icon;
            return <div key={index} className={`group p-6 md:p-8 rounded-lg transition-all duration-700 hover:bg-white/3 border-l-2 border-accent/30 ${marketingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
              transitionDelay: `${(index + 1) * 100}ms`
            }}>
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-400" />
                  <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">{service.desc}</p>
                </div>;
          })}
          </div>
          
          <div className={`text-center transition-all duration-700 ${marketingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '400ms'
        }}>
            <Button asChild variant="link" className="font-light group">
              <Link to="/services/marketing">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Client Logos / Trusted By Section */}
      <section className="py-12 md:py-16 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-sm uppercase tracking-widest text-muted-foreground mb-8">Trusted By Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 opacity-60 hover:opacity-80 transition-opacity">
            {["REBNY", "NYC Housing", "CoStar Group", "StreetEasy", "Cushman & Wakefield", "CBRE"].map((client) => (
              <div 
                key={client} 
                className="text-lg md:text-xl font-light text-muted-foreground grayscale hover:grayscale-0 transition-all duration-300"
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Signup */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <NewsletterSignup />
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section ref={ctaReveal.elementRef} className="py-12 md:py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-light mb-6 transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Talk To The Right Team At Bridge
          </h2>
          <p className={`text-base md:text-lg text-muted-foreground font-light mb-8 md:mb-12 transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
          transitionDelay: '100ms'
        }}>
            Whether you are an owner, investor, tenant, or home seeker, Bridge Advisory Group will connect you with the right team to move your real estate decisions forward.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`} style={{
          transitionDelay: '200ms'
        }}>
            <Button size="lg" className="font-light px-8 md:px-12" onClick={openContactSheet}>
              Contact Us
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8 md:px-12">
              <a href="#services">Explore Services</a>
            </Button>
          </div>
        </div>
      </section>
    </div>;
}