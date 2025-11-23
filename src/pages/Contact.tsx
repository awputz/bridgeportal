import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { COMPANY_INFO } from "@/lib/constants";

const Contact = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, userType: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase.functions.invoke("submit-inquiry", {
        body: {
          name: `${formData.get('firstName')} ${formData.get('lastName')}`,
          email: formData.get('email'),
          phone: formData.get('phone'),
          notes: formData.get('message') || formData.get('agentMessage'),
          user_type: userType,
          requirements: formData.get('experience') ? `${formData.get('experience')} years experience` : undefined
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you within one business day."
      });
      
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8 md:mb-12 pt-4 md:pt-8">
        <div className="container mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl md:text-5xl">Contact</h1>
          <p className="text-sm md:text-xl text-muted max-w-2xl leading-relaxed mb-4">
            Get in touch. We respond within one business day.
          </p>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            {COMPANY_INFO.name} is the dedicated residential division of {COMPANY_INFO.parentCompany}.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Contact Info - Stack on Mobile */}
          <div className="space-y-4 md:space-y-8">
            <div className="group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-accent/20 transition-colors">
                <MapPin className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold mb-2 text-sm md:text-base">Office</h3>
              <p className="text-sm md:text-base text-muted leading-relaxed">
                {COMPANY_INFO.address.street}<br />
                {COMPANY_INFO.address.floors}<br />
                {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zip}
              </p>
            </div>

            <div className="group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-accent/20 transition-colors">
                <Phone className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold mb-2 text-sm md:text-base">Phone</h3>
              <a href={`tel:${COMPANY_INFO.contact.phone.replace(/\D/g, '')}`} className="text-sm md:text-base text-muted hover:text-foreground transition-colors">
                {COMPANY_INFO.contact.phone}
              </a>
            </div>

            <div className="group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-accent/20 transition-colors">
                <Mail className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold mb-2 text-sm md:text-base">Email</h3>
              <a href={`mailto:${COMPANY_INFO.contact.email}`} className="text-sm md:text-base text-muted hover:text-foreground transition-colors break-all">
                {COMPANY_INFO.contact.email}
              </a>
            </div>
          </div>

          {/* Contact Forms - Simplified for Mobile */}
          <div className="lg:col-span-2">
            <Card className="p-4 md:p-8 border border-border rounded-lg">
              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8 h-auto">
                  <TabsTrigger value="general" className="text-xs md:text-sm py-2">General</TabsTrigger>
                  <TabsTrigger value="agent" className="text-xs md:text-sm py-2">Join as Agent</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <form className="space-y-4 md:space-y-6" onSubmit={(e) => handleSubmit(e, 'general')}>
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
                      <Label htmlFor="message" className="text-xs md:text-sm">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help?"
                        rows={4}
                        className="text-sm resize-none"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full rounded-full text-sm" size="lg">
                      Send Message
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="agent">
                  <form className="space-y-4 md:space-y-6" onSubmit={(e) => handleSubmit(e, 'agent')}>
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                      <div>
                        <Label htmlFor="agentFirstName" className="text-xs md:text-sm">First Name</Label>
                        <Input id="agentFirstName" name="firstName" placeholder="John" className="h-10 md:h-11 text-sm" required />
                      </div>
                      <div>
                        <Label htmlFor="agentLastName" className="text-xs md:text-sm">Last Name</Label>
                        <Input id="agentLastName" name="lastName" placeholder="Smith" className="h-10 md:h-11 text-sm" required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="agentEmail" className="text-xs md:text-sm">Email</Label>
                      <Input id="agentEmail" name="email" type="email" placeholder="john@example.com" className="h-10 md:h-11 text-sm" required />
                    </div>

                    <div>
                      <Label htmlFor="agentPhone" className="text-xs md:text-sm">Phone</Label>
                      <Input id="agentPhone" name="phone" type="tel" placeholder="(555) 123-4567" className="h-10 md:h-11 text-sm" />
                    </div>

                    <div>
                      <Label htmlFor="experience" className="text-xs md:text-sm">Years Experience</Label>
                      <Input id="experience" name="experience" placeholder="5" className="h-10 md:h-11 text-sm" required />
                    </div>

                    <div>
                      <Label htmlFor="agentMessage" className="text-xs md:text-sm">Why BRIDGE?</Label>
                      <Textarea
                        id="agentMessage"
                        name="agentMessage"
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="text-sm resize-none"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full rounded-full text-sm" size="lg">
                      Submit Application
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
