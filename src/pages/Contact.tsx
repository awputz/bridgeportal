import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { COMPANY_INFO } from "@/lib/constants";

const Contact = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase.from("inquiries").insert([{
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        notes: formData.get('message') as string,
        inquiry_type: 'Investment Sales',
        user_type: 'team'
      }]);
      
      if (error) throw error;
      
      toast({
        title: "Message sent",
        description: "We'll respond within one business day."
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
    <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36">
      {/* Header */}
      <section className="px-6 lg:px-8 mb-16 md:mb-20 lg:mb-24">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 md:mb-8 tracking-tight">Contact</h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-loose">
            Speak with the {COMPANY_INFO.name} team. We respond within one business day.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-10 md:space-y-12">
            <div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <MapPin className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold mb-2">Office</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {COMPANY_INFO.address.street}<br />
                {COMPANY_INFO.address.floors}<br />
                {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zip}
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Phone className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <a href={`tel:${COMPANY_INFO.contact.phone.replace(/\D/g, '')}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {COMPANY_INFO.contact.phone}
              </a>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Mail className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href={`mailto:${COMPANY_INFO.contact.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {COMPANY_INFO.contact.email}
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 md:p-10 lg:p-12 border border-border">
              <form className="space-y-6 md:space-y-7" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;