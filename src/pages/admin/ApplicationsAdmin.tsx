import { useState } from "react";
import { format } from "date-fns";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  Check, 
  X, 
  Eye,
  Loader2,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAgentApplications, useUpdateApplicationStatus, AgentApplication } from "@/hooks/useAgentApplications";
import { cn } from "@/lib/utils";

const ApplicationsAdmin = () => {
  const { data: applications, isLoading } = useAgentApplications();
  const updateStatus = useUpdateApplicationStatus();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<AgentApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const filteredApplications = applications?.filter(app => {
    const matchesSearch = 
      app.full_name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleAction = async () => {
    if (!selectedApp || !actionType) return;
    
    await updateStatus.mutateAsync({
      id: selectedApp.id,
      status: actionType === 'approve' ? 'approved' : 'rejected',
      admin_notes: adminNotes,
    });

    setSelectedApp(null);
    setAdminNotes("");
    setActionType(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/10 text-red-500">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = applications?.filter(a => a.status === 'pending').length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-foreground">Agent Applications</h1>
          <p className="text-muted-foreground text-sm">
            Review and manage new agent applications
            {pendingCount > 0 && (
              <span className="ml-2 text-yellow-500">({pendingCount} pending)</span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No applications found</h3>
          <p className="text-muted-foreground text-sm">
            {search || statusFilter !== "all" 
              ? "Try adjusting your filters" 
              : "New applications will appear here"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Divisions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {app.headshot_url ? (
                        <img 
                          src={app.headshot_url} 
                          alt={app.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{app.full_name}</p>
                        {app.license_number && (
                          <p className="text-xs text-muted-foreground">License: {app.license_number}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {app.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {app.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {app.divisions.map(d => (
                        <Badge key={d} variant="outline" className="text-xs capitalize">
                          {d.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {app.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                            onClick={() => {
                              setSelectedApp(app);
                              setActionType('approve');
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => {
                              setSelectedApp(app);
                              setActionType('reject');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View/Action Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => {
        setSelectedApp(null);
        setAdminNotes("");
        setActionType(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Application' :
               actionType === 'reject' ? 'Reject Application' : 
               'Application Details'}
            </DialogTitle>
            <DialogDescription>
              {actionType 
                ? `Are you sure you want to ${actionType} this application?`
                : 'Review the applicant information'}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="flex items-start gap-4">
                {selectedApp.headshot_url ? (
                  <img 
                    src={selectedApp.headshot_url} 
                    alt={selectedApp.full_name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{selectedApp.full_name}</h3>
                  <p className="text-muted-foreground">{selectedApp.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedApp.phone}</p>
                  {getStatusBadge(selectedApp.status)}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedApp.license_number && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">License Number</p>
                    <p className="font-medium">{selectedApp.license_number}</p>
                  </div>
                )}
                {selectedApp.date_of_birth && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{format(new Date(selectedApp.date_of_birth), 'MMM d, yyyy')}</p>
                  </div>
                )}
                {selectedApp.mailing_address && (
                  <div className="p-3 rounded-lg bg-muted/30 col-span-2">
                    <p className="text-xs text-muted-foreground">Mailing Address</p>
                    <p className="font-medium">{selectedApp.mailing_address}</p>
                  </div>
                )}
              </div>

              {/* Divisions */}
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Selected Divisions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.divisions.map(d => (
                    <Badge key={d} className="capitalize">
                      {d.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              {selectedApp.bio && (
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">Bio</p>
                  <p className="text-sm">{selectedApp.bio}</p>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-4">
                {selectedApp.linkedin_url && (
                  <a 
                    href={selectedApp.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    LinkedIn Profile →
                  </a>
                )}
                {selectedApp.instagram_url && (
                  <span className="text-sm text-muted-foreground">
                    Instagram: {selectedApp.instagram_url}
                  </span>
                )}
              </div>

              {/* Cultural Values */}
              <div className={cn(
                "p-3 rounded-lg",
                selectedApp.cultural_values_acknowledged 
                  ? "bg-emerald-500/10 border border-emerald-500/30" 
                  : "bg-yellow-500/10 border border-yellow-500/30"
              )}>
                <div className="flex items-center gap-2">
                  {selectedApp.cultural_values_acknowledged ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <X className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    Cultural values {selectedApp.cultural_values_acknowledged ? 'acknowledged' : 'not acknowledged'}
                  </span>
                </div>
              </div>

              {/* Action Area */}
              {actionType && (
                <div className="space-y-3 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium">Admin Notes (optional)</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder={actionType === 'reject' 
                        ? "Reason for rejection..." 
                        : "Any notes about this approval..."}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {actionType ? (
              <>
                <Button variant="outline" onClick={() => setActionType(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAction}
                  disabled={updateStatus.isPending}
                  className={cn(
                    actionType === 'approve' 
                      ? "bg-emerald-500 hover:bg-emerald-600" 
                      : "bg-red-500 hover:bg-red-600"
                  )}
                >
                  {updateStatus.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
                </Button>
              </>
            ) : selectedApp?.status === 'pending' ? (
              <>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                  onClick={() => setActionType('reject')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => setActionType('approve')}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsAdmin;
