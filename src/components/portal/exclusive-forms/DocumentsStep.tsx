import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FileText, Upload, X, Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  ExclusiveDivision, 
  AdditionalDocument,
  uploadExclusiveDocument,
  useCreateExclusiveSubmission,
} from "@/hooks/useExclusiveSubmissions";
import { WizardFormData } from "@/pages/portal/exclusives/ExclusiveWizard";
import { cn } from "@/lib/utils";

interface DocumentsStepProps {
  division: ExclusiveDivision;
  submissionId: string | null;
  exclusiveContractUrl?: string;
  additionalDocuments: AdditionalDocument[];
  formData: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  onSubmissionCreated: (id: string) => void;
}

export function DocumentsStep({ 
  division, 
  submissionId,
  exclusiveContractUrl,
  additionalDocuments,
  formData,
  onChange,
  onSubmissionCreated,
}: DocumentsStepProps) {
  const [isUploadingContract, setIsUploadingContract] = useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  
  const createMutation = useCreateExclusiveSubmission();

  const getDocumentLabels = () => {
    switch (division) {
      case "residential":
        return {
          contract: "Exclusive Agreement",
          additional: ["Floor Plans", "Photos", "Lease Agreement"],
        };
      case "investment-sales":
        return {
          contract: "Executed Exclusive",
          additional: ["Certified Rent Roll", "Offering Memorandum (OM)", "Financial Statements"],
        };
      case "commercial-leasing":
        return {
          contract: "Commercial Exclusive Contract",
          additional: ["Site Plan / CAD", "Photos", "Lease Abstract"],
        };
      default:
        return { contract: "Exclusive Contract", additional: [] };
    }
  };

  const labels = getDocumentLabels();

  // Ensure we have a submission ID before uploading
  const ensureSubmissionId = async (): Promise<string> => {
    if (submissionId) return submissionId;
    
    // Create a draft submission
    const result = await createMutation.mutateAsync({
      division,
      property_address: formData.property_address,
      unit_number: formData.unit_number,
      neighborhood: formData.addressComponents?.neighborhood,
      borough: formData.addressComponents?.borough,
      city: formData.addressComponents?.city,
      state: formData.addressComponents?.state,
      zip_code: formData.addressComponents?.zipCode,
      latitude: formData.addressComponents?.latitude,
      longitude: formData.addressComponents?.longitude,
      owner_name: formData.owner_name,
      owner_email: formData.owner_email,
      owner_phone: formData.owner_phone,
      owner_company: formData.owner_company,
      listing_data: formData.listing_data,
      status: "draft",
    });
    
    onSubmissionCreated(result.id);
    return result.id;
  };

  const handleContractUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF
    if (!file.type.includes("pdf")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file for the exclusive contract.",
        variant: "destructive",
      });
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingContract(true);
    try {
      const id = await ensureSubmissionId();
      const path = await uploadExclusiveDocument(file, id, "contract");
      onChange({ exclusive_contract_url: path });
      toast({
        title: "Contract Uploaded",
        description: "Exclusive contract has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload the contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingContract(false);
      e.target.value = "";
    }
  }, [formData, onChange, onSubmissionCreated, submissionId]);

  const handleAdditionalUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate total size
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      toast({
        title: "Files Too Large",
        description: "Total file size cannot exceed 50MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAdditional(true);
    try {
      const id = await ensureSubmissionId();
      const newDocs: AdditionalDocument[] = [];
      
      for (const file of files) {
        const path = await uploadExclusiveDocument(file, id, "additional");
        newDocs.push({
          name: file.name,
          url: path,
          type: file.type,
          uploaded_at: new Date().toISOString(),
        });
      }
      
      onChange({ 
        additional_documents: [...additionalDocuments, ...newDocs] 
      });
      
      toast({
        title: "Files Uploaded",
        description: `${newDocs.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAdditional(false);
      e.target.value = "";
    }
  }, [additionalDocuments, formData, onChange, onSubmissionCreated, submissionId]);

  const removeAdditionalDocument = (index: number) => {
    const updated = additionalDocuments.filter((_, i) => i !== index);
    onChange({ additional_documents: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Documents
        </h2>
        <p className="text-muted-foreground mt-1">
          Upload the required documents for your exclusive
        </p>
      </div>

      {/* Required Contract */}
      <Card className={cn(
        "border-2",
        exclusiveContractUrl ? "border-green-500/50 bg-green-500/5" : "border-destructive/50"
      )}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {labels.contract}
            <span className="text-destructive text-sm font-normal">* Required</span>
          </CardTitle>
          <CardDescription>
            Upload the signed exclusive contract (PDF only, max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exclusiveContractUrl ? (
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Contract uploaded</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange({ exclusive_contract_url: undefined })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Input
                id="contract"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleContractUpload}
                disabled={isUploadingContract}
                className="hidden"
              />
              <Label
                htmlFor="contract"
                className={cn(
                  "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  "hover:border-primary hover:bg-primary/5",
                  isUploadingContract && "opacity-50 cursor-not-allowed"
                )}
              >
                {isUploadingContract ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Click to upload PDF</span>
                    <span className="text-xs text-muted-foreground mt-1">or drag and drop</span>
                  </>
                )}
              </Label>
            </div>
          )}
          
          {!exclusiveContractUrl && (
            <div className="flex items-center gap-2 mt-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>You must upload the exclusive contract before submitting</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Documents</CardTitle>
          <CardDescription>
            Optional: Upload {labels.additional.join(", ")} or other supporting documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {additionalDocuments.length > 0 && (
            <div className="space-y-2">
              {additionalDocuments.map((doc, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalDocument(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <Input
              id="additional"
              type="file"
              multiple
              onChange={handleAdditionalUpload}
              disabled={isUploadingAdditional}
              className="hidden"
            />
            <Label
              htmlFor="additional"
              className={cn(
                "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                "hover:border-primary hover:bg-primary/5",
                isUploadingAdditional && "opacity-50 cursor-not-allowed"
              )}
            >
              {isUploadingAdditional ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Upload additional files</span>
                </>
              )}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Visibility Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visibility Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="off_market" className="text-base">Off-Market Listing</Label>
              <p className="text-sm text-muted-foreground">
                Keep this listing private (not publicly advertised)
              </p>
            </div>
            <Switch
              id="off_market"
              checked={formData.is_off_market ?? false}
              onCheckedChange={(checked) => onChange({ is_off_market: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pocket" className="text-base">Pocket Listing</Label>
              <p className="text-sm text-muted-foreground">
                Share only within our brokerage network
              </p>
            </div>
            <Switch
              id="pocket"
              checked={formData.is_pocket_listing ?? false}
              onCheckedChange={(checked) => onChange({ is_pocket_listing: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
