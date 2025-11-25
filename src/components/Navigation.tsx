import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/bridge-investment-sales-logo.png";
import { ContactSheet } from "@/components/ContactSheet";
import { Button } from "@/components/ui/button";

const leftNavItems = [
  { name: "Approach", path: "/approach", external: false },
  { name: "Listings", path: "https://crexi.com", external: true },
];

const rightNavItems = [
  { name: "Track Record", path: "/track-record", external: false },
  { name: "Team", path: "/team", external: false },
  { name: "Research", path: "/research", external: false },
  { name: "Contact", path: "/contact", external: false },
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-2xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-20">
            {/* Left Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {leftNavItems.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-light text-foreground/80 hover:text-foreground transition-all duration-300"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-base font-light transition-all duration-300 ${
                      location.pathname === item.path
                        ? "text-foreground"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* Center Logo */}
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="BRIDGE Investment Sales" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Right Navigation */}
            <div className="hidden lg:flex items-center justify-end space-x-8">
              {rightNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-base font-light transition-all duration-300 ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                onClick={() => setContactOpen(true)}
                size="sm"
                className="ml-2 font-light"
              >
                Submit a Deal
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground hover:text-foreground/80 transition-colors ml-auto"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-black/30 backdrop-blur-2xl border-t border-white/5">
            <div className="container mx-auto px-6 py-6 space-y-4">
              {[...leftNavItems, ...rightNavItems].map((item) =>
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
