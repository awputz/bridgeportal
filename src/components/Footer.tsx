import { Link } from "react-router-dom";
import { COMPANY_INFO, NAV_ITEMS } from "@/lib/constants";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import bridgeAdvisoryLogo from "@/assets/bridge-advisory-group-logo.png";

export const Footer = () => {
  const { openContactSheet } = useContactSheet();
  return (
    <footer className="bg-dark-bg text-foreground border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
          {/* Logo & Description - Full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-1">
            <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="h-8 md:h-10 invert opacity-80" />
            <p className="text-sm text-muted-foreground mt-4 mb-6 leading-relaxed max-w-sm">
              {COMPANY_INFO.description.short}
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-light">{COMPANY_INFO.address.short}</p>
              <p>
                <a 
                  href={`mailto:${COMPANY_INFO.contact.email}`} 
                  className="hover:text-foreground transition-colors font-light touch-manipulation"
                >
                  {COMPANY_INFO.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-light mb-4 md:mb-5 tracking-tight text-sm uppercase text-muted-foreground">
              Services
            </h3>
            <ul className="space-y-2.5 md:space-y-3 text-sm">
              {NAV_ITEMS.services.items.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-light mb-4 md:mb-5 tracking-tight text-sm uppercase text-muted-foreground">
              Company
            </h3>
            <ul className="space-y-2.5 md:space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/track-record" className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation">
                  Track Record
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation">
                  Research & Reports
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation">
                  Press & Media
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - Hidden on smallest mobile, shown on sm+ */}
          <div className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="font-light mb-4 md:mb-5 tracking-tight text-sm uppercase text-muted-foreground">
              Contact
            </h3>
            <ul className="space-y-2.5 md:space-y-3 text-sm">
              <li>
                <button onClick={openContactSheet} className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation text-left">
                  Contact Us
                </button>
              </li>
              <li>
                <a 
                  href={`tel:${COMPANY_INFO.contact.phone}`} 
                  className="text-foreground/70 hover:text-foreground transition-colors font-light py-1 inline-block touch-manipulation"
                >
                  {COMPANY_INFO.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="border-t border-border/30 pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Equal Housing Opportunity */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-7 h-7 md:w-8 md:h-8 border border-muted-foreground/30 flex items-center justify-center text-[7px] md:text-[8px] leading-tight flex-shrink-0">
                  EQUAL<br/>HOUSING
                </div>
                <span>Equal Housing Opportunity</span>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-xs text-muted-foreground mb-1">
                {COMPANY_INFO.compliance.license}
              </p>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
