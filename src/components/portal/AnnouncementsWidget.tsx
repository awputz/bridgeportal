import { Link } from "react-router-dom";
import { Bell, ArrowRight, Pin, Megaphone, Building2, DollarSign, Users } from "lucide-react";
import { useAnnouncements, Announcement } from "@/hooks/useAnnouncements";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  general: { icon: Megaphone, color: "text-blue-400" },
  listing: { icon: Building2, color: "text-purple-400" },
  deal: { icon: DollarSign, color: "text-emerald-400" },
  team: { icon: Users, color: "text-amber-400" },
};

export const AnnouncementsWidget = () => {
  const { data: announcements, isLoading } = useAnnouncements();

  // Get the 3 most recent, prioritizing pinned ones
  const topAnnouncements = announcements
    ?.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!topAnnouncements || topAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-light text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          Company News
        </h2>
        <Link
          to="/portal/announcements"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {topAnnouncements.map((announcement) => {
          const config = typeConfig[announcement.announcement_type] || typeConfig.general;
          const Icon = config.icon;

          return (
            <Link
              key={announcement.id}
              to="/portal/announcements"
              className={cn(
                "block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300",
                announcement.is_pinned && "border border-amber-500/20"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-light text-foreground truncate">
                      {announcement.title}
                    </span>
                    {announcement.is_pinned && (
                      <Pin className="h-3 w-3 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(announcement.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
