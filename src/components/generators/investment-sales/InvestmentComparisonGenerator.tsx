import { useState } from "react";
import { Scale } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const InvestmentComparisonGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({ properties: "", investorGoals: "" });

  const promptBuilder = (data: Record<string, any>) => `
You are an investment advisor comparing multiple properties.

Properties to Compare:
${data.properties}

Investor Goals: ${data.investorGoals}

Create a comprehensive comparison including:
1. PROPERTY SUMMARY TABLE (side-by-side metrics)
2. FINANCIAL COMPARISON (price, cap rate, NOI, $/unit, $/SF)
3. RISK ASSESSMENT (each property's risk factors)
4. UPSIDE POTENTIAL (value-add opportunities for each)
5. LOCATION ANALYSIS (market dynamics, demographics)
6. RECOMMENDATION (ranked with rationale)

Be objective and highlight trade-offs between each option.
`;

  return (
    <GeneratorShell
      id="investment-comparison" title="Investment Comparison"
      description="Compare multiple investment properties side-by-side"
      icon={Scale} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!formData.properties}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Properties to Compare *</Label>
          <Textarea placeholder="List each property with key details: address, price, units, NOI, cap rate..."
            value={formData.properties} onChange={(e) => setFormData({ ...formData, properties: e.target.value })} rows={6} />
        </div>
        <div className="space-y-2">
          <Label>Investor Goals</Label>
          <Textarea placeholder="What is the investor prioritizing? Cash flow, appreciation, value-add..."
            value={formData.investorGoals} onChange={(e) => setFormData({ ...formData, investorGoals: e.target.value })} rows={2} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default InvestmentComparisonGenerator;
