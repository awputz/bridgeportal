import { useEffect, useRef, useState } from "react";

export const useScrollReveal = (threshold = 0.1, initialVisible = false) => {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fallback: ensure content becomes visible even if observer fails
    const timeout = setTimeout(() => setIsVisible(true), 500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [threshold]);

  return { elementRef, isVisible };
};
