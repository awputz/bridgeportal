import { useState, useCallback, RefObject } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface Use3DTiltReturn {
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  tiltStyle: React.CSSProperties;
}

export const use3DTilt = (
  ref: RefObject<HTMLElement>,
  maxTilt: number = 10
): Use3DTiltReturn => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setPosition({ x, y });
    },
    [ref]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const tiltStyle: React.CSSProperties = {
    transform: `perspective(1000px) rotateY(${position.x * maxTilt}deg) rotateX(${-position.y * maxTilt}deg)`,
    transition: position.x === 0 && position.y === 0 ? "transform 0.5s ease-out" : "transform 0.1s ease-out",
  };

  return { handleMouseMove, handleMouseLeave, tiltStyle };
};
