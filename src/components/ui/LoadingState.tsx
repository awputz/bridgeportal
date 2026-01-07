import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  variant?: "inline" | "card" | "page";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingState({ 
  message, 
  variant = "inline", 
  size = "md",
  className 
}: LoadingStateProps) {
  const spinnerSize = sizeClasses[size];

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className={cn(spinnerSize, "animate-spin text-muted-foreground")} />
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn(
        "glass-card p-8 flex flex-col items-center justify-center text-center min-h-[200px]",
        className
      )}>
        <Loader2 className={cn("h-8 w-8 animate-spin text-muted-foreground mb-3")} />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  // page variant
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] w-full",
      className
    )}>
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
      {message && (
        <p className="text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
