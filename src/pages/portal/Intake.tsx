import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Copy, 
  Users, 
  Calendar,
  Building2,
  Home,
  Briefcase,
  UserPlus,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Check,
  TrendingUp,
  QrCode,
  Download,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  useMyIntakeLink,
  useIntakeSubmissions, 
  useIntakeStats,
  useUpdateSubmission,
  useConvertToContact,
  IntakeSubmission 
} from "@/hooks/useIntake";
import { cn } from "@/lib/utils";
import {
  IntakeStatsCard,
  IntakeFilters,
  IntakeSubmissionRow,
  IntakeSubmissionRowSkeleton,
  IntakeEmptyState,
} from "@/components/portal/intake";

const ITEMS_PER_PAGE = 10;

const divisionInfo: Record<string, { label: string; icon: typeof Building2; color: string }> = {
  "investment-sales": { label: "Investment Sales", icon: Building2, color: "text-emerald-500" },
  "commercial-leasing": { label: "Commercial Leasing", icon: Briefcase, color: "text-blue-500" },
  "residential": { label: "Residential", icon: Home, color: "text-violet-500" },
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  converted: "bg-green-500/10 text-green-600 border-green-500/20",
  closed: "bg-muted text-muted-foreground border-border",
};

export default function Intake() {
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeSubmission | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: intakeLink, isLoading: linkLoading } = useMyIntakeLink();
  const { data: submissions = [], isLoading: submissionsLoading } = useIntakeSubmissions({
    division: selectedDivision !== "all" ? selectedDivision : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });
  const { data: stats, isLoading: statsLoading } = useIntakeStats();
  const updateSubmission = useUpdateSubmission();
  const convertToContact = useConvertToContact();

  // Generate the full intake URLs
  const baseUrl = window.location.origin;
  const universalIntakeUrl = `${baseUrl}/intake`;
  const personalIntakeUrl = intakeLink ? `${baseUrl}/intake/${intakeLink.link_code}` : "";

  // Handle copy universal link
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(universalIntakeUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter submissions by search
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => 
      s.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.client_email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [submissions, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubmissions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubmissions, currentPage]);

  // Reset page when filters change
  const handleFilterChange = (type: 'division' | 'status' | 'search', value: string) => {
    setCurrentPage(1);
    if (type === 'division') setSelectedDivision(value);
    else if (type === 'status') setSelectedStatus(value);
    else setSearchQuery(value);
  };

  // Calculate conversion rate
  const conversionRate = stats && stats.total > 0 
    ? Math.round((submissions.filter(s => s.status === 'converted').length / stats.total) * 100) 
    : 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="py-8 space-y-8 max-w-7xl mx-auto px-4 md:px-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Client Intake</h1>
            <p className="text-muted-foreground">
              Collect and manage client criteria submissions
            </p>
          </div>
        </div>
      </div>

      {/* Universal Intake Link Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Company Intake Link</CardTitle>
          </div>
          <CardDescription>
            Share this universal link with any client. They'll select their agent and sector, then submit requirements directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Universal Link - Primary */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background border-2 border-primary/30">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm truncate text-foreground select-all">
                  {universalIntakeUrl}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                onClick={handleCopyLink}
                size="lg"
                className="shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open(universalIntakeUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Form
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowQR(true)}
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>

          {/* Personal Link - Collapsible Dropdown */}
          {!linkLoading && personalIntakeUrl && (
            <Collapsible className="pt-4 border-t border-border/50">
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group w-full">
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                <span>Advanced Options</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-2">
                <p className="text-xs text-muted-foreground">Your personal link (skips agent selection):</p>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs truncate text-muted-foreground select-all">
                      {personalIntakeUrl}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(personalIntakeUrl);
                      toast.success("Personal link copied!");
                    }}
                    className="shrink-0 h-8"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <IntakeStatsCard
          title="Total Submissions"
          value={stats?.total || 0}
          icon={Users}
          variant="default"
          isLoading={statsLoading}
        />
        <IntakeStatsCard
          title="This Week"
          value={stats?.thisWeek || 0}
          icon={Calendar}
          trend={{ value: stats?.thisWeek || 0, label: "this week" }}
          variant="primary"
          isLoading={statsLoading}
        />
        <IntakeStatsCard
          title="Awaiting Contact"
          value={stats?.newSubmissions || 0}
          icon={Clock}
          variant="warning"
          isLoading={statsLoading}
        />
        <IntakeStatsCard
          title="Conversion Rate"
          value={conversionRate}
          icon={TrendingUp}
          variant="success"
          isLoading={statsLoading}
          suffix="%"
        />
      </div>

      {/* Submissions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Submissions</h2>
          {filteredSubmissions.length > 0 && (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {filteredSubmissions.length} total
            </Badge>
          )}
        </div>

        {/* Filters */}
        <IntakeFilters
          searchQuery={searchQuery}
          onSearchChange={(v) => handleFilterChange('search', v)}
          selectedDivision={selectedDivision}
          onDivisionChange={(v) => handleFilterChange('division', v)}
          selectedStatus={selectedStatus}
          onStatusChange={(v) => handleFilterChange('status', v)}
        />

        {/* Submissions Table */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {submissionsLoading ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[280px] h-14 font-semibold">Client</TableHead>
                    <TableHead className="w-[180px] font-semibold">Division</TableHead>
                    <TableHead className="w-[120px] font-semibold">Status</TableHead>
                    <TableHead className="w-[140px] hidden md:table-cell font-semibold">Submitted</TableHead>
                    <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <IntakeSubmissionRowSkeleton key={i} />
                  ))}
                </TableBody>
              </Table>
            ) : filteredSubmissions.length === 0 ? (
              <IntakeEmptyState type="submissions" />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-[280px] h-14 font-semibold">Client</TableHead>
                      <TableHead className="w-[180px] font-semibold">Division</TableHead>
                      <TableHead className="w-[120px] font-semibold">Status</TableHead>
                      <TableHead className="w-[140px] font-semibold hidden md:table-cell">Submitted</TableHead>
                      <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSubmissions.map((submission) => (
                      <IntakeSubmissionRow
                        key={submission.id}
                        submission={submission}
                        onView={() => setSelectedSubmission(submission)}
                        onMarkContacted={() => updateSubmission.mutate({
                          id: submission.id,
                          status: "contacted",
                          contacted_at: new Date().toISOString()
                        })}
                        onConvertToContact={() => convertToContact.mutate({
                          submission,
                          division: submission.division
                        })}
                      />
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubmissions.length)} of {filteredSubmissions.length}
                    </p>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submission Detail Dialog */}
      {selectedSubmission && (
        <SubmissionDetailDialog 
          submission={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)} 
        />
      )}

      {/* QR Code Dialog */}
      {showQR && (
        <QRCodeDialog 
          url={universalIntakeUrl} 
          onClose={() => setShowQR(false)} 
        />
      )}
      </div>
    </div>
  );
}

