import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isPast, isSameMonth } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useScheduledPosts, useCancelScheduledPost, ScheduledPost } from "@/hooks/marketing/useScheduledPosts";
import { SchedulePostDialog } from "@/components/marketing/SchedulePostDialog";
import { cn } from "@/lib/utils";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
};

const platformColors = {
  instagram: 'text-pink-500 bg-pink-500/10',
  facebook: 'text-blue-600 bg-blue-600/10',
  linkedin: 'text-blue-700 bg-blue-700/10',
  twitter: 'text-sky-500 bg-sky-500/10',
};

const statusConfig = {
  scheduled: { label: 'Scheduled', icon: Clock, variant: 'secondary' as const },
  posted: { label: 'Posted', icon: CheckCircle2, variant: 'default' as const },
  failed: { label: 'Failed', icon: AlertCircle, variant: 'destructive' as const },
  cancelled: { label: 'Cancelled', icon: XCircle, variant: 'outline' as const },
};

export default function SocialSchedule() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const { data: posts, isLoading } = useScheduledPosts();
  const { mutate: cancelPost } = useCancelScheduledPost();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getPostsForDay = (day: Date) => {
    return posts?.filter(post => isSameDay(new Date(post.scheduled_at), day)) || [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderPostCard = (post: ScheduledPost) => {
    const PlatformIcon = platformIcons[post.platform];
    const StatusConfig = statusConfig[post.status];

    return (
      <Card key={post.id} className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", platformColors[post.platform])}>
                <PlatformIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium capitalize">{post.platform}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(post.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={StatusConfig.variant} className="gap-1">
                <StatusConfig.icon className="h-3 w-3" />
                {StatusConfig.label}
              </Badge>
              {post.status === 'scheduled' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => cancelPost(post.id)}
                    >
                      Cancel Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <p className="mt-3 text-sm line-clamp-3">{post.content}</p>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {post.hashtags.slice(0, 5).map((tag, i) => (
                <span key={i} className="text-xs text-primary">
                  #{tag}
                </span>
              ))}
              {post.hashtags.length > 5 && (
                <span className="text-xs text-muted-foreground">
                  +{post.hashtags.length - 5} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <MarketingLayout breadcrumbs={[{ label: "Social Schedule" }]}>
        <LoadingState variant="page" message="Loading schedule..." />
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout breadcrumbs={[{ label: "Social Schedule" }]}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight">Social Schedule</h1>
            <p className="text-sm text-muted-foreground font-normal">
              Manage and schedule your social media posts
            </p>
          </div>
          <Button onClick={() => setShowScheduleDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Post
          </Button>
        </div>

        {/* View Toggle */}
        <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>

            {view === 'calendar' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[140px] text-center">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="calendar" className="mt-4">
            <Card>
              <CardContent className="p-4">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[100px] bg-muted/30 rounded-lg" />
                  ))}

                  {/* Days of the month */}
                  {days.map(day => {
                    const dayPosts = getPostsForDay(day);
                    const isPastDay = isPast(day) && !isToday(day);

                    return (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          "min-h-[100px] p-2 rounded-lg border transition-colors",
                          isToday(day) && "border-primary bg-primary/5",
                          isPastDay && "bg-muted/30 opacity-60",
                          !isToday(day) && !isPastDay && "hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "text-sm font-medium mb-1",
                          isToday(day) && "text-primary"
                        )}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayPosts.slice(0, 3).map(post => {
                            const Icon = platformIcons[post.platform];
                            return (
                              <div
                                key={post.id}
                                className={cn(
                                  "flex items-center gap-1 text-xs p-1 rounded",
                                  platformColors[post.platform]
                                )}
                              >
                                <Icon className="h-3 w-3" />
                                <span className="truncate">{format(new Date(post.scheduled_at), 'h:mm a')}</span>
                              </div>
                            );
                          })}
                          {dayPosts.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{dayPosts.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            {posts && posts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(renderPostCard)}
              </div>
            ) : (
              <EmptyState
                icon={CalendarIcon}
                title="No scheduled posts"
                description="Create your first scheduled post to get started"
                actionLabel="Schedule Post"
                onAction={() => setShowScheduleDialog(true)}
              />
            )}
          </TabsContent>
        </Tabs>

      <SchedulePostDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      />
    </MarketingLayout>
  );
}
