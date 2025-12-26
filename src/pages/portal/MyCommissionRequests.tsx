import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Plus, Clock, CheckCircle, XCircle, Eye, FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyCommissionRequests, CommissionRequest } from "@/hooks/useCommissionRequests";
import { format } from "date-fns";

const statusConfig: Record<CommissionRequest["status"], { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Clock },
  under_review: { label: "Under Review", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Eye },
  approved: { label: "Approved", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  paid: { label: "Paid", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
};

const MyCommissionRequests = () => {
  const { data: requests, isLoading } = useMyCommissionRequests();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Back Navigation */}
        <Link
          to="/portal/tools"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-light">Back to Tools</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-light">Commission Requests</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extralight text-foreground">
              My Payment Requests
            </h1>
          </div>
          <Link to="/portal/commission-request">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : !requests?.length ? (
          <Card className="glass-card border-white/10">
            <CardContent className="py-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-light text-foreground mb-2">No Commission Requests</h3>
              <p className="text-muted-foreground font-light mb-6">
                Submit your first commission request to track your payments.
              </p>
              <Link to="/portal/commission-request">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const status = statusConfig[request.status];
              const StatusIcon = status.icon;
              
              return (
                <Card key={request.id} className="glass-card border-white/10 hover:border-white/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-light text-foreground mb-1">
                              {request.property_address}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="capitalize">{request.deal_type}</span>
                              <span>•</span>
                              <span>Closed {format(new Date(request.closing_date), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                          <Badge className={`${status.color} border`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        {/* Commission Amount */}
                        <div className="text-2xl font-light text-emerald-400 mb-4">
                          {formatCurrency(request.commission_amount)}
                        </div>

                        {/* Documents */}
                        <div className="flex flex-wrap gap-2">
                          {request.invoice_url && (
                            <a
                              href={request.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <FileText className="h-3 w-3" />
                              Invoice
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {request.w9_url && (
                            <a
                              href={request.w9_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <FileText className="h-3 w-3" />
                              W9
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {request.contract_url && (
                            <a
                              href={request.contract_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <FileText className="h-3 w-3" />
                              Contract
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {/* Admin Notes (if any) */}
                        {request.admin_notes && (
                          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-muted-foreground font-medium mb-1">Admin Note:</p>
                            <p className="text-sm text-foreground/80">{request.admin_notes}</p>
                          </div>
                        )}

                        {/* Submitted Date */}
                        <p className="text-xs text-muted-foreground/60 mt-4">
                          Submitted {format(new Date(request.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCommissionRequests;
