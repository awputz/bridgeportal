import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, TrendingUp, Camera, Handshake, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { SEOHelmet } from "@/components/SEOHelmet";
const ResidentialSellers = () => {
  const {
    openContactSheet
  } = useContactSheet();
  const {
    elementRef,
    isVisible
  } = useScrollReveal();
  const services = [{
    icon: DollarSign,
    title: "Property Valuation",
    description: "Comprehensive market analysis and competitive pricing strategy to maximize your sale price."
  }, {
    icon: TrendingUp,
    title: "Strategic Pricing",
    description: "Data-driven pricing recommendations based on current market conditions and buyer demand."
  }, {
    icon: Camera,
    title: "Professional Marketing",
    description: "High-quality photography, virtual tours, and targeted digital campaigns to attract qualified buyers."
  }, {
    icon: Handshake,
    title: "Negotiation Support",
    description: "Expert negotiation to secure the best terms and highest price for your property."
  }];
  const benefits = ["Access to our extensive buyer network", "Professional staging consultation", "Premium listing placement on major platforms", "Weekly market updates and feedback reports", "Dedicated listing agent throughout the process", "Transparent communication at every step"];
  const processSteps = [{
    step: "01",
    title: "Consultation",
    description: "We meet to discuss your goals, timeline, and evaluate your property's unique selling points."
  }, {
    step: "02",
    title: "Valuation",
    description: "Comprehensive market analysis to determine the optimal listing price for maximum return."
  }, {
    step: "03",
    title: "Marketing",
    description: "Professional photography, virtual tours, and targeted marketing campaigns launch your listing."
  }, {
    step: "04",
    title: "Showings",
    description: "We coordinate and host showings, qualifying buyers and gathering feedback."
  }, {
    step: "05",
    title: "Closing",
    description: "Expert negotiation and transaction management through to a successful closing."
  }];
  const heroContent = <section className="relative bg-gradient-to-b from-secondary to-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-3">Residential / For Sellers</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Sell Your Property with Confidence
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          From valuation to closing, our team provides the expertise and marketing power to achieve the best possible outcome for your sale.
        </p>
      </div>
    </section>;
  return <>
      <SEOHelmet title="Sell Your Property | Bridge Advisory Group" description="Maximize your property's value with Bridge Advisory Group. Expert valuations, professional marketing, and skilled negotiation to achieve the best sale price in NYC." />

      <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
        {/* Services Grid */}
        <section ref={elementRef as React.RefObject<HTMLElement>} className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light mb-3">Our Seller Services</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">
                Comprehensive support at every stage of your selling journey.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service, index) => {
              const Icon = service.icon;
              return <div key={index} className="p-5 rounded-lg border border-border/50 bg-card hover:border-accent/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground font-light">
                      {service.description}
                    </p>
                  </div>;
            })}
            </div>
          </div>
        </section>

        {/* Why Sell with Bridge */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-light mb-4">Why Sell with Bridge</h2>
              <p className="text-muted-foreground font-light mb-6">
                Our integrated platform combines deep market expertise with powerful marketing capabilities to deliver exceptional results for sellers across NYC.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-light">{benefit}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light mb-3">Our Selling Process</h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">
                A streamlined approach designed to maximize your property's value and minimize stress.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {processSteps.map((step, index) => <div key={index} className="flex gap-5 p-5 rounded-lg border border-border/50 bg-card hover:border-accent/30 transition-colors">
                    <div className="text-2xl font-light text-accent/50">{step.step}</div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground font-light">{step.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-accent text-accent-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-3">Ready to Sell?</h2>
            <p className="text-lg font-light opacity-90 mb-6 max-w-2xl mx-auto">
              Get started with a free, no-obligation property valuation from our expert team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => openContactSheet()} className="gap-2">
                Request Valuation <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10" asChild>
                <Link to="/team">Meet Our Team</Link>
              </Button>
            </div>
          </div>
        </section>
      </ServicePageLayout>
    </>;
};
export default ResidentialSellers;