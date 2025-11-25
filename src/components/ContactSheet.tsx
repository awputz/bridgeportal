import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail, Instagram, Linkedin } from "lucide-react";

interface ContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: string;
}

export const ContactSheet = ({ open, onOpenChange, initialTab = "general" }: ContactSheetProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Update active tab when initialTab changes
  useState(() => {
    if (open && initialTab) {
      setActiveTab(initialTab);
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto bg-background/98 backdrop-blur-3xl border-l border-white/10">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-xl md:text-2xl font-light">Connect with BRIDGE</SheetTitle>
          <SheetDescription className="font-light text-sm md:text-base">
            Get in touch with our team. We respond to all inquiries within one business day.
          </SheetDescription>
        </SheetHeader>

        {/* Contact Info */}
        <div className="space-y-8 mb-8 pb-8 border-b">
          <div className="group">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <MapPin className="text-accent" size={18} />
            </div>
            <h3 className="font-semibold mb-1 text-sm">Office</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              600 Third Avenue<br />
              New York, NY 10016
            </p>
          </div>

          <div className="group">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <Phone className="text-accent" size={18} />
            </div>
            <h3 className="font-semibold mb-1 text-sm">Phone</h3>
            <a href="tel:+12125550100" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              (212) 555-0100
            </a>
          </div>

          <div className="group">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <Mail className="text-accent" size={18} />
            </div>
            <h3 className="font-semibold mb-1 text-sm">Email</h3>
            <a href="mailto:isales@bridgenyre.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              isales@bridgenyre.com
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 pt-4">
            <a
              href="https://linkedin.com/company/bridge-advisory-group"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Contact Forms */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="general">General Inquiry</TabsTrigger>
              <TabsTrigger value="agent">Join as Agent</TabsTrigger>
              <TabsTrigger value="deal">Submit a Deal</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-xs font-light">First Name</Label>
                    <Input id="firstName" placeholder="John" className="mt-1 h-12" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs font-light">Last Name</Label>
                    <Input id="lastName" placeholder="Smith" className="mt-1 h-12" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs font-light">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs font-light">Phone</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-xs font-light">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="message" className="text-xs font-light">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="mt-1"
                  />
                </div>

                <Button className="w-full font-light" size="lg">
                  Send Message
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="agent">
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agentFirstName" className="text-xs font-light">First Name</Label>
                    <Input id="agentFirstName" placeholder="John" className="mt-1 h-12" />
                  </div>
                  <div>
                    <Label htmlFor="agentLastName" className="text-xs font-light">Last Name</Label>
                    <Input id="agentLastName" placeholder="Smith" className="mt-1 h-12" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="agentEmail" className="text-xs font-light">Email</Label>
                  <Input id="agentEmail" type="email" placeholder="john@example.com" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="agentPhone" className="text-xs font-light">Phone</Label>
                  <Input id="agentPhone" type="tel" placeholder="(555) 123-4567" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-xs font-light">Years of Experience</Label>
                  <Input id="experience" type="number" placeholder="5" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="license" className="text-xs font-light">Real Estate License Number</Label>
                  <Input id="license" placeholder="License #" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="focus" className="text-xs font-light">Geographic Focus Areas</Label>
                  <Input id="focus" placeholder="Manhattan, Brooklyn, Queens..." className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-xs font-light">Brief Bio / Background</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your experience and why you'd like to join Bridge..."
                    rows={5}
                    className="mt-1"
                  />
                </div>

                <Button className="w-full font-light" size="lg">
                  Submit Application
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="deal">
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dealFirstName" className="text-xs font-light">First Name</Label>
                    <Input id="dealFirstName" placeholder="John" className="mt-1 h-12" />
                  </div>
                  <div>
                    <Label htmlFor="dealLastName" className="text-xs font-light">Last Name</Label>
                    <Input id="dealLastName" placeholder="Smith" className="mt-1 h-12" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dealEmail" className="text-xs font-light">Email</Label>
                  <Input id="dealEmail" type="email" placeholder="john@example.com" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="dealPhone" className="text-xs font-light">Phone</Label>
                  <Input id="dealPhone" type="tel" placeholder="(555) 123-4567" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="propertyAddress" className="text-xs font-light">Property Address</Label>
                  <Input id="propertyAddress" placeholder="123 Main St, Brooklyn, NY" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="propertyType" className="text-xs font-light">Property Type</Label>
                  <Input id="propertyType" placeholder="Multifamily, Mixed-Use, etc." className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="estimatedValue" className="text-xs font-light">Estimated Value</Label>
                  <Input id="estimatedValue" placeholder="$5,000,000" className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="currentUse" className="text-xs font-light">Current Use / Situation</Label>
                  <Input id="currentUse" placeholder="Stabilized, value-add, etc." className="mt-1 h-12" />
                </div>

                <div>
                  <Label htmlFor="dealDetails" className="text-xs font-light">Additional Details</Label>
                  <Textarea
                    id="dealDetails"
                    placeholder="Tell us more about the property and your goals..."
                    rows={5}
                    className="mt-1"
                  />
                </div>

                <Button className="w-full font-light" size="lg">
                  Submit Deal
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
