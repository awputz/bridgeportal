import { ServicePageLayout } from "@/components/ServicePageLayout";
import { CheckCircle, ArrowRight, Clock, DollarSign, FileText, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";

const Dispositions = () => {
  const { openContactSheet } = useContactSheet();
  const dispositionProcess = [
    {
      step: "01",
      title: "Property Valuation",
      description: "Comprehensive market analysis and property valuation to establish optimal pricing strategy and identify potential value enhancement opportunities.",
    },
    {
      step: "02",
      title: "Marketing Strategy",
      description: "Custom marketing approach targeting qualified buyers through our proprietary database, broker networks, and strategic digital campaigns.",
    },
    {
      step: "03",
      title: "Buyer Qualification",
      description: "Rigorous vetting of potential buyers to ensure financial capability, timeline alignment, and serious intent to close.",
    },
    {
      step: "04",
      title: "Offer Management",
      description: "Strategic management of the offer process, creating competitive tension while maintaining deal certainty for sellers.",
    },
    {
      step: "05",
      title: "Due Diligence Support",
      description: "Proactive management of the due diligence period, anticipating buyer concerns and facilitating smooth information flow.",
    },
    {
      step: "06",
      title: "Closing Coordination",
      description: "End-to-end transaction management ensuring timely closing with all legal, financial, and operational requirements met.",
    },
  ];

  const sellerBenefits = [
    {
      icon: DollarSign,
      title: "Maximum Value",
      description: "Our market expertise and buyer relationships consistently achieve premium pricing for our clients.",
    },
    {
      icon: Clock,
      title: "Efficient Timeline",
      description: "Streamlined processes and proactive management minimize time to close while maintaining deal quality.",
    },
    {
      icon: Target,
      title: "Qualified Buyers",
      description: "Access to our extensive database of vetted, active buyers ready to transact.",
    },
    {
      icon: FileText,
      title: "Full Documentation",
      description: "Professional marketing materials and comprehensive due diligence packages that instill buyer confidence.",
    },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Investment Sales / Dispositions</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Disposition Services
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Maximize value and ensure certainty of execution when selling your multifamily, 
          mixed-use, or commercial real estate assets.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="investment-sales" heroContent={heroContent}>
      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Strategic Disposition Advisory
              </h2>
              <p className="text-muted-foreground mb-6">
                Selling a property is one of the most significant financial decisions an owner can make. 
                Bridge Investment Sales brings unparalleled market knowledge, buyer relationships, and 
                transaction expertise to ensure you achieve the best possible outcome.
              </p>
              <p className="text-muted-foreground mb-6">
                Our disposition team has successfully sold over $3 billion in real estate assets across 
                New York City, representing private owners, family offices, and institutional investors 
                in transactions ranging from $1 million to $100+ million.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">98% Closing Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Above-Market Pricing</span>
                </div>
              </div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">$3B+</p>
                  <p className="text-muted-foreground text-sm">Properties Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">200+</p>
                  <p className="text-muted-foreground text-sm">Transactions Closed</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">98%</p>
                  <p className="text-muted-foreground text-sm">Closing Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">45</p>
                  <p className="text-muted-foreground text-sm">Avg Days to Contract</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Benefits */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Why Sell With Bridge
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Our sellers benefit from our comprehensive approach to maximizing value and ensuring smooth transactions.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerBenefits.map((benefit) => (
              <div key={benefit.title} className="bg-background rounded-lg p-6 border border-border">
                <benefit.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disposition Process */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Our Disposition Process
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A proven methodology for achieving optimal outcomes in every sale.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dispositionProcess.map((step) => (
              <div
                key={step.step}
                className="bg-secondary/20 rounded-lg p-6 border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Approach */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Marketing Excellence
              </h2>
              <p className="text-muted-foreground mb-6">
                Every property we represent receives a customized marketing strategy designed 
                to reach the most qualified buyers and generate maximum interest.
              </p>
              <div className="space-y-4">
                {[
                  "Professional photography and videography",
                  "Comprehensive offering memorandums",
                  "Targeted digital marketing campaigns",
                  "Broker network outreach",
                  "Confidential or marketed approaches available",
                  "Virtual tour capabilities",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Buyer Access
              </h2>
              <p className="text-muted-foreground mb-6">
                Our proprietary database and industry relationships ensure your property 
                reaches serious, qualified buyers.
              </p>
              <div className="space-y-4">
                {[
                  "5,000+ active buyer relationships",
                  "Institutional investor network",
                  "Private equity connections",
                  "Family office relationships",
                  "International buyer access",
                  "1031 exchange buyer database",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Considering Selling Your Property?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Request a complimentary property valuation and learn how we can maximize your return.
          </p>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>
            Request Valuation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Dispositions;
