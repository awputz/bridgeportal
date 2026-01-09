import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { HRLayout } from "@/components/hr/HRLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Eye,
} from "lucide-react";
import { useActiveAgents, useActiveAgentStats, statusConfig, type ActiveAgentStatus } from "@/hooks/hr/useActiveAgents";
import { useAgentOnboarding, calculateOnboardingProgress } from "@/hooks/hr/useAgentOnboarding";
import { useExpiringLicenses } from "@/hooks/hr/useAgentCompliance";
import { ConvertToActiveDialog } from "@/components/hr/agents/ConvertToActiveDialog";
import { format } from "date-fns";
import { divisionLabels } from "@/hooks/hr/useHRAgents";

function OnboardingProgressCell({ activeAgentId }: { activeAgentId: string }) {
  const { data: onboarding } = useAgentOnboarding(activeAgentId);
  const progress = calculateOnboardingProgress(onboarding);
  
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <Progress value={progress} className="h-2 flex-1" />
      <span className="text-xs text-muted-foreground w-8">{progress}%</span>
    </div>
  );
}

export default function ActiveAgentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConvertDialog, setShowConvertDialog] = useState(false);

  const statusFilter = searchParams.get("status") as ActiveAgentStatus | null;
  const divisionFilter = searchParams.get("division");
  const searchQuery = searchParams.get("search") || "";

  const { data: agents, isLoading } = useActiveAgents({
    status: statusFilter || undefined,
    division: divisionFilter || undefined,
    search: searchQuery || undefined,
  });
  const { data: stats } = useActiveAgentStats();
  const { data: expiringLicenses } = useExpiringLicenses(30);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const statCards = [
    { label: "Total Active", value: stats?.active || 0, icon: Users, color: "text-emerald-400" },
    { label: "Onboarding", value: stats?.onboarding || 0, icon: Clock, color: "text-amber-400" },
    { label: "Total Employees", value: stats?.total || 0, icon: UserCheck, color: "text-blue-400" },
    { label: "Expiring Licenses", value: expiringLicenses?.length || 0, icon: AlertTriangle, color: "text-red-400" },
  ];

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Active Agents</h1>
            <p className="text-muted-foreground">Manage active employees and onboarding</p>
          </div>
          <Button onClick={() => setShowConvertDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Convert from Hired
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => updateFilter("search", e.target.value || null)}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter || "all"}
                onValueChange={(v) => updateFilter("status", v === "all" ? null : v)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={divisionFilter || "all"}
                onValueChange={(v) => updateFilter("division", v === "all" ? null : v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="investment_sales">Investment Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Employees ({agents?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : agents?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active agents found. Convert hired agents to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents?.map((agent) => {
                    const status = statusConfig[agent.status];
                    return (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{agent.full_name}</p>
                            <p className="text-sm text-muted-foreground">{agent.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {agent.employee_id || "—"}
                          </code>
                        </TableCell>
                        <TableCell>
                          {divisionLabels[agent.division as keyof typeof divisionLabels] || agent.division}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <OnboardingProgressCell activeAgentId={agent.id} />
                        </TableCell>
                        <TableCell>
                          {format(new Date(agent.hire_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/hr/active-agents/${agent.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <ConvertToActiveDialog
        open={showConvertDialog}
        onOpenChange={setShowConvertDialog}
      />
    </HRLayout>
  );
}
