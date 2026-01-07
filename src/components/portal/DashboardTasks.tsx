import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ArrowRight,
  Plus,
  ListTodo
} from "lucide-react";
import { format, parseISO, isPast, isToday } from "date-fns";
import { useTasks, useCompleteTask, useTaskStats, Task } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { QueryErrorState } from "@/components/ui/QueryErrorState";

type FilterType = "today" | "overdue" | "week" | "all";

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

const categoryIcons: Record<string, string> = {
  call: "📞",
  email: "✉️",
  meeting: "👥",
  "site-visit": "🏢",
  document: "📄",
  task: "✓",
  other: "📋",
};

const TaskItem = ({ 
  task, 
  onComplete, 
  isCompleting 
}: { 
  task: Task; 
  onComplete: () => void;
  isCompleting: boolean;
}) => {
  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && !task.is_completed;
  const isDueToday = task.due_date && isToday(parseISO(task.due_date));

  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors",
      task.is_completed && "opacity-60"
    )}>
      <button
        onClick={onComplete}
        disabled={isCompleting || task.is_completed}
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all mt-0.5",
          task.is_completed 
            ? "bg-green-500 border-green-500" 
            : "border-muted-foreground/50 hover:border-foreground"
        )}
      >
        {task.is_completed && <CheckCircle2 className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm font-light text-foreground",
            task.is_completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          <span className="text-sm flex-shrink-0">
            {categoryIcons[task.category as keyof typeof categoryIcons] || "📋"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium)}>
            {task.priority}
          </Badge>

          {task.due_date && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-400" : isDueToday ? "text-yellow-400" : "text-muted-foreground"
            )}>
              {isOverdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {format(parseISO(task.due_date), "MMM d")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DashboardTasks = () => {
  const [filter, setFilter] = useState<FilterType>("today");
  const { data: tasks, isLoading, error, refetch } = useTasks(filter);
  const { data: stats } = useTaskStats();
  const completeTask = useCompleteTask();

  // Show error state if query failed
  if (error) {
    return (
      <div className="glass-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light text-foreground flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-muted-foreground" />
            Tasks
          </h2>
        </div>
        <QueryErrorState 
          error={error}
          onRetry={() => refetch()}
          compact
          title="Failed to load tasks"
        />
      </div>
    );
  }

  const filterOptions: { value: FilterType; label: string; count?: number; icon: typeof Calendar }[] = [
    { value: "today", label: "Today", count: stats?.today, icon: Calendar },
    { value: "overdue", label: "Overdue", count: stats?.overdue, icon: AlertCircle },
    { value: "week", label: "This Week", count: stats?.thisWeek, icon: Clock },
    { value: "all", label: "All", icon: ListTodo },
  ];

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-light text-foreground flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-muted-foreground" />
          Tasks
        </h2>
        <Link 
          to="/portal/tasks"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filterOptions.map((option) => {
          const isActive = filter === option.value;
          const hasOverdue = option.value === "overdue" && (option.count || 0) > 0;
          
          return (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-light transition-all",
                isActive 
                  ? "bg-foreground text-background" 
                  : hasOverdue
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              )}
            >
              {option.label}
              {option.count !== undefined && option.count > 0 && (
                <span className="ml-1.5 opacity-75">({option.count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))
        ) : tasks?.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-8 w-8 text-green-400/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {filter === "today" && "No tasks due today"}
              {filter === "overdue" && "No overdue tasks"}
              {filter === "week" && "No tasks this week"}
              {filter === "all" && "No tasks yet"}
            </p>
            <Link to="/portal/tasks">
              <Button variant="outline" size="sm" className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </Link>
          </div>
        ) : (
          tasks?.slice(0, 8).map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={() => completeTask.mutate(task.id)}
              isCompleting={completeTask.isPending}
            />
          ))
        )}
      </div>

      {/* Show more link if more than 8 tasks */}
      {tasks && tasks.length > 8 && (
        <Link 
          to="/portal/tasks"
          className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4"
        >
          +{tasks.length - 8} more tasks
        </Link>
      )}
    </div>
  );
};
