import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHRAgents } from "@/hooks/hr/useHRAgents";
import { useCreateActiveAgent } from "@/hooks/hr/useActiveAgents";
import { useContracts } from "@/hooks/hr/useContracts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ConvertToActiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedAgentId?: string;
}

export function ConvertToActiveDialog({
  open,
  onOpenChange,
  preselectedAgentId,
}: ConvertToActiveDialogProps) {
  const [selectedAgentId, setSelectedAgentId] = useState(preselectedAgentId || "");
  const [formData, setFormData] = useState({
    hireDate: format(new Date(), "yyyy-MM-dd"),
    startDate: "",
    commissionSplit: "",
    contractId: "",
  });

  const { data: hrAgents } = useHRAgents({ status: "hired" });
  const { data: contracts } = useContracts({ status: "signed" });
  const createActiveAgent = useCreateActiveAgent();

  const selectedAgent = hrAgents?.find((a) => a.id === selectedAgentId);
  const agentContracts = contracts?.filter((c) => c.agent_id === selectedAgentId);

  const handleSubmit = async () => {
    if (!selectedAgent) return;

    await createActiveAgent.mutateAsync({
      hr_agent_id: selectedAgent.id,
      full_name: selectedAgent.full_name,
      email: selectedAgent.email,
      phone: selectedAgent.phone,
      division: selectedAgent.division,
      hire_date: formData.hireDate,
      start_date: formData.startDate || null,
      commission_split: formData.commissionSplit || null,
      contract_id: formData.contractId || null,
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedAgentId("");
    setFormData({
      hireDate: format(new Date(), "yyyy-MM-dd"),
      startDate: "",
      commissionSplit: "",
      contractId: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convert to Active Agent</DialogTitle>
          <DialogDescription>
            Convert a hired agent from the pipeline to an active employee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Agent Selection */}
          <div className="space-y-2">
            <Label>Select Hired Agent</Label>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent..." />
              </SelectTrigger>
              <SelectContent>
                {hrAgents?.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.full_name} — {agent.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hrAgents?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hired agents available. Move agents to "Hired" status in the pipeline first.
              </p>
            )}
          </div>

          {selectedAgent && (
            <>
              {/* Pre-populated Info */}
              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {selectedAgent.full_name}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {selectedAgent.email}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Division:</span>{" "}
                  {selectedAgent.division}
                </p>
              </div>

              {/* Hire Date */}
              <div className="space-y-2">
                <Label htmlFor="hireDate">Hire Date *</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hireDate: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (optional)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>

              {/* Commission Split */}
              <div className="space-y-2">
                <Label htmlFor="commissionSplit">Commission Split</Label>
                <Input
                  id="commissionSplit"
                  placeholder="e.g., 70/30"
                  value={formData.commissionSplit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, commissionSplit: e.target.value }))
                  }
                />
              </div>

              {/* Link Contract */}
              {agentContracts && agentContracts.length > 0 && (
                <div className="space-y-2">
                  <Label>Link Signed Contract</Label>
                  <Select
                    value={formData.contractId}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, contractId: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract..." />
                    </SelectTrigger>
                    <SelectContent>
                      {agentContracts.map((contract) => (
                        <SelectItem key={contract.id} value={contract.id}>
                          {contract.contract_type} — Signed{" "}
                          {contract.signed_at
                            ? format(new Date(contract.signed_at), "MMM d, yyyy")
                            : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAgent || !formData.hireDate || createActiveAgent.isPending}
          >
            {createActiveAgent.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Convert to Active
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
