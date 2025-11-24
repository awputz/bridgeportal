import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import bridgeLogo from "@/assets/bridge-investment-sales-logo-dark.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ContactSheet } from "@/components/ContactSheet";
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
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
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
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/");
  };
  
  return <>
      {/* Light Theme Navigation Bar */}
      <div className="fixed top-6 left-0 right-0 z-50 px-6 animate-slide-down">
        <nav className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl border border-border shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between h-20 px-8">
            {/* Logo - Left on mobile/tablet, centered on desktop */}
            <Link to="/" className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 transition-transform hover:scale-110 duration-300">
              <img src={bridgeLogo} alt="BRIDGE Investment Sales" className="h-12" />
            </Link>

            {/* Left Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.slice(0, 3).map(item => <Link key={item.path} to={item.path} className={cn("px-3 py-2 text-[15px] font-semibold transition-all duration-300 rounded-lg whitespace-nowrap tracking-tight hover:scale-105", location.pathname === item.path ? "text-primary bg-muted/80 shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-muted/50")}>
                  {item.name}
                </Link>)}
            </div>

            {/* Right Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.slice(3).map(item => <Link key={item.path} to={item.path} className={cn("px-3 py-2 text-[15px] font-semibold transition-all duration-300 rounded-lg whitespace-nowrap tracking-tight", location.pathname === item.path ? "text-primary bg-muted/80 shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-muted/50")}>
                  {item.name}
                </Link>)}

              <Button asChild size="sm" className="ml-2 rounded-lg h-9 px-5 text-[15px] font-semibold tracking-tight bg-primary text-primary-foreground hover:shadow-md transition-shadow">
                <Link to="/submit-deal">Submit a Deal</Link>
              </Button>

              {/* Auth Buttons */}
              {user && <Button onClick={handleLogout} variant="outline" size="sm" className="ml-2 rounded-xl h-9 px-5 text-[15px] font-medium tracking-wide hover:scale-105">
                  Logout
                </Button>}
            </div>

            {/* Mobile Menu Button - positioned to the right */}
            <button className="lg:hidden p-2 text-primary ml-auto hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Full Screen Menu */}
      <div className={cn("fixed inset-0 z-40 bg-white/98 backdrop-blur-xl lg:hidden transition-all duration-500 ease-out", isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none")}>
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
              {user ? <Button onClick={handleLogout} variant="outline" size="lg" className="rounded-lg tracking-tight w-full font-semibold">
                  Logout
                </Button> : <>
                  <Button onClick={() => navigate("/auth")} variant="ghost" size="lg" className="rounded-lg tracking-tight w-full bg-muted/50 font-semibold">
                    Login
                  </Button>
                  <Button asChild size="lg" className="rounded-lg tracking-tight w-full bg-primary text-primary-foreground font-semibold">
                    <Link to="/submit-deal">Submit a Deal</Link>
                  </Button>
                </>}
            </div>
          </nav>
        </div>
      </div>

      {/* Contact Sheet */}
      <ContactSheet open={contactOpen} onOpenChange={setContactOpen} />
    </>;
};