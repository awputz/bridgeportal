import { useState } from "react";
import { format } from "date-fns";
import { 
  Building2, 
  Home, 
  Store, 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useAllExclusiveSubmissions, 
  useUpdateSubmissionStatus,
  ExclusiveSubmission,
  ExclusiveStatus,
  ExclusiveDivision,
  getExclusiveDocumentUrl,
} from "@/hooks/useExclusiveSubmissions";
import { cn } from "@/lib/utils";

const statusConfig: Record<ExclusiveStatus, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: Clock },
  pending_review: { label: "Pending Review", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Eye },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  needs_revision: { label: "Needs Revision", color: "bg-orange-100 text-orange-700", icon: AlertCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  live: { label: "Live", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
};

const divisionConfig: Record<ExclusiveDivision, { label: string; icon: React.ElementType }> = {
  residential: { label: "Residential", icon: Home },
  "investment-sales": { label: "Investment Sales", icon: Building2 },
  "commercial-leasing": { label: "Commercial Leasing", icon: Store },
};

export default function ExclusiveSubmissionsAdmin() {
  const [statusFilter, setStatusFilter] = useState<ExclusiveStatus | "all">("all");
  const [divisionFilter, setDivisionFilter] = useState<ExclusiveDivision | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ExclusiveSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: submissions, isLoading } = useAllExclusiveSubmissions({
    status: statusFilter === "all" ? undefined : statusFilter,
    division: divisionFilter === "all" ? undefined : divisionFilter,
  });

  const updateStatusMutation = useUpdateSubmissionStatus();

  const filteredSubmissions = submissions?.filter(sub => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      sub.property_address.toLowerCase().includes(query) ||
      sub.owner_name.toLowerCase().includes(query)
    );
  }) || [];

  const handleStatusChange = async (status: ExclusiveStatus) => {
    if (!selectedSubmission) return;
    
    await updateStatusMutation.mutateAsync({
      id: selectedSubmission.id,
      status,
      admin_notes: adminNotes || undefined,
    });
    
    setSelectedSubmission(null);
    setAdminNotes("");
  };

  const openDocumentUrl = async (path: string) => {
    const url = await getExclusiveDocumentUrl(path);
    if (url) window.open(url, "_blank");
  };

  // Stats
  const stats = {
    pending: submissions?.filter(s => s.status === "pending_review").length || 0,
    underReview: submissions?.filter(s => s.status === "under_review").length || 0,
    approved: submissions?.filter(s => ["approved", "live"].includes(s.status)).length || 0,
    total: submissions?.length || 0,
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exclusive Submissions</h1>
          <p className="text-muted-foreground">
            Review and manage agent exclusive listing submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Under Review</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{stats.underReview}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved / Live</CardDescription>
              <CardTitle className="text-2xl text-green-600">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ExclusiveStatus | "all")}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={divisionFilter} onValueChange={(v) => setDivisionFilter(v as ExclusiveDivision | "all")}>
            <SelectTrigger className="w-[180px]">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {Object.entries(divisionConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => {
                    const status = statusConfig[submission.status];
                    const division = divisionConfig[submission.division];
                    const StatusIcon = status.icon;
                    const DivisionIcon = division.icon;

                    return (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{submission.property_address}</p>
                            {submission.unit_number && (
                              <p className="text-sm text-muted-foreground">Unit {submission.unit_number}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DivisionIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{division.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>{submission.owner_name}</TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1", status.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(submission.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setAdminNotes(submission.admin_notes || "");
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Review Sheet */}
      <Sheet open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedSubmission && (
            <>
              <SheetHeader>
                <SheetTitle>Review Submission</SheetTitle>
                <SheetDescription>
                  {selectedSubmission.property_address}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge className={cn("gap-1", statusConfig[selectedSubmission.status].color)}>
                    {statusConfig[selectedSubmission.status].label}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    {divisionConfig[selectedSubmission.division].label}
                  </Badge>
                </div>

                {/* Property Details */}
                <div>
                  <h4 className="font-medium mb-2">Property</h4>
                  <p>{selectedSubmission.property_address}</p>
                  {selectedSubmission.unit_number && <p className="text-sm text-muted-foreground">Unit {selectedSubmission.unit_number}</p>}
                  <p className="text-sm text-muted-foreground">
                    {[selectedSubmission.neighborhood, selectedSubmission.borough, selectedSubmission.city].filter(Boolean).join(", ")}
                  </p>
                </div>

                {/* Owner Details */}
                <div>
                  <h4 className="font-medium mb-2">Owner/Landlord</h4>
                  <p>{selectedSubmission.owner_name}</p>
                  {selectedSubmission.owner_company && <p className="text-sm text-muted-foreground">{selectedSubmission.owner_company}</p>}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {selectedSubmission.owner_email && <span>{selectedSubmission.owner_email}</span>}
                    {selectedSubmission.owner_phone && <span>{selectedSubmission.owner_phone}</span>}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="font-medium mb-2">Documents</h4>
                  <div className="space-y-2">
                    {selectedSubmission.exclusive_contract_url ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => openDocumentUrl(selectedSubmission.exclusive_contract_url!)}
                      >
                        <FileText className="h-4 w-4" />
                        View Exclusive Contract
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    ) : (
                      <p className="text-sm text-destructive">No contract uploaded</p>
                    )}
                    
                    {selectedSubmission.additional_documents.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">Additional Documents:</p>
                        {selectedSubmission.additional_documents.map((doc, i) => (
                          <Button 
                            key={i}
                            variant="ghost" 
                            size="sm" 
                            className="gap-2 h-auto py-1"
                            onClick={() => openDocumentUrl(doc.url)}
                          >
                            <FileText className="h-3 w-3" />
                            {doc.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <Label htmlFor="admin_notes">Admin Notes</Label>
                  <Textarea
                    id="admin_notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for the agent..."
                    className="mt-2"
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <h4 className="font-medium mb-2">Update Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusChange("under_review")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Mark Under Review
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange("approved")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      onClick={() => handleStatusChange("needs_revision")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Request Revision
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleStatusChange("rejected")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

