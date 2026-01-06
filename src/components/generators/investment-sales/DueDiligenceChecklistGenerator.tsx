import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const DueDiligenceChecklistGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "", propertyType: "", dealSize: "", specialConsiderations: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a transaction manager creating a due diligence checklist.

Property: ${data.propertyAddress}
Type: ${data.propertyType}
Deal Size: ${data.dealSize}
Special Considerations: ${data.specialConsiderations}

Create a comprehensive due diligence checklist organized by category:
1. FINANCIAL DOCUMENTS (rent roll, T12, budgets, etc.)
2. LEGAL DOCUMENTS (title, surveys, leases, violations)
3. PHYSICAL INSPECTION (property condition, systems, environmental)
4. TENANT/LEASE REVIEW (estoppels, lease abstracts)
5. REGULATORY COMPLIANCE (C of O, violations, permits)
6. THIRD-PARTY REPORTS (appraisal, environmental, PCA)
7. INSURANCE & RISK
8. CLOSING REQUIREMENTS

For each item, include: document needed, who provides it, and priority level.
`;

  return (
    <GeneratorShell
      id="due-diligence-checklist" title="Due Diligence Checklist"
      description="Property-specific due diligence checklists"
      icon={ClipboardCheck} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.propertyAddress && formData.propertyType)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <AddressAutocomplete
            value={formData.propertyAddress}
            onChange={(v) => setFormData({ ...formData, propertyAddress: v })}
            onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress })}
            placeholder="Start typing an address..."
          />
        </div>
        <div className="space-y-2">
          <Label>Property Type *</Label>
          <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="multifamily">Multifamily</SelectItem>
              <SelectItem value="mixed-use">Mixed-Use</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="development-site">Development Site</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Deal Size</Label>
          <Input placeholder="$5,000,000" value={formData.dealSize}
            onChange={(e) => setFormData({ ...formData, dealSize: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Special Considerations</Label>
          <Textarea placeholder="1031 exchange, environmental concerns, tenant issues..."
            value={formData.specialConsiderations} onChange={(e) => setFormData({ ...formData, specialConsiderations: e.target.value })} rows={2} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default DueDiligenceChecklistGenerator;
