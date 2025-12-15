import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEOHelmet } from "@/components/SEOHelmet";

const faqCategories = [
  {
    title: "General",
    questions: [
      {
        q: "What services does Bridge Advisory Group offer?",
        a: "Bridge Advisory Group provides comprehensive real estate services including Investment Sales, Residential Leasing & Sales, Commercial Leasing, Capital Advisory, Property Management, Marketing, and Billboard advertising. We serve clients across all five NYC boroughs."
      },
      {
        q: "Where is Bridge Advisory Group located?",
        a: "Our headquarters is located at 245 West 55th Street in Manhattan, New York. We serve clients throughout New York City and the greater metropolitan area."
      },
      {
        q: "How do I get in touch with Bridge Advisory Group?",
        a: "You can reach us by phone at (212) 634-6180, email at info@bridgeadvisorygroup.com, or through our contact form on the website. Our team typically responds within 24 hours."
      },
    ]
  },
  {
    title: "Investment Sales",
    questions: [
      {
        q: "What types of properties does Bridge handle for investment sales?",
        a: "We specialize in multifamily buildings, mixed-use properties, retail, office, and development sites across NYC. Our team handles transactions ranging from small walk-ups to large portfolio sales."
      },
      {
        q: "How does Bridge Advisory Group determine property valuations?",
        a: "Our valuations are based on comprehensive market analysis including comparable sales, income approach analysis, and current market conditions. We provide detailed broker opinions of value to help owners understand their asset's position in the market."
      },
      {
        q: "Do you work with first-time sellers?",
        a: "Absolutely. We guide first-time sellers through every step of the process, from initial valuation through closing. Our team ensures you understand each phase and makes decisions that align with your goals."
      },
    ]
  },
  {
    title: "Residential Services",
    questions: [
      {
        q: "Does Bridge Advisory Group help with apartment rentals?",
        a: "Yes, Bridge Residential manages over 500 rental units across Manhattan, Brooklyn, and Queens. We help renters find apartments and landlords fill vacancies with qualified tenants."
      },
      {
        q: "What areas of NYC do you cover for residential services?",
        a: "We cover Manhattan (Upper East Side, Upper West Side, Midtown, Downtown, Chelsea, Tribeca, SoHo, Greenwich Village), Brooklyn (Williamsburg, DUMBO, Park Slope, Brooklyn Heights, Greenpoint), and Queens (Long Island City, Astoria, Forest Hills)."
      },
      {
        q: "Do you charge fees for renters?",
        a: "Fee structures vary by listing. Many of our exclusive listings are no-fee, while others may have standard broker fees. Contact us for specific details about available apartments."
      },
    ]
  },
  {
    title: "Commercial Leasing",
    questions: [
      {
        q: "Do you represent both tenants and landlords?",
        a: "Yes, Bridge Commercial provides full-service representation for both tenants seeking space and landlords looking to lease their properties. We maintain transparency and prioritize each client's best interests."
      },
      {
        q: "What types of commercial spaces do you handle?",
        a: "We specialize in retail storefronts, restaurant and hospitality spaces, office suites, and medical/wellness facilities. Our experience spans from neighborhood shops to flagship locations."
      },
      {
        q: "How long does the commercial leasing process typically take?",
        a: "For landlords, the timeline is typically 2-6 months depending on the space and market conditions. For tenants, we can often complete the process in 1-4 months from initial search to lease execution."
      },
    ]
  },
  {
    title: "Capital Advisory",
    questions: [
      {
        q: "What types of financing does Bridge help with?",
        a: "We assist with senior debt placement, bridge and transitional financing, construction loans, equity partnerships, and recapitalizations. Our relationships span banks, credit unions, and private lenders."
      },
      {
        q: "Do you help with refinancing?",
        a: "Yes, refinancing is a core part of our capital advisory services. We help owners optimize their capital stack, secure better terms, and structure financing that supports their business plan."
      },
    ]
  },
  {
    title: "Property Management",
    questions: [
      {
        q: "What does Bridge Property Management include?",
        a: "Our services include tenant screening, marketing and leasing, rent optimization, financial reporting, maintenance coordination, and market intelligence. We provide institutional-quality management for portfolios of all sizes."
      },
      {
        q: "What is your typical occupancy rate?",
        a: "Our managed portfolio maintains a 98% occupancy rate through proactive marketing, competitive pricing analysis, and quality tenant placement."
      },
    ]
  },
  {
    title: "Marketing",
    questions: [
      {
        q: "What marketing services does Bridge offer?",
        a: "Bridge Marketing provides creative services (photography, video, branding, brochures), digital campaigns (paid advertising, email marketing, social media), and strategic consulting for property launches and repositioning."
      },
      {
        q: "Do you work with non-real estate clients?",
        a: "Our primary focus is real estate marketing, but we selectively work with related industries such as hospitality, design, and development firms where our expertise adds clear value."
      },
      {
        q: "What is your typical project timeline?",
        a: "Timelines vary by scope. A single property campaign typically takes 2-4 weeks, while comprehensive brand or portfolio projects may take 6-8 weeks from kickoff to launch."
      },
    ]
  },
  {
    title: "Billboard",
    questions: [
      {
        q: "What types of billboard advertising do you offer?",
        a: "We offer static billboards, digital displays, wallscapes, and building wraps across high-traffic NYC locations. Our inventory spans Manhattan, Brooklyn, and Queens with options for all budgets."
      },
      {
        q: "How does the billboard booking process work?",
        a: "Start with a consultation to define your goals and target audience. We then present site options, handle creative production guidance, and manage the campaign from installation through completion."
      },
      {
        q: "What are typical campaign durations?",
        a: "Most campaigns run a minimum of 4 weeks, with discounts available for longer commitments. Seasonal and event-based campaigns can be arranged with flexible timing."
      },
    ]
  },
];

export default function FAQ() {
  const heroReveal = useScrollReveal(0.1);
  const faqReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      <SEOHelmet 
        title="FAQ | Bridge Advisory Group - Frequently Asked Questions"
        description="Find answers to common questions about Bridge Advisory Group's services including investment sales, residential, commercial leasing, capital advisory, and more."
        path="/faq"
      />
      {/* Hero */}
      <section className="pb-16 md:pb-24 border-b border-white/5" ref={heroReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-light mb-6 transition-all duration-700 ${
            heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-lg md:text-xl text-muted-foreground font-light transition-all duration-700 ${
            heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ animationDelay: '100ms' }}>
            Find answers to common questions about our services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 md:py-28" ref={faqReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`space-y-12 transition-all duration-700 ${
            faqReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {faqCategories.map((category, categoryIndex) => (
              <div key={category.title}>
                <h2 className="text-2xl md:text-3xl font-light mb-6 text-accent">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${categoryIndex}-${index}`}
                      className="border border-white/10 rounded-lg px-6 bg-white/[0.02]"
                    >
                      <AccordionTrigger className="text-left font-light hover:no-underline py-5">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground font-light pb-5 leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white/[0.02] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Still Have Questions?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Our team is ready to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <Button asChild size="lg" className="font-light">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}