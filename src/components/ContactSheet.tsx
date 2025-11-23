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
}

export const ContactSheet = ({ open, onOpenChange }: ContactSheetProps) => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl">Contact</SheetTitle>
          <SheetDescription>
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
            <a href="mailto:hello@bridgeresidential.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              hello@bridgeresidential.com
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 pt-4">
            <a
              href="https://instagram.com/bridgeresidential"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://linkedin.com/company/bridge-residential"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Contact Forms */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="agent">Join As Agent</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-xs">First Name</Label>
                    <Input id="firstName" placeholder="John" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                    <Input id="lastName" placeholder="Smith" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-xs">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="message" className="text-xs">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button className="w-full rounded-full" size="lg">
                  Send Message
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="agent">
              <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs text-muted-foreground">
                  Interested in joining BRIDGE Residential? Fill out this form or visit our{" "}
                  <a href="/join" className="text-foreground hover:underline underline-offset-4">dedicated careers page</a>.
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agentFirstName" className="text-xs">First Name</Label>
                    <Input id="agentFirstName" placeholder="John" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="agentLastName" className="text-xs">Last Name</Label>
                    <Input id="agentLastName" placeholder="Smith" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="agentEmail" className="text-xs">Email</Label>
                  <Input id="agentEmail" type="email" placeholder="john@example.com" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="agentPhone" className="text-xs">Phone</Label>
                  <Input id="agentPhone" type="tel" placeholder="(555) 123-4567" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-xs">Years of Experience</Label>
                  <Input id="experience" placeholder="5" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="agentMessage" className="text-xs">Why BRIDGE Residential?</Label>
                  <Textarea
                    id="agentMessage"
                    placeholder="Tell us about your background and interest..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button className="w-full rounded-full" size="lg">
                  Submit Application
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
