import { useState } from "react";
import { Bell, Pin, Calendar, Megaphone, Building2, DollarSign, Users, Filter } from "lucide-react";
import { useAnnouncements, Announcement } from "@/hooks/useAnnouncements";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  general: { icon: Megaphone, color: "bg-blue-500/20 text-blue-400", label: "General" },
  listing: { icon: Building2, color: "bg-purple-500/20 text-purple-400", label: "Listing" },
  deal: { icon: DollarSign, color: "bg-emerald-500/20 text-emerald-400", label: "Deal" },
  team: { icon: Users, color: "bg-amber-500/20 text-amber-400", label: "Team" },
};

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  const config = typeConfig[announcement.announcement_type] || typeConfig.general;
  const Icon = config.icon;

  return (
    <div className={cn(
      "glass-card p-5 transition-all duration-300",
      announcement.is_pinned && "border-amber-500/30"
    )}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full ${config.color.split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${config.color.split(' ')[1]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-foreground font-light">{announcement.title}</h3>
              {announcement.is_pinned && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  <Pin className="h-3 w-3" />
                  Pinned
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>
                {config.label}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground font-light text-sm mb-3 whitespace-pre-wrap">
            {announcement.content}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(announcement.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Announcements = () => {
  const { data: announcements, isLoading } = useAnnouncements();
  const [filter, setFilter] = useState<string>("all");

  const filteredAnnouncements = announcements?.filter(
    (a) => filter === "all" || a.announcement_type === filter
  );

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "general", label: "General" },
    { value: "listing", label: "Listings" },
    { value: "deal", label: "Deals" },
    { value: "team", label: "Team" },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Announcements</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extralight text-foreground mb-4">
            Company News
          </h1>
          <p className="text-muted-foreground font-light">
            Stay updated with the latest from Bridge Advisory Group.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-light transition-all whitespace-nowrap",
                filter === option.value
                  ? "bg-foreground text-background"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : filteredAnnouncements && filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-light text-foreground mb-2">No Announcements</h3>
            <p className="text-muted-foreground font-light text-sm">
              {filter === "all"
                ? "There are no announcements at this time."
                : `No ${filter} announcements found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
