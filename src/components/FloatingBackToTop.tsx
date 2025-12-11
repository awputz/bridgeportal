import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const FloatingBackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };
    
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 z-50 touch-manipulation ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
