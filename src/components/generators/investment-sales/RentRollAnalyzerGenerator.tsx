import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const RentRollAnalyzerGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({ rentRollData: "", analysisGoals: "" });

  const promptBuilder = (data: Record<string, any>) => `
You are a real estate analyst reviewing a rent roll.

Rent Roll Data:
${data.rentRollData}

Analysis Goals: ${data.analysisGoals}

Provide:
1. SUMMARY STATISTICS (avg rent, occupancy, rent per SF if applicable)
2. LEASE EXPIRATION ANALYSIS (rollover risk)
3. RENT ANALYSIS (below/at/above market)
4. TENANT QUALITY ASSESSMENT
5. UPSIDE OPPORTUNITIES (mark-to-market, vacancy fill)
6. RISKS AND CONCERNS
7. RECOMMENDATIONS

Be specific and actionable. Reference specific units/tenants where relevant.
`;

  return (
    <GeneratorShell
      id="rent-roll-analyzer" title="Rent Roll Analyzer"
      description="Summarize and analyze rent rolls with AI insights"
      icon={FileSpreadsheet} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!formData.rentRollData}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Rent Roll Data *</Label>
          <Textarea placeholder="Paste rent roll data: Unit, Tenant, SF, Rent, Lease Start, Lease End..."
            value={formData.rentRollData} onChange={(e) => setFormData({ ...formData, rentRollData: e.target.value })} rows={8} />
        </div>
        <div className="space-y-2">
          <Label>Analysis Goals</Label>
          <Textarea placeholder="What specific insights are you looking for?"
            value={formData.analysisGoals} onChange={(e) => setFormData({ ...formData, analysisGoals: e.target.value })} rows={2} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default RentRollAnalyzerGenerator;
