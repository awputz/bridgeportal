import { Link } from "react-router-dom";
import { COMPANY_INFO, NAV_ITEMS } from "@/lib/constants";
import bridgeAdvisoryLogo from "@/assets/bridge-advisory-group-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-dark-bg text-foreground border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-14 lg:gap-16 mb-16">
          <div className="lg:col-span-1">
            <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="h-10 invert opacity-80" />
            <p className="text-sm text-muted-foreground mt-4 mb-6 leading-relaxed max-w-sm">
              {COMPANY_INFO.description.short}
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-light">{COMPANY_INFO.address.short}</p>
              <p>
                <a href={`mailto:${COMPANY_INFO.contact.email}`} className="hover:text-foreground transition-colors font-light">
                  {COMPANY_INFO.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-light mb-5 tracking-tight text-sm uppercase text-muted-foreground">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              {NAV_ITEMS.services.items.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="text-foreground/70 hover:text-foreground transition-colors font-light"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-light mb-5 tracking-tight text-sm uppercase text-muted-foreground">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  Market Insights
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  Research & Reports
                </Link>
              </li>
              <li>
                <Link to="/track-record" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  Track Record
                </Link>
              </li>
              <li>
                <Link to="/markets-coming-soon" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  Markets Coming Soon
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-light mb-5 tracking-tight text-sm uppercase text-muted-foreground">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href={`tel:${COMPANY_INFO.contact.phone}`} className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  {COMPANY_INFO.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="border-t border-border/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              {/* Equal Housing Opportunity */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-8 h-8 border border-muted-foreground/30 flex items-center justify-center text-[8px] leading-tight">
                  EQUAL<br/>HOUSING
                </div>
                <span>Equal Housing Opportunity</span>
              </div>
            </div>
            
            <div className="text-center md:text-right">
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
