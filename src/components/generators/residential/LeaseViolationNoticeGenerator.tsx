import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const LeaseViolationNoticeGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    tenantName: "",
    propertyAddress: "",
    violationType: "",
    violationDate: "",
    violationDetails: "",
    leaseClause: "",
    remedyRequired: "",
    deadlineDays: "",
    landlordName: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Draft a professional lease violation notice.

Tenant: ${data.tenantName}
Property: ${data.propertyAddress}
Violation Type: ${data.violationType}
Date of Violation: ${data.violationDate}
Violation Details: ${data.violationDetails}
Lease Clause Referenced: ${data.leaseClause}
Remedy Required: ${data.remedyRequired}
Cure Period: ${data.deadlineDays} days
Landlord/Manager: ${data.landlordName}

Generate a professional, legally-minded violation notice that:
1. Clearly states this is a formal notice
2. Identifies the specific violation
3. References the applicable lease clause
4. Describes the violation in detail
5. States the required remedy
6. Provides the cure period deadline
7. Explains consequences of non-compliance
8. Maintains professional, non-threatening tone
9. Includes proper signature block

Note: This is a template - advise consulting with legal counsel for specific situations.`;

  const isFormValid = !!formData.tenantName && !!formData.propertyAddress && !!formData.violationType;

  return (
    <GeneratorShell
      id="lease-violation-notice"
      title="Lease Violation Notice"
      description="Draft professional lease violation notices with proper documentation."
      icon={AlertTriangle}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Violation Notice"
      outputDescription="Your formal notice document"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Tenant Name *</Label>
          <Input value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })} placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="456 Oak Street, Unit 2" />
        </div>
        <div className="space-y-2">
          <Label>Violation Type *</Label>
          <Select value={formData.violationType} onValueChange={(v) => setFormData({ ...formData, violationType: v })}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="noise">Noise Complaint</SelectItem>
              <SelectItem value="unauthorized-occupant">Unauthorized Occupant</SelectItem>
              <SelectItem value="pet-violation">Pet Violation</SelectItem>
              <SelectItem value="late-payment">Late Payment</SelectItem>
              <SelectItem value="property-damage">Property Damage</SelectItem>
              <SelectItem value="illegal-activity">Illegal Activity</SelectItem>
              <SelectItem value="lease-breach">Other Lease Breach</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date of Violation</Label>
          <Input type="date" value={formData.violationDate} onChange={(e) => setFormData({ ...formData, violationDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Violation Details</Label>
          <Textarea value={formData.violationDetails} onChange={(e) => setFormData({ ...formData, violationDetails: e.target.value })} placeholder="Describe the specific violation and circumstances..." />
        </div>
        <div className="space-y-2">
          <Label>Lease Clause Reference</Label>
          <Input value={formData.leaseClause} onChange={(e) => setFormData({ ...formData, leaseClause: e.target.value })} placeholder="Section 12, Paragraph B" />
        </div>
        <div className="space-y-2">
          <Label>Remedy Required</Label>
          <Textarea value={formData.remedyRequired} onChange={(e) => setFormData({ ...formData, remedyRequired: e.target.value })} placeholder="What the tenant must do to cure the violation..." />
        </div>
        <div className="space-y-2">
          <Label>Cure Period (Days)</Label>
          <Input value={formData.deadlineDays} onChange={(e) => setFormData({ ...formData, deadlineDays: e.target.value })} placeholder="10" />
        </div>
        <div className="space-y-2">
          <Label>Landlord/Manager Name</Label>
          <Input value={formData.landlordName} onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })} placeholder="Property Management Co." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default LeaseViolationNoticeGenerator;
