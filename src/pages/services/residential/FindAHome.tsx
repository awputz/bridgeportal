import { Search, FileText, Key, Users, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicePageLayout } from "@/components/ServicePageLayout";

const services = [
  {
    icon: Search,
    title: "Property Search",
    description: "Access our exclusive inventory of rentals and sales across Manhattan, Brooklyn, and Queens.",
  },
  {
    icon: FileText,
    title: "Application Support",
    description: "We guide you through the entire process, from documentation to approval.",
  },
  {
    icon: Users,
    title: "Expert Negotiation",
    description: "Our agents negotiate the best terms on your behalf.",
  },
  {
    icon: Key,
    title: "Move-In Coordination",
    description: "Seamless transition from signing to moving in.",
  },
];

const benefits = [
  "Access to exclusive listings",
  "Off-market opportunities",
  "Trusted lender connections",
  "Comprehensive market analysis",
  "Building & unit due diligence",
  "End-to-end representation",
];

const processSteps = [
  {
    step: "1",
    title: "Consultation",
    description: "Tell us your needs, budget, and preferred neighborhoods.",
  },
  {
    step: "2",
    title: "Curated Search",
    description: "We match you with properties that fit your criteria.",
  },
  {
    step: "3",
    title: "Tours & Showings",
    description: "Visit your top choices with a dedicated agent.",
  },
  {
    step: "4",
    title: "Close & Move In",
    description: "Application, negotiation, and welcome home.",
  },
];

export default function FindAHome() {
  const { openContactSheet } = useContactSheet();

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / For Buyers & Renters</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Find Your Perfect Home
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Whether you're renting or buying, our team provides personalized guidance to find your ideal residence.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout heroContent={heroContent} serviceKey="residential">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Services Grid */}
        <section className="py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">How We Help</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-6 rounded-xl border border-border/50 bg-card/30 text-center"
              >
                <service.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{service.title}</h3>
                <p className="text-muted-foreground font-light text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 md:py-16 border-t border-border/30">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">Why Work With Us</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground font-light">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="py-12 md:py-16 border-t border-border/30">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div key={step.title} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 text-lg font-medium">
                  {step.step}
                </div>
                <h3 className="text-base font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground font-light text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 border-t border-border/30 text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-4">Ready to Find Your Home?</h2>
          <p className="text-muted-foreground font-light mb-6 max-w-xl mx-auto">
            Connect with one of our specialists to start your search today.
          </p>
          <Button size="lg" onClick={openContactSheet} className="font-light">
            Start Your Search
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </div>
    </ServicePageLayout>
  );
}
