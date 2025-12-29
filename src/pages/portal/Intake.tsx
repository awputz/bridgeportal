import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Link as LinkIcon, 
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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  useIntakeLinks, 
  useIntakeSubmissions, 
  useIntakeStats,
  useCreateIntakeLink,
  useDeleteIntakeLink,
  useUpdateSubmission,
  useConvertToContact,
  IntakeSubmission 
} from "@/hooks/useIntake";
import { cn } from "@/lib/utils";
import {
  IntakeStatsCard,
  IntakeLinkCard,
  IntakeLinkCardSkeleton,
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
  const [activeTab, setActiveTab] = useState("submissions");
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeSubmission | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: links = [], isLoading: linksLoading } = useIntakeLinks();
  const { data: submissions = [], isLoading: submissionsLoading } = useIntakeSubmissions({
    division: selectedDivision !== "all" ? selectedDivision : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });
  const { data: stats, isLoading: statsLoading } = useIntakeStats();
  const deleteLink = useDeleteIntakeLink();
  const updateSubmission = useUpdateSubmission();
  const convertToContact = useConvertToContact();

  // Filter submissions by search
  const filteredSubmissions = submissions.filter(s => 
    s.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.client_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Link
            </Button>
          </DialogTrigger>
          <CreateLinkDialog onClose={() => setCreateDialogOpen(false)} />
        </Dialog>
      </div>

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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger 
            value="submissions" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Submissions
            {submissions.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {submissions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="links"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            My Links
            {links.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {links.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6 mt-0">
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
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-6 mt-0">
          {linksLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <IntakeLinkCardSkeleton key={i} />
              ))}
            </div>
          ) : links.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <IntakeEmptyState 
                  type="links" 
                  onAction={() => setCreateDialogOpen(true)} 
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link) => (
                <IntakeLinkCard 
                  key={link.id} 
                  link={link}
                  onDelete={(id) => deleteLink.mutate(id)}
                  divisionLabel={link.division ? divisionInfo[link.division]?.label : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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

// Create Link Dialog
function CreateLinkDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [division, setDivision] = useState<string>("");
  const createLink = useCreateIntakeLink();
  
  const baseUrl = window.location.origin;
  const previewCode = "preview-code";

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a link name");
      return;
    }
    await createLink.mutateAsync({ 
      name: name.trim(), 
      division: division || undefined 
    });
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create Intake Link</DialogTitle>
        <DialogDescription>
          Create a shareable link for clients to submit their criteria
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Link Name</Label>
          <Input 
            id="name"
            placeholder="e.g., Q1 Buyer Leads"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">
            Give this link a descriptive name to track its purpose
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Lock to Division (optional)</Label>
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All divisions" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="">All divisions</SelectItem>
              <SelectItem value="investment-sales">Investment Sales</SelectItem>
              <SelectItem value="commercial-leasing">Commercial Leasing</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            If locked, clients won't be able to choose a different division
          </p>
        </div>

        {/* Preview */}
        {name && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Link Preview</Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
              <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-mono text-muted-foreground truncate">
                {baseUrl}/intake/{previewCode}
              </span>
            </div>
          </div>
        )}
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={createLink.isPending}>
          {createLink.isPending ? "Creating..." : "Create Link"}
        </Button>
      </DialogFooter>
    </DialogContent>
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
