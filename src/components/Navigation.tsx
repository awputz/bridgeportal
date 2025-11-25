import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/bridge-investment-sales-logo.png";
import { ContactSheet } from "@/components/ContactSheet";
import { Button } from "@/components/ui/button";

const leftNavItems = [
  { name: "Approach", path: "/approach", external: false },
  { name: "Transactions", path: "/transactions", external: false },
];

const rightNavItems = [
  { name: "Team", path: "/team", external: false },
  { name: "Contact", path: "/contact", external: false },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-6">
        <div className="max-w-6xl mx-auto bg-black/40 backdrop-blur-3xl border border-white/10 rounded-lg md:rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.75)]">
          {/* Mobile & Tablet Layout */}
          <div className="flex lg:hidden items-center justify-between h-16 md:h-20 px-4 md:px-6">
            <div className="w-10" />
            <Link to="/" className="flex items-center">
              <img src={logo} alt="BRIDGE Investment Sales" className="h-10 md:h-12 w-auto" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:text-foreground/80 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-3 items-center h-24 px-10">
            {/* Left Navigation */}
            <div className="flex items-center space-x-10">
              {leftNavItems.map((item) => (
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
            </div>

            {/* Center Logo */}
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="BRIDGE Investment Sales" className="h-16 w-auto" />
              </Link>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center justify-end space-x-10">
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
          </div>
        </div>

        {/* Mobile Full-Screen Menu */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 bg-background/98 backdrop-blur-3xl top-20 md:top-24 z-40">
            <div className="container mx-auto px-6 py-8">
              <div className="space-y-6">
                {[...leftNavItems, ...rightNavItems].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block text-2xl font-light text-foreground/80 hover:text-foreground transition-colors py-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    setContactOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full mt-8 font-light"
                  size="lg"
                >
                  Submit a Deal
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <ContactSheet open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
};
