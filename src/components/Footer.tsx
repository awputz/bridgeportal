import { Link } from "react-router-dom";
import { useBridgeSettings } from "@/hooks/useBridgeSettings";
import { useBridgeServices } from "@/hooks/useBridgeServices";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { Instagram, Linkedin, Phone, Mail, ArrowUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
export const Footer = () => {
  const {
    openContactSheet
  } = useContactSheet();
  const {
    data: settings
  } = useBridgeSettings();
  const {
    data: services
  } = useBridgeServices();
  const [email, setEmail] = useState("");
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!", { description: "You'll receive our latest updates." });
      setEmail("");
    }
  };
  return <footer className="bg-dark-bg text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-primary-foreground">
        {/* Top Section - 4 Columns */}
        <div className="py-8 md:py-12 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-light mb-4 md:mb-6 tracking-tight">
              Subscribe To Our Newsletter
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input type="email" placeholder="Enter Your Email Here" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b border-muted-foreground/30 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
              <button type="submit" className="w-full bg-foreground text-background py-3 text-sm font-medium hover:bg-foreground/90 transition-colors">
                Submit
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-medium mb-3 md:mb-5 tracking-tight text-sm">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services/investment-sales" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  About
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  About
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  Agents
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  Join Us
                </Link>
              </li>
              <li>
                <Link to="/markets-coming-soon" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                  Markets Coming Soon
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-medium mb-3 md:mb-5 tracking-tight text-sm">
              Contact Us
            </h3>
            <div className="space-y-3 md:space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground font-light mb-1">Email Address</p>
                <a href={`mailto:${settings?.company_contact.email}`} className="text-foreground hover:text-muted-foreground transition-colors">
                  {settings?.company_contact.email}
                </a>
              </div>
              <div>
                <p className="text-muted-foreground font-light mb-1">Phone Number</p>
                <a href={`tel:${settings?.company_contact.phone}`} className="text-foreground hover:text-muted-foreground transition-colors">
                  {settings?.company_contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Office */}
          <div>
            <h3 className="font-medium mb-3 md:mb-5 tracking-tight text-sm">
              Office
            </h3>
            <div className="text-sm text-muted-foreground font-light leading-relaxed whitespace-pre-line">
              {settings?.company_address.full || settings?.company_address.short}
            </div>
          </div>
        </div>

        {/* Middle Section - Logo & Social */}
        <div className="py-6 md:py-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <img alt="Bridge Advisory Group" src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" className="h-8 md:h-10 lg:h-12 w-auto" />
          <div className="flex items-center gap-3 md:gap-4">
            <a href="https://www.instagram.com/bridgeadvisorygroup" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-muted-foreground/30 flex items-center justify-center hover:border-foreground transition-colors">
              <Instagram className="w-4 h-4 md:w-5 md:h-5" />
            </a>
            <a href="https://www.linkedin.com/company/bridgeadvisorygroup" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-muted-foreground/30 flex items-center justify-center hover:border-foreground transition-colors">
              <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
            </a>
            <a href={`mailto:${settings?.company_contact.email}`} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-muted-foreground/30 flex items-center justify-center hover:border-foreground transition-colors">
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
            </a>
            <button onClick={openContactSheet} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-muted-foreground/30 flex items-center justify-center hover:border-foreground transition-colors">
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button onClick={scrollToTop} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-muted-foreground/30 flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-colors" aria-label="Back to top">
              <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="py-4 md:py-6 border-t border-border/20">
          <div className="flex items-start gap-2 md:gap-3 mb-4 md:mb-6">
            <img src="/brandmark-white.png" alt="Bridge" className="w-4 h-4 md:w-5 md:h-5 mt-0.5 opacity-70 flex-shrink-0" />
            <p className="text-[10px] md:text-xs text-muted-foreground/70 leading-relaxed">
              {settings?.company_name}, Including Its Logo, Trademarks, Designs, And Slogans, Are Registered And Unregistered Trademarks Of {settings?.company_name} Or Its Affiliated Companies. Bridge Is A Licensed Real Estate Broker In New York. All Listing Information Is Deemed Reliable But Is Not Guaranteed And Is Subject To Errors, Omissions, Changes In Price, Prior Sale, Or Withdrawal Without Notice. No Representation Is Made As To The Accuracy Of Any Description. All Measurements And Square Footages Are Approximate, And All Descriptive Information Should Be Independently Verified. No Financial Or Legal Advice Is Provided. {settings?.company_name} Supports The Fair Housing Act And Equal Opportunity Act And Does Not Discriminate Against Voucher Holders Pursuant To Applicable Law. All Lawful Sources Of Income Are Accepted.
            </p>
          </div>
        </div>

        {/* Option 4: Founded line */}
        <div className="py-3 md:py-4 border-t border-border/20 text-center">
          <p className="text-[10px] md:text-xs text-muted-foreground font-light">
            © 2024 Bridge Advisory Group. Founded 2024.
          </p>
        </div>

        {/* Bottom Links */}
        <div className="py-3 md:py-4 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">
          <a href="https://d1e1jt2fj4r8r.cloudfront.net/b26ab618-2b1e-4a17-8868-498b96b52dc0/qckNAwejF/NY%20Reasonable%20Accommodations%20Notice.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            NY Reasonable Accommodations Notice
          </a>
          <a href="https://d1e1jt2fj4r8r.cloudfront.net/b26ab618-2b1e-4a17-8868-498b96b52dc0/LcdbBuJ7w/NY%20Fair%20Housing%20Notice.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Fair Housing Notice
          </a>
          <a href="https://nyresop.tiiny.site/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Standard Operating Procedures
          </a>
        </div>
      </div>
    </footer>;
};