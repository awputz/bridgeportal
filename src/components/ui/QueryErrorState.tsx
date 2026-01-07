import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { handleQueryError } from "@/lib/errorHandler";

interface QueryErrorStateProps {
  error: Error | unknown;
  onRetry?: () => void;
  title?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Get icon based on error type
 */
function getErrorIcon(error: unknown) {
  const err = error as { message?: string; code?: string };
  
  if (err?.message?.includes('fetch') || err?.message?.includes('network') || err?.code === 'PGRST000') {
    return WifiOff;
  }
  
  return AlertCircle;
}

/**
 * Determine if error is likely retryable
 */
function isRetryableError(error: unknown): boolean {
  const err = error as { code?: string; message?: string };
  
  // Network errors are retryable
  if (err?.message?.includes('fetch') || err?.message?.includes('network')) {
    return true;
  }
  
  // Auth errors are not retryable without re-login
  if (err?.code === '42501' || err?.code === 'PGRST116') {
    return false;
  }
  
  // Most other errors can be retried
  return true;
}

export function QueryErrorState({ 
  error, 
  onRetry, 
  title = "Failed to load",
  className,
  compact = false
}: QueryErrorStateProps) {
  const userMessage = handleQueryError(error);
  const Icon = getErrorIcon(error);
  const canRetry = isRetryableError(error);

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20",
        className
      )}>
        <Icon className="h-5 w-5 text-destructive flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground font-medium truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{userMessage}</p>
        </div>
        {onRetry && canRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="flex-shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "glass-card p-8 flex flex-col items-center justify-center text-center min-h-[200px]",
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        {userMessage}
      </p>
      {onRetry && canRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
