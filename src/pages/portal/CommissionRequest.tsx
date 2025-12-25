import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Upload, FileText, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateCommissionRequest, uploadCommissionDocument } from "@/hooks/useCommissionRequests";
import { supabase } from "@/integrations/supabase/client";

const CommissionRequest = () => {
  const navigate = useNavigate();
  const createRequest = useCreateCommissionRequest();
  
  const [formData, setFormData] = useState({
    closing_date: "",
    deal_type: "sale" as "sale" | "lease",
    property_address: "",
    commission_amount: "",
    notes: "",
  });

  const [files, setFiles] = useState<{
    invoice: File | null;
    w9: File | null;
    contract: File | null;
  }>({
    invoice: null,
    w9: null,
    contract: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (type: "invoice" | "w9" | "contract", file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a temporary ID for file uploads
      const tempId = crypto.randomUUID();

      // Upload files first
      let invoice_url: string | null = null;
      let w9_url: string | null = null;
      let contract_url: string | null = null;

      if (files.invoice) {
        invoice_url = await uploadCommissionDocument(files.invoice, tempId, "invoice");
      }
      if (files.w9) {
        w9_url = await uploadCommissionDocument(files.w9, tempId, "w9");
      }
      if (files.contract) {
        contract_url = await uploadCommissionDocument(files.contract, tempId, "contract");
      }

      // Create the request
      await createRequest.mutateAsync({
        closing_date: formData.closing_date,
        deal_type: formData.deal_type,
        property_address: formData.property_address,
        commission_amount: parseFloat(formData.commission_amount),
        notes: formData.notes || null,
        invoice_url,
        w9_url,
        contract_url,
      });

      navigate("/portal/my-commission-requests");
    } catch (error) {
      console.error("Error submitting commission request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadField = ({
    label,
    type,
    file,
    required = false,
  }: {
    label: string;
    type: "invoice" | "w9" | "contract";
    file: File | null;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="text-foreground/80">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <div className="relative">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={required}
        />
        <div className={`flex items-center gap-3 p-4 border border-dashed rounded-lg ${file ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/20 bg-white/5"} hover:border-white/30 transition-colors`}>
          {file ? (
            <>
              <Check className="h-5 w-5 text-emerald-400" />
              <span className="text-sm text-foreground/80 truncate flex-1">{file.name}</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click or drag to upload PDF</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Navigation */}
        <Link
          to="/portal/tools"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-light">Back to Tools</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-light">Commission Request</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extralight text-foreground mb-4">
            Submit Payment Request
          </h1>
          <p className="text-muted-foreground font-light">
            Request commission payment for a recently closed deal.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-light">Deal Information</CardTitle>
              <CardDescription>Enter details about the closed transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Deal Type */}
              <div className="space-y-3">
                <Label className="text-foreground/80">Deal Type *</Label>
                <RadioGroup
                  value={formData.deal_type}
                  onValueChange={(value: "sale" | "lease") =>
                    setFormData((prev) => ({ ...prev, deal_type: value }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sale" id="sale" />
                    <Label htmlFor="sale" className="font-light cursor-pointer">Sale</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lease" id="lease" />
                    <Label htmlFor="lease" className="font-light cursor-pointer">Lease</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Property Address */}
              <div className="space-y-2">
                <Label htmlFor="property_address" className="text-foreground/80">Property Address *</Label>
                <Input
                  id="property_address"
                  value={formData.property_address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, property_address: e.target.value }))}
                  placeholder="123 Main Street, New York, NY"
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>

              {/* Closing Date */}
              <div className="space-y-2">
                <Label htmlFor="closing_date" className="text-foreground/80">Closing Date *</Label>
                <Input
                  id="closing_date"
                  type="date"
                  value={formData.closing_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, closing_date: e.target.value }))}
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>

              {/* Commission Amount */}
              <div className="space-y-2">
                <Label htmlFor="commission_amount" className="text-foreground/80">Commission Amount ($) *</Label>
                <Input
                  id="commission_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.commission_amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, commission_amount: e.target.value }))}
                  placeholder="25,000.00"
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground/80">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional details about this transaction..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="glass-card border-white/10 mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-light flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Required Documents
              </CardTitle>
              <CardDescription>Upload supporting documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploadField
                label="Invoice"
                type="invoice"
                file={files.invoice}
                required
              />
              <FileUploadField
                label="W9 Form"
                type="w9"
                file={files.w9}
                required
              />
              <FileUploadField
                label="Contract of Sale/Lease"
                type="contract"
                file={files.contract}
                required
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/portal/tools")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionRequest;
