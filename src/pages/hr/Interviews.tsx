import { useState } from "react";
import { Link } from "react-router-dom";
import { format, isAfter, isBefore, startOfDay, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import {
  Calendar,
  Plus,
  Video,
  Phone,
  User,
  MoreHorizontal,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useURLFilters, parseString } from "@/hooks/useURLFilters";
import {
  useHRInterviews,
  useDeleteHRInterview,
  HRInterviewWithAgent,
  interviewTypeColors,
  decisionColors,
  InterviewType,
} from "@/hooks/hr/useHRInterviews";
import { ScheduleInterviewDialog } from "@/components/hr/ScheduleInterviewDialog";

// Filter config for URL persistence
const filterConfigs = {
  tab: { 
    key: 'tab', 
    defaultValue: 'upcoming' as 'upcoming' | 'completed' | 'all', 
    parse: parseString('upcoming') 
  },
};

export default function Interviews() {
  // URL-persisted tab state
  const [filters, setFilters] = useURLFilters(filterConfigs);
  const { tab: activeTab } = filters;
  
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: interviews, isLoading } = useHRInterviews({ tab: activeTab as 'upcoming' | 'completed' | 'all' });
  const deleteInterview = useDeleteHRInterview();

  const now = new Date();
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Calculate metrics
  const allInterviews = interviews || [];
  const upcomingThisWeek = allInterviews.filter(
    (i) => isAfter(new Date(i.interview_date), now) && isBefore(new Date(i.interview_date), weekEnd)
  ).length;
  const completedThisMonth = allInterviews.filter(
    (i) =>
      isBefore(new Date(i.interview_date), now) &&
      isAfter(new Date(i.interview_date), monthStart) &&
      i.decision !== 'pending'
  ).length;
  const passedInterviews = allInterviews.filter((i) => i.decision === 'pass').length;
  const decidedInterviews = allInterviews.filter((i) => i.decision === 'pass' || i.decision === 'fail').length;
  const passRate = decidedInterviews > 0 ? Math.round((passedInterviews / decidedInterviews) * 100) : 0;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-3.5 w-3.5" />;
      case 'phone':
        return <Phone className="h-3.5 w-3.5" />;
      default:
        return <User className="h-3.5 w-3.5" />;
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteInterview.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Interviews</h1>
          <p className="text-sm text-muted-foreground">
            Schedule and evaluate candidate interviews
          </p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setShowScheduleDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">This Week</p>
          <p className="text-2xl font-light mt-1">{upcomingThisWeek}</p>
          <p className="text-xs text-muted-foreground">upcoming</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">This Month</p>
          <p className="text-2xl font-light mt-1">{completedThisMonth}</p>
          <p className="text-xs text-muted-foreground">completed</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pass Rate</p>
          <p className="text-2xl font-light mt-1 text-emerald-400">{passRate}%</p>
          <p className="text-xs text-muted-foreground">of evaluated</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
          <p className="text-2xl font-light mt-1">{allInterviews.length}</p>
          <p className="text-xs text-muted-foreground">interviews</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setFilters({ tab: v as typeof activeTab })}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-white/10">
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-20 mt-1" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : allInterviews.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No interviews found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === 'upcoming'
                  ? 'Schedule your first interview to get started'
                  : 'No completed interviews yet'}
              </p>
              {activeTab === 'upcoming' && (
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setShowScheduleDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allInterviews.map((interview) => (
                    <TableRow
                      key={interview.id}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {format(new Date(interview.interview_date), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(interview.interview_date), 'h:mm a')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/hr/agents/${interview.agent_id}`}
                          className="flex items-center gap-3 hover:text-emerald-400 transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={interview.hr_agents?.photo_url || ''} />
                            <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-xs">
                              {interview.hr_agents?.full_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{interview.hr_agents?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">
                              {interview.hr_agents?.current_brokerage || 'No brokerage'}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>{interview.interviewer_name}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border",
                            interviewTypeColors[interview.interview_type as InterviewType] ||
                              interviewTypeColors['in-person']
                          )}
                        >
                          {getTypeIcon(interview.interview_type || 'in-person')}
                          {interview.interview_type || 'In-Person'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs border capitalize",
                            decisionColors[interview.decision || 'pending']
                          )}
                        >
                          {interview.decision || 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/hr/interviews/${interview.id}`}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400"
                              onClick={() => setDeleteId(interview.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Schedule Dialog */}
      <ScheduleInterviewDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this interview record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}