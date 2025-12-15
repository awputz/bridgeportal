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
  const [commercialExpanded, setCommercialExpanded] = useState(false);
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
            <button onClick={() => setIsOpen(!isOpen)} className="p-3 -mr-2 text-foreground hover:text-foreground/80 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Toggle menu">
              <div className="relative w-6 h-6">
                <Menu size={22} className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X size={22} className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
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

            {/* Right: Services Hover Menu + Search + Contact Link */}
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
                  className="w-[340px] p-3 glass-nav z-40"
                >
                  {services?.map((service) => {
                    const IconComponent = serviceIcons[service.name] || Building2;
                    
                    return (
                      <Link
                        key={service.id}
                        to={service.path}
                        className={cn(
                          "flex items-start gap-3 rounded-md px-3 py-3 transition-colors",
                          "hover:bg-white/10",
                          location.pathname.startsWith(service.path) && "bg-white/10"
                        )}
                      >
                        <IconComponent className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-white/90 font-light">
                            {service.name}
                          </span>
                          {service.tagline && (
                            <span className="text-xs text-white/50 font-light leading-snug">
                              {service.tagline}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
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
                  className="w-[220px] p-2 glass-nav z-40"
                >
                  {listingsNav?.items.map((item) => {
                    const IconComponent = listingIcons[item.name] || Building2;
                    
                    if (item.nested && item.items) {
                      return (
                        <DropdownMenuSub key={item.name}>
                          <DropdownMenuSubTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-md text-white/90">
                            <IconComponent className="h-4 w-4 text-white/60" />
                            <span className="text-sm font-light">{item.name}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="glass-nav p-2 z-40">
                            {item.items.map((subItem) => (
                              <DropdownMenuItem key={subItem.name} asChild>
                                <a 
                                  href={subItem.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer"
                                >
                                  <span className="text-sm text-white/90 font-light">{subItem.name}</span>
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
                          className="flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-4 w-4 text-white/60" />
                            <span className="text-sm text-white/90 font-light">{item.name}</span>
                          </div>
                          <ChevronDown className="h-3 w-3 text-white/40 -rotate-90" />
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
            <div className="space-y-3">
              {/* Left Nav Items */}
              <div>
                {leftNavItems.map((item, index) => 
                  item.external ? (
                    <a 
                      key={item.name} 
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-3 min-h-[44px] flex items-center ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: `${index * 40}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link key={item.name} to={item.path} className={`block text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-3 min-h-[44px] flex items-center ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{
                      transitionDelay: `${index * 40}ms`
                    }} onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                  )
                )}
              </div>

              {/* Services Section */}
              <div className="pt-3 border-t border-white/15">
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Services</p>
                {services?.map((service, index) => {
                const IconComponent = serviceIcons[service.name] || Building2;
                return <Link key={service.id} to={service.path} className={`flex items-center gap-3 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-3 min-h-[44px] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{
                  transitionDelay: `${(index + leftNavItems.length) * 40}ms`
                }} onClick={() => setIsOpen(false)}>
                      <IconComponent className="h-4 w-4 text-foreground/50" />
                      {service.name}
                    </Link>;
              })}
              </div>

              {/* Listings Section - Optimized for Mobile/Tablet */}
              <div className="pt-3 border-t border-white/15">
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Listings</p>
                
                {/* Residential - Direct link */}
                {listingsNav?.items.filter(item => item.name === "Residential").map((item, index) => (
                  <a 
                    key={item.name}
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-3 min-h-[44px] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                    style={{ transitionDelay: `${((services?.length || 0) + leftNavItems.length + index) * 40}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4 text-foreground/50" />
                    {item.name}
                  </a>
                ))}

                {/* Commercial Leasing - Collapsible */}
                {listingsNav?.items.filter(item => item.name === "Commercial Leasing").map((item, index) => (
                  <div key={item.name}>
                    <button 
                      onClick={() => setCommercialExpanded(!commercialExpanded)}
                      className={`flex items-center justify-between w-full text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-3 min-h-[44px] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: `${((services?.length || 0) + leftNavItems.length + 1) * 40}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-foreground/50" />
                        {item.name}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-foreground/50 transition-transform duration-300 ${commercialExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Collapsible sub-items */}
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${commercialExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {item.items?.map((subItem) => (
                        <a 
                          key={subItem.name}
                          href={subItem.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm font-light text-foreground/60 hover:text-foreground transition-colors duration-200 py-3 min-h-[44px] pl-7"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Investment Sales - Direct link */}
                {listingsNav?.items.filter(item => item.name === "Investment Sales").map((item, index) => (
                  <a 
                    key={item.name}
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 py-3 min-h-[44px] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                    style={{ transitionDelay: `${((services?.length || 0) + leftNavItems.length + 2) * 40}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    <TrendingUp className="h-4 w-4 text-foreground/50" />
                    {item.name}
                  </a>
                ))}
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
