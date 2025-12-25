import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { useTodaysTasks, useCompleteActivity } from "@/hooks/useCRM";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const activityTypeLabels: Record<string, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  tour: "Tour",
  showing: "Showing",
  proposal: "Proposal",
  "follow-up": "Follow-up",
  note: "Note",
  task: "Task",
};

export const TodaysPriorities = () => {
  const { data: tasks, isLoading } = useTodaysTasks();
  const completeTask = useCompleteActivity();

  const handleComplete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    completeTask.mutate(id);
  };

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Today's Priorities
        </h3>
        <Link
          to="/portal/crm"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="text-center py-6">
          <CheckCircle2 className="h-8 w-8 text-green-500/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground/70">No tasks due today</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <button
                onClick={(e) => handleComplete(task.id, e)}
                className="mt-0.5 flex-shrink-0"
                disabled={completeTask.isPending}
              >
                <Circle className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{task.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-1.5 py-0.5 bg-white/10 rounded">
                    {activityTypeLabels[task.activity_type] || task.activity_type}
                  </span>
                  {task.contact && (
                    <span className="truncate">{task.contact.full_name}</span>
                  )}
                  {task.due_date && (
                    <span>{format(new Date(task.due_date), "h:mm a")}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {tasks.length > 5 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{tasks.length - 5} more tasks
            </p>
          )}
        </div>
      )}
    </div>
  );
};
