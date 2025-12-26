import { useState } from "react";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import {
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCRMActivities, useCreateActivity, useCompleteActivity } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ContactActivityTimelineProps {
  contactId: string;
}

const activityTypes = [
  { value: "call", label: "Call", icon: Phone, color: "text-green-400", bg: "bg-green-500/20" },
  { value: "email", label: "Email", icon: Mail, color: "text-blue-400", bg: "bg-blue-500/20" },
  { value: "meeting", label: "Meeting", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/20" },
  { value: "note", label: "Note", icon: MessageSquare, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { value: "task", label: "Task", icon: FileText, color: "text-orange-400", bg: "bg-orange-500/20" },
];

const getActivityConfig = (type: string) => {
  return activityTypes.find((t) => t.value === type) || activityTypes[3];
};

export function ContactActivityTimeline({ contactId }: ContactActivityTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivityType, setNewActivityType] = useState("note");
  const [newActivityTitle, setNewActivityTitle] = useState("");

  const { data: activities, isLoading } = useCRMActivities({ contactId, limit: 20 });
  const createActivity = useCreateActivity();
  const completeActivity = useCompleteActivity();

  // Calculate last contact indicator
  const getLastContactStatus = () => {
    if (!activities || activities.length === 0) {
      return { color: "text-muted-foreground", bg: "bg-muted", label: "Never contacted", days: -1 };
    }

    const lastActivity = activities.find((a) => a.is_completed);
    if (!lastActivity) {
      return { color: "text-muted-foreground", bg: "bg-muted", label: "No completed activities", days: -1 };
    }

    const daysSince = differenceInDays(new Date(), new Date(lastActivity.completed_at || lastActivity.created_at));

    if (daysSince < 7) {
      return {
        color: "text-green-400",
        bg: "bg-green-500/20",
        label: daysSince === 0 ? "Today" : `${daysSince}d ago`,
        days: daysSince,
      };
    } else if (daysSince < 30) {
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
        label: `${daysSince}d ago`,
        days: daysSince,
      };
    } else {
      return {
        color: "text-red-400",
        bg: "bg-red-500/20",
        label: `${daysSince}d ago`,
        days: daysSince,
      };
    }
  };

  const lastContactStatus = getLastContactStatus();

  const handleAddActivity = async () => {
    if (!newActivityTitle.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    createActivity.mutate(
      {
        agent_id: user.id,
        contact_id: contactId,
        deal_id: null,
        activity_type: newActivityType,
        title: newActivityTitle,
        description: null,
        due_date: null,
        completed_at: new Date().toISOString(),
        is_completed: true,
      },
      {
        onSuccess: () => {
          setNewActivityTitle("");
          setShowAddActivity(false);
        },
      }
    );
  };

  const handleCompleteActivity = (activityId: string) => {
    completeActivity.mutate(activityId);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Activity
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", lastContactStatus.bg, lastContactStatus.color)}>
              <Clock className="h-3 w-3 mr-1" />
              Last: {lastContactStatus.label}
            </Badge>
          </div>
        </div>

        <CollapsibleContent className="space-y-4">
          {/* Quick add activity */}
          {showAddActivity ? (
            <div className="glass-card p-4 space-y-3">
              <div className="flex gap-2">
                <Select value={newActivityType} onValueChange={setNewActivityType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className={cn("h-3 w-3", type.color)} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="What happened?"
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddActivity()}
                  className="flex-1"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAddActivity(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddActivity}
                  disabled={!newActivityTitle.trim() || createActivity.isPending}
                >
                  {createActivity.isPending ? "Adding..." : "Log Activity"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 border-dashed"
              onClick={() => setShowAddActivity(true)}
            >
              <Plus className="h-4 w-4" />
              Log Activity
            </Button>
          )}

          {/* Timeline */}
          {activities && activities.length > 0 ? (
            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute left-4 top-3 bottom-3 w-px bg-border" />

              {activities.map((activity, index) => {
                const config = getActivityConfig(activity.activity_type);
                const Icon = config.icon;

                return (
                  <div key={activity.id} className="relative flex gap-4 pb-4 group">
                    {/* Icon */}
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background",
                        config.bg
                      )}
                    >
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{activity.title}</p>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {activity.description}
                            </p>
                          )}
                        </div>
                        
                        {!activity.is_completed && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCompleteActivity(activity.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at))} ago
                        </span>
                        {activity.is_completed && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                            Completed
                          </Badge>
                        )}
                        {!activity.is_completed && activity.due_date && (
                          <Badge variant="outline" className="text-xs">
                            Due: {format(new Date(activity.due_date), "MMM d")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activities yet</p>
              <p className="text-xs">Log your first interaction above</p>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
