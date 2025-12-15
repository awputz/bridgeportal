import { Building2, Users, BarChart3, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicePageLayout } from "@/components/ServicePageLayout";

const landlordServices = [
  {
    icon: Users,
    title: "Tenant Placement",
    description: "Find qualified tenants quickly through our extensive network and marketing reach.",
  },
  {
    icon: BarChart3,
    title: "Rent Optimization",
    description: "Data-driven pricing strategies to maximize your rental income.",
  },
  {
    icon: Shield,
    title: "Lease Management",
    description: "Professional lease preparation, renewals, and compliance handling.",
  },
];

const benefits = [
  "Access to qualified tenant pool",
  "Professional photography & listings",
  "Comprehensive tenant screening",
  "Competitive market analysis",
  "Lease negotiation support",
  "Ongoing portfolio advisory",
];

const processSteps = [
  {
    step: "1",
    title: "Consultation",
    description: "We assess your property and discuss your goals.",
  },
  {
    step: "2",
    title: "Marketing",
    description: "Professional photos, listings on major platforms, and network outreach.",
  },
  {
    step: "3",
    title: "Showings",
    description: "We handle all inquiries and conduct property tours.",
  },
  {
    step: "4",
    title: "Placement",
    description: "Tenant screening, lease execution, and move-in coordination.",
  },
];

export default function Landlords() {
  const { openContactSheet } = useContactSheet();

  const heroContent = (
    <>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
        For Landlords
      </h1>
      <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
        Maximize your rental income with professional leasing services. We handle everything from marketing to tenant placement.
      </p>
    </>
  );

  return (
    <ServicePageLayout heroContent={heroContent} serviceKey="residential">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Services Grid */}
        <section className="py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">Our Landlord Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {landlordServices.map((service) => (
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
            {processSteps.map((step, index) => (
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
          <h2 className="text-2xl md:text-3xl font-light mb-4">Ready to List Your Property?</h2>
          <p className="text-muted-foreground font-light mb-6 max-w-xl mx-auto">
            Get in touch with our team to discuss your property and leasing goals.
          </p>
          <Button size="lg" onClick={openContactSheet} className="font-light">
            Schedule a Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </div>
    </ServicePageLayout>
  );
}
