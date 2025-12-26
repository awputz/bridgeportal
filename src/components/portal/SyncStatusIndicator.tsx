import { useState, useEffect } from "react";
import { RefreshCw, Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SyncStatusIndicatorProps {
  isSyncing: boolean;
  syncedCount?: number;
}

export function SyncStatusIndicator({ isSyncing, syncedCount = 0 }: SyncStatusIndicatorProps) {
  const [showComplete, setShowComplete] = useState(false);
  const [wasSync, setWasSync] = useState(false);

  useEffect(() => {
    if (isSyncing) {
      setWasSync(true);
      setShowComplete(false);
    } else if (wasSync) {
      // Show completion briefly after sync finishes
      setShowComplete(true);
      const timer = setTimeout(() => {
        setShowComplete(false);
        setWasSync(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSyncing, wasSync]);

  if (!isSyncing && !showComplete) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-[60] flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300",
        "bg-background/95 backdrop-blur-xl border border-border shadow-lg",
        isSyncing ? "animate-in fade-in slide-in-from-top-2" : "animate-out fade-out slide-out-to-top-2"
      )}
    >
      {isSyncing ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-foreground/80">Syncing contacts...</span>
        </>
      ) : showComplete ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm text-foreground/80">
            {syncedCount > 0 ? `${syncedCount} contacts synced` : "Contacts up to date"}
          </span>
        </>
      ) : null}
    </div>
  );
}
