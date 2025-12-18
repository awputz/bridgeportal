import { 
  Megaphone, TrendingUp, Award, Palette, FileText, Camera, 
  Mail, Share2, BarChart3, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicesSubNav } from "@/components/ServicesSubNav";
import { DIVISIONS } from "@/lib/constants";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

const creativeServices = [
  {
    icon: Palette,
    title: "Property Branding",
    description: "Creating memorable identities that resonate with target audiences.",
    items: [
      "Building naming and positioning strategy",
      "Logo design and visual identity systems",
      "Brand guidelines and asset libraries"
    ]
  },
  {
    icon: FileText,
    title: "Sales Collateral",
    description: "Professional materials that support the sales and leasing process.",
    items: [
      "Offering memorandums and investment packages",
      "Pitch decks and presentation materials",
      "Brochures, flyers, and leave-behinds"
    ]
  },
  {
    icon: Camera,
    title: "Visual Content",
    description: "High-quality imagery and video that showcases properties.",
    items: [
      "Professional photography and art direction",
      "Video production and drone footage",
      "3D renders and virtual staging"
    ]
  }
];

const digitalServices = [
  {
    icon: TrendingUp,
    title: "Paid & Organic",
    description: "Strategic campaigns that maximize reach and engagement.",
    items: [
      "Google Ads and display campaigns",
      "Social media advertising (Meta, LinkedIn)",
      "Retargeting and audience building"
    ]
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Direct outreach that drives engagement and conversions.",
    items: [
      "List building and segmentation",
      "Campaign design and automation",
      "Performance tracking and optimization"
    ]
  },
  {
    icon: Share2,
    title: "Social Media",
    description: "Content that builds awareness and drives engagement.",
    items: [
      "Project-specific content calendars",
      "Firm-level brand building",
      "Influencer and partnership outreach"
    ]
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Data-driven insights that improve performance over time.",
    items: [
      "Campaign performance tracking",
      "A/B testing for creative and messaging",
      "Regular reporting with recommendations"
    ]
  }
];

export default function Marketing() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const introReveal = useScrollReveal(0.1);
  const creativeReveal = useScrollReveal(0.1);
  const digitalReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] min-h-[320px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" ref={heroReveal.elementRef}>
        <div className="absolute inset-0 z-0">
          <img 
            src={PLACEHOLDER_IMAGES.office.modern}
            alt="Modern creative workspace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className={`container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ${
          heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6">
            Bridge Marketing
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light">
            {DIVISIONS.marketing.tagline}
          </p>
        </div>
      </section>

      <ServicesSubNav />

      {/* Intro */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={introReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className={`text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed text-center transition-all duration-700 ${
            introReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Bridge Marketing powers the visual identity and storytelling behind Bridge listings and select client assignments. From brand development through digital distribution, our team delivers work that stands out in a competitive market.
          </p>
        </div>
      </section>

      {/* Creative Studio Section */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5 bg-white/[0.01]" ref={creativeReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`mb-12 transition-all duration-700 ${
            creativeReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <Megaphone className="h-6 w-6 md:h-8 md:w-8 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Creative Studio</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-3xl">
              Full-service creative production for properties and brands.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {creativeServices.map((service, index) => (
              <div
                key={service.title}
                className={`group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 ${
                  creativeReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <service.icon className="h-8 w-8 text-accent mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-lg font-light mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground font-light mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.items.map(item => (
                    <li key={item} className="text-sm text-muted-foreground/80 font-light flex items-start gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital & Campaigns Section */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-white/5" ref={digitalReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`mb-12 transition-all duration-700 ${
            digitalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <Award className="h-6 w-6 md:h-8 md:w-8 text-accent" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Digital & Campaigns</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-3xl">
              Multi-channel distribution that reaches the right audience with data-driven insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {digitalServices.map((service, index) => (
              <div
                key={service.title}
                className={`group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 ${
                  digitalReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <service.icon className="h-8 w-8 text-accent mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-lg font-light mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground font-light mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.items.map(item => (
                    <li key={item} className="text-sm text-muted-foreground/80 font-light flex items-start gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6">Ready To Get Started?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Whether you need creative, digital distribution, or strategic marketing support, Bridge Marketing is ready to help.
          </p>
          <Button size="lg" className="font-light" onClick={openContactSheet}>
            Contact Marketing
          </Button>
        </div>
      </section>
    </div>
  );
}