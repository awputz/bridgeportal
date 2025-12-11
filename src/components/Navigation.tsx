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
  { name: "Careers", path: "/careers" },
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

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isServicesActive = location.pathname.startsWith('/services');

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-2 pt-2 md:px-3 md:pt-2 lg:px-3 lg:pt-2">
        <div className="max-w-7xl mx-auto bg-black/40 backdrop-blur-3xl border border-white/10 rounded-lg md:rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.75)]">
          {/* Mobile & Tablet Layout */}
          <div className="flex lg:hidden items-center justify-between h-16 sm:h-18 md:h-20 px-4 md:px-6">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src={bridgeAdvisoryLogo} 
                alt="Bridge Advisory Group" 
                className="w-36 sm:w-40 md:w-44 invert" 
              />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 -mr-2 text-foreground hover:text-foreground/80 transition-colors touch-manipulation"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  size={24} 
                  className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} 
                />
                <X 
                  size={24} 
                  className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} 
                />
              </div>
            </button>
          </div>

          {/* Desktop Layout - Centered Logo */}
          <div className="hidden lg:grid grid-cols-3 items-center py-0.5 px-3">
            {/* Left: Navigation Links */}
            <div className="flex items-center space-x-5">
              {leftNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-light transition-all duration-300 whitespace-nowrap ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <img src={bridgeAdvisoryLogo} alt="Bridge Advisory Group" className="w-36 invert" />
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
                <DropdownMenuContent className="bg-[#0a0a0a] border border-white/20 z-[9999] shadow-2xl min-w-[200px]">
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
        <div 
          className={`lg:hidden fixed inset-x-0 bottom-0 bg-background/98 backdrop-blur-3xl z-40 transition-all duration-300 ease-out ${
            isOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-full pointer-events-none'
          }`}
          style={{ top: 'calc(4rem + 0.75rem)' }}
        >
          <div className="h-full overflow-y-auto overscroll-contain px-6 py-6 pb-safe">
            <div className="space-y-4">
              {/* Left Nav Items */}
              <div>
                {leftNavItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block text-lg font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-3 min-h-[48px] flex items-center ${
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Services Section */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Services</p>
                {NAV_ITEMS.services.items.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block text-lg font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-3 min-h-[48px] flex items-center ${
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${(index + leftNavItems.length) * 50}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <Button
                asChild
                className={`w-full mt-6 font-light transition-all duration-300 ${
                  isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '400ms' }}
                size="lg"
              >
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
