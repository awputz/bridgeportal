import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { statusConfig, type ActiveAgent } from "@/hooks/hr/useActiveAgents";
import { divisionLabels } from "@/hooks/hr/useHRAgents";
import { useAgentOnboarding, calculateOnboardingProgress } from "@/hooks/hr/useAgentOnboarding";

interface MobileActiveAgentCardProps {
  agent: ActiveAgent;
}

function OnboardingProgress({ activeAgentId }: { activeAgentId: string }) {
  const { data: onboarding } = useAgentOnboarding(activeAgentId);
  const progress = calculateOnboardingProgress(onboarding);
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Onboarding</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

export function MobileActiveAgentCard({ agent }: MobileActiveAgentCardProps) {
  const status = statusConfig[agent.status];

  return (
    <div className="p-4 bg-card/50 border border-border rounded-xl space-y-3">
      {/* Header with name and status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium truncate">{agent.full_name}</p>
          <p className="text-sm text-muted-foreground truncate">{agent.email}</p>
        </div>
        <Badge variant="outline" className={status.color}>
          {status.label}
        </Badge>
      </div>

      {/* Info row */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Employee ID</p>
          <code className="text-xs bg-muted px-2 py-0.5 rounded">
            {agent.employee_id || "—"}
          </code>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Division</p>
          <p className="font-medium">
            {divisionLabels[agent.division as keyof typeof divisionLabels] || agent.division}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Hire Date</p>
          <p className="font-medium">
            {format(new Date(agent.hire_date), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Onboarding progress */}
      <OnboardingProgress activeAgentId={agent.id} />

      {/* Action */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-10"
          asChild
        >
          <Link to={`/hr/active-agents/${agent.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
}
