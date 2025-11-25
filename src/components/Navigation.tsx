import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/bridge-investment-sales-logo.png";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-dark-bg backdrop-blur-md border-border" 
          : "bg-dark-bg/80 backdrop-blur-sm border-border/50"
      }`}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:brightness-110">
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
                    className="relative px-4 py-2 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 hover:scale-105"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-4 py-2 text-sm font-light transition-all duration-300 hover:scale-105 ${
                      location.pathname === item.path
                        ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
              <Button
                onClick={() => setContactOpen(true)}
                size="sm"
                className="ml-4 font-light transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Submit a Deal
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground hover:text-foreground/80 transition-colors"
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
