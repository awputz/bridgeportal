import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const CapRateJustificationGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "", askingCapRate: "", marketCapRates: "", propertyStrengths: "", potentialConcerns: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are explaining pricing to a property seller.

Property: ${data.propertyAddress}
Asking Cap Rate: ${data.askingCapRate}
Market Cap Rates: ${data.marketCapRates}
Property Strengths: ${data.propertyStrengths}
Potential Concerns: ${data.potentialConcerns}

Write a cap rate justification that:
1. Explains what cap rates mean in simple terms
2. Shows where this property fits in the market
3. Justifies the pricing with specific factors
4. Addresses any concerns that might affect pricing
5. Provides context on buyer expectations
6. Recommends pricing strategy

Be educational but persuasive. Help the seller understand market reality.
`;

  return (
    <GeneratorShell
      id="cap-rate-justification" title="Cap Rate Justification"
      description="Explain and justify pricing to sellers"
      icon={DollarSign} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.propertyAddress && formData.askingCapRate)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Asking Cap Rate *</Label>
          <Input placeholder="5.0%" value={formData.askingCapRate}
            onChange={(e) => setFormData({ ...formData, askingCapRate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Market Cap Rates</Label>
          <Input placeholder="Similar properties trading at 4.5% - 5.5%"
            value={formData.marketCapRates} onChange={(e) => setFormData({ ...formData, marketCapRates: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Property Strengths</Label>
          <Textarea placeholder="Location, condition, tenant quality, upside..."
            value={formData.propertyStrengths} onChange={(e) => setFormData({ ...formData, propertyStrengths: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Potential Concerns</Label>
          <Textarea placeholder="Issues that might affect pricing..."
            value={formData.potentialConcerns} onChange={(e) => setFormData({ ...formData, potentialConcerns: e.target.value })} rows={2} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default CapRateJustificationGenerator;
