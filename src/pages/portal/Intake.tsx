import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Link as LinkIcon, 
  Copy, 
  ExternalLink, 
  Users, 
  Calendar,
  Trash2,
  Eye,
  Building2,
  Home,
  Briefcase,
  UserPlus,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
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
import { useDivision } from "@/contexts/DivisionContext";
import { cn } from "@/lib/utils";

const divisionInfo: Record<string, { label: string; icon: typeof Building2; color: string }> = {
  "investment-sales": { label: "Investment Sales", icon: Building2, color: "text-emerald-500" },
  "commercial-leasing": { label: "Commercial Leasing", icon: Briefcase, color: "text-blue-500" },
  "residential": { label: "Residential", icon: Home, color: "text-violet-500" },
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  converted: "bg-green-500/10 text-green-500 border-green-500/20",
  closed: "bg-muted text-muted-foreground",
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
  const { data: stats } = useIntakeStats();
  const { division } = useDivision();

  // Filter submissions by search
  const filteredSubmissions = submissions.filter(s => 
    s.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.client_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Client Intake</h1>
          <p className="text-muted-foreground">Collect and manage client criteria submissions</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Link
            </Button>
          </DialogTrigger>
          <CreateLinkDialog onClose={() => setCreateDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-semibold">{stats?.total || 0}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-semibold">{stats?.thisWeek || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New (Uncontacted)</p>
                <p className="text-2xl font-semibold text-blue-500">{stats?.newSubmissions || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="links">My Links</TabsTrigger>
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                <SelectItem value="investment-sales">Investment Sales</SelectItem>
                <SelectItem value="commercial-leasing">Commercial Leasing</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submissions Table */}
          <Card>
            <CardContent className="p-0">
              {submissionsLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No submissions yet</p>
                  <p className="text-sm">Share your intake links to start collecting client criteria</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => {
                      const divInfo = divisionInfo[submission.division];
                      const DivIcon = divInfo?.icon || Building2;
                      return (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{submission.client_name}</p>
                              <p className="text-sm text-muted-foreground">{submission.client_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DivIcon className={cn("h-4 w-4", divInfo?.color)} />
                              <span className="text-sm">{divInfo?.label || submission.division}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[submission.status]}>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell className="text-right">
                            <SubmissionActions 
                              submission={submission} 
                              onView={() => setSelectedSubmission(submission)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-4">
          {linksLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : links.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <LinkIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground">No intake links yet</p>
                <p className="text-sm text-muted-foreground mb-4">Create a link to share with clients</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} />
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Intake Link</DialogTitle>
        <DialogDescription>
          Create a shareable link for clients to submit their criteria
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Link Name</Label>
          <Input 
            id="name"
            placeholder="e.g., Q1 Buyer Leads"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Lock to Division (optional)</Label>
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger>
              <SelectValue placeholder="All divisions" />
            </SelectTrigger>
            <SelectContent>
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
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={createLink.isPending}>
          {createLink.isPending ? "Creating..." : "Create Link"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// Link Card
function LinkCard({ link }: { link: ReturnType<typeof useIntakeLinks>["data"][number] }) {
  const deleteLink = useDeleteIntakeLink();
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}/intake/${link.link_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{link.name}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {link.division ? divisionInfo[link.division]?.label : "All divisions"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => deleteLink.mutate(link.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>{link.view_count} views</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded bg-muted/50 text-xs font-mono truncate">
          <LinkIcon className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{fullUrl}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </CardContent>
    </Card>
  );
}

// Submission Actions
function SubmissionActions({ 
  submission, 
  onView 
}: { 
  submission: IntakeSubmission; 
  onView: () => void;
}) {
  const updateSubmission = useUpdateSubmission();
  const convertToContact = useConvertToContact();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        {submission.status === "new" && (
          <DropdownMenuItem onClick={() => updateSubmission.mutate({ 
            id: submission.id, 
            status: "contacted",
            contacted_at: new Date().toISOString()
          })}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark Contacted
          </DropdownMenuItem>
        )}
        {!submission.converted_contact_id && (
          <DropdownMenuItem onClick={() => convertToContact.mutate({ 
            submission, 
            division: submission.division 
          })}>
            <UserPlus className="h-4 w-4 mr-2" />
            Convert to Contact
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DivIcon className={cn("h-5 w-5", divInfo?.color)} />
            {submission.client_name}
          </DialogTitle>
          <DialogDescription>
            Submitted {format(new Date(submission.created_at), "PPP 'at' p")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{submission.client_email}</p>
              </div>
              {submission.client_phone && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{submission.client_phone}</p>
                </div>
              )}
              {submission.client_company && (
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-medium">{submission.client_company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Criteria */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Criteria</h3>
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              {Object.entries(submission.criteria).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-muted-foreground capitalize">
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
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Additional Notes</h3>
              <p className="p-4 rounded-lg bg-muted/50">{submission.notes}</p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={statusColors[submission.status]}>
              {submission.status}
            </Badge>
            {submission.converted_contact_id && (
              <Link 
                to={`/portal/crm/contacts/${submission.converted_contact_id}`}
                className="text-sm text-primary hover:underline"
              >
                View Contact →
              </Link>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          {submission.status === "new" && (
            <Button 
              variant="outline"
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
