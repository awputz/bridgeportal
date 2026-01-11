import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCreateESignDocument } from "@/hooks/esign/useESignDocuments";
import { toast } from "@/hooks/use-toast";
import type { CreateESignRecipientInput, ESignRecipientRole, ESignSignerType } from "@/types/esign";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (documentId: string) => void;
  preSelectedDealId?: string;
}

const signerTypes: { value: ESignSignerType; label: string }[] = [
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
  { value: "agent", label: "Agent" },
  { value: "attorney", label: "Attorney" },
  { value: "broker", label: "Broker" },
  { value: "other", label: "Other" },
];

const roleOptions: { value: ESignRecipientRole; label: string }[] = [
  { value: "signer", label: "Needs to Sign" },
  { value: "cc", label: "Receives Copy" },
  { value: "viewer", label: "View Only" },
];

export const DocumentUploadDialog = ({
  open,
  onOpenChange,
  onSuccess,
  preSelectedDealId,
}: DocumentUploadDialogProps) => {
  const createDocument = useCreateESignDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dealId, setDealId] = useState(preSelectedDealId || "");
  const [isDragging, setIsDragging] = useState(false);
  const [recipients, setRecipients] = useState<CreateESignRecipientInput[]>([
    { name: "", email: "", role: "signer", signer_type: "buyer", signing_order: 1 },
  ]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please select a PDF file", variant: "destructive" });
      return;
    }
    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.pdf$/i, ""));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const addRecipient = () => {
    setRecipients([
      ...recipients,
      {
        name: "",
        email: "",
        role: "signer",
        signer_type: "buyer",
        signing_order: recipients.length + 1,
      },
    ]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (
    index: number,
    field: keyof CreateESignRecipientInput,
    value: string
  ) => {
    setRecipients(
      recipients.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const isValid =
    file &&
    title.trim() &&
    recipients.some(
      (r) => r.role === "signer" && r.name.trim() && r.email.trim()
    );

  const handleSubmit = async () => {
    if (!file || !isValid) return;

    try {
      const result = await createDocument.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        file,
        dealId: dealId || undefined,
        recipients: recipients.filter((r) => r.name.trim() && r.email.trim()),
      });

      toast({ title: "Document Created", description: "Your document is ready for signature fields." });
      onSuccess(result.id);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create document:", error);
      toast({ title: "Error", description: "Failed to create document", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setDealId("");
    setRecipients([
      { name: "", email: "", role: "signer", signer_type: "buyer", signing_order: 1 },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-extralight text-xl">
            New Document for Signature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Document (PDF)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />

            {file ? (
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF files only, up to 20MB
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Purchase Agreement - 123 Main St"
            />
          </div>

          {/* Description (optional) */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes for the recipients..."
              rows={2}
            />
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Recipients</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addRecipient}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Recipient
              </Button>
            </div>

            <div className="space-y-3">
              {recipients.map((recipient, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 p-3 border border-border rounded-lg bg-muted/20"
                >
                  <div className="col-span-12 sm:col-span-3">
                    <Input
                      placeholder="Name"
                      value={recipient.name}
                      onChange={(e) =>
                        updateRecipient(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={recipient.email}
                      onChange={(e) =>
                        updateRecipient(index, "email", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <Select
                      value={recipient.role}
                      onValueChange={(v) => updateRecipient(index, "role", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5 sm:col-span-2">
                    <Select
                      value={recipient.signer_type || "other"}
                      onValueChange={(v) =>
                        updateRecipient(index, "signer_type", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {signerTypes.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecipient(index)}
                      disabled={recipients.length === 1}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createDocument.isPending}
          >
            {createDocument.isPending ? "Creating..." : "Continue to Add Fields"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
