import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Join = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase.functions.invoke("submit-inquiry", {
        body: {
          name: `${formData.get('firstName')} ${formData.get('lastName')}`,
          email: formData.get('email'),
          phone: formData.get('phone'),
          user_type: 'agent',
          notes: `Real Estate Application:
License: ${formData.get('license')}
Experience: ${formData.get('experience')} years
Current Brokerage: ${formData.get('currentBrokerage')}
Transaction Volume: ${formData.get('transactions')}
Why BRIDGE: ${formData.get('why')}
LinkedIn/Resume: ${formData.get('resume')}`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted!",
        description: "We'll review your application and respond within 3-5 business days."
      });
      
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="min-h-screen pt-24 md:pt-32 lg:pt-40 pb-20">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 md:mb-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-4 md:mb-6 text-3xl md:text-5xl">Join BRIDGE Residential</h1>
          <p className="text-sm md:text-xl text-muted-foreground px-2">
            Build your career with real marketing support and established systems
          </p>
        </div>
      </section>

      {/* Why Join - Mobile Optimized */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 md:mb-20 bg-surface py-12 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center mb-8 md:mb-12 text-2xl md:text-4xl">Why BRIDGE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <Card className="p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Real Lead Flow</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                100+ active listings and deep landlord relationships
              </p>
            </Card>

            <Card className="p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Marketing Support</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Professional photography and digital campaigns
              </p>
            </Card>

            <Card className="p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Back Office</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Transaction coordination and admin support
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form - Simplified for Mobile */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-4 md:p-8">
            <h2 className="text-center mb-6 md:mb-8 text-2xl md:text-3xl">Apply Now</h2>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-xs md:text-sm">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" className="h-10 md:h-11 text-sm" required />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-xs md:text-sm">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Smith" className="h-10 md:h-11 text-sm" required />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-xs md:text-sm">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" className="h-10 md:h-11 text-sm" required />
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs md:text-sm">Phone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className="h-10 md:h-11 text-sm" />
              </div>

              <div>
                <Label htmlFor="experience" className="text-xs md:text-sm">Years of Experience</Label>
                <Input id="experience" name="experience" placeholder="5" className="h-10 md:h-11 text-sm" required />
              </div>

              <div>
                <Label htmlFor="why" className="text-xs md:text-sm">Why BRIDGE Residential?</Label>
                <Textarea
                  id="why"
                  name="why"
                  placeholder="Tell us about your background..."
                  rows={4}
                  className="text-sm resize-none"
                  required
                />
              </div>

              <Button type="submit" className="w-full text-sm" size="lg">
                Submit Application
              </Button>

              <p className="text-xs md:text-sm text-center text-muted-foreground">
                We respond within 3-5 business days
              </p>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Join;
