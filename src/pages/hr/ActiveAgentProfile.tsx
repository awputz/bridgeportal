import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useActiveAgent, statusConfig } from "@/hooks/hr/useActiveAgents";
import { OnboardingChecklist } from "@/components/hr/onboarding/OnboardingChecklist";
import { ComplianceCard } from "@/components/hr/compliance/ComplianceCard";
import { divisionLabels } from "@/hooks/hr/useHRAgents";
import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  TrendingUp,
} from "lucide-react";

export default function ActiveAgentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: agent, isLoading } = useActiveAgent(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Agent Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested agent profile could not be found.
        </p>
        <Button asChild>
          <Link to="/hr/active-agents">Back to Active Agents</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[agent.status];

  return (
    <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild>
          <Link to="/hr/active-agents">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Active Agents
          </Link>
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-light tracking-tight">{agent.full_name}</h1>
              <Badge variant="outline" className={status.color}>
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              {agent.employee_id && (
                <code className="text-xs bg-muted px-2 py-1 rounded">{agent.employee_id}</code>
              )}
              <span className="text-sm">
                {divisionLabels[agent.division as keyof typeof divisionLabels] || agent.division}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Employment Info */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Employee Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{agent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm">{agent.phone || "—"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Employment Details */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Division</p>
                      <p className="text-sm">
                        {divisionLabels[agent.division as keyof typeof divisionLabels] || agent.division}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hire Date</p>
                      <p className="text-sm">{format(new Date(agent.hire_date), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  {agent.start_date && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="text-sm">{format(new Date(agent.start_date), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                  )}
                  {agent.commission_split && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Commission Split</p>
                        <p className="text-sm">{agent.commission_split}</p>
                      </div>
                    </div>
                  )}
                  {agent.contract_id && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Contract</p>
                        <Button variant="link" size="sm" className="h-auto p-0" asChild>
                          <Link to={`/hr/contracts?search=${agent.full_name}`}>View Contract</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <p className="text-2xl font-semibold">
                      ${(agent.ytd_production || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">YTD Production</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <p className="text-2xl font-semibold">{agent.deals_closed || 0}</p>
                    <p className="text-sm text-muted-foreground">Deals Closed</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <p className="text-2xl font-semibold">
                      {agent.last_deal_date
                        ? format(new Date(agent.last_deal_date), "MMM d")
                        : "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">Last Deal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Checklist */}
            <OnboardingChecklist activeAgentId={agent.id} />
          </div>

          {/* Right Column - Compliance */}
          <div className="space-y-6">
            <ComplianceCard activeAgentId={agent.id} />
        </div>
      </div>
    </div>
  );
}
