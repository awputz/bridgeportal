import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { ContactSheet } from "@/components/ContactSheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/lib/constants";

// Placeholder for Bridge Advisory Group logo - replace with actual logo
const PlaceholderLogo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="text-xl md:text-2xl font-light tracking-tight">
      <span className="font-medium">BRIDGE</span>
      <span className="text-foreground/70 ml-1">Advisory Group</span>
    </div>
  </div>
);

const staticNavItems = [
  { name: "Capital Markets", path: "/capital-markets" },
  { name: "About", path: "/about" },
  { name: "Team", path: "/team" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
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
        <div className="max-w-7xl mx-auto bg-black/40 backdrop-blur-3xl border border-white/10 rounded-lg md:rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.75)]">
          {/* Mobile & Tablet Layout */}
          <div className="flex lg:hidden items-center justify-between h-16 md:h-20 px-4 md:px-6">
            <Link to="/" className="flex items-center">
              <PlaceholderLogo className="h-10 md:h-12" />
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
          <div className="hidden lg:flex items-center justify-between h-20 px-8">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center">
              <PlaceholderLogo />
            </Link>

            {/* Center: Navigation */}
            <div className="flex items-center space-x-6">
              {/* Commercial & Investment Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 ease-out outline-none hover:scale-105">
                  {NAV_ITEMS.commercialInvestment.label}
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-white/10 z-50">
                  {NAV_ITEMS.commercialInvestment.items.map((item, index) => (
                    <DropdownMenuItem 
                      key={item.name} 
                      asChild 
                      className="animate-in fade-in slide-in-from-top-1"
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

              {/* Residential Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1 text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 ease-out outline-none hover:scale-105">
                  {NAV_ITEMS.residential.label}
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-white/10 z-50">
                  {NAV_ITEMS.residential.items.map((item, index) => (
                    <DropdownMenuItem 
                      key={item.name} 
                      asChild 
                      className="animate-in fade-in slide-in-from-top-1"
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
              
              {staticNavItems.map((item) => (
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

            {/* Right: Contact */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setContactOpen(true)}
                className="text-sm font-light text-foreground/80 hover:text-foreground transition-all duration-300 whitespace-nowrap"
              >
                Contact
              </button>
              <Button
                onClick={() => {
                  setContactOpen(true);
                  setTimeout(() => setActiveTab("deal"), 50);
                }}
                size="sm"
                className="font-light whitespace-nowrap"
              >
                Submit a Deal
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Menu */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 bg-background/98 backdrop-blur-3xl top-20 md:top-24 z-40">
            <div className="container mx-auto px-6 py-8 overflow-y-auto max-h-[calc(100vh-6rem)]">
              <div className="space-y-6">
                {/* Commercial & Investment Section */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Commercial & Investment</p>
                  {NAV_ITEMS.commercialInvestment.items.map((item) => (
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

                {/* Residential Section */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Residential</p>
                  {NAV_ITEMS.residential.items.map((item) => (
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

                {/* Static Links */}
                <div className="pt-4 border-t border-white/10">
                  {staticNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block text-xl font-light text-foreground/80 hover:text-foreground transition-colors py-3"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setContactOpen(true);
                      setIsOpen(false);
                    }}
                    className="block text-xl font-light text-foreground/80 hover:text-foreground transition-colors py-3 w-full text-left"
                  >
                    Contact
                  </button>
                </div>

                <Button
                  onClick={() => {
                    setContactOpen(true);
                    setIsOpen(false);
                    setTimeout(() => setActiveTab("deal"), 50);
                  }}
                  className="w-full mt-6 font-light"
                  size="lg"
                >
                  Submit a Deal
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <ContactSheet 
        open={contactOpen} 
        onOpenChange={(open) => {
          setContactOpen(open);
          if (!open) setActiveTab("general");
        }} 
        initialTab={activeTab}
      />
    </>
  );
};
