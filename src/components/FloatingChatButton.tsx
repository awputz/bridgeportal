import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const isMobile = useIsMobile();

  // Stop pulsing after first click
  useEffect(() => {
    if (isOpen) {
      setShowPulse(false);
    }
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
    // Dispatch custom event to toggle AI chat
    window.dispatchEvent(new CustomEvent(isOpen ? 'closeAIChat' : 'openAIChat'));
  };

  // Listen for external close events
  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener('closeAIChat', handleClose);
    return () => window.removeEventListener('closeAIChat', handleClose);
  }, []);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed z-50 flex items-center justify-center rounded-full shadow-lg transition-all duration-300",
        "bg-primary text-primary-foreground hover:scale-110",
        isMobile ? "bottom-8 left-8 w-14 h-14" : "bottom-8 left-8 w-14 h-14",
        isOpen && "rotate-90"
      )}
      aria-label={isOpen ? "Close chat" : "Open AI assistant"}
    >
      {/* Pulse animation */}
      {showPulse && !isOpen && (
        <>
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
          <span className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-30" />
        </>
      )}
      
      {/* Icon */}
      <div className="relative z-10">
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </div>

      {/* Online indicator */}
      {!isOpen && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-primary" />
      )}
    </button>
  );
};
