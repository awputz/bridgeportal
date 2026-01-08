import { useNavigate } from "react-router-dom";
import { CalendarPlus, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HRInterview } from "@/hooks/hr/useHRInterviews";
import { HROffer, getOfferStatus } from "@/hooks/hr/useHROffers";
import { RecruitmentStatus } from "@/hooks/hr/useHRAgents";
import { CreateOfferDialog } from "@/components/hr/CreateOfferDialog";

interface WorkflowActionsProps {
  agentId: string;
  agentName: string;
  recruitmentStatus: RecruitmentStatus;
  interviews: HRInterview[];
  offers: HROffer[];
  division: string;
  onScheduleInterview: () => void;
}

export function WorkflowActions({
  agentId,
  agentName,
  recruitmentStatus,
  interviews,
  offers,
  division,
  onScheduleInterview,
}: WorkflowActionsProps) {
  const navigate = useNavigate();

  const passedInterview = interviews.some(i => i.decision === 'pass');
  const hasPendingOffer = offers.some(o => {
    const status = getOfferStatus(o);
    return status === 'draft' || status === 'sent';
  });
  const pendingOffer = offers.find(o => {
    const status = getOfferStatus(o);
    return status === 'draft' || status === 'sent';
  });

  const isHired = recruitmentStatus === 'hired';
  const hasOfferMade = recruitmentStatus === 'offer-made';

  // Determine workflow actions based on current state
  const getActions = () => {
    if (isHired) {
      return (
        <p className="text-sm text-emerald-400 text-center py-2">
          ✓ Agent successfully hired
        </p>
      );
    }

    if (hasPendingOffer && pendingOffer) {
      return (
        <Button 
          className="w-full justify-start gap-2"
          variant="outline"
          onClick={() => navigate(`/hr/offers/${pendingOffer.id}`)}
        >
          <Eye className="h-4 w-4" />
          View Pending Offer
        </Button>
      );
    }

    if (passedInterview && !hasPendingOffer) {
      return (
        <div className="space-y-2">
          <CreateOfferDialog defaultAgentId={agentId} defaultDivision={division}>
            <Button 
              className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
            >
              <Sparkles className="h-4 w-4" />
              Create Offer - Ready to Hire!
            </Button>
          </CreateOfferDialog>
          <Button 
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={onScheduleInterview}
          >
            <CalendarPlus className="h-4 w-4" />
            Schedule Another Interview
          </Button>
        </div>
      );
    }

    // Default: show schedule interview as primary
    return (
      <div className="space-y-2">
        <Button 
          className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
          onClick={onScheduleInterview}
        >
          <CalendarPlus className="h-4 w-4" />
          Schedule Interview
        </Button>
        {(recruitmentStatus === 'qualified' || recruitmentStatus === 'hot' || hasOfferMade) && (
          <CreateOfferDialog defaultAgentId={agentId} defaultDivision={division}>
            <Button 
              variant="outline"
              className="w-full justify-start gap-2"
            >
              Create Offer
            </Button>
          </CreateOfferDialog>
        )}
      </div>
    );
  };

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        {getActions()}
      </CardContent>
    </Card>
  );
}
