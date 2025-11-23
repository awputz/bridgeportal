import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import AIChat from "./AIChat";

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsChatOpen(true);
      window.dispatchEvent(new Event('openAIChat'));
    };
    const handleCloseChat = () => {
      window.dispatchEvent(new Event('closeAIChat'));
    };
    
    window.addEventListener('openAIChat', handleOpenChat);
    return () => window.removeEventListener('openAIChat', handleOpenChat);
  }, []);

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 z-40 flex items-center justify-center border border-neutral-200"
          aria-label="Open chat"
        >
          <MessageCircle 
            size={22} 
            className="text-black" 
          />
        </button>
      )}
      
      <AIChat isOpen={isChatOpen} onClose={() => {
        setIsChatOpen(false);
        window.dispatchEvent(new Event('closeAIChat'));
      }} />
    </>
  );
};

export default FloatingChatButton;