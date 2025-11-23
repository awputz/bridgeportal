import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const RentersBuyers = () => {
  const hero = useScrollAnimation();
  const intro = useScrollAnimation();
  const landlord = useScrollAnimation();
  const tenant = useScrollAnimation();
  const whyLeasing = useScrollAnimation();
  const salesIntro = useScrollAnimation();
  const seller = useScrollAnimation();
  const buyer = useScrollAnimation();
  const sponsor = useScrollAnimation();
  const whySales = useScrollAnimation();
  const contact = useScrollAnimation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase.functions.invoke("submit-inquiry", {
        body: {
          name: `${formData.get('firstName')} ${formData.get('lastName')}`,
          email: formData.get('email'),
          phone: formData.get('phone'),
          user_type: 'renter',
          budget: formData.get('budget') as string,
          neighborhoods: formData.get('neighborhoods') as string,
          timing: formData.get('timeline') as string,
          notes: formData.get('details') as string
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Search request submitted!",
        description: "Our team will reach out to you shortly with personalized recommendations."
      });
      
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting search request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="min-h-screen pt-36 pb-20">
      {/* Hero */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16 pt-8">
        <div 
          ref={hero.elementRef}
          className={`container mx-auto max-w-4xl text-center transition-all duration-700 ${
            hero.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="mb-6">For Renters & Buyers</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We handle your entire New York City search—from first conversation to signed lease or closing. Full access to our portfolio plus off-market opportunities.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16">
        <div 
          ref={intro.elementRef}
          className={`container mx-auto max-w-4xl transition-all duration-700 delay-100 ${
            intro.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            Bridge Advisory Group offers a fully integrated leasing platform for residential property owners, developers, and renters across New York City. Our team handles everything from listing strategy to lease signing, ensuring high occupancy, optimal pricing, and minimal downtime.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-6">
            Each listing is supported by Bridge AI, our in-house leasing intelligence system designed to streamline marketing, match qualified tenants, and respond to inquiries in real time—giving our clients a competitive advantage in a fast-moving market.
          </p>
        </div>
      </section>

      {/* Landlord Representation */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16 bg-surface py-12 md:py-16">
        <div 
          ref={landlord.elementRef}
          className={`container mx-auto max-w-5xl transition-all duration-700 ${
            landlord.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="mb-4">Landlord Representation</h2>
          <p className="text-muted-foreground mb-8 md:mb-12 max-w-3xl">
            Our residential leasing division works with landlords, portfolio managers, and developers to drive lease velocity while ensuring tenant quality and retention.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold mb-4">Pricing & Market Positioning</h3>
              <p className="text-muted-foreground leading-relaxed">
                We evaluate real-time rental comps and market absorption to establish strategic pricing—automatically updated and monitored through Bridge AI.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Listing Exposure & Marketing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every unit receives premium photography, branded marketing, and syndication across top platforms. Bridge AI boosts visibility by continuously re-ranking listings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Lead Management & Showings</h3>
              <p className="text-muted-foreground leading-relaxed">
                Inquiries are qualified, tracked, and scheduled through our AI-powered response system—ensuring no lead is missed and all showings are optimized.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Application & Lease Execution</h3>
              <p className="text-muted-foreground leading-relaxed">
                We oversee the full lease process from application vetting to signing, using digital tools to streamline approvals and protect ownership interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tenant Representation */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16">
        <div 
          ref={tenant.elementRef}
          className={`container mx-auto max-w-5xl transition-all duration-700 ${
            tenant.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="mb-4">Tenant Representation</h2>
          <p className="text-muted-foreground mb-8 md:mb-12 max-w-3xl">
            We help individuals, families, and corporate renters secure apartments across Manhattan, Brooklyn, and Queens, with personalized support backed by our internal data engine.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-semibold mb-4">Search & Discovery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bridge AI recommends listings based on your specific preferences—location, price point, building features, and more—surfacing both on- and off-market options.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Tour Scheduling & Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our team coordinates tours and provides detailed walkthroughs of neighborhoods, buildings, and unit details, making the search process seamless.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Application Assistance</h3>
              <p className="text-muted-foreground leading-relaxed">
                We guide clients through application submission, document collection, credit review, and lease signing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bridge Leasing */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16 bg-foreground text-background py-12 md:py-16">
        <div 
          ref={whyLeasing.elementRef}
          className={`container mx-auto max-w-4xl transition-all duration-700 ${
            whyLeasing.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="mb-8 md:mb-10">Why Bridge Residential Leasing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Tech-enhanced leasing powered by Bridge AI",
              "Deep inventory access and landlord relationships across NYC",
              "Fast response time and 7-day-a-week coverage",
              "High-touch service with a data-first approach",
              "End-to-end management for both owners and tenants"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle2 className="flex-shrink-0 mt-1" size={20} />
                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Intro */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16">
        <div 
          ref={salesIntro.elementRef}
          className={`container mx-auto max-w-4xl transition-all duration-700 ${
            salesIntro.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            Bridge Advisory Group provides full-service residential sales representation across New York City, working with buyers, sellers, and developers to execute transactions with precision. From townhomes and co-ops to condominiums and new developments, our team delivers tailored guidance backed by real-time data, strategic positioning, and in-house technology.
          </p>
        </div>
      </section>

      {/* Seller Representation */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16 bg-surface py-12 md:py-16">
        <div 
          ref={seller.elementRef}
          className={`container mx-auto max-w-5xl transition-all duration-700 ${
            seller.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="mb-4">Seller Representation</h2>
          <p className="text-muted-foreground mb-8 md:mb-12 max-w-3xl">
            Our residential sales platform is designed to maximize value and drive results through a combination of market expertise and technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-semibold mb-4">Valuation & Market Strategy</h3>
              <p className="text-muted-foreground leading-relaxed">
                We provide customized pricing analysis built on comps, absorption trends, building-level insights, and buyer demand data.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Marketing & Visibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every property is launched with high-quality visuals and strategic outreach. Bridge AI amplifies this by automatically targeting active buyers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Negotiation & Deal Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                We guide sellers through the full process—from offer evaluation to board approval and closing—ensuring seamless, transparent transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Representation */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16">
        <div 
          ref={buyer.elementRef}
          className={`container mx-auto max-w-5xl transition-all duration-700 ${
            buyer.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="mb-4">Buyer Representation</h2>
          <p className="text-muted-foreground mb-8 md:mb-12 max-w-3xl">
            We work closely with individual buyers, family offices, and investors to identify the right opportunities and navigate complex purchase processes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-semibold mb-4">Search & Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                We combine local expertise with the power of Bridge AI, which flags relevant listings based on your preferences—even before they hit the market.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Offer Strategy & Execution</h3>
              <p className="text-muted-foreground leading-relaxed">
                We handle negotiations, contract review, and due diligence to ensure every step is protected and aligned with your goals.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Closing & Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                From lender referrals to closing table logistics, we remain fully engaged through the finish line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Sales */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16 bg-surface py-12 md:py-16">
        <div 
          ref={sponsor.elementRef}
          className={`container mx-auto max-w-5xl transition-all duration-700 ${
            sponsor.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="mb-4">Sponsor Sales & New Development</h2>
          <p className="text-muted-foreground mb-8 md:mb-10 max-w-3xl">
            Our team also advises developers and property owners on residential sellouts and unit-by-unit strategies. We act as your on-the-ground partner to deliver:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Pre-development planning and market strategy",
              "Pricing, staging, and rollout timelines",
              "Broker network outreach and campaign coordination",
              "Full integration of Bridge AI to match active buyers and streamline showings"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bridge Sales */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16">
        <div 
          ref={whySales.elementRef}
          className={`container mx-auto max-w-4xl transition-all duration-700 ${
            whySales.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="mb-8 md:mb-10">Why Bridge Residential</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Proprietary AI platform to enhance listing exposure and match qualified buyers",
              "Sharp market analysis and pricing intelligence",
              "Boutique, white-glove client service",
              "Deep relationships with buyer agents, developers, and lenders",
              "Integrated marketing and transaction support from listing to close"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle2 className="flex-shrink-0 mt-1 text-accent" size={20} />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 lg:px-8">
        <div 
          ref={contact.elementRef}
          className={`container mx-auto max-w-2xl transition-all duration-700 ${
            contact.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Card className="p-8 border border-border rounded-lg">
            <h2 className="mb-6 md:mb-8 text-center">Start Your Search</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Smith" required />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Input id="budget" name="budget" placeholder="$3,000 - $4,000 per month" required />
              </div>
              
              <div>
                <Label htmlFor="neighborhoods">Preferred Neighborhoods</Label>
                <Input id="neighborhoods" name="neighborhoods" placeholder="Upper West Side, Williamsburg, etc." required />
              </div>
              
              <div>
                <Label htmlFor="timeline">Move-in Timeline</Label>
                <Input id="timeline" name="timeline" placeholder="Within 2 months" />
              </div>
              
              <div>
                <Label htmlFor="details">Additional Details</Label>
                <Textarea 
                  id="details"
                  name="details"
                  placeholder="Tell us about your search..."
                  rows={4}
                />
              </div>
              
              <Button type="submit" className="w-full rounded-full" size="lg">Submit Search Request</Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default RentersBuyers;
