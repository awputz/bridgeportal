import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/bridge-logo-white.png";
import { ContactSheet } from "@/components/ContactSheet";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "Approach", path: "/approach" },
  { name: "Listings", path: "https://crexi.com", external: true },
  { name: "Track Record", path: "/track-record" },
  { name: "Team", path: "/team" },
  { name: "Research", path: "/research" },
  { name: "Contact", path: "/contact" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
              <img src={logo} alt="BRIDGE Investment Sales" className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-light text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="px-4 py-2 text-sm font-light text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              )}
              <Button
                onClick={() => setContactOpen(true)}
                size="sm"
                className="ml-4 font-light"
              >
                Submit a Deal
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-dark-bg border-t border-border">
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navigationItems.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 text-base font-light text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block py-2 text-base font-light text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              <Button
                onClick={() => {
                  setContactOpen(true);
                  setIsOpen(false);
                }}
                className="w-full font-light"
              >
                Submit a Deal
              </Button>
            </div>
          </div>
        )}
      </nav>

      <ContactSheet open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
};
