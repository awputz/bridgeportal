import { useState } from "react";
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ListTodo,
  Filter,
  User,
  Building2,
  MoreHorizontal,
  Trash2,
  Search
} from "lucide-react";
import { format, isToday, isPast, parseISO } from "date-fns";
import { useTasks, useCreateTask, useCompleteTask, useDeleteTask, useTaskStats, Task } from "@/hooks/useTasks";
import { useCRMContacts, useCRMDeals } from "@/hooks/useCRM";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

const categoryIcons = {
  call: "📞",
  email: "✉️",
  meeting: "👥",
  "site-visit": "🏢",
  document: "📄",
  task: "✓",
  other: "📋",
};

const activityTypes = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "site-visit", label: "Site Visit" },
  { value: "document", label: "Document" },
  { value: "follow-up", label: "Follow Up" },
  { value: "other", label: "Other" },
];

const TaskCard = ({ 
  task, 
  onComplete, 
  onDelete,
  isCompleting 
}: { 
  task: Task; 
  onComplete: () => void;
  onDelete: () => void;
  isCompleting: boolean;
}) => {
  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && !task.is_completed;
  const isDueToday = task.due_date && isToday(parseISO(task.due_date));

  return (
    <div className={cn(
      "glass-card p-4 transition-all duration-200 hover:bg-white/5",
      task.is_completed && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
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
            <h3 className={cn(
              "font-light text-foreground",
              task.is_completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Priority Badge */}
            <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium)}>
              {task.priority}
            </Badge>

            {/* Category */}
            <span className="text-sm">
              {categoryIcons[task.category as keyof typeof categoryIcons] || "📋"}
            </span>

            {/* Due Date */}
            {task.due_date && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-red-400" : isDueToday ? "text-yellow-400" : "text-muted-foreground"
              )}>
                {isOverdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {format(parseISO(task.due_date), "MMM d, h:mm a")}
              </div>
            )}

            {/* Linked Contact */}
            {task.contact && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {task.contact.full_name}
              </div>
            )}

            {/* Linked Deal */}
            {task.deal && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                {task.deal.property_address}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Tasks = () => {
  const [filter, setFilter] = useState<"today" | "week" | "overdue" | "completed" | "all">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: tasks, isLoading } = useTasks(filter);
  const { data: stats } = useTaskStats();
  const { data: contacts } = useCRMContacts();
  const { data: deals } = useCRMDeals();
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  // Apply additional filters
  const filteredTasks = tasks?.filter(task => {
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Priority filter
    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }
    // Category filter
    if (categoryFilter !== "all" && task.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dueDate = formData.get("due_date") as string;
    const dueTime = formData.get("due_time") as string || "09:00";

    createTask.mutate({
      agent_id: user.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      activity_type: formData.get("activity_type") as string || "task",
      priority: formData.get("priority") as string || "medium",
      category: formData.get("activity_type") as string || "task",
      due_date: dueDate ? `${dueDate}T${dueTime}:00` : null,
      contact_id: formData.get("contact_id") as string || null,
      deal_id: formData.get("deal_id") as string || null,
      is_completed: false,
      is_all_day: false,
      reminder_at: null,
      recurring_pattern: null,
    }, {
      onSuccess: () => {
        setShowAddDialog(false);
        form.reset();
      },
    });
  };

  const confirmDeleteTask = () => {
    if (deleteTaskId) {
      deleteTask.mutate(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto page-content">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 section-gap">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-1 md:mb-2">
              Tasks
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-light">
              Manage your activities and stay on track
            </p>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel-strong max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-light">Create Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" required placeholder="e.g., Follow up with client" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={2} placeholder="Additional details..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity_type">Type</Label>
                    <Select name="activity_type" defaultValue="task">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input id="due_date" name="due_date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_time">Time</Label>
                    <Input id="due_time" name="due_time" type="time" defaultValue="09:00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_id">Link to Contact</Label>
                    <Select name="contact_id">
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts?.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deal_id">Link to Deal</Label>
                    <Select name="deal_id">
                      <SelectTrigger>
                        <SelectValue placeholder="Select deal" />
                      </SelectTrigger>
                      <SelectContent>
                        {deals?.map((deal) => (
                          <SelectItem key={deal.id} value={deal.id}>
                            {deal.property_address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTask.isPending}>
                    {createTask.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="stat-grid section-gap">
          <button
            onClick={() => setFilter("today")}
            className={cn(
              "glass-card p-3 sm:p-4 text-left transition-all hover:bg-white/5 touch-target",
              filter === "today" && "ring-1 ring-foreground/20"
            )}
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-1 sm:mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-light">Today</span>
            </div>
            <p className="text-xl sm:text-2xl font-light text-foreground">{stats?.today || 0}</p>
          </button>

          <button
            onClick={() => setFilter("week")}
            className={cn(
              "glass-card p-3 sm:p-4 text-left transition-all hover:bg-white/5 touch-target",
              filter === "week" && "ring-1 ring-foreground/20"
            )}
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-1 sm:mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-light">This Week</span>
            </div>
            <p className="text-xl sm:text-2xl font-light text-foreground">{stats?.thisWeek || 0}</p>
          </button>

          <button
            onClick={() => setFilter("overdue")}
            className={cn(
              "glass-card p-3 sm:p-4 text-left transition-all hover:bg-white/5 touch-target",
              filter === "overdue" && "ring-1 ring-foreground/20"
            )}
          >
            <div className="flex items-center gap-2 text-red-400 mb-1 sm:mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-light">Overdue</span>
            </div>
            <p className="text-xl sm:text-2xl font-light text-red-400">{stats?.overdue || 0}</p>
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={cn(
              "glass-card p-3 sm:p-4 text-left transition-all hover:bg-white/5 touch-target",
              filter === "completed" && "ring-1 ring-foreground/20"
            )}
          >
            <div className="flex items-center gap-2 text-green-400 mb-1 sm:mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-light">Completed</span>
            </div>
            <p className="text-xl sm:text-2xl font-light text-green-400">{stats?.completed || 0}</p>
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 section-gap">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white/5 border-white/10"
            />
          </div>
          
          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {activityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* All Tasks Button */}
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            All Tasks
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : filteredTasks?.length === 0 ? (
            <div className="text-center py-16 glass-card">
              <ListTodo className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-light text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || priorityFilter !== "all" || categoryFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : filter === "all" 
                    ? "Create your first task to get started" 
                    : `No ${filter} tasks`}
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          ) : (
            filteredTasks?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => completeTask.mutate(task.id)}
                onDelete={() => setDeleteTaskId(task.id)}
                isCompleting={completeTask.isPending}
              />
            ))
          )}
        </div>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Tasks;
