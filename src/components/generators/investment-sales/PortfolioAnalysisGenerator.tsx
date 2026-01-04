import { useState } from "react";
import { Layers } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const PortfolioAnalysisGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({ portfolioData: "", ownerGoals: "", analysisType: "" });

  const promptBuilder = (data: Record<string, any>) => `
You are a portfolio strategist analyzing a real estate portfolio.

Portfolio Properties:
${data.portfolioData}

Owner Goals: ${data.ownerGoals}
Analysis Type: ${data.analysisType}

Provide a comprehensive portfolio analysis:
1. PORTFOLIO OVERVIEW (total value, units, NOI, avg cap rate)
2. DIVERSIFICATION ANALYSIS (by location, asset type, tenant mix)
3. PERFORMANCE METRICS (yield, growth, risk profile)
4. CONCENTRATION RISKS
5. OPTIMIZATION OPPORTUNITIES (buy, sell, hold recommendations)
6. STRATEGIC RECOMMENDATIONS

Be specific and actionable. Reference individual properties where relevant.
`;

  return (
    <GeneratorShell
      id="portfolio-analysis" title="Portfolio Analysis"
      description="Multi-property portfolio summaries and insights"
      icon={Layers} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!formData.portfolioData}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Portfolio Properties *</Label>
          <Textarea placeholder="List each property: address, type, value, NOI, acquisition date..."
            value={formData.portfolioData} onChange={(e) => setFormData({ ...formData, portfolioData: e.target.value })} rows={6} />
        </div>
        <div className="space-y-2">
          <Label>Owner Goals</Label>
          <Textarea placeholder="Growth, income, exit, tax planning..."
            value={formData.ownerGoals} onChange={(e) => setFormData({ ...formData, ownerGoals: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Analysis Focus</Label>
          <Input placeholder="Full review, disposition strategy, refinance analysis..."
            value={formData.analysisType} onChange={(e) => setFormData({ ...formData, analysisType: e.target.value })} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default PortfolioAnalysisGenerator;
