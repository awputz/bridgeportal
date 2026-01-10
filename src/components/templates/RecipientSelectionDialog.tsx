import { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ESignSignerType } from "@/types/esign";

export interface Recipient {
  name: string;
  email: string;
  role: "signer" | "cc";
  signer_type: ESignSignerType;
}

interface RecipientSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (recipients: Recipient[]) => void;
  isLoading?: boolean;
  prefillData?: {
    buyerName?: string;
    buyerEmail?: string;
    sellerName?: string;
    sellerEmail?: string;
  };
}

const signerTypes: { value: ESignSignerType; label: string }[] = [
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
  { value: "agent", label: "Agent" },
  { value: "attorney", label: "Attorney" },
  { value: "broker", label: "Broker" },
  { value: "other", label: "Other" },
];

export const RecipientSelectionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  prefillData,
}: RecipientSelectionDialogProps) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  // Initialize recipients when dialog opens or prefill data changes
  useEffect(() => {
    if (open) {
      const initial: Recipient[] = [];
      if (prefillData?.buyerName || prefillData?.buyerEmail) {
        initial.push({
          name: prefillData.buyerName || "",
          email: prefillData.buyerEmail || "",
          role: "signer",
          signer_type: "buyer",
        });
      }
      if (prefillData?.sellerName || prefillData?.sellerEmail) {
        initial.push({
          name: prefillData.sellerName || "",
          email: prefillData.sellerEmail || "",
          role: "signer",
          signer_type: "seller",
        });
      }
      if (initial.length === 0) {
        initial.push({ name: "", email: "", role: "signer", signer_type: "buyer" });
      }
      setRecipients(initial);
    }
  }, [open, prefillData]);

  const addRecipient = () => {
    setRecipients([
      ...recipients,
      { name: "", email: "", role: "signer", signer_type: "other" },
    ]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (
    index: number,
    field: keyof Recipient,
    value: string
  ) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipients(updated);
  };

  const isValid =
    recipients.length > 0 &&
    recipients.every((r) => r.name.trim() && r.email.trim());

  const handleConfirm = () => {
    if (isValid) {
      onConfirm(recipients);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Who needs to sign?</DialogTitle>
          <DialogDescription>
            Add the people who need to sign this document. You can add multiple
            signers and CC recipients.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {recipients.map((recipient, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-3 bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Recipient {index + 1}
                </Label>
                {recipients.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeRecipient(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`name-${index}`} className="text-xs">
                    Name
                  </Label>
                  <Input
                    id={`name-${index}`}
                    placeholder="Full name"
                    value={recipient.name}
                    onChange={(e) =>
                      updateRecipient(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`email-${index}`} className="text-xs">
                    Email
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="email@example.com"
                    value={recipient.email}
                    onChange={(e) =>
                      updateRecipient(index, "email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Role</Label>
                  <Select
                    value={recipient.role}
                    onValueChange={(v) =>
                      updateRecipient(index, "role", v as "signer" | "cc")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="signer">Needs to Sign</SelectItem>
                      <SelectItem value="cc">CC (View Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={recipient.signer_type}
                    onValueChange={(v) =>
                      updateRecipient(index, "signer_type", v as ESignSignerType)
                    }
                    disabled={recipient.role !== "signer"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {signerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addRecipient}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Recipient
          </Button>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Continue to Field Placement"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
