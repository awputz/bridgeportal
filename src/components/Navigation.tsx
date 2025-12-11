import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Building2, Home, Briefcase, TrendingUp, Megaphone, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { NAV_ITEMS, DIVISIONS } from "@/lib/constants";
import bridgeInvestmentLogo from "@/assets/bridge-investment-sales-logo.png";
import { cn } from "@/lib/utils";
const leftNavItems = [{
  name: "About Us",
  path: "/about"
}, {
  name: "Team",
  path: "/team"
}, {
  name: "Research",
  path: "/research"
}, {
  name: "Careers",
  path: "/careers"
}];

// Service icons mapping
const serviceIcons: Record<string, typeof Building2> = {
  "Investment Sales": TrendingUp,
  "Commercial Leasing": Building2,
  "Capital Advisory": Briefcase,
  "Property Management": Settings,
  "Marketing": Megaphone,
  "Billboard": Image,
  "Residential": Home
};
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
  return <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-4 md:pt-3 lg:px-5 lg:pt-4">
        <div className="max-w-7xl mx-auto glass-nav">
          {/* Mobile & Tablet Layout */}
          <div className="flex lg:hidden items-center justify-between h-16 sm:h-18 px-5 md:px-6">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={bridgeInvestmentLogo} alt="Bridge Investment Sales" className="h-10 sm:h-11 md:h-12 w-auto" />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 -mr-1.5 text-foreground hover:text-foreground/80 transition-colors touch-manipulation" aria-label="Toggle menu">
              <div className="relative w-5 h-5">
                <Menu size={20} className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X size={20} className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-3 items-center h-20 px-8">
            {/* Left: Navigation Links */}
            <div className="flex items-center space-x-6">
              {leftNavItems.map(item => <Link key={item.name} to={item.path} className={`text-sm font-light transition-all duration-200 whitespace-nowrap hover:scale-105 ${location.pathname === item.path ? "text-foreground" : "text-foreground/70 hover:text-foreground"}`}>
                  {item.name}
                </Link>)}
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <img alt="Bridge Investment Sales" className="h-12 w-auto" src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" />
              </Link>
            </div>

            {/* Right: Services Hover Menu + Contact Link + Submit Button */}
            <div className="flex items-center justify-end space-x-6">
              {/* Services Hover Navigation */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn("bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent", "text-sm font-light px-0 h-auto", "transition-all duration-200 hover:scale-105", isServicesActive ? "text-foreground" : "text-foreground/70 hover:text-foreground")}>
                      Services
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-2 gap-2 p-4 w-[500px]">
                        {NAV_ITEMS.services.items.map((item, index) => {
                        const IconComponent = serviceIcons[item.name] || Building2;
                        // Get division key from item name
                        const divisionKey = Object.keys(DIVISIONS).find(key => DIVISIONS[key as keyof typeof DIVISIONS].name === item.name) as keyof typeof DIVISIONS | undefined;
                        const description = divisionKey ? DIVISIONS[divisionKey].description : "";
                        return <NavigationMenuLink key={item.name} asChild>
                              <Link to={item.path} className={cn("group flex items-center gap-3 rounded-lg p-3 transition-all duration-200", "hover:bg-white/10 hover:scale-[1.02]", "animate-in fade-in slide-in-from-top-2", location.pathname.startsWith(item.path) && "bg-white/10")} style={{
                            animationDuration: "300ms",
                            animationDelay: `${index * 40}ms`,
                            animationFillMode: "backwards"
                          }}>
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 group-hover:bg-white/15 transition-colors">
                                  <IconComponent className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-white group-hover:text-white">
                                    {item.name}
                                  </span>
                                  <span className="text-xs text-white/60 mt-0.5">
                                    {description}
                                  </span>
                                </div>
                              </Link>
                            </NavigationMenuLink>;
                      })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link to="/contact" className="text-sm font-light text-foreground/70 hover:text-foreground transition-all duration-200">
                Contact
              </Link>

              <Button asChild size="sm" className="h-9 px-5 text-sm font-medium bg-white text-black hover:bg-white/90 rounded-md">
                <Link to="/contact">Submit a Deal</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Menu */}
        <div className={`lg:hidden fixed inset-x-0 bottom-0 bg-background/98 backdrop-blur-3xl z-40 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`} style={{
        top: 'calc(3.5rem + 0.75rem)'
      }}>
          <div className="h-full overflow-y-auto overscroll-contain px-5 py-5 pb-safe">
            <div className="space-y-3">
              {/* Left Nav Items */}
              <div>
                {leftNavItems.map((item, index) => <Link key={item.name} to={item.path} className={`block text-base font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-2.5 min-h-[44px] flex items-center ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{
                transitionDelay: `${index * 50}ms`
              }} onClick={() => setIsOpen(false)}>
                    {item.name}
                  </Link>)}
              </div>

              {/* Services Section */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Services</p>
                {NAV_ITEMS.services.items.map((item, index) => {
                const IconComponent = serviceIcons[item.name] || Building2;
                return <Link key={item.name} to={item.path} className={`flex items-center gap-3 text-base font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-2.5 min-h-[44px] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{
                  transitionDelay: `${(index + leftNavItems.length) * 50}ms`
                }} onClick={() => setIsOpen(false)}>
                      <IconComponent className="h-4 w-4 text-foreground/50" />
                      {item.name}
                    </Link>;
              })}
              </div>

              <Button asChild className={`w-full mt-5 font-light transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{
              transitionDelay: '400ms'
            }} size="lg">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>;
};