import { useState } from "react";
import { PenTool } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const CompNarrativeGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    subjectProperty: "", comps: "", marketTrends: "", priceJustification: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an investment sales analyst writing a comparable sales narrative.

Subject Property: ${data.subjectProperty}
Comparable Sales: ${data.comps}
Market Trends: ${data.marketTrends}
Price Justification Notes: ${data.priceJustification}

Write a professional comp narrative that:
1. Introduces the subject property and its key metrics
2. Analyzes each comparable sale (address, price, $/unit, $/SF, cap rate)
3. Explains adjustments (location, condition, size, timing)
4. Draws conclusions about subject property value
5. Supports the pricing recommendation

Use professional investment sales language. Be analytical and objective.
`;

  return (
    <GeneratorShell
      id="comp-narrative" title="Comp Narrative"
      description="Generate market analysis narratives from comparable sales"
      icon={PenTool} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.subjectProperty && formData.comps)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Subject Property *</Label>
          <Textarea placeholder="Address, type, size, units, asking price..." value={formData.subjectProperty}
            onChange={(e) => setFormData({ ...formData, subjectProperty: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Comparable Sales *</Label>
          <Textarea placeholder="List comps with address, sale price, date, $/unit, cap rate..." value={formData.comps}
            onChange={(e) => setFormData({ ...formData, comps: e.target.value })} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>Market Trends</Label>
          <Input placeholder="Cap rate compression, strong absorption, etc." value={formData.marketTrends}
            onChange={(e) => setFormData({ ...formData, marketTrends: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Price Justification Notes</Label>
          <Textarea placeholder="Why the subject is priced where it is..." value={formData.priceJustification}
            onChange={(e) => setFormData({ ...formData, priceJustification: e.target.value })} rows={2} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default CompNarrativeGenerator;
