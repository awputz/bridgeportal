import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const PerformanceInsightsGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    ytdDeals: "",
    ytdVolume: "",
    avgDealSize: "",
    conversionRate: "",
    avgDaysToClose: "",
    leadSources: "",
    dealTypes: "",
    strengthAreas: "",
    improvementAreas: "",
    goals: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Provide AI coaching insights based on performance data.

Performance Metrics:
- YTD Deals Closed: ${data.ytdDeals}
- YTD Volume: $${data.ytdVolume}
- Average Deal Size: $${data.avgDealSize}
- Conversion Rate: ${data.conversionRate}%
- Average Days to Close: ${data.avgDaysToClose}

Business Mix:
- Lead Sources: ${data.leadSources}
- Deal Types: ${data.dealTypes}

Self-Assessment:
- Strength Areas: ${data.strengthAreas}
- Areas for Improvement: ${data.improvementAreas}
- Goals: ${data.goals}

Generate comprehensive performance coaching including:
1. Performance scorecard summary
2. Strengths to leverage
3. Opportunity areas with specific action steps
4. Deal size optimization strategies
5. Conversion rate improvement tactics
6. Time efficiency recommendations
7. Lead source ROI analysis
8. Specialization opportunities
9. Skill development priorities
10. 90-day performance improvement plan

Be specific, actionable, and encouraging - like a great sales coach.`;

  const isFormValid = !!formData.ytdDeals || !!formData.ytdVolume;

  return (
    <GeneratorShell
      id="performance-insights"
      title="Performance Insights"
      description="AI coaching based on your metrics and performance patterns."
      icon={TrendingUp}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Performance Coaching"
      outputDescription="Your personalized insights"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>YTD Deals Closed</Label>
            <Input value={formData.ytdDeals} onChange={(e) => setFormData({ ...formData, ytdDeals: e.target.value })} placeholder="12" />
          </div>
          <div className="space-y-2">
            <Label>YTD Volume ($)</Label>
            <Input value={formData.ytdVolume} onChange={(e) => setFormData({ ...formData, ytdVolume: e.target.value })} placeholder="8,500,000" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Avg Deal Size ($)</Label>
            <Input value={formData.avgDealSize} onChange={(e) => setFormData({ ...formData, avgDealSize: e.target.value })} placeholder="700,000" />
          </div>
          <div className="space-y-2">
            <Label>Conversion Rate (%)</Label>
            <Input value={formData.conversionRate} onChange={(e) => setFormData({ ...formData, conversionRate: e.target.value })} placeholder="25" />
          </div>
          <div className="space-y-2">
            <Label>Avg Days to Close</Label>
            <Input value={formData.avgDaysToClose} onChange={(e) => setFormData({ ...formData, avgDaysToClose: e.target.value })} placeholder="45" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Lead Sources Breakdown</Label>
          <Textarea value={formData.leadSources} onChange={(e) => setFormData({ ...formData, leadSources: e.target.value })} placeholder="Referrals: 40%, Cold outreach: 25%, Repeat clients: 20%, Marketing: 15%..." />
        </div>
        <div className="space-y-2">
          <Label>Deal Types</Label>
          <Textarea value={formData.dealTypes} onChange={(e) => setFormData({ ...formData, dealTypes: e.target.value })} placeholder="Investment sales: 60%, Leasing: 30%, Development: 10%..." />
        </div>
        <div className="space-y-2">
          <Label>Your Strengths</Label>
          <Textarea value={formData.strengthAreas} onChange={(e) => setFormData({ ...formData, strengthAreas: e.target.value })} placeholder="What you do well..." />
        </div>
        <div className="space-y-2">
          <Label>Areas to Improve</Label>
          <Textarea value={formData.improvementAreas} onChange={(e) => setFormData({ ...formData, improvementAreas: e.target.value })} placeholder="What you want to get better at..." />
        </div>
        <div className="space-y-2">
          <Label>Goals</Label>
          <Textarea value={formData.goals} onChange={(e) => setFormData({ ...formData, goals: e.target.value })} placeholder="Your short and long-term goals..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default PerformanceInsightsGenerator;
