import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileStickyContactProps {
  onContactClick: () => void;
  scrollThreshold?: number;
  className?: string;
}

export const MobileStickyContact = ({
  onContactClick,
  scrollThreshold = 0.3,
  className,
}: MobileStickyContactProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setIsVisible(scrollPercent > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

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

  if (!isMobile || !isVisible || isChatOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(env(safe-area-inset-bottom,0px)+0.75rem,1.25rem)] bg-gradient-to-t from-background via-background/95 to-transparent animate-fade-in",
        className
      )}
    >
      <Button
        onClick={onContactClick}
        className="w-full h-12 text-sm font-medium shadow-lg"
        size="lg"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Get in Touch
      </Button>
    </div>
  );
};
