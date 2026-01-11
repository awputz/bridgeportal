import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FileText, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PDFDocumentViewer } from "@/components/esign/PDFDocumentViewer";
import { SignableField } from "@/components/esign/SignableField";
import { SignatureDialog } from "@/components/esign/SignatureDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ESignField } from "@/types/esign";

interface DocumentData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  signedFileUrl: string;
  total_signers: number;
  signed_count: number;
}

interface RecipientData {
  id: string;
  name: string;
  email: string;
  status: string;
}

const SignDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [recipient, setRecipient] = useState<RecipientData | null>(null);
  const [fields, setFields] = useState<ESignField[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1);

  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Fetch document and validate token
  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId || !token) {
        setError("Invalid signing link");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase.functions.invoke("esign-sign", {
          method: "GET",
          body: null,
          headers: {
            "Content-Type": "application/json",
          },
        });

        // The function needs query params, so we'll call via fetch
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/esign-sign?documentId=${documentId}&token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Failed to load document");
          setIsLoading(false);
          return;
        }

        if (result.data.isComplete) {
          setIsComplete(true);
          setRecipient(result.data.recipient);
          setDocument(result.data.document);
        } else {
          setDocument(result.data.document);
          setRecipient(result.data.recipient);
          setFields(result.data.fields || []);

          // Initialize field values with any existing values
          const values: Record<string, string> = {};
          (result.data.fields || []).forEach((f: ESignField) => {
            if (f.value) values[f.id] = f.value;
          });
          setFieldValues(values);
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, token]);

  const handleFieldClick = (field: ESignField) => {
    if (field.field_type === "signature" || field.field_type === "initials") {
      setActiveFieldId(field.id);
      setShowSignatureDialog(true);
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSignatureComplete = (signatureData: string) => {
    if (activeFieldId) {
      setFieldValues((prev) => ({ ...prev, [activeFieldId]: signatureData }));
    }
    setShowSignatureDialog(false);
    setActiveFieldId(null);
  };

  const handleSubmit = async () => {
    if (!recipient || !document || !token) return;

    // Check all required fields are filled
    const requiredFields = fields.filter((f) => f.required);
    const missingFields = requiredFields.filter((f) => !fieldValues[f.id]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please complete all required fields (${missingFields.length} remaining)`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/esign-sign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            documentId,
            token,
            fieldValues,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit signature");
      }

      setIsComplete(true);
      toast({ title: "Document Signed", description: "Thank you for signing!" });
    } catch (err) {
      console.error("Error submitting signature:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit signature. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle className="mb-2">Unable to Load Document</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="mb-2">Document Signed</CardTitle>
            <CardDescription className="space-y-2">
              <p>Thank you, {recipient?.name}! Your signature has been recorded.</p>
              <p>You will receive a copy of the completed document via email.</p>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPageFields = fields.filter((f) => f.page_number === currentPage);
  const completedCount = fields.filter((f) => fieldValues[f.id]).length;
  const requiredCount = fields.filter((f) => f.required).length;
  const activeField = fields.find((f) => f.id === activeFieldId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h1 className="font-semibold">{document?.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Signing as {recipient?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {completedCount} of {requiredCount} required fields
              </span>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Finish Signing"
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Instructions */}
      <div className="max-w-6xl mx-auto px-4 py-3 w-full">
        <Alert>
          <AlertDescription>
            Click on each highlighted field to fill in your information. Yellow fields are
            required.
          </AlertDescription>
        </Alert>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 max-w-6xl mx-auto px-4 pb-6 w-full">
        <div className="h-[calc(100vh-200px)]">
          <PDFDocumentViewer
            fileUrl={document?.signedFileUrl || ""}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onNumPagesChange={setNumPages}
            scale={scale}
            onScaleChange={setScale}
          >
            {currentPageFields.map((field) => (
              <SignableField
                key={field.id}
                field={field}
                value={fieldValues[field.id]}
                scale={scale}
                onClick={() => handleFieldClick(field)}
                onChange={(value) => handleFieldChange(field.id, value)}
              />
            ))}
          </PDFDocumentViewer>
        </div>
      </div>

      {/* Signature Dialog */}
      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        fieldType={activeField?.field_type === "initials" ? "initials" : "signature"}
        onComplete={handleSignatureComplete}
        recipientName={recipient?.name || ""}
      />
    </div>
  );
};

export default SignDocument;
