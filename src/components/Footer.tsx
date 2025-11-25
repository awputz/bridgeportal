import { Link } from "react-router-dom";
import { COMPANY_INFO } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="bg-dark-bg text-foreground border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="text-3xl font-bold mb-6 tracking-tight">
              BRIDGE<span className="font-normal text-muted-foreground"> Investment Sales</span>
            </div>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed max-w-md">
              {COMPANY_INFO.description.short}
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">{COMPANY_INFO.address.short}</p>
              <p>
                <a href={`mailto:${COMPANY_INFO.contact.email}`} className="hover:text-accent transition-colors font-medium">
                  {COMPANY_INFO.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-light mb-6 tracking-tight text-base md:text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/transactions" className="text-muted-foreground hover:text-accent transition-colors font-light">
                  Transactions
                </Link>
              </li>
              <li>
                <Link to="/approach" className="text-muted-foreground hover:text-accent transition-colors font-light">
                  Our Approach
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-accent transition-colors font-light">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-light mb-6 tracking-tight text-base md:text-lg">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/submit-deal" className="text-muted-foreground hover:text-accent transition-colors font-light">
                  Submit a Deal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors font-light">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
          <p className="text-xs">Maximizing NYC property values since 2024</p>
        </div>
      </div>
    </footer>
  );
};