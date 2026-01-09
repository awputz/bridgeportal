import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg";
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = "default",
  message,
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 gap-3", className)}>
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-muted-foreground")} />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
