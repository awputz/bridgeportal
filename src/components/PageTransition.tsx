import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("enter");
  const isFirstRender = useRef(true);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("exit");
      
      // Fallback timeout in case animation doesn't fire
      transitionTimeout.current = setTimeout(() => {
        setTransitionStage("enter");
        setDisplayLocation(location);
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 400);
    }
    
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, [location, displayLocation]);

  const handleAnimationEnd = useCallback(() => {
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    
    if (transitionStage === "exit") {
      setTransitionStage("enter");
      setDisplayLocation(location);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [transitionStage, location]);

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};
