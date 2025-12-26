import { RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DataFreshnessIndicatorProps {
  dataUpdatedAt: number | undefined;
  isRefetching?: boolean;
}

export const DataFreshnessIndicator = ({ 
  dataUpdatedAt, 
  isRefetching 
}: DataFreshnessIndicatorProps) => {
  if (!dataUpdatedAt) return null;

  const timeAgo = formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true });

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <RefreshCw className={`h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
      <span>Updated {timeAgo}</span>
    </div>
  );
};
