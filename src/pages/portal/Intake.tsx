import { useState } from "react";
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
  Check
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

  const { data: intakeLink, isLoading: linkLoading } = useMyIntakeLink();
  const { data: submissions = [], isLoading: submissionsLoading } = useIntakeSubmissions({
    division: selectedDivision !== "all" ? selectedDivision : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });
  const { data: stats, isLoading: statsLoading } = useIntakeStats();
  const updateSubmission = useUpdateSubmission();
  const convertToContact = useConvertToContact();

  // Generate the full intake URL
  const baseUrl = window.location.origin;
  const intakeUrl = intakeLink ? `${baseUrl}/intake/${intakeLink.link_code}` : "";

  // Handle copy link
  const handleCopyLink = async () => {
    if (!intakeUrl) return;
    await navigator.clipboard.writeText(intakeUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter submissions by search
  const filteredSubmissions = submissions.filter(s => 
    s.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.client_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Client Intake</h1>
            <p className="text-sm text-muted-foreground">
              Collect and manage client criteria submissions
            </p>
          </div>
        </div>
      </div>

      {/* Intake Link Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Your Intake Link</CardTitle>
          </div>
          <CardDescription>
            Share this link with any client. They'll select their sector and submit their requirements directly to your portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {linkLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          ) : intakeLink ? (
            <>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border">
                <div className="flex-1 overflow-hidden">
                  <p className="font-mono text-sm truncate text-foreground">
                    {intakeUrl}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
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
                  onClick={() => window.open(intakeUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Form
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Unable to load your intake link. Please refresh the page.</p>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          title="New (Uncontacted)"
          value={stats?.newSubmissions || 0}
          icon={Clock}
          variant="warning"
          isLoading={statsLoading}
        />
      </div>

      {/* Submissions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Submissions</h2>
          {submissions.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {submissions.length} total
            </Badge>
          )}
        </div>

        {/* Filters */}
        <IntakeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDivision={selectedDivision}
          onDivisionChange={setSelectedDivision}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        {/* Submissions Table */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {submissionsLoading ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[280px]">Client</TableHead>
                    <TableHead className="w-[180px]">Division</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[140px] hidden md:table-cell">Submitted</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
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
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[280px] font-semibold">Client</TableHead>
                    <TableHead className="w-[180px] font-semibold">Division</TableHead>
                    <TableHead className="w-[120px] font-semibold">Status</TableHead>
                    <TableHead className="w-[140px] font-semibold hidden md:table-cell">Submitted</TableHead>
                    <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
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
    </div>
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

        <div className="space-y-6 py-2">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{submission.client_email}</p>
              </div>
              {submission.client_phone && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{submission.client_phone}</p>
                </div>
              )}
              {submission.client_company && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Company</p>
                  <p className="font-medium">{submission.client_company}</p>
                </div>
              )}
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                <p className="font-medium">{format(new Date(submission.created_at), "PPP 'at' p")}</p>
              </div>
            </div>
          </div>

          {/* Criteria */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Criteria & Requirements
            </h3>
            <div className="grid gap-3">
              {Object.entries(submission.criteria).map(([key, value]) => (
                <div key={key} className="p-4 rounded-lg bg-muted/50 border border-border/50">
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
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Additional Notes
              </h3>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="whitespace-pre-wrap">{submission.notes}</p>
              </div>
            </div>
          )}

          {/* Converted Contact Link */}
          {submission.converted_contact_id && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
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
