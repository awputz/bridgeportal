import { format } from "date-fns";
import { 
  UserPlus, ArrowRight, Phone, Mail, Video, Linkedin, Send, 
  MessageSquare, Calendar, FileSignature, CheckCircle2, XCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HRInterview } from "@/hooks/hr/useHRInterviews";
import { HROffer, getOfferStatus } from "@/hooks/hr/useHROffers";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  date: string;
  type: 'created' | 'status' | 'interaction' | 'interview' | 'offer' | 'hired';
  title: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

interface RecruitmentTimelineProps {
  agentCreatedAt: string;
  interviews: HRInterview[];
  offers: HROffer[];
  interactions: Array<{
    id: string;
    interaction_type: string;
    interaction_date: string;
    notes?: string | null;
    outcome?: string | null;
  }>;
  isHired: boolean;
  hiredAt?: string | null;
}

const interactionIcons: Record<string, React.ReactNode> = {
  call: <Phone className="h-3 w-3" />,
  email: <Mail className="h-3 w-3" />,
  meeting: <Video className="h-3 w-3" />,
  linkedin: <Linkedin className="h-3 w-3" />,
  text: <Send className="h-3 w-3" />,
  other: <MessageSquare className="h-3 w-3" />,
};

export function RecruitmentTimeline({
  agentCreatedAt,
  interviews,
  offers,
  interactions,
  isHired,
  hiredAt,
}: RecruitmentTimelineProps) {
  // Build timeline events
  const events: TimelineEvent[] = [];

  // Agent added
  events.push({
    id: 'created',
    date: agentCreatedAt,
    type: 'created',
    title: 'Added to database',
    icon: <UserPlus className="h-3 w-3" />,
    color: 'bg-slate-500',
  });

  // Interactions
  interactions.forEach(interaction => {
    events.push({
      id: `interaction-${interaction.id}`,
      date: interaction.interaction_date,
      type: 'interaction',
      title: `${interaction.interaction_type.charAt(0).toUpperCase() + interaction.interaction_type.slice(1)} logged`,
      description: interaction.notes || undefined,
      icon: interactionIcons[interaction.interaction_type] || <MessageSquare className="h-3 w-3" />,
      color: 'bg-blue-500',
    });
  });

  // Interviews
  interviews.forEach(interview => {
    const isPast = new Date(interview.interview_date) < new Date();
    events.push({
      id: `interview-${interview.id}`,
      date: interview.interview_date,
      type: 'interview',
      title: isPast 
        ? `${interview.interview_type} interview ${interview.decision ? `- ${interview.decision}` : 'completed'}`
        : `${interview.interview_type} interview scheduled`,
      description: interview.interviewer_name ? `with ${interview.interviewer_name}` : undefined,
      icon: <Calendar className="h-3 w-3" />,
      color: interview.decision === 'pass' ? 'bg-emerald-500' : interview.decision === 'fail' ? 'bg-red-500' : 'bg-purple-500',
    });
  });

  // Offers
  offers.forEach(offer => {
    const status = getOfferStatus(offer);
    let title = 'Offer created';
    let color = 'bg-amber-500';

    if (status === 'sent') {
      title = 'Offer sent';
      color = 'bg-blue-500';
    } else if (status === 'signed') {
      title = 'Offer signed';
      color = 'bg-emerald-500';
    } else if (status === 'declined') {
      title = 'Offer declined';
      color = 'bg-red-500';
    }

    events.push({
      id: `offer-${offer.id}`,
      date: offer.signed_at || offer.declined_at || offer.sent_at || offer.created_at,
      type: 'offer',
      title,
      description: `${offer.commission_split}% commission split`,
      icon: <FileSignature className="h-3 w-3" />,
      color,
    });
  });

  // Hired event
  if (isHired) {
    events.push({
      id: 'hired',
      date: hiredAt || new Date().toISOString(),
      type: 'hired',
      title: 'Joined the team!',
      icon: <CheckCircle2 className="h-3 w-3" />,
      color: 'bg-emerald-500',
    });
  }

  // Sort by date descending (most recent first)
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Recruitment Journey
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No activity yet
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

            <div className="space-y-4">
              {events.slice(0, 10).map((event, index) => (
                <div key={event.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-6 h-6 rounded-full text-white",
                    event.color
                  )}>
                    {event.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    <p className="text-sm font-medium">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {event.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {events.length > 10 && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                +{events.length - 10} more events
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
