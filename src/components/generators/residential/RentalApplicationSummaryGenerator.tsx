import { useState } from "react";
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const RentalApplicationSummaryGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    applicantName: "",
    propertyAddress: "",
    requestedRent: "",
    annualIncome: "",
    employer: "",
    creditScore: "",
    rentalHistory: "",
    references: "",
    guarantor: "",
    moveInDate: "",
    additionalNotes: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a professional rental application summary for landlord review.

Applicant: ${data.applicantName}
Property: ${data.propertyAddress}
Requested Rent: $${data.requestedRent}/month
Annual Income: $${data.annualIncome}
Employer: ${data.employer}
Credit Score Range: ${data.creditScore}
Rental History: ${data.rentalHistory}
References: ${data.references}
Guarantor: ${data.guarantor}
Requested Move-In: ${data.moveInDate}
Additional Notes: ${data.additionalNotes}

Generate a concise, professional application summary including:
1. Applicant overview
2. Financial qualification analysis (income-to-rent ratio)
3. Employment verification summary
4. Rental history highlights
5. Credit assessment
6. Guarantor information (if applicable)
7. Overall recommendation with any flags or concerns
8. Suggested next steps

Be objective and highlight both strengths and potential concerns.`;

  const isFormValid = !!formData.applicantName && !!formData.propertyAddress && !!formData.annualIncome;

  return (
    <GeneratorShell
      id="rental-application-summary"
      title="Rental Application Summary"
      description="Summarize tenant applications for landlord review."
      icon={FileText}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Application Summary"
      outputDescription="Your professional application review"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Applicant Name *</Label>
          <Input value={formData.applicantName} onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })} placeholder="John Smith" />
        </div>
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="456 Oak Street, Unit 2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Monthly Rent</Label>
            <Input value={formData.requestedRent} onChange={(e) => setFormData({ ...formData, requestedRent: e.target.value })} placeholder="3,500" />
          </div>
          <div className="space-y-2">
            <Label>Annual Income *</Label>
            <Input value={formData.annualIncome} onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })} placeholder="150,000" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Employer</Label>
          <Input value={formData.employer} onChange={(e) => setFormData({ ...formData, employer: e.target.value })} placeholder="Company Name, Position" />
        </div>
        <div className="space-y-2">
          <Label>Credit Score Range</Label>
          <Select value={formData.creditScore} onValueChange={(v) => setFormData({ ...formData, creditScore: v })}>
            <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent (750+)</SelectItem>
              <SelectItem value="good">Good (700-749)</SelectItem>
              <SelectItem value="fair">Fair (650-699)</SelectItem>
              <SelectItem value="poor">Poor (Below 650)</SelectItem>
              <SelectItem value="no-credit">No Credit History</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Rental History</Label>
          <Textarea value={formData.rentalHistory} onChange={(e) => setFormData({ ...formData, rentalHistory: e.target.value })} placeholder="Previous addresses, length of tenancy, landlord feedback..." />
        </div>
        <div className="space-y-2">
          <Label>References</Label>
          <Textarea value={formData.references} onChange={(e) => setFormData({ ...formData, references: e.target.value })} placeholder="Personal and professional references..." />
        </div>
        <div className="space-y-2">
          <Label>Guarantor (if applicable)</Label>
          <Input value={formData.guarantor} onChange={(e) => setFormData({ ...formData, guarantor: e.target.value })} placeholder="Guarantor name and relationship" />
        </div>
        <div className="space-y-2">
          <Label>Requested Move-In Date</Label>
          <Input type="date" value={formData.moveInDate} onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea value={formData.additionalNotes} onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })} placeholder="Pets, special requests, red flags..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default RentalApplicationSummaryGenerator;
