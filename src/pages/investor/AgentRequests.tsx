import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileQuestion, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import { useInvestorAgentRequests } from "@/hooks/useInvestorData";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-sky-500/10 text-sky-500 border-sky-500/20", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-muted text-muted-foreground" },
  normal: { label: "Normal", color: "bg-sky-500/10 text-sky-500" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-500" },
  urgent: { label: "Urgent", color: "bg-red-500/10 text-red-500" },
};

export default function InvestorAgentRequests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: requests, isLoading } = useInvestorAgentRequests({
    status: statusFilter,
    search,
  });

  const pendingCount = requests?.filter(r => r.status === "pending").length || 0;
  const inProgressCount = requests?.filter(r => r.status === "in_progress").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Agent Requests</h1>
          <p className="text-muted-foreground mt-1">View all agent support requests</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Eye className="h-3 w-3 mr-1" />
          Read-only access
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{requests?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Requests</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-sky-500/5 border-sky-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-sky-500">{inProgressCount}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-500">
              {requests?.filter(r => r.status === "completed").length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            All Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by agent, client, property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : requests?.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Type</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Client/Property</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests?.map((request) => {
                    const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
                    const priorityConfig = PRIORITY_CONFIG[request.priority] || PRIORITY_CONFIG.normal;
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow key={request.id} className="border-border/30">
                        <TableCell>
                          <span className="font-medium text-foreground capitalize">
                            {request.request_type.replace(/_/g, " ")}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {request.agent_name}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {request.client_name && (
                              <div className="text-sm text-foreground">{request.client_name}</div>
                            )}
                            {request.property_address && (
                              <div className="text-xs text-muted-foreground">{request.property_address}</div>
                            )}
                            {!request.client_name && !request.property_address && (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={priorityConfig.color}>
                            {priorityConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(request.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
