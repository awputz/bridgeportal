import { useDealHistory } from '@/hooks/useDealHistory';
import { Clock, ArrowRight, User } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface DealTimelineProps {
  dealId: string;
}

export function DealTimeline({ dealId }: DealTimelineProps) {
  const { data: history, isLoading } = useDealHistory(dealId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No history yet</p>
        <p className="text-xs">Changes to this deal will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-6">
        {history.map((entry, index) => (
          <div key={entry.id} className="relative flex gap-4 pl-2">
            {/* Timeline dot */}
            <div className="absolute left-0 mt-1.5 w-8 flex justify-center">
              <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
            </div>

            {/* Content */}
            <div className="flex-1 ml-6 min-w-0">
              {/* Stage change */}
              {entry.field_name === 'stage' && (
                <div className="flex items-center gap-2 flex-wrap">
                  {entry.old_stage && (
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: entry.old_stage.color,
                        color: entry.old_stage.color,
                      }}
                      className="text-xs leading-tight"
                    >
                      {entry.old_stage.name}
                    </Badge>
                  )}
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  {entry.new_stage && (
                    <Badge
                      style={{
                        backgroundColor: entry.new_stage.color,
                        color: 'white',
                      }}
                      className="text-xs leading-tight"
                    >
                      {entry.new_stage.name}
                    </Badge>
                  )}
                </div>
              )}

              {/* Other field changes */}
              {entry.field_name !== 'stage' && (
                <p className="text-sm text-foreground leading-tight">
                  <span className="font-medium capitalize">{entry.field_name.replace(/_/g, ' ')}</span>
                  {entry.old_value && (
                    <span className="text-muted-foreground"> from "{entry.old_value}"</span>
                  )}
                  {entry.new_value && (
                    <span> to "{entry.new_value}"</span>
                  )}
                </p>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {entry.changed_by_user ? (
                  <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={entry.changed_by_user.avatar_url || undefined} />
                      <AvatarFallback className="text-[8px]">
                        {entry.changed_by_user.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="leading-none">{entry.changed_by_user.full_name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="leading-none">System</span>
                  </div>
                )}
                <span className="leading-none">•</span>
                <time className="leading-none">
                  {formatDistance(new Date(entry.changed_at), new Date(), { addSuffix: true })}
                </time>
              </div>

              {/* Notes */}
              {entry.notes && (
                <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1 leading-tight">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
