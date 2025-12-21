import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const FloatingContactButton = ({ onContactClick }: { onContactClick: () => void }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleChatOpen = () => setIsChatOpen(true);
    const handleChatClose = () => setIsChatOpen(false);
    
    window.addEventListener('openAIChat', handleChatOpen);
    window.addEventListener('closeAIChat', handleChatClose);
    
    return () => {
      window.removeEventListener('openAIChat', handleChatOpen);
      window.removeEventListener('closeAIChat', handleChatClose);
    };
  }, []);

  if (!isMobile || isChatOpen) return null;

  return (
    <button
      onClick={onContactClick}
      className="fixed w-14 h-14 bg-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 z-40 flex items-center justify-center border border-neutral-200"
      style={{ 
        bottom: 'max(env(safe-area-inset-bottom, 0px) + 1rem, 1.5rem)',
        right: '5.5rem'
      }}
      aria-label="Contact us"
    >
      <Phone 
        size={22} 
        className="text-black" 
      />
    </button>
  );
};
