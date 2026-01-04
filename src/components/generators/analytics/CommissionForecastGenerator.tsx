import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const CommissionForecastGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    activePipeline: "",
    dealProbabilities: "",
    averageCommission: "",
    historicalCloseRate: "",
    ytdEarnings: "",
    annualGoal: "",
    forecastPeriod: "",
    seasonalFactors: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a commission forecast based on current pipeline and historical performance.

Pipeline Data:
${data.activePipeline}

Deal Probabilities:
${data.dealProbabilities}

Performance Metrics:
- Average Commission: $${data.averageCommission}
- Historical Close Rate: ${data.historicalCloseRate}%
- YTD Earnings: $${data.ytdEarnings}
- Annual Goal: $${data.annualGoal}

Forecast Period: ${data.forecastPeriod}
Seasonal Factors: ${data.seasonalFactors}

Generate a comprehensive commission forecast including:
1. Executive summary with projected earnings
2. Conservative, realistic, and optimistic scenarios
3. Month-by-month projection
4. Probability-weighted pipeline value
5. Gap analysis vs. annual goal
6. Required close rate to hit goal
7. Top deals most likely to close
8. Risk factors that could impact forecast
9. Actions to improve forecast
10. Confidence level assessment

Provide specific numbers and actionable insights.`;

  const isFormValid = !!formData.activePipeline && !!formData.annualGoal;

  return (
    <GeneratorShell
      id="commission-forecast"
      title="Commission Forecast"
      description="Project your earnings based on pipeline probability and historical data."
      icon={DollarSign}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Earnings Forecast"
      outputDescription="Your projected commission analysis"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Active Pipeline *</Label>
          <Textarea 
            value={formData.activePipeline} 
            onChange={(e) => setFormData({ ...formData, activePipeline: e.target.value })} 
            placeholder="List deals with values and expected close dates...&#10;&#10;123 Main St - $50K commission, closing Feb&#10;456 Oak Ave - $35K commission, closing March..."
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Deal Probabilities</Label>
          <Textarea value={formData.dealProbabilities} onChange={(e) => setFormData({ ...formData, dealProbabilities: e.target.value })} placeholder="Estimate close probability for each deal (%)..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Avg Commission per Deal</Label>
            <Input value={formData.averageCommission} onChange={(e) => setFormData({ ...formData, averageCommission: e.target.value })} placeholder="25,000" />
          </div>
          <div className="space-y-2">
            <Label>Historical Close Rate (%)</Label>
            <Input value={formData.historicalCloseRate} onChange={(e) => setFormData({ ...formData, historicalCloseRate: e.target.value })} placeholder="35" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>YTD Earnings</Label>
            <Input value={formData.ytdEarnings} onChange={(e) => setFormData({ ...formData, ytdEarnings: e.target.value })} placeholder="125,000" />
          </div>
          <div className="space-y-2">
            <Label>Annual Goal *</Label>
            <Input value={formData.annualGoal} onChange={(e) => setFormData({ ...formData, annualGoal: e.target.value })} placeholder="400,000" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Forecast Period</Label>
          <Select value={formData.forecastPeriod} onValueChange={(v) => setFormData({ ...formData, forecastPeriod: v })}>
            <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="q1">Q1</SelectItem>
              <SelectItem value="q2">Q2</SelectItem>
              <SelectItem value="q3">Q3</SelectItem>
              <SelectItem value="q4">Q4</SelectItem>
              <SelectItem value="6-months">Next 6 Months</SelectItem>
              <SelectItem value="12-months">Next 12 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Seasonal Factors</Label>
          <Textarea value={formData.seasonalFactors} onChange={(e) => setFormData({ ...formData, seasonalFactors: e.target.value })} placeholder="Market trends, holidays, typical slow/busy periods..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default CommissionForecastGenerator;
