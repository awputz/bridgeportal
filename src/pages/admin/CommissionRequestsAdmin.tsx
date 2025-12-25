import { useState } from "react";
import { DollarSign, Clock, CheckCircle, XCircle, Eye, FileText, ExternalLink, Search, Filter, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAllCommissionRequests, useUpdateCommissionRequestAdmin, CommissionRequestWithAgent } from "@/hooks/useCommissionRequestsAdmin";
import { CommissionRequest } from "@/hooks/useCommissionRequests";
import { format } from "date-fns";

const statusConfig: Record<CommissionRequest["status"], { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Clock },
  under_review: { label: "Under Review", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Eye },
  approved: { label: "Approved", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  paid: { label: "Paid", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
};

const CommissionRequestsAdmin = () => {
  const { data: requests, isLoading } = useAllCommissionRequests();
  const updateRequest = useUpdateCommissionRequestAdmin();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<CommissionRequestWithAgent | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<CommissionRequest["status"]>("pending");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredRequests = requests?.filter((request) => {
    const matchesSearch = 
      request.property_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.agent_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.agent_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenReview = (request: CommissionRequestWithAgent) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || "");
    setNewStatus(request.status);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    
    await updateRequest.mutateAsync({
      id: selectedRequest.id,
      status: newStatus,
      admin_notes: adminNotes,
    });
    
    setSelectedRequest(null);
  };

  // Stats
  const pendingCount = requests?.filter((r) => r.status === "pending").length || 0;
  const underReviewCount = requests?.filter((r) => r.status === "under_review").length || 0;
  const totalPending = requests
    ?.filter((r) => ["pending", "under_review"].includes(r.status))
    .reduce((sum, r) => sum + r.commission_amount, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-500" />
            Commission Requests
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review and process agent commission payment requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-400/80">Pending Review</p>
                <p className="text-2xl font-semibold text-amber-400">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400/80">Under Review</p>
                <p className="text-2xl font-semibold text-blue-400">{underReviewCount}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-400/80">Total Pending</p>
                <p className="text-2xl font-semibold text-emerald-400">{formatCurrency(totalPending)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by property or agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
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

      {/* Requests List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : !filteredRequests?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Commission Requests</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery || statusFilter !== "all" 
                ? "No requests match your filters" 
                : "Commission requests from agents will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;
            const isUrgent = request.status === "pending";
            
            return (
              <Card 
                key={request.id} 
                className={`hover:border-white/20 transition-colors cursor-pointer ${isUrgent ? "border-amber-500/30 bg-amber-500/5" : ""}`}
                onClick={() => handleOpenReview(request)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Status Indicator */}
                    <div className={`w-10 h-10 rounded-full ${status.color.split(" ")[0]} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`h-5 w-5 ${status.color.split(" ")[1]}`} />
                    </div>
                    
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{request.property_address}</h3>
                        <Badge className={`${status.color} border text-xs`}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{request.agent_name}</span>
                        <span>•</span>
                        <span className="capitalize">{request.deal_type}</span>
                        <span>•</span>
                        <span>{format(new Date(request.closing_date), "MMM d, yyyy")}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-semibold text-emerald-400">
                        {formatCurrency(request.commission_amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(request.created_at), "MMM d")}
                      </p>
                    </div>

                    {/* Documents Indicators */}
                    <div className="flex gap-1 flex-shrink-0">
                      {request.invoice_url && (
                        <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center" title="Invoice">
                          <FileText className="h-3 w-3" />
                        </div>
                      )}
                      {request.w9_url && (
                        <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center" title="W9">
                          <FileText className="h-3 w-3" />
                        </div>
                      )}
                      {request.contract_url && (
                        <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center" title="Contract">
                          <FileText className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Commission Request</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6 py-4">
              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Agent</Label>
                  <p className="font-medium">{selectedRequest.agent_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.agent_email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Commission</Label>
                  <p className="text-2xl font-semibold text-emerald-400">
                    {formatCurrency(selectedRequest.commission_amount)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Property</Label>
                  <p className="font-medium">{selectedRequest.property_address}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Deal Type</Label>
                  <p className="font-medium capitalize">{selectedRequest.deal_type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Closing Date</Label>
                  <p className="font-medium">{format(new Date(selectedRequest.closing_date), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Submitted</Label>
                  <p className="font-medium">{format(new Date(selectedRequest.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>

              {/* Agent Notes */}
              {selectedRequest.notes && (
                <div>
                  <Label className="text-muted-foreground text-xs">Agent Notes</Label>
                  <p className="mt-1 p-3 rounded-lg bg-muted/50 text-sm">{selectedRequest.notes}</p>
                </div>
              )}

              {/* Documents */}
              <div>
                <Label className="text-muted-foreground text-xs">Documents</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRequest.invoice_url ? (
                    <a
                      href={selectedRequest.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Invoice
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm">
                      <XCircle className="h-4 w-4" />
                      No Invoice
                    </span>
                  )}
                  {selectedRequest.w9_url ? (
                    <a
                      href={selectedRequest.w9_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      W9 Form
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm">
                      <XCircle className="h-4 w-4" />
                      No W9
                    </span>
                  )}
                  {selectedRequest.contract_url ? (
                    <a
                      href={selectedRequest.contract_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Contract
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm">
                      <XCircle className="h-4 w-4" />
                      No Contract
                    </span>
                  )}
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-3">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as CommissionRequest["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this request..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={updateRequest.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {updateRequest.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommissionRequestsAdmin;
