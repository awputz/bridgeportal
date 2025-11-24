import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import bridgeLogo from "@/assets/bridge-investment-sales-logo-dark.png";
import { ContactSheet } from "@/components/ContactSheet";

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrolled;
};
const navigationItems = [{
  name: "Current Offerings",
  path: "/offerings"
}, {
  name: "Track Record",
  path: "/track-record"
}, {
  name: "Approach",
  path: "/approach"
}, {
  name: "Team",
  path: "/team"
}, {
  name: "Research",
  path: "/research"
}, {
  name: "Contact",
  path: "/contact"
}];
export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();
  const scrolled = useScrolled();
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  
  return <>
      {/* Premium Navigation Bar with Scroll Effect */}
      <div className="fixed top-6 left-0 right-0 z-50 px-6 animate-slide-down">
        <nav className={cn(
          "max-w-7xl mx-auto rounded-2xl border shadow-xl transition-all duration-700",
          scrolled 
            ? "bg-card/98 backdrop-blur-2xl border-border shadow-premium" 
            : "bg-card/80 backdrop-blur-xl border-border/50 shadow-xl"
        )}>
          <div className="flex items-center justify-between h-20 px-8">
            {/* Logo with Premium Hover */}
            <Link 
              to="/" 
              className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 transition-all duration-500 hover:scale-110 hover:brightness-110"
            >
              <img src={bridgeLogo} alt="BRIDGE Investment Sales" className="h-12" />
            </Link>

            {/* Left Navigation with Magnetic Effect */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.slice(0, 3).map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={cn(
                    "px-4 py-2.5 text-[15px] font-semibold transition-all duration-500 rounded-xl whitespace-nowrap tracking-tight relative group",
                    location.pathname === item.path 
                      ? "text-primary bg-gradient-to-br from-muted/80 to-muted/60 shadow-md" 
                      : "text-muted-foreground hover:text-primary hover:bg-muted/40"
                  )}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Navigation with Enhanced Styling */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.slice(3).map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={cn(
                    "px-4 py-2.5 text-[15px] font-semibold transition-all duration-500 rounded-xl whitespace-nowrap tracking-tight relative group",
                    location.pathname === item.path 
                      ? "text-primary bg-gradient-to-br from-muted/80 to-muted/60 shadow-md" 
                      : "text-muted-foreground hover:text-primary hover:bg-muted/40"
                  )}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              ))}

              <Button 
                asChild 
                size="sm" 
                className="ml-3 rounded-xl h-10 px-6 text-[15px] font-semibold tracking-tight magnetic-button bg-accent hover:bg-accent/90 text-background shadow-lg"
              >
                <Link to="/submit-deal">Submit a Deal</Link>
              </Button>
            </div>

            {/* Mobile Menu Button - positioned to the right */}
            <button className="lg:hidden p-2 text-primary ml-auto hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Full Screen Menu */}
      <div className={cn("fixed inset-0 z-40 bg-card/98 backdrop-blur-xl lg:hidden transition-all duration-500 ease-out", isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none")}>
        <div className="flex flex-col items-start justify-center min-h-screen px-8 py-24">
          {/* Navigation Links */}
          <nav className="flex flex-col items-start space-y-4 text-left w-full max-w-xs">
            {navigationItems.map((item, index) => <Link key={item.path} to={item.path} className={cn("text-xl font-semibold transition-all duration-500 tracking-tight w-full py-3 rounded-lg text-left", isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4", location.pathname === item.path ? "text-primary bg-muted px-4" : "text-muted-foreground hover:text-primary hover:bg-muted/50 hover:px-4")} style={{
            transitionDelay: isOpen ? `${100 + index * 40}ms` : "0ms"
          }}>
                {item.name}
              </Link>)}

            <div className={cn("transition-all duration-500 flex flex-col gap-3 pt-4 border-t border-border/30 w-full", isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} style={{
            transitionDelay: isOpen ? "400ms" : "0ms"
          }}>
              <Button asChild size="lg" className="rounded-lg tracking-tight w-full bg-primary text-primary-foreground font-semibold">
                <Link to="/submit-deal">Submit a Deal</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Contact Sheet */}
      <ContactSheet open={contactOpen} onOpenChange={setContactOpen} />
    </>;
};