import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const StickyBottomBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

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
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl animate-slide-up">
      <div className="container mx-auto max-w-md">
        <Button asChild size="lg" className="w-full rounded-full text-base">
          <Link to="/listings" className="flex items-center gap-2">
            <Search size={18} />
            View All Listings
          </Link>
        </Button>
      </div>
    </div>
  );
};
