import { useState } from "react";
import { useAgentRequestsAdmin } from "@/hooks/useAgentRequestsAdmin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Trash2, FileEdit, Clock, CheckCircle, XCircle, AlertCircle, User } from "lucide-react";
import { AgentDisplay } from "@/components/admin/AgentDisplay";
import { format } from "date-fns";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-gray-500/10 text-gray-600 border-gray-200", icon: XCircle },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
  normal: { label: "Normal", color: "bg-blue-100 text-blue-600" },
  high: { label: "High", color: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-600" },
};

export default function AgentRequestsAdmin() {
  const { requests, isLoading, updateRequest, deleteRequest } = useAgentRequestsAdmin();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editRequest, setEditRequest] = useState<typeof requests extends (infer T)[] ? T : never | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredRequests = requests?.filter((req) => {
    const matchesSearch =
      req.request_type.toLowerCase().includes(search.toLowerCase()) ||
      req.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      req.property_address?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openEdit = (request: NonNullable<typeof editRequest>) => {
    setEditRequest(request);
    setEditNotes(request.notes || "");
    setEditStatus(request.status);
  };

  const handleUpdate = () => {
    if (!editRequest) return;
    updateRequest.mutate({
      id: editRequest.id,
      status: editStatus,
      notes: editNotes,
    });
    setEditRequest(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteRequest.mutate(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const pendingCount = requests?.filter((r) => r.status === "pending").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agent Requests</h1>
        <p className="text-muted-foreground mt-1">
          Process and manage requests from agents
        </p>
      </div>

      {pendingCount > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                {pendingCount} pending request{pendingCount !== 1 ? "s" : ""} awaiting review
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            {requests?.length || 0} total requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !filteredRequests?.length ? (
            <div className="text-center py-8 text-muted-foreground">No requests found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Client / Property</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const statusConfig = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                  const priorityConfig = PRIORITY_CONFIG[request.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.normal;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.request_type}</div>
                        {request.notes && (
                          <div className="text-sm text-muted-foreground line-clamp-1">{request.notes}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <AgentDisplay 
                          name={request.agent_name} 
                          email={request.agent_email}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          {request.client_name && <div>{request.client_name}</div>}
                          {request.property_address && (
                            <div className="text-sm text-muted-foreground">{request.property_address}</div>
                          )}
                          {!request.client_name && !request.property_address && (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityConfig.color}>
                          {priorityConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(request.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(request)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(request.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editRequest} onOpenChange={() => setEditRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request</DialogTitle>
            <DialogDescription>
              Update the status and add notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-1">Request Type</div>
              <div className="text-foreground">{editRequest?.request_type}</div>
            </div>
            {editRequest?.client_name && (
              <div>
                <div className="text-sm font-medium mb-1">Client</div>
                <div className="text-foreground">{editRequest.client_name}</div>
              </div>
            )}
            {editRequest?.property_address && (
              <div>
                <div className="text-sm font-medium mb-1">Property</div>
                <div className="text-foreground">{editRequest.property_address}</div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes about this request..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRequest(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
