import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Home, Search, FileText, Key, Building2, MapPin, DollarSign, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContactSheet } from "@/contexts/ContactSheetContext";

const FindAHome = () => {
  const { openContactSheet } = useContactSheet();

  const rentalServices = [
    {
      icon: Search,
      title: "Apartment Search",
      description: "Access our exclusive inventory of rentals across Manhattan, Brooklyn, and Queens."
    },
    {
      icon: FileText,
      title: "Application Support",
      description: "We guide you through the entire application process, from documentation to approval."
    },
    {
      icon: Users,
      title: "Negotiation",
      description: "Our agents negotiate the best terms on your behalf, including rent and lease conditions."
    },
    {
      icon: Key,
      title: "Move-In Coordination",
      description: "Seamless transition from signing to moving in, with full support along the way."
    }
  ];

  const buyerServices = [
    {
      icon: Search,
      title: "Property Search",
      description: "Access exclusive listings and off-market opportunities tailored to your criteria."
    },
    {
      icon: DollarSign,
      title: "Financial Guidance",
      description: "Connect with trusted lenders and understand your purchasing power."
    },
    {
      icon: FileText,
      title: "Due Diligence",
      description: "Comprehensive building and unit analysis to ensure you make an informed decision."
    },
    {
      icon: Users,
      title: "Negotiation & Closing",
      description: "Expert representation from offer to closing, maximizing value at every step."
    }
  ];

  const rentalTypes = [
    {
      title: "Luxury Rentals",
      description: "Full-service buildings with doormen, gyms, and rooftop amenities.",
      features: ["Doorman buildings", "In-unit laundry", "Fitness centers", "Rooftop access"]
    },
    {
      title: "Brooklyn Living",
      description: "Brownstones and modern developments in Brooklyn's best neighborhoods.",
      features: ["Garden apartments", "Townhouse rentals", "New developments", "Historic buildings"]
    },
    {
      title: "Value Options",
      description: "Quality apartments at competitive prices throughout the city.",
      features: ["No-fee apartments", "Rent-stabilized units", "Walk-up buildings", "Flexible terms"]
    }
  ];

  const propertyTypes = [
    {
      title: "Condos",
      description: "Full ownership with modern amenities and building services.",
      features: ["Tax benefits", "Easier financing", "Building amenities", "Flexible subletting"]
    },
    {
      title: "Co-ops",
      description: "Cooperative ownership often at lower price points.",
      features: ["Lower prices", "Community feel", "Maintenance included", "Stable buildings"]
    },
    {
      title: "Townhouses",
      description: "Multi-floor living with private outdoor space.",
      features: ["Private entrance", "Outdoor space", "Multiple floors", "Rental income potential"]
    }
  ];

  const rentalProcess = [
    { step: "1", title: "Consultation", description: "Tell us your needs, budget, and preferred neighborhoods." },
    { step: "2", title: "Curated Search", description: "We match you with properties that fit your criteria." },
    { step: "3", title: "Tours", description: "Visit your top choices with a dedicated agent." },
    { step: "4", title: "Application", description: "We prepare and submit your complete application package." },
    { step: "5", title: "Move-In", description: "Lease signing and key pickup—welcome home." }
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Find a Home</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Find Your Perfect NYC Home
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Whether you're renting or buying, our team provides personalized guidance to find your ideal residence.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="rentals" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="rentals" className="text-base">Rentals</TabsTrigger>
            <TabsTrigger value="sales" className="text-base">Buy</TabsTrigger>
          </TabsList>

          {/* Rentals Tab */}
          <TabsContent value="rentals" className="space-y-20">
            {/* Services */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Rental Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rentalServices.map((service) => (
                  <div key={service.title} className="bg-secondary/30 rounded-lg p-6 border border-border">
                    <service.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Rental Types */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Types of Rentals</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {rentalTypes.map((type) => (
                  <div key={type.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{type.title}</h3>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section className="bg-secondary/30 rounded-xl p-8 border border-border">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">The Rental Process</h2>
              <div className="grid md:grid-cols-5 gap-4">
                {rentalProcess.map((item, index) => (
                  <div key={item.step} className="text-center relative">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    {index < rentalProcess.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Find Your Rental?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect with one of our rental specialists to start your apartment search today.
              </p>
              <Button size="lg" onClick={openContactSheet}>
                Start Your Search
              </Button>
            </section>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-20">
            {/* Services */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Buyer Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {buyerServices.map((service) => (
                  <div key={service.title} className="bg-secondary/30 rounded-lg p-6 border border-border">
                    <service.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Property Types */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Property Types</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {propertyTypes.map((type) => (
                  <div key={type.title} className="bg-secondary/20 rounded-lg p-6 border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{type.title}</h3>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Buy with Bridge */}
            <section className="bg-secondary/30 rounded-xl p-8 border border-border">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why Buy with Bridge</h2>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-primary mb-2">$500M+</p>
                  <p className="text-muted-foreground">In Transactions</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary mb-2">200+</p>
                  <p className="text-muted-foreground">Homes Sold</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary mb-2">15+</p>
                  <p className="text-muted-foreground">Years Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary mb-2">5</p>
                  <p className="text-muted-foreground">Boroughs Covered</p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Buy?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a consultation with one of our buyer specialists to discuss your goals.
              </p>
              <Button size="lg" onClick={openContactSheet}>
                Schedule Consultation
              </Button>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </ServicePageLayout>
  );
};

export default FindAHome;
