import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Save, Send, Loader2 } from "lucide-react";
import { DynamicFormField } from "./DynamicFormField";
import { RecipientSelectionDialog, type Recipient } from "./RecipientSelectionDialog";
import { useCreateFilledTemplate, useUpdateFilledTemplate } from "@/hooks/useFilledTemplates";
import { useCreateESignDocument } from "@/hooks/esign/useESignDocuments";
import { toast } from "@/hooks/use-toast";
import type { AgentTemplate } from "@/types/templates";

interface TemplateFillDialogProps {
  template: AgentTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId?: string;
  onComplete?: (filledTemplateId: string) => void;
}

export const TemplateFillDialog = ({
  template,
  open,
  onOpenChange,
  dealId,
  onComplete,
}: TemplateFillDialogProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRecipientDialog, setShowRecipientDialog] = useState(false);
  const [isCreatingESign, setIsCreatingESign] = useState(false);

  const navigate = useNavigate();
  const createFilledTemplate = useCreateFilledTemplate();
  const updateFilledTemplate = useUpdateFilledTemplate();
  const createESignDocument = useCreateESignDocument();

  // Reset form when template changes
  useEffect(() => {
    if (template?.form_schema) {
      const defaults: Record<string, unknown> = {};
      template.form_schema.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaults[field.id] = field.defaultValue;
        }
      });
      setFormData(defaults);
      setErrors({});
    }
  }, [template]);

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!template?.form_schema) return true;

    const newErrors: Record<string, string> = {};

    template.form_schema.fields.forEach((field) => {
      const value = formData[field.id];

      if (
        field.required &&
        (value === undefined || value === "" || value === null)
      ) {
        newErrors[field.id] = `${field.label} is required`;
      }

      if (field.validation && value !== undefined && value !== "" && value !== null) {
        if (
          field.validation.min !== undefined &&
          Number(value) < field.validation.min
        ) {
          newErrors[field.id] =
            field.validation.message ||
            `Minimum value is ${field.validation.min}`;
        }
        if (
          field.validation.max !== undefined &&
          Number(value) > field.validation.max
        ) {
          newErrors[field.id] =
            field.validation.message ||
            `Maximum value is ${field.validation.max}`;
        }
        if (
          field.validation.pattern &&
          !new RegExp(field.validation.pattern).test(String(value))
        ) {
          newErrors[field.id] = field.validation.message || `Invalid format`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!template) return;
    if (!validateForm()) {
      toast({
        title: "Please fix errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createFilledTemplate.mutateAsync({
        templateId: template.id,
        formData,
        dealId,
      });

      toast({
        title: "Template Saved",
        description: "Your filled template has been saved.",
      });

      onOpenChange(false);
      onComplete?.(result.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSendForSignature = async () => {
    if (!template || !validateForm()) {
      toast({
        title: "Please fix errors",
        description: "Complete all required fields before sending for signature.",
        variant: "destructive",
      });
      return;
    }

    // Open recipient dialog to collect signers
    setShowRecipientDialog(true);
  };

  const handleStartESignFlow = async (recipients: Recipient[]) => {
    if (!template) return;

    setIsCreatingESign(true);

    try {
      // 1. Save filled template first
      const filledTemplate = await createFilledTemplate.mutateAsync({
        templateId: template.id,
        formData,
        dealId,
      });

      // 2. Fetch the template PDF file
      const response = await fetch(template.file_url);
      if (!response.ok) {
        throw new Error("Failed to fetch template file");
      }
      const blob = await response.blob();
      const fileName = `${template.name.replace(/[^a-zA-Z0-9]/g, "_")}_filled.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      // 3. Create eSign document with recipients
      const documentTitle = `${template.name} - ${
        (formData.buyer_name as string) ||
        (formData.client_name as string) ||
        "Unsigned"
      }`;

      const document = await createESignDocument.mutateAsync({
        title: documentTitle,
        description: `Generated from ${template.name} template`,
        file,
        templateId: template.id,
        dealId,
        recipients: recipients.map((r, i) => ({
          name: r.name,
          email: r.email,
          role: r.role,
          signer_type: r.signer_type,
          signing_order: i + 1,
          status: "pending" as const,
        })),
      });

      // 4. Update filled template status
      await updateFilledTemplate.mutateAsync({
        id: filledTemplate.id,
        status: "sent_for_signature",
      });

      // 5. Close dialogs and navigate to field editor
      toast({
        title: "Document Created",
        description: "Now place signature fields on the document.",
      });

      setShowRecipientDialog(false);
      onOpenChange(false);
      navigate(`/portal/esign/edit/${document.id}`);
    } catch (error) {
      console.error("eSign flow error:", error);
      toast({
        title: "Error",
        description: "Failed to create signature request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingESign(false);
    }
  };

  // Extract prefill data for recipient dialog
  const recipientPrefillData = {
    buyerName: formData.buyer_name as string | undefined,
    buyerEmail: formData.buyer_email as string | undefined,
    sellerName: formData.seller_name as string | undefined,
    sellerEmail: formData.seller_email as string | undefined,
  };

  if (!template || !template.form_schema) return null;

  const { fields, sections } = template.form_schema;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col max-w-lg max-h-[90vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {template.name}
            </DialogTitle>
            <DialogDescription>
              Fill in the fields below. Required fields are marked with an
              asterisk (*).
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 py-4">
              {sections && sections.length > 0 ? (
                // Render with sections
                sections.map((section, sectionIdx) => (
                  <div key={section.title} className="space-y-4">
                    {sectionIdx > 0 && <Separator />}
                    <div>
                      <h4 className="font-medium text-sm">{section.title}</h4>
                      {section.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {section.description}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      {section.fieldIds.map((fieldId) => {
                        const field = fields.find((f) => f.id === fieldId);
                        if (!field) return null;
                        return (
                          <DynamicFormField
                            key={field.id}
                            field={field}
                            value={formData[field.id]}
                            onChange={(value) =>
                              handleFieldChange(field.id, value)
                            }
                            error={errors[field.id]}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                // Render flat list
                <div className="space-y-4">
                  {fields.map((field) => (
                    <DynamicFormField
                      key={field.id}
                      field={field}
                      value={formData[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      error={errors[field.id]}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex-shrink-0 flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={createFilledTemplate.isPending}
            >
              {createFilledTemplate.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button onClick={handleSendForSignature}>
              <Send className="h-4 w-4 mr-2" />
              Send for Signature
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <RecipientSelectionDialog
        open={showRecipientDialog}
        onOpenChange={setShowRecipientDialog}
        onConfirm={handleStartESignFlow}
        isLoading={isCreatingESign}
        prefillData={recipientPrefillData}
      />
    </>
  );
};
