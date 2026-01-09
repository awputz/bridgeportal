import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Video, Phone, User, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HRInterviewWithAgent,
  InterviewType,
  interviewTypeColors,
  decisionColors,
} from "@/hooks/hr/useHRInterviews";
import { cn } from "@/lib/utils";

interface MobileInterviewCardProps {
  interview: HRInterviewWithAgent;
  onDelete: () => void;
}

export function MobileInterviewCard({ interview, onDelete }: MobileInterviewCardProps) {
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

  return (
    <div className="p-4 bg-card/50 border border-border rounded-xl space-y-3">
      {/* Date & Time */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">
            {format(new Date(interview.interview_date), 'EEEE, MMM d')}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(interview.interview_date), 'h:mm a')}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border",
            interviewTypeColors[interview.interview_type as InterviewType] ||
              interviewTypeColors['in-person']
          )}
        >
          {getTypeIcon(interview.interview_type || 'in-person')}
          {interview.interview_type || 'In-Person'}
        </span>
      </div>

      {/* Agent Info */}
      <Link
        to={`/hr/agents/${interview.agent_id}`}
        className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={interview.hr_agents?.photo_url || ''} />
          <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-sm">
            {interview.hr_agents?.full_name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{interview.hr_agents?.full_name || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground truncate">
            {interview.hr_agents?.current_brokerage || 'No brokerage'}
          </p>
        </div>
      </Link>

      {/* Interviewer & Decision */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="text-sm">
          <span className="text-muted-foreground">Interviewer: </span>
          <span>{interview.interviewer_name}</span>
        </div>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs border capitalize",
            decisionColors[interview.decision || 'pending']
          )}
        >
          {interview.decision || 'Pending'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-10"
          asChild
        >
          <Link to={`/hr/interviews/${interview.id}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
