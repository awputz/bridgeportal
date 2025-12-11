import { Link } from "react-router-dom";
import { useBridgeSettings } from "@/hooks/useBridgeSettings";
import { useBridgeServices } from "@/hooks/useBridgeServices";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { Instagram, Linkedin, Phone } from "lucide-react";
import { useState } from "react";

export const Footer = () => {
  const { openContactSheet } = useContactSheet();
  const { data: settings } = useBridgeSettings();
  const { data: services } = useBridgeServices();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter submission logic here
    setEmail("");
  };

  return (
    <footer className="bg-dark-bg text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - 4 Columns */}
        <div className="py-12 md:py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-1 lg:pr-8">
            <h3 className="text-xl md:text-2xl font-light mb-6 tracking-tight">
              subscribe to our newsletter
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your Email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-muted-foreground/30 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-foreground text-background py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-medium mb-5 tracking-tight text-sm">
              navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services?.slice(0, 2).map((service) => (
                <li key={service.id}>
                  <Link
                    to={service.path}
                    className="text-muted-foreground hover:text-foreground transition-colors font-light"
                  >
                    {service.name.toLowerCase()}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/press" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  press
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  design
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  agents
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  join us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-medium mb-5 tracking-tight text-sm">
              contact us
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground font-light mb-1">email address</p>
                <a
                  href={`mailto:${settings?.company_contact.email}`}
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  {settings?.company_contact.email}
                </a>
              </div>
              <div>
                <p className="text-muted-foreground font-light mb-1">phone number</p>
                <a
                  href={`tel:${settings?.company_contact.phone}`}
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  {settings?.company_contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Office */}
          <div>
            <h3 className="font-medium mb-5 tracking-tight text-sm">
              office
            </h3>
            <div className="text-sm text-muted-foreground font-light leading-relaxed whitespace-pre-line">
              {settings?.company_address.full || settings?.company_address.short}
            </div>
          </div>
        </div>

        {/* Middle Section - Logo & Social */}
        <div className="py-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <img
            alt="Bridge Advisory Group"
            src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png"
            className="h-10 md:h-12 w-auto"
          />
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-muted-foreground/30 flex items-center justify-center hover:border-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-muted-foreground/30 flex items-center justify-center hover:border-foreground transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <button
              onClick={openContactSheet}
              className="w-12 h-12 rounded-full border border-muted-foreground/30 flex items-center justify-center hover:border-foreground transition-colors"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="py-6 border-t border-border/20">
          <div className="flex items-start gap-2 mb-6">
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              {settings?.company_name}, including its logo, trademarks, designs, and slogans, are registered and unregistered trademarks of {settings?.company_name} or its affiliated companies. Bridge is a licensed real estate broker in New York. All listing information is deemed reliable but is not guaranteed and is subject to errors, omissions, changes in price, prior sale, or withdrawal without notice. No representation is made as to the accuracy of any description. All measurements and square footages are approximate, and all descriptive information should be independently verified. No financial or legal advice is provided. {settings?.company_name} supports the Fair Housing Act and Equal Opportunity Act and does not discriminate against voucher holders pursuant to applicable law. All lawful sources of income are accepted.
              <span className="inline-block ml-1">
                <div className="w-4 h-4 border border-muted-foreground/50 inline-flex items-center justify-center text-[6px] leading-none">
                  ⌂
                </div>
              </span>
            </p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="py-4 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground uppercase tracking-wider">
          <a href="#" className="hover:text-foreground transition-colors">
            NY Reasonable Accommodations Notice
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Fair Housing Notice
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Standard Operating Procedures
          </a>
        </div>
      </div>
    </footer>
  );
};
