import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useAgentCompliance,
  useAddCompliance,
  useDeleteCompliance,
  complianceStatusConfig,
  licenseTypes,
  type AgentCompliance,
} from "@/hooks/hr/useAgentCompliance";
import { format, differenceInDays, parseISO } from "date-fns";
import { Plus, Shield, Trash2, Loader2, FileText, AlertTriangle } from "lucide-react";

interface ComplianceCardProps {
  activeAgentId: string;
}

export function ComplianceCard({ activeAgentId }: ComplianceCardProps) {
  const { data: compliance, isLoading } = useAgentCompliance(activeAgentId);
  const addCompliance = useAddCompliance();
  const deleteCompliance = useDeleteCompliance();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    licenseType: "",
    licenseNumber: "",
    licenseState: "NY",
    issueDate: "",
    expiryDate: "",
  });

  const handleAdd = async () => {
    await addCompliance.mutateAsync({
      active_agent_id: activeAgentId,
      license_type: formData.licenseType,
      license_number: formData.licenseNumber,
      license_state: formData.licenseState,
      issue_date: formData.issueDate || null,
      expiry_date: formData.expiryDate,
    });

    setShowAddDialog(false);
    setFormData({
      licenseType: "",
      licenseNumber: "",
      licenseState: "NY",
      issueDate: "",
      expiryDate: "",
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteCompliance.mutateAsync({ id: deleteId, activeAgentId });
    setDeleteId(null);
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    return differenceInDays(parseISO(expiryDate), new Date());
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Licenses & Compliance
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {compliance?.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No licenses or certifications on file.</p>
            </div>
          ) : (
            compliance?.map((item) => {
              const status = complianceStatusConfig[item.status];
              const daysLeft = getDaysUntilExpiry(item.expiry_date);

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {licenseTypes.find((t) => t.value === item.license_type)?.label || item.license_type}
                      </span>
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      #{item.license_number} • {item.license_state}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Expires: {format(parseISO(item.expiry_date), "MMM d, yyyy")}</span>
                      {daysLeft >= 0 ? (
                        <span className={daysLeft <= 30 ? "text-amber-500" : ""}>
                          ({daysLeft} days left)
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expired {Math.abs(daysLeft)} days ago
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add License/Certification</DialogTitle>
            <DialogDescription>
              Add a new license or certification for this agent.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>License Type *</Label>
              <Select
                value={formData.licenseType}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, licenseType: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, licenseNumber: e.target.value }))
                  }
                  placeholder="e.g., 10401234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseState">State</Label>
                <Input
                  id="licenseState"
                  value={formData.licenseState}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, licenseState: e.target.value }))
                  }
                  placeholder="NY"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, issueDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={
                !formData.licenseType ||
                !formData.licenseNumber ||
                !formData.expiryDate ||
                addCompliance.isPending
              }
            >
              {addCompliance.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Compliance Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this license/certification from the agent's records.
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
    </>
  );
}
