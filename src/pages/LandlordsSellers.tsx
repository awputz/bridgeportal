import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, TrendingUp, FileCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const LandlordsSellers = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase.functions.invoke("submit-inquiry", {
        body: {
          name: `${formData.get('firstName')} ${formData.get('lastName')}`,
          email: formData.get('email'),
          phone: formData.get('phone'),
          user_type: 'seller',
          property_address: formData.get('location') as string,
          requirements: `Property Type: ${formData.get('propertyType')}`,
          notes: `Company: ${formData.get('company')}
Project Details: ${formData.get('details')}`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Consultation request received!",
        description: "Our team will contact you shortly to discuss your property."
      });
      
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="min-h-screen pt-40 pb-20">
      {/* Hero */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6">For Landlords & Sellers</h1>
          <p className="text-xl text-muted-foreground">
            Building-level leasing, new development launches, and comprehensive sales strategy. We handle everything from marketing to reporting with full transparency and dedicated support.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16 bg-surface py-12 md:py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center mb-8 md:mb-10">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <Building2 className="mx-auto mb-4 text-accent" size={48} />
              <h3 className="text-xl font-semibold mb-4">Building Leasing</h3>
              <p className="text-muted-foreground">
                Full building exclusive representation with coordinated marketing, showings, and tenant placement
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <TrendingUp className="mx-auto mb-4 text-accent" size={48} />
              <h3 className="text-xl font-semibold mb-4">Launch Strategy</h3>
              <p className="text-muted-foreground">
                New development marketing with pricing strategy, competitive analysis, and launch coordination
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <FileCheck className="mx-auto mb-4 text-accent" size={48} />
              <h3 className="text-xl font-semibold mb-4">Sales Advisory</h3>
              <p className="text-muted-foreground">
                Comprehensive sales strategy with market positioning, buyer outreach, and closing support
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center mb-8 md:mb-10">Recent Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "12-Unit Building Lease-Up",
                location: "Upper West Side",
                metric: "100% occupancy in 45 days",
                result: "$5,500 average rent, 15% above market"
              },
              {
                title: "New Development Launch",
                location: "Williamsburg",
                metric: "18 units sold in 3 months",
                result: "$1.2M average sale price"
              },
              {
                title: "Luxury Condo Sale",
                location: "Tribeca",
                metric: "$3.5M closing price",
                result: "5% above asking, multiple offers"
              }
            ].map((study, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold mb-2">{study.title}</h3>
                <p className="text-sm text-accent mb-4">{study.location}</p>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{study.metric}</div>
                  <p className="text-sm text-muted-foreground">{study.result}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="px-6 lg:px-8 mb-12 md:mb-16 bg-surface py-12 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-center mb-8 md:mb-10">What We Provide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Marketing & Exposure</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Professional photography and floor plans</li>
                <li>• Listing syndication across all major platforms</li>
                <li>• Targeted email campaigns to qualified buyers/renters</li>
                <li>• Social media and digital advertising</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Operations & Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Dedicated agent and back office team</li>
                <li>• Coordinated showings and open houses</li>
                <li>• Application screening and processing</li>
                <li>• Weekly performance reporting</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Market Intelligence</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Competitive pricing analysis</li>
                <li>• Neighborhood market trends</li>
                <li>• Buyer/renter feedback and insights</li>
                <li>• Strategy adjustments based on data</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Closing Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Lease negotiation and documentation</li>
                <li>• Attorney and board package coordination</li>
                <li>• Move-in/closing timeline management</li>
                <li>• Post-closing follow-up</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8">
            <h2 className="text-center mb-6 md:mb-8">Request a Consultation</h2>
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
                <Label htmlFor="company">Company / Building Name</Label>
                <Input id="company" name="company" placeholder="ABC Properties" />
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
                <Label htmlFor="propertyType">Property Type</Label>
                <Input id="propertyType" name="propertyType" placeholder="Multi-family building, condo, etc." required />
              </div>
              
              <div>
                <Label htmlFor="location">Property Location</Label>
                <Input id="location" name="location" placeholder="Neighborhood or address" required />
              </div>
              
              <div>
                <Label htmlFor="details">Project Details</Label>
                <Textarea 
                  id="details"
                  name="details"
                  placeholder="Tell us about your property and goals..."
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" size="lg">Request Consultation</Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandlordsSellers;