// QR Code Dialog
function QRCodeDialog({ url, onClose }: { url: string; onClose: () => void }) {
  // Generate a simple QR code using an external service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'intake-qr-code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("QR code downloaded!");
    } catch {
      toast.error("Failed to download QR code");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Intake Form QR Code</DialogTitle>
          <DialogDescription>
            Scan this code to open your client intake form
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="p-4 bg-white rounded-xl shadow-inner">
            <img 
              src={qrCodeUrl} 
              alt="QR Code for intake form"
              className="w-48 h-48"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Print this QR code for meetings, business cards, or marketing materials
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Submission Detail Dialog
function SubmissionDetailDialog({ 
  submission, 
  onClose 
}: { 
  submission: IntakeSubmission; 
  onClose: () => void;
}) {
  const updateSubmission = useUpdateSubmission();
  const convertToContact = useConvertToContact();
  const divInfo = divisionInfo[submission.division];
  const DivIcon = divInfo?.icon || Building2;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold"
              )}>
                {submission.client_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <DialogTitle className="text-xl">{submission.client_name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <DivIcon className={cn("h-4 w-4", divInfo?.color)} />
                  {divInfo?.label || submission.division}
                </DialogDescription>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={cn("capitalize text-sm", statusColors[submission.status])}
            >
              {submission.status}
            </Badge>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${submission.client_email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>
            {submission.client_phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${submission.client_phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(submission.client_email);
                toast.success("Email copied!");
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Email
            </Button>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6 py-4">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{submission.client_email}</p>
              </div>
              {submission.client_phone && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{submission.client_phone}</p>
                </div>
              )}
              {submission.client_company && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Company</p>
                  <p className="font-medium">{submission.client_company}</p>
                </div>
              )}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                <p className="font-medium">{format(new Date(submission.created_at), "PPP 'at' p")}</p>
              </div>
            </div>
          </div>

          {/* Criteria */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Criteria & Requirements
            </h3>
            <div className="grid gap-3">
              {Object.entries(submission.criteria).map(([key, value]) => (
                <div key={key} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1 capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="font-medium">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {submission.notes && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Additional Notes
              </h3>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="whitespace-pre-wrap">{submission.notes}</p>
              </div>
            </div>
          )}

          {/* Converted Contact Link */}
          {submission.converted_contact_id && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              <span className="text-sm font-medium text-green-700">Converted to contact</span>
              <Link 
                to={`/portal/crm/contacts/${submission.converted_contact_id}`}
                className="text-sm text-primary hover:underline ml-auto flex items-center gap-1"
              >
                View Contact
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {submission.status === "new" && (
            <Button 
              variant="secondary"
              onClick={() => {
                updateSubmission.mutate({ 
                  id: submission.id, 
                  status: "contacted",
                  contacted_at: new Date().toISOString()
                });
                onClose();
              }}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark Contacted
            </Button>
          )}
          {!submission.converted_contact_id && (
            <Button 
              onClick={() => {
                convertToContact.mutate({ submission, division: submission.division });
                onClose();
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Convert to Contact
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
