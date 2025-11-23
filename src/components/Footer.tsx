import { Link } from "react-router-dom";
import { COMPANY_INFO } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="bg-card text-foreground border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="text-xl font-semibold mb-4">
              BRIDGE<span className="font-light"> Residential</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {COMPANY_INFO.description.short}
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>{COMPANY_INFO.address.short}</p>
              <p>
                <a href={`mailto:${COMPANY_INFO.contact.email}`} className="hover:text-foreground transition-colors">
                  {COMPANY_INFO.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/listings" className="text-muted-foreground hover:text-foreground transition-colors">
                  View Listings
                </Link>
              </li>
              <li>
                <Link to="/buildings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Exclusive Buildings
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/process" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Process
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/join" className="text-muted-foreground hover:text-foreground transition-colors">
                  Join BRIDGE Residential
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Resources */}
          <div>
            <h3 className="font-semibold mb-4">Legal & Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resources & Legal
                </Link>
              </li>
              <li>
                <a
                  href="https://dos.ny.gov/system/files/documents/2024/01/1736.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  NY Standard Operating Procedures
                </a>
              </li>
              <li>
                <a
                  href="https://www.hud.gov/program_offices/fair_housing_equal_opp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fair Housing Information
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
