import { useState } from "react";
import { Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const PipelineHealthGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    totalDeals: "",
    dealsByStage: "",
    totalPipelineValue: "",
    averageDealSize: "",
    dealsAtRisk: "",
    staleDeals: "",
    recentWins: "",
    recentLosses: "",
    focusAreas: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Analyze this sales pipeline and provide actionable insights.

Pipeline Overview:
- Total Active Deals: ${data.totalDeals}
- Deals by Stage: ${data.dealsByStage}
- Total Pipeline Value: $${data.totalPipelineValue}
- Average Deal Size: $${data.averageDealSize}

Health Indicators:
- Deals at Risk: ${data.dealsAtRisk}
- Stale Deals (no activity 14+ days): ${data.staleDeals}
- Recent Wins: ${data.recentWins}
- Recent Losses: ${data.recentLosses}

Agent Focus Areas: ${data.focusAreas}

Generate a comprehensive pipeline health report including:
1. Executive Summary - overall pipeline health score
2. Stage distribution analysis (is the funnel balanced?)
3. Velocity analysis (deal movement patterns)
4. Risk assessment for at-risk deals
5. Stale deal recommendations
6. Win/loss pattern insights
7. Priority actions for this week
8. 30-day pipeline forecast
9. Specific deals to focus on

Provide actionable, specific recommendations - not generic advice.`;

  const isFormValid = !!formData.totalDeals && !!formData.totalPipelineValue;

  return (
    <GeneratorShell
      id="pipeline-health"
      title="Pipeline Health Report"
      description="AI analysis of your deal pipeline with actionable recommendations."
      icon={Activity}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Pipeline Analysis"
      outputDescription="Your pipeline health insights"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Active Deals *</Label>
            <Input value={formData.totalDeals} onChange={(e) => setFormData({ ...formData, totalDeals: e.target.value })} placeholder="24" />
          </div>
          <div className="space-y-2">
            <Label>Total Pipeline Value *</Label>
            <Input value={formData.totalPipelineValue} onChange={(e) => setFormData({ ...formData, totalPipelineValue: e.target.value })} placeholder="2,500,000" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Deals by Stage</Label>
          <Textarea value={formData.dealsByStage} onChange={(e) => setFormData({ ...formData, dealsByStage: e.target.value })} placeholder="Prospecting: 8, Qualified: 6, Proposal: 5, Negotiation: 3, Closing: 2" />
        </div>
        <div className="space-y-2">
          <Label>Average Deal Size</Label>
          <Input value={formData.averageDealSize} onChange={(e) => setFormData({ ...formData, averageDealSize: e.target.value })} placeholder="45,000" />
        </div>
        <div className="space-y-2">
          <Label>Deals at Risk</Label>
          <Textarea value={formData.dealsAtRisk} onChange={(e) => setFormData({ ...formData, dealsAtRisk: e.target.value })} placeholder="List deals with concerns and why..." />
        </div>
        <div className="space-y-2">
          <Label>Stale Deals (14+ days no activity)</Label>
          <Textarea value={formData.staleDeals} onChange={(e) => setFormData({ ...formData, staleDeals: e.target.value })} placeholder="Deal names and last activity dates..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Recent Wins (last 30 days)</Label>
            <Input value={formData.recentWins} onChange={(e) => setFormData({ ...formData, recentWins: e.target.value })} placeholder="3 deals, $150K" />
          </div>
          <div className="space-y-2">
            <Label>Recent Losses</Label>
            <Input value={formData.recentLosses} onChange={(e) => setFormData({ ...formData, recentLosses: e.target.value })} placeholder="2 deals, $80K" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Your Focus Areas</Label>
          <Textarea value={formData.focusAreas} onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })} placeholder="What are you trying to improve?" />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default PipelineHealthGenerator;
