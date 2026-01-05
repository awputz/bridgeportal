import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  ListTodo
} from "lucide-react";
import { format, isToday, isPast, parseISO } from "date-fns";
import { useTasks, useCompleteTask, Task } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CRMTasksPanelProps {
  division: string;
}

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

const TaskRow = ({ 
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
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-white/5",
      task.is_completed && "opacity-50"
    )}>
      <button
        onClick={onComplete}
        disabled={isCompleting || task.is_completed}
        className={cn(
          "flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all",
          task.is_completed 
            ? "bg-green-500 border-green-500" 
            : "border-muted-foreground/50 hover:border-foreground"
        )}
      >
        {task.is_completed && <CheckCircle2 className="w-3 h-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm">
          {categoryIcons[task.category] || "📋"}
        </span>
        <span className={cn(
          "text-sm font-light truncate",
          task.is_completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </span>
      </div>

      <Badge 
        variant="outline" 
        className={cn(
          "text-[10px] shrink-0 px-1.5 py-0",
          priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium
        )}
      >
        {task.priority}
      </Badge>

      {task.due_date && (
        <span className={cn(
          "text-xs shrink-0",
          isOverdue ? "text-red-400" : isDueToday ? "text-yellow-400" : "text-muted-foreground"
        )}>
          {isOverdue && <AlertCircle className="h-3 w-3 inline mr-1" />}
          {format(parseISO(task.due_date), "MMM d")}
        </span>
      )}

      {task.deal && (
        <Link 
          to={`/portal/crm/deals/${task.deal_id}`}
          className="text-xs text-muted-foreground hover:text-foreground truncate max-w-24"
        >
          {task.deal.property_address}
        </Link>
      )}
    </div>
  );
};

export const CRMTasksPanel = ({ division }: CRMTasksPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState<"today" | "week" | "overdue">("today");
  
  const { data: tasks, isLoading } = useTasks(filter, division);
  const completeTask = useCompleteTask();

  const taskCount = tasks?.length || 0;
  const overdueCount = tasks?.filter(t => 
    t.due_date && isPast(parseISO(t.due_date)) && !t.is_completed
  ).length || 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="glass-card overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <ListTodo className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-light">Tasks</span>
              {taskCount > 0 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
                  {taskCount}
                </Badge>
              )}
              {overdueCount > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                  {overdueCount} overdue
                </Badge>
              )}
            </div>
            <Link 
              to="/portal/tasks" 
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              View all →
            </Link>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {/* Quick Filters */}
          <div className="flex items-center gap-2 px-4 py-2 border-t border-white/5">
            {(["today", "week", "overdue"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full transition-all",
                  filter === f 
                    ? "bg-foreground text-background" 
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                )}
              >
                {f === "today" && "Today"}
                {f === "week" && "This Week"}
                {f === "overdue" && "Overdue"}
              </button>
            ))}
            <div className="flex-1" />
            <Link to={`/portal/tasks?division=${division}`}>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                <Plus className="h-3 w-3" />
                Add Task
              </Button>
            </Link>
          </div>

          {/* Task List */}
          <div className="px-2 pb-3 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 px-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : tasks && tasks.length > 0 ? (
              <div className="space-y-1">
                {tasks.slice(0, 8).map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onComplete={() => completeTask.mutate(task.id)}
                    isCompleting={completeTask.isPending}
                  />
                ))}
                {tasks.length > 8 && (
                  <Link 
                    to={`/portal/tasks?division=${division}`}
                    className="block text-center text-xs text-muted-foreground hover:text-foreground py-2"
                  >
                    +{tasks.length - 8} more tasks
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No tasks {filter === "today" ? "due today" : filter === "week" ? "this week" : "overdue"}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};