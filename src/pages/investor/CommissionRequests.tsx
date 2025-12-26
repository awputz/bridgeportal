import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Receipt, Clock, CheckCircle, XCircle, Eye, DollarSign, FileText } from "lucide-react";
import { useInvestorCommissionRequests, InvestorCommissionRequest } from "@/hooks/useInvestorData";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  under_review: { label: "Under Review", color: "bg-sky-500/10 text-sky-500 border-sky-500/20", icon: FileText },
  approved: { label: "Approved", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle },
  paid: { label: "Paid", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: DollarSign },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
};

export default function InvestorCommissionRequests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<InvestorCommissionRequest | null>(null);

  const { data: requests, isLoading } = useInvestorCommissionRequests({
    status: statusFilter,
    search,
  });

  const pendingCount = requests?.filter(r => r.status === "pending" || r.status === "under_review").length || 0;
  const pendingAmount = requests
    ?.filter(r => r.status === "pending" || r.status === "under_review")
    .reduce((sum, r) => sum + r.commission_amount, 0) || 0;
  const totalPaid = requests
    ?.filter(r => r.status === "paid")
    .reduce((sum, r) => sum + r.commission_amount, 0) || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Commission Requests</h1>
          <p className="text-muted-foreground mt-1">View all agent commission payout requests</p>
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
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card className="bg-sky-500/5 border-sky-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-sky-500">{formatCurrency(pendingAmount)}</div>
            <div className="text-sm text-muted-foreground">Pending Amount</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalPaid)}</div>
            <div className="text-sm text-muted-foreground">Total Paid</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            All Commission Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by agent, property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
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
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No commission requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Agent</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Deal Type</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead>Closing Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests?.map((request) => {
                    const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow 
                        key={request.id} 
                        className="border-border/30 cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <TableCell className="font-medium text-foreground">
                          {request.agent_name}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                          {request.property_address}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {request.deal_type.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">
                          {formatCurrency(request.commission_amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(request.closing_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Commission Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Agent</p>
                  <p className="font-medium">{selectedRequest.agent_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge 
                    variant="outline" 
                    className={STATUS_CONFIG[selectedRequest.status]?.color}
                  >
                    {STATUS_CONFIG[selectedRequest.status]?.label}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Property Address</p>
                <p className="font-medium">{selectedRequest.property_address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Commission Amount</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(selectedRequest.commission_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deal Type</p>
                  <p className="font-medium capitalize">{selectedRequest.deal_type.replace(/_/g, " ")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Closing Date</p>
                  <p className="font-medium">{format(new Date(selectedRequest.closing_date), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{format(new Date(selectedRequest.created_at), "MMMM d, yyyy")}</p>
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Agent Notes</p>
                  <p className="text-sm bg-muted/50 rounded-md p-3 mt-1">{selectedRequest.notes}</p>
                </div>
              )}

              {selectedRequest.admin_notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Admin Notes</p>
                  <p className="text-sm bg-muted/50 rounded-md p-3 mt-1">{selectedRequest.admin_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
