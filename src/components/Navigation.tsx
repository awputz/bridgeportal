import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/lib/constants";
import bridgeAdvisoryLogo from "@/assets/bridge-advisory-group-logo.png";

const leftNavItems = [
  { name: "About Us", path: "/about" },
  { name: "Team", path: "/team" },
  { name: "Research", path: "/research" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const isServicesActive = location.pathname.startsWith('/services');

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-6">
        <div className="max-w-7xl mx-auto bg-black/40 backdrop-blur-3xl border border-white/10 rounded-lg md:rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.75)]">
          {/* Mobile & Tablet Layout */}
          <div className="flex lg:hidden items-center justify-between h-16 md:h-20 px-4 md:px-6">
            <Link to="/" className="flex items-center">
              <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="h-16 md:h-20 invert object-contain max-w-[200px]" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:text-foreground/80 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Layout - Centered Logo */}
          <div className="hidden lg:grid grid-cols-3 items-center h-20 px-8">
            {/* Left: Navigation Links */}
            <div className="flex items-center space-x-6">
              {leftNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-base font-light transition-all duration-300 whitespace-nowrap ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Center: Logo - Made larger */}
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="h-24 invert object-contain max-w-[240px]" />
              </Link>
            </div>

            {/* Right: Services Dropdown + Contact Button */}
            <div className="flex items-center justify-end space-x-6">
              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={`group flex items-center gap-1 text-base font-light transition-all duration-300 ease-out outline-none hover:scale-105 ${
                  isServicesActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                }`}>
                  Services
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1a1a1a] border-white/20 z-[9999] shadow-2xl">
                  {NAV_ITEMS.services.items.map((item, index) => (
                    <DropdownMenuItem 
                      key={item.name} 
                      asChild 
                      className="animate-in fade-in slide-in-from-top-1 text-base"
                      style={{
                        animationDuration: "300ms",
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "backwards"
                      }}
                    >
                      <Link
                        to={item.path}
                        className="cursor-pointer font-light"
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                asChild
                size="sm"
                className="font-light whitespace-nowrap"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Menu */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 bg-background/98 backdrop-blur-3xl top-20 md:top-24 z-40">
            <div className="container mx-auto px-6 py-8 overflow-y-auto max-h-[calc(100vh-6rem)]">
              <div className="space-y-6">
                {/* Left Nav Items */}
                <div>
                  {leftNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block text-xl font-light text-foreground/80 hover:text-foreground transition-colors py-3"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Services Section */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Services</p>
                  {NAV_ITEMS.services.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block text-xl font-light text-foreground/80 hover:text-foreground transition-colors py-3"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <Button
                  asChild
                  className="w-full mt-6 font-light"
                  size="lg"
                >
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
