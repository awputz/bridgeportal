import { formatDistanceToNow } from "date-fns";
import { 
  Share2, 
  MessageCircle, 
  Star, 
  FileUp, 
  Edit3,
  Activity
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useDealRoomActivity } from "@/hooks/useDealRoom";

interface DealRoomActivityProps {
  dealId: string;
}

const ACTION_CONFIG: Record<string, { icon: typeof Share2; label: string; color: string }> = {
  shared: { icon: Share2, label: "shared this deal", color: "text-primary" },
  comment_added: { icon: MessageCircle, label: "added a comment", color: "text-blue-500" },
  interest_expressed: { icon: Star, label: "expressed interest", color: "text-yellow-500" },
  file_uploaded: { icon: FileUp, label: "uploaded a file", color: "text-green-500" },
  notes_updated: { icon: Edit3, label: "updated notes", color: "text-purple-500" },
};

export function DealRoomActivity({ dealId }: DealRoomActivityProps) {
  const { data: activities, isLoading } = useDealRoomActivity(dealId);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Activity className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No activity recorded yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="relative px-4 py-2">
        {/* Timeline line */}
        <div className="absolute left-7 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = ACTION_CONFIG[activity.action] || {
              icon: Activity,
              label: activity.action,
              color: "text-muted-foreground",
            };
            const Icon = config.icon;
            const userInitials = activity.user?.full_name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "?";

            return (
              <div key={activity.id} className="relative flex gap-3 pl-2">
                {/* Timeline dot */}
                <div className="absolute left-[11px] top-3 h-2.5 w-2.5 rounded-full bg-background border-2 border-border z-10" />

                <Avatar className="h-8 w-8 flex-shrink-0 ml-4">
                  <AvatarImage src={activity.user?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                    <span className="text-sm font-medium">
                      {activity.user?.full_name || "Someone"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {config.label}
                    </span>
                  </div>

                  {activity.details && typeof activity.details === "object" && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {(activity.details as Record<string, unknown>).interest_type && 
                        `(${(activity.details as Record<string, unknown>).interest_type})`}
                      {(activity.details as Record<string, unknown>).file_name && 
                        `${(activity.details as Record<string, unknown>).file_name}`}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
