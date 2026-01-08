import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  Video,
  Phone,
  Building2,
  Star,
  Clock,
  Save,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  useHRInterview,
  useUpdateHRInterview,
  useDeleteHRInterview,
  useAgentInterviews,
  Scorecard,
  createDefaultScorecard,
  interviewTypeColors,
  decisionColors,
  InterviewType,
  InterviewDecision,
} from "@/hooks/hr/useHRInterviews";
import { InterviewScorecard } from "@/components/hr/InterviewScorecard";
import { divisionLabels, formatProduction, Division } from "@/hooks/hr/useHRAgents";

export default function InterviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: interview, isLoading } = useHRInterview(id);
  const { data: agentInterviews } = useAgentInterviews(interview?.agent_id);
  const updateInterview = useUpdateHRInterview();
  const deleteInterview = useDeleteHRInterview();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [scorecard, setScorecard] = useState<Scorecard>(createDefaultScorecard());
  const [decision, setDecision] = useState<InterviewDecision>('pending');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (interview) {
      setNotes(interview.notes || '');
      setDecision((interview.decision as InterviewDecision) || 'pending');
      if (interview.scorecard) {
        setScorecard(interview.scorecard as unknown as Scorecard);
      }
    }
  }, [interview]);

  const handleSave = async () => {
    if (!id) return;
    
    await updateInterview.mutateAsync({
      id,
      notes,
      scorecard: JSON.parse(JSON.stringify(scorecard)),
      decision,
    });
    setHasChanges(false);
  };

  const handleDecisionChange = (value: InterviewDecision) => {
    setDecision(value);
    setHasChanges(true);
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteInterview.mutateAsync(id);
    navigate('/hr/interviews');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Interview not found</h2>
        <Button variant="ghost" onClick={() => navigate('/hr/interviews')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Interviews
        </Button>
      </div>
    );
  }

  const agent = interview.hr_agents;
  const isPast = new Date(interview.interview_date) < new Date();
  const otherInterviews = agentInterviews?.filter(i => i.id !== interview.id) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/interviews')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-light tracking-tight">Interview Details</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(interview.interview_date), 'EEEE, MMMM d, yyyy')} at{' '}
            {format(new Date(interview.interview_date), 'h:mm a')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={updateInterview.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Info Card */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={agent?.photo_url || ''} />
                  <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-lg">
                    {agent?.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/hr/agents/${interview.agent_id}`}
                    className="text-lg font-medium hover:text-emerald-400 transition-colors"
                  >
                    {agent?.full_name || 'Unknown Agent'}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {agent?.current_brokerage || 'No brokerage'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border",
                    interviewTypeColors[(interview.interview_type as InterviewType) || 'in-person']
                  )}
                >
                  {getTypeIcon(interview.interview_type || 'in-person')}
                  {interview.interview_type || 'In-Person'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <Label className="text-muted-foreground text-xs">Interviewer</Label>
                <p className="font-medium">{interview.interviewer_name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Division</Label>
                <p className="font-medium">
                  {divisionLabels[agent?.division as Division] || agent?.division || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Decision Section */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-medium">Decision</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className={cn(
                  "flex-1 border-white/10",
                  decision === 'pass' && "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                )}
                onClick={() => handleDecisionChange('pass')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Pass
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 border-white/10",
                  decision === 'fail' && "bg-red-500/20 border-red-500/50 text-red-400"
                )}
                onClick={() => handleDecisionChange('fail')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Fail
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 border-white/10",
                  decision === 'pending' && "bg-amber-500/20 border-amber-500/50 text-amber-400"
                )}
                onClick={() => handleDecisionChange('pending')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Pending
              </Button>
            </div>
          </div>

          {/* Scorecard */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-medium">Evaluation Scorecard</h3>
            <InterviewScorecard
              scorecard={scorecard}
              onChange={(sc) => {
                setScorecard(sc);
                setHasChanges(true);
              }}
            />
          </div>

          {/* Notes */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-medium">Interview Notes</h3>
            <Textarea
              placeholder="Add notes from the interview..."
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setHasChanges(true);
              }}
              className="bg-white/5 border-white/10 min-h-[150px] resize-none"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Quick Info */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Agent Info
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm capitalize">{agent?.recruitment_status || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Poachability</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm">{agent?.poachability_score || 'N/A'}/10</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Production</span>
                <span className="text-sm">
                  {agent?.annual_production ? formatProduction(agent.annual_production) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Experience</span>
                <span className="text-sm">
                  {agent?.years_experience ? `${agent.years_experience} years` : 'N/A'}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-white/10 mt-2"
              asChild
            >
              <Link to={`/hr/agents/${interview.agent_id}`}>
                View Full Profile
              </Link>
            </Button>
          </div>

          {/* Interview History */}
          {otherInterviews.length > 0 && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Previous Interviews
              </h4>
              <div className="space-y-2">
                {otherInterviews.slice(0, 5).map((prev) => (
                  <Link
                    key={prev.id}
                    to={`/hr/interviews/${prev.id}`}
                    className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {format(new Date(prev.interview_date), 'MMM d, yyyy')}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full capitalize",
                          decisionColors[prev.decision || 'pending']
                        )}
                      >
                        {prev.decision || 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {prev.interviewer_name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this interview and all associated data.
              This action cannot be undone.
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
