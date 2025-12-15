import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useContactSheet } from "@/contexts/ContactSheetContext";

export const StickyBottomBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { openContactSheet } = useContactSheet();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show on listing detail pages or forms
  const hideOnRoutes = ["/contact", "/join", "/auth"];
  const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route)) || 
                     location.pathname.includes("/listings/");

  if (!isMobile || !isVisible || shouldHide) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-safe bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl animate-slide-up">
      <div className="container mx-auto max-w-md">
        <div className="flex gap-2 justify-center">
          <Button asChild variant="ghost" size="sm" className="flex-1 text-xs font-light">
            <Link to="/services/investment-sales" className="flex flex-col items-center gap-1 py-2">
              <Briefcase size={16} />
              <span>Services</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="flex-1 text-xs font-light">
            <Link to="/team" className="flex flex-col items-center gap-1 py-2">
              <Users size={16} />
              <span>Team</span>
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="flex-1 text-xs font-light"
            onClick={openContactSheet}
          >
            <div className="flex flex-col items-center gap-1 py-2">
              <Phone size={16} />
              <span>Contact</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
