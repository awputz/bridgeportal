import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const FloatingBackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileStickyVisible, setIsMobileStickyVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      // Show back to top after scrolling 400px
      setIsVisible(window.scrollY > 400);
      
      // Check if we're past the threshold where MobileStickyContact would show (30% of page)
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setIsMobileStickyVisible(scrollPercent > 0.3);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate bottom position - move up when MobileStickyContact is visible on mobile
  const bottomPosition = isMobile && isMobileStickyVisible 
    ? 'max(env(safe-area-inset-bottom, 0px) + 5rem, 5.5rem)' // Above the sticky CTA bar
    : 'max(env(safe-area-inset-bottom, 0px) + 1.5rem, 1.5rem)';

  return (
    <button
      onClick={scrollToTop}
      className={`fixed w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 z-50 touch-manipulation active:scale-95 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ 
        bottom: bottomPosition,
        right: 'clamp(1rem, 4vw, 2rem)',
      }}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
