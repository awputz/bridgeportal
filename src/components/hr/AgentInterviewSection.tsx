import { format } from "date-fns";
import { CalendarPlus, CheckCircle2, XCircle, Clock, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HRInterview, 
  interviewTypeColors, 
  decisionColors,
  InterviewType,
  InterviewDecision
} from "@/hooks/hr/useHRInterviews";
import { cn } from "@/lib/utils";

interface AgentInterviewSectionProps {
  interviews: HRInterview[];
  isLoading?: boolean;
  onScheduleInterview: () => void;
}

const decisionIcons: Record<string, React.ReactNode> = {
  pass: <CheckCircle2 className="h-3 w-3" />,
  fail: <XCircle className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
};

export function AgentInterviewSection({ 
  interviews, 
  isLoading,
  onScheduleInterview 
}: AgentInterviewSectionProps) {
  const navigate = useNavigate();

  const passCount = interviews.filter(i => i.decision === 'pass').length;
  const totalCompleted = interviews.filter(i => i.decision).length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Interviews
          </CardTitle>
          {totalCompleted > 0 && (
            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              {passCount}/{totalCompleted} passed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {interviews.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-3">
              No interviews scheduled yet
            </p>
            <Button 
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={onScheduleInterview}
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Schedule First Interview
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.slice(0, 3).map((interview) => {
              const scorecard = interview.scorecard as { overallRating?: number } | null;
              const rating = scorecard?.overallRating || 0;

              return (
                <div 
                  key={interview.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 cursor-pointer transition-colors"
                  onClick={() => navigate(`/hr/interviews/${interview.id}`)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", interviewTypeColors[interview.interview_type as InterviewType])}
                      >
                        {interview.interview_type}
                      </Badge>
                      {interview.decision && (
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs gap-1", decisionColors[interview.decision])}
                        >
                          {decisionIcons[interview.decision]}
                          {interview.decision}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(interview.interview_date), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {rating > 0 && (
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs">{rating.toFixed(1)}</span>
                      </div>
                    )}
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}

            {interviews.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => navigate('/hr/interviews')}
              >
                View all {interviews.length} interviews
              </Button>
            )}

            <Button 
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onScheduleInterview}
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
