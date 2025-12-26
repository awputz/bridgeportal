import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

export interface FABProps extends ButtonProps {
  position?: "bottom-right" | "bottom-center" | "bottom-left";
  offset?: { bottom?: number; right?: number; left?: number };
}

const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, position = "bottom-right", offset, children, ...props }, ref) => {
    const positionClasses = {
      "bottom-right": "right-4 bottom-20 md:bottom-6 md:right-6",
      "bottom-center": "left-1/2 -translate-x-1/2 bottom-20 md:bottom-6",
      "bottom-left": "left-4 bottom-20 md:bottom-6",
    };

    return (
      <Button
        ref={ref}
        size="lg"
        className={cn(
          "fixed z-50 rounded-full shadow-lg h-14 w-14 p-0",
          "hover:shadow-xl active:scale-95 transition-all",
          "animate-in fade-in slide-in-from-bottom-4 duration-300",
          positionClasses[position],
          className
        )}
        style={{
          bottom: offset?.bottom,
          right: offset?.right,
          left: offset?.left,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
FAB.displayName = "FAB";

export { FAB };
