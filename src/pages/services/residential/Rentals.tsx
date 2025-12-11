import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Search, Shield, CheckCircle, ArrowRight, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Rentals = () => {
  const rentalServices = [
    {
      icon: Search,
      title: "Apartment Search",
      description: "Comprehensive search across our exclusive portfolio and the broader NYC market to find your perfect rental.",
    },
    {
      icon: Shield,
      title: "Application Support",
      description: "Guidance through the application process, documentation requirements, and board package preparation.",
    },
    {
      icon: Users,
      title: "Negotiation",
      description: "Expert negotiation of lease terms, concessions, and renewal options on your behalf.",
    },
    {
      icon: Clock,
      title: "Move-In Coordination",
      description: "Seamless coordination of lease signing, key pickup, and move-in logistics.",
    },
  ];

  const rentalTypes = [
    {
      title: "Luxury Rentals",
      description: "High-end apartments in Manhattan's most prestigious buildings with premium amenities.",
      features: ["Doorman buildings", "Roof decks", "Fitness centers", "Concierge services"],
    },
    {
      title: "Brooklyn Living",
      description: "Trendy apartments in Brooklyn's most sought-after neighborhoods.",
      features: ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights"],
    },
    {
      title: "Affordable Options",
      description: "Quality rentals across all price points throughout the five boroughs.",
      features: ["Studios to 4BR", "No-fee options", "Flexible terms", "Pet-friendly"],
    },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Rentals</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Rental Services
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Find your perfect New York City apartment with personalized guidance from our 
          experienced residential team.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Services */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            How We Help Renters
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            From search to move-in, we handle every aspect of finding your next home.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalServices.map((service) => (
              <div key={service.title} className="bg-secondary/20 rounded-lg p-6 border border-border text-center">
                <service.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Types */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Rentals for Every Lifestyle
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {rentalTypes.map((type) => (
              <div key={type.title} className="bg-background rounded-lg p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">{type.title}</h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Our Rental Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Consultation", desc: "Discuss your needs, budget, and preferred neighborhoods" },
              { step: "02", title: "Search", desc: "We curate listings that match your specific criteria" },
              { step: "03", title: "Tours", desc: "Scheduled viewings at your convenience" },
              { step: "04", title: "Move In", desc: "Application, lease signing, and key pickup" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Start Your Rental Search
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Tell us what you're looking for and we'll find your perfect NYC apartment.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Rentals;
