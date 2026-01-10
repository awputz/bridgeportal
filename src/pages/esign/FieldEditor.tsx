import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDocumentViewer } from "@/components/esign/PDFDocumentViewer";
import { FieldPalette } from "@/components/esign/FieldPalette";
import { DraggableField } from "@/components/esign/DraggableField";
import { useESignDocument, useUpdateESignDocument } from "@/hooks/esign/useESignDocuments";
import { useESignFields } from "@/hooks/esign/useESignFields";
import { toast } from "@/hooks/use-toast";
import type { ESignFieldType, ESignField, ESignRecipient } from "@/types/esign";

type LocalField = Partial<ESignField> & { id: string; isNew?: boolean };

const FieldEditor = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  const { data: document, isLoading } = useESignDocument(documentId);
  const { bulkSaveFields } = useESignFields(documentId);
  const updateDocument = useUpdateESignDocument();

  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [localFields, setLocalFields] = useState<LocalField[]>([]);
  const [deletedFieldIds, setDeletedFieldIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local fields from document
  useEffect(() => {
    if (document?.fields) {
      setLocalFields(document.fields.map((f) => ({ ...f, isNew: false })));
    }
    if (document?.recipients?.length && !selectedRecipientId) {
      const firstSigner = document.recipients.find((r) => r.role === "signer");
      if (firstSigner) setSelectedRecipientId(firstSigner.id);
    }
  }, [document]);

  // Keyboard handler for delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedFieldId) {
        e.preventDefault();
        handleDeleteField(selectedFieldId);
      }
      if (e.key === "Escape") {
        setSelectedFieldId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFieldId]);

  const handleAddField = useCallback(
    (fieldType: ESignFieldType) => {
      if (!selectedRecipientId || !documentId) return;

      const newField: LocalField = {
        id: crypto.randomUUID(),
        document_id: documentId,
        recipient_id: selectedRecipientId,
        field_type: fieldType,
        page_number: currentPage,
        x_position: 100,
        y_position: 100,
        width: fieldType === "checkbox" ? 30 : 200,
        height: fieldType === "checkbox" ? 30 : 50,
        required: true,
        label: fieldType.charAt(0).toUpperCase() + fieldType.slice(1),
        isNew: true,
      };

      setLocalFields((prev) => [...prev, newField]);
      setSelectedFieldId(newField.id);
    },
    [selectedRecipientId, documentId, currentPage]
  );

  const handleMoveField = useCallback((fieldId: string, x: number, y: number) => {
    setLocalFields((fields) =>
      fields.map((f) =>
        f.id === fieldId ? { ...f, x_position: x, y_position: y } : f
      )
    );
  }, []);

  const handleResizeField = useCallback(
    (fieldId: string, width: number, height: number) => {
      setLocalFields((fields) =>
        fields.map((f) => (f.id === fieldId ? { ...f, width, height } : f))
      );
    },
    []
  );

  const handleDeleteField = useCallback((fieldId: string) => {
    const field = localFields.find((f) => f.id === fieldId);
    if (field && !field.isNew) {
      setDeletedFieldIds((prev) => [...prev, fieldId]);
    }
    setLocalFields((fields) => fields.filter((f) => f.id !== fieldId));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  }, [localFields, selectedFieldId]);

  const handleSave = async () => {
    if (!documentId) return;

    setIsSaving(true);
    try {
      const originalFields = document?.fields || [];
      const originalIds = new Set(originalFields.map((f) => f.id));

      // New fields to create
      const fieldsToCreate = localFields
        .filter((f) => f.isNew)
        .map((f) => ({
          document_id: documentId,
          recipient_id: f.recipient_id!,
          field_type: f.field_type!,
          page_number: f.page_number!,
          x_position: f.x_position!,
          y_position: f.y_position!,
          width: f.width!,
          height: f.height!,
          required: f.required ?? true,
          label: f.label || null,
          placeholder: f.placeholder || null,
          options: f.options || null,
        }));

      // Existing fields to update
      const fieldsToUpdate = localFields
        .filter((f) => !f.isNew && originalIds.has(f.id))
        .map((f) => ({
          id: f.id,
          x_position: f.x_position,
          y_position: f.y_position,
          width: f.width,
          height: f.height,
          page_number: f.page_number,
          required: f.required,
          label: f.label,
        }));

      await bulkSaveFields.mutateAsync({
        fieldsToCreate,
        fieldsToUpdate,
        fieldsToDelete: deletedFieldIds,
      });

      // Mark all as no longer new
      setLocalFields((fields) => fields.map((f) => ({ ...f, isNew: false })));
      setDeletedFieldIds([]);
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendForSignature = async () => {
    // First save
    await handleSave();

    // Check all signers have at least one field
    const signers = document?.recipients?.filter((r) => r.role === "signer") || [];
    for (const signer of signers) {
      const hasFields = localFields.some((f) => f.recipient_id === signer.id);
      if (!hasFields) {
        toast({
          title: "Missing Fields",
          description: `${signer.name} has no fields assigned. Add at least one field per signer.`,
          variant: "destructive",
        });
        return;
      }
    }

    // Update status and send
    try {
      await updateDocument.mutateAsync({
        id: documentId!,
        status: "pending",
        sent_at: new Date().toISOString(),
      });

      // TODO: Trigger email sending via Edge Function

      toast({
        title: "Sent for Signature",
        description: "Recipients will receive an email with signing instructions.",
      });

      navigate("/portal/esign");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send document",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  const currentPageFields = localFields.filter((f) => f.page_number === currentPage);
  const recipients = (document.recipients || []) as ESignRecipient[];

  const hasChanges =
    localFields.some((f) => f.isNew) ||
    deletedFieldIds.length > 0 ||
    localFields.some((f) => {
      const original = document.fields?.find((of) => of.id === f.id);
      if (!original) return false;
      return (
        original.x_position !== f.x_position ||
        original.y_position !== f.y_position ||
        original.width !== f.width ||
        original.height !== f.height
      );
    });

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/portal/esign")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="font-semibold">{document.title}</h1>
            <p className="text-sm text-muted-foreground">
              {localFields.length} field{localFields.length !== 1 && "s"} placed
              {hasChanges && " • Unsaved changes"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
          <Button
            onClick={handleSendForSignature}
            disabled={isSaving || localFields.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Send for Signature
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Field Palette */}
        <FieldPalette
          recipients={recipients}
          selectedRecipientId={selectedRecipientId}
          onSelectRecipient={setSelectedRecipientId}
          onAddField={handleAddField}
        />

        {/* PDF Viewer with Fields */}
        <div className="flex-1 overflow-hidden">
          <PDFDocumentViewer
            fileUrl={document.original_file_url}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onNumPagesChange={setNumPages}
            scale={scale}
            onScaleChange={setScale}
          >
            {currentPageFields.map((field) => {
              const recipient = recipients.find((r) => r.id === field.recipient_id);
              if (!recipient) return null;

              return (
                <DraggableField
                  key={field.id}
                  field={field}
                  recipient={recipient}
                  scale={scale}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => setSelectedFieldId(field.id)}
                  onMove={(x, y) => handleMoveField(field.id, x, y)}
                  onResize={(w, h) => handleResizeField(field.id, w, h)}
                  onDelete={() => handleDeleteField(field.id)}
                />
              );
            })}
          </PDFDocumentViewer>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
