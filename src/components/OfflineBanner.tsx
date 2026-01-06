import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { cn } from "@/lib/utils";

interface OfflineBannerProps {
  className?: string;
}

/**
 * Banner that displays when the user is offline
 * Uses the existing useOnlineStatus hook
 */
export function OfflineBanner({ className }: OfflineBannerProps) {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 z-[100] bg-destructive text-destructive-foreground py-2 px-4 text-center text-sm font-medium shadow-md",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <WifiOff className="inline h-4 w-4 mr-2" aria-hidden="true" />
      You're offline. Some features may be unavailable.
    </div>
  );
}
