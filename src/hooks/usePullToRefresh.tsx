import { useEffect, useState, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const isMobile = useIsMobile();

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!startY || window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0 && distance < 150) {
      setPullDistance(distance);
      setIsPulling(true);
    }
  }, [startY]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 80) {
      // Trigger refresh
      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  }, [pullDistance, onRefresh]);

  useEffect(() => {
    if (!isMobile) return;

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isPulling,
    pullDistance,
    isRefreshing: isPulling && pullDistance > 80,
  };
};
