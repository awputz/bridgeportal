import { Link } from "react-router-dom";
import { COMPANY_INFO, NAV_ITEMS } from "@/lib/constants";

// Placeholder for Bridge Advisory Group logo (monochrome)
const FooterLogo = () => (
  <div className="text-2xl font-light tracking-tight">
    <span className="font-medium">BRIDGE</span>
    <span className="text-muted-foreground ml-1">Advisory Group</span>
  </div>
);

export const Footer = () => {
  return (
    <footer className="bg-dark-bg text-foreground border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-14 lg:gap-16 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <FooterLogo />
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

          {/* Commercial & Investment Links */}
          <div>
            <h3 className="font-light mb-5 tracking-tight text-sm uppercase text-muted-foreground">
              Commercial & Investment
            </h3>
            <ul className="space-y-3 text-sm">
              {NAV_ITEMS.commercialInvestment.items.map((item) => (
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

          {/* Residential Links */}
          <div>
            <h3 className="font-light mb-5 tracking-tight text-sm uppercase text-muted-foreground">
              Residential
            </h3>
            <ul className="space-y-3 text-sm">
              {NAV_ITEMS.residential.items.map((item) => (
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
                <Link to="/capital-markets" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  Capital Markets
                </Link>
              </li>
              <li>
                <Link to="/submit-deal" className="text-foreground/70 hover:text-foreground transition-colors font-light">
                  Submit a Deal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="border-t border-border/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              {/* Equal Housing Opportunity - Placeholder */}
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
