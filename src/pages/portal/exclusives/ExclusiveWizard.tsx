import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  ExclusiveDivision, 
  CreateExclusiveSubmission,
  ListingData,
  AdditionalDocument,
  ResidentialListingData,
  InvestmentSalesListingData,
  CommercialLeasingListingData,
  useCreateExclusiveSubmission,
  useUpdateExclusiveSubmission,
  useSubmitForReview,
} from "@/hooks/useExclusiveSubmissions";
import { AddressComponents } from "@/components/ui/AddressAutocomplete";

// Step Components
import { AddressStep } from "@/components/portal/exclusive-forms/AddressStep";
import { OwnerStep } from "@/components/portal/exclusive-forms/OwnerStep";
import { ResidentialSpecsStep } from "@/components/portal/exclusive-forms/ResidentialSpecsStep";
import { InvestmentSpecsStep } from "@/components/portal/exclusive-forms/InvestmentSpecsStep";
import { CommercialSpecsStep } from "@/components/portal/exclusive-forms/CommercialSpecsStep";
import { FinancialsStep } from "@/components/portal/exclusive-forms/FinancialsStep";
import { DocumentsStep } from "@/components/portal/exclusive-forms/DocumentsStep";
import { ReviewStep } from "@/components/portal/exclusive-forms/ReviewStep";

const STEPS = [
  { id: "address", label: "Property", required: true },
  { id: "owner", label: "Owner", required: true },
  { id: "specs", label: "Specs", required: false },
  { id: "financials", label: "Financials", required: false },
  { id: "documents", label: "Documents", required: true },
  { id: "review", label: "Review", required: true },
];

export interface WizardFormData {
  // Address
  property_address: string;
  unit_number?: string;
  addressComponents?: AddressComponents;
  
  // Owner
  owner_name: string;
  owner_email?: string;
  owner_phone?: string;
  owner_company?: string;
  
  // Division-specific
  listing_data: ListingData;
  
  // Documents
  exclusive_contract_url?: string;
  additional_documents: AdditionalDocument[];
  
  // Flags
  is_off_market?: boolean;
  is_pocket_listing?: boolean;
}

const initialFormData: WizardFormData = {
  property_address: "",
  owner_name: "",
  listing_data: {},
  additional_documents: [],
};

export default function ExclusiveWizard() {
  const navigate = useNavigate();
  const { division } = useParams<{ division: ExclusiveDivision }>();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>(initialFormData);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createMutation = useCreateExclusiveSubmission();
  const updateMutation = useUpdateExclusiveSubmission();
  const submitForReviewMutation = useSubmitForReview();

  // Validate division
  useEffect(() => {
    if (!division || !["residential", "investment-sales", "commercial-leasing"].includes(division)) {
      navigate("/portal/exclusives/new");
    }
  }, [division, navigate]);

  // Auto-save draft to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`exclusive-draft-${division}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData);
        setSubmissionId(parsed.submissionId);
        setCurrentStep(parsed.currentStep || 0);
      } catch {
        // Ignore parse errors
      }
    }
  }, [division]);

  useEffect(() => {
    if (formData.property_address || formData.owner_name) {
      localStorage.setItem(`exclusive-draft-${division}`, JSON.stringify({
        formData,
        submissionId,
        currentStep,
      }));
    }
  }, [formData, submissionId, currentStep, division]);

  const updateFormData = useCallback((updates: Partial<WizardFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleNext = async () => {
    // Create or update draft in database on first forward navigation
    if (currentStep === 1 && !submissionId && formData.property_address && formData.owner_name) {
      try {
        const result = await createMutation.mutateAsync({
          division: division as ExclusiveDivision,
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
        setSubmissionId(result.id);
      } catch (error) {
        console.error("Failed to create draft:", error);
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!submissionId) {
      toast({
        title: "Error",
        description: "No submission found. Please start again.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.exclusive_contract_url) {
      toast({
        title: "Missing Required Document",
        description: "Please upload the exclusive contract before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update with all final data
      await updateMutation.mutateAsync({
        id: submissionId,
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
        exclusive_contract_url: formData.exclusive_contract_url,
        additional_documents: formData.additional_documents,
        is_off_market: formData.is_off_market,
        is_pocket_listing: formData.is_pocket_listing,
      });

      // Submit for review
      await submitForReviewMutation.mutateAsync(submissionId);
      
      // Clear draft
      localStorage.removeItem(`exclusive-draft-${division}`);
      
      // Navigate to success/my exclusives
      navigate("/portal/my-exclusives", { 
        state: { submitted: true, address: formData.property_address } 
      });
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDivisionLabel = () => {
    switch (division) {
      case "residential": return "Residential";
      case "investment-sales": return "Investment Sales";
      case "commercial-leasing": return "Commercial Leasing";
      default: return "";
    }
  };

  const getSpecsComponent = () => {
    switch (division) {
      case "residential":
        return (
          <ResidentialSpecsStep
            data={formData.listing_data as ResidentialListingData}
            onChange={(data) => updateFormData({ listing_data: { ...formData.listing_data, ...data } })}
          />
        );
      case "investment-sales":
        return (
          <InvestmentSpecsStep
            data={formData.listing_data as InvestmentSalesListingData}
            onChange={(data) => updateFormData({ listing_data: { ...formData.listing_data, ...data } })}
          />
        );
      case "commercial-leasing":
        return (
          <CommercialSpecsStep
            data={formData.listing_data as CommercialLeasingListingData}
            onChange={(data) => updateFormData({ listing_data: { ...formData.listing_data, ...data } })}
          />
        );
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AddressStep
            address={formData.property_address}
            unitNumber={formData.unit_number}
            addressComponents={formData.addressComponents}
            onChange={updateFormData}
          />
        );
      case 1:
        return (
          <OwnerStep
            ownerName={formData.owner_name}
            ownerEmail={formData.owner_email}
            ownerPhone={formData.owner_phone}
            ownerCompany={formData.owner_company}
            division={division as ExclusiveDivision}
            onChange={updateFormData}
          />
        );
      case 2:
        return getSpecsComponent();
      case 3:
        return (
          <FinancialsStep
            division={division as ExclusiveDivision}
            data={formData.listing_data}
            onChange={(data) => updateFormData({ listing_data: { ...formData.listing_data, ...data } })}
          />
        );
      case 4:
        return (
          <DocumentsStep
            division={division as ExclusiveDivision}
            submissionId={submissionId}
            exclusiveContractUrl={formData.exclusive_contract_url}
            additionalDocuments={formData.additional_documents}
            onChange={updateFormData}
            onSubmissionCreated={setSubmissionId}
            formData={formData}
          />
        );
      case 5:
        return (
          <ReviewStep
            division={division as ExclusiveDivision}
            formData={formData}
            onEdit={(step) => setCurrentStep(step)}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!formData.property_address;
      case 1:
        return !!formData.owner_name;
      case 2:
      case 3:
        return true; // Optional steps
      case 4:
        return !!formData.exclusive_contract_url;
      case 5:
        return !!formData.exclusive_contract_url;
      default:
        return true;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-3xl py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/portal/exclusives/new")}
            className="mb-4 -ml-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Change Division
          </Button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {getDivisionLabel()} Exclusive
            </h1>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Step {currentStep + 1} of {STEPS.length}</span>
            <span className="text-muted-foreground">{STEPS[currentStep].label}</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index < currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={`text-xs font-medium transition-colors ${
                  index === currentStep 
                    ? "text-primary" 
                    : index < currentStep 
                      ? "text-muted-foreground hover:text-foreground cursor-pointer" 
                      : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[400px]"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="gap-2"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Submit for Review
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
