import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Building2, Home, Briefcase, TrendingUp, Megaphone, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { useBridgeServices } from "@/hooks/useBridgeServices";
import { useBridgeListingNavItems } from "@/hooks/useBridgeListingLinks";

import { cn } from "@/lib/utils";
import { ContactSheet } from "@/components/ContactSheet";

const leftNavItems = [{
  name: "About Us",
  path: "/about"
}, {
  name: "Team",
  path: "/team"
}, {
  name: "Transactions",
  path: "https://traded.co/company/bridge-advisory-group/",
  external: true
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

// Listing icons mapping
const listingIcons: Record<string, typeof Building2> = {
  "Residential": Home,
  "Commercial Leasing": Building2,
  "Investment Sales": TrendingUp
};

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();
  
  const { data: services } = useBridgeServices();
  const { data: listingsNav } = useBridgeListingNavItems();

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
          <div className="flex lg:hidden items-center justify-between h-14 px-4">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" alt="Bridge Advisory Group" className="h-10 w-auto" />
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
              {leftNavItems.map(item => 
                item.external ? (
                  <a 
                    key={item.name} 
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light transition-all duration-200 whitespace-nowrap hover:scale-105 text-foreground/70 hover:text-foreground"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link key={item.name} to={item.path} className={`text-sm font-light transition-all duration-200 whitespace-nowrap hover:scale-105 ${location.pathname === item.path ? "text-foreground" : "text-foreground/70 hover:text-foreground"}`}>
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <img alt="Bridge Investment Sales" className="h-16 w-auto" src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" />
              </Link>
            </div>

            {/* Right: Services Hover Menu + Contact Link + Submit Button */}
            <div className="flex items-center justify-end space-x-6">
              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-1 text-sm font-light transition-all duration-200 hover:scale-105",
                    isServicesActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                  )}>
                    Services
                    <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={16}
                  className="w-[500px] p-4 bg-zinc-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl relative"
                >
                  {/* Arrow connector */}
                  <div className="absolute -top-2 right-8 w-4 h-4 bg-zinc-900/95 border-l border-t border-white/20 rotate-45" />
                  <div className="grid grid-cols-2 gap-2">
                    {services?.map((service) => {
                      const IconComponent = serviceIcons[service.name] || Building2;
                      
                      return (
                        <Link
                          key={service.id}
                          to={service.path}
                          className={cn(
                            "group flex items-start gap-3 rounded-lg p-3 transition-all duration-200",
                            "hover:bg-white/10 hover:scale-[1.02]",
                            "min-h-[72px]",
                            location.pathname.startsWith(service.path) && "bg-white/10"
                          )}
                        >
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-white/10 group-hover:bg-white/15 transition-colors">
                            <IconComponent className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-white group-hover:text-white">
                              {service.name}
                            </span>
                            <span className="text-xs text-white/60 mt-0.5 line-clamp-1">
                              {service.description}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>


              {/* Listings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-1 text-sm font-light transition-all duration-200 hover:scale-105",
                    "text-foreground/70 hover:text-foreground"
                  )}>
                    Listings
                    <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={16}
                  className="w-[220px] p-2 bg-zinc-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl relative"
                >
                  {/* Arrow connector */}
                  <div className="absolute -top-2 right-8 w-4 h-4 bg-zinc-900/95 border-l border-t border-white/20 rotate-45" />
                  {listingsNav?.items.map((item) => {
                    const IconComponent = listingIcons[item.name] || Building2;
                    
                    if (item.nested && item.items) {
                      return (
                        <DropdownMenuSub key={item.name}>
                          <DropdownMenuSubTrigger className="flex items-center gap-3 p-2.5 rounded-lg">
                            <IconComponent className="h-4 w-4 text-white/70" />
                            <span className="text-sm text-white">{item.name}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="bg-zinc-900/95 backdrop-blur-2xl border border-white/20 rounded-xl p-2">
                            {item.items.map((subItem) => (
                              <DropdownMenuItem key={subItem.name} asChild>
                              <a 
                                  href={subItem.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer"
                                >
                                  <span className="text-sm text-white">{subItem.name}</span>
                                </a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      );
                    }
                    
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer"
                        >
                          <IconComponent className="h-4 w-4 text-white/70" />
                          <span className="text-sm text-white">{item.name}</span>
                        </a>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                size="sm" 
                className="font-light"
                onClick={() => setContactOpen(true)}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Menu */}
        <div className={`lg:hidden fixed inset-x-0 bottom-0 bg-background/98 backdrop-blur-3xl z-40 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`} style={{
        top: 'calc(3.5rem + 0.75rem)'
      }}>
          <div className="h-full overflow-y-auto overscroll-contain px-4 py-4 pb-safe">
            <div className="space-y-2">
              {/* Left Nav Items */}
              <div>
                {leftNavItems.map((item, index) => 
                  item.external ? (
                    <a 
                      key={item.name} 
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-2 min-h-[40px] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: `${index * 40}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link key={item.name} to={item.path} className={`block text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-2 min-h-[40px] flex items-center ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{
                      transitionDelay: `${index * 40}ms`
                    }} onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                  )
                )}
              </div>

              {/* Services Section */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Services</p>
                {services?.map((service, index) => {
                const IconComponent = serviceIcons[service.name] || Building2;
                return <Link key={service.id} to={service.path} className={`flex items-center gap-2 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-1.5 min-h-[36px] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{
                  transitionDelay: `${(index + leftNavItems.length) * 40}ms`
                }} onClick={() => setIsOpen(false)}>
                      <IconComponent className="h-3.5 w-3.5 text-foreground/50" />
                      {service.name}
                    </Link>;
              })}
              </div>

              {/* Listings Section */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Listings</p>
                
                {listingsNav?.items.map((item, index) => {
                  const IconComponent = listingIcons[item.name] || Building2;
                  const baseDelay = (services?.length || 0) + leftNavItems.length;
                  
                  if (item.nested && item.items) {
                    return (
                      <div key={item.name}>
                        <p className="text-xs text-foreground/60 mt-1.5 mb-0.5 pl-5">{item.name}</p>
                        {item.items.map((subItem, subIndex) => (
                          <a 
                            key={subItem.name}
                            href={subItem.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-1.5 min-h-[36px] pl-5 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                            style={{ transitionDelay: `${(baseDelay + index + subIndex + 1) * 40}ms` }}
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    );
                  }
                  
                  return (
                    <a 
                      key={item.name}
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-1.5 min-h-[36px] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: `${(baseDelay + index) * 40}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent className="h-3.5 w-3.5 text-foreground/50" />
                      {item.name}
                    </a>
                  );
                })}
              </div>

              <Button 
                className={`w-full mt-4 font-light transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} 
                style={{ transitionDelay: '300ms' }} 
                onClick={() => {
                  setIsOpen(false);
                  setContactOpen(true);
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <ContactSheet open={contactOpen} onOpenChange={setContactOpen} />
    </>;
};
