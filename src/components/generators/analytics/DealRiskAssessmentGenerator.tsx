import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const DealRiskAssessmentGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    dealName: "",
    dealValue: "",
    currentStage: "",
    daysInStage: "",
    lastActivity: "",
    clientEngagement: "",
    competitionInfo: "",
    obstacles: "",
    stakeholders: "",
    timeline: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Assess the risk level of this deal and provide a rescue plan.

Deal Information:
- Deal: ${data.dealName}
- Value: $${data.dealValue}
- Current Stage: ${data.currentStage}
- Days in Current Stage: ${data.daysInStage}
- Last Activity: ${data.lastActivity}

Risk Indicators:
- Client Engagement Level: ${data.clientEngagement}
- Competition: ${data.competitionInfo}
- Known Obstacles: ${data.obstacles}
- Key Stakeholders: ${data.stakeholders}
- Timeline Pressure: ${data.timeline}

Generate a comprehensive risk assessment including:
1. Overall risk score (1-10) with justification
2. Red flags identified
3. Risk category (timeline, competition, engagement, financing, other)
4. Root cause analysis
5. Immediate actions (next 24-48 hours)
6. Short-term strategy (next 1-2 weeks)
7. Stakeholder engagement plan
8. Competitive response strategy
9. Objection handling scripts
10. Success probability with and without intervention
11. Decision point: fight or fold recommendation

Be direct and actionable - time may be critical.`;

  const isFormValid = !!formData.dealName && !!formData.currentStage;

  return (
    <GeneratorShell
      id="deal-risk-assessment"
      title="Deal Risk Assessment"
      description="Identify at-risk deals and get specific action plans to save them."
      icon={AlertCircle}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Risk Assessment"
      outputDescription="Your deal rescue plan"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Deal Name/Property *</Label>
          <Input value={formData.dealName} onChange={(e) => setFormData({ ...formData, dealName: e.target.value })} placeholder="123 Main Street Investment Sale" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Deal Value ($)</Label>
            <Input value={formData.dealValue} onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })} placeholder="2,500,000" />
          </div>
          <div className="space-y-2">
            <Label>Current Stage *</Label>
            <Select value={formData.currentStage} onValueChange={(v) => setFormData({ ...formData, currentStage: v })}>
              <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="prospecting">Prospecting</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal/Offer</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="due-diligence">Due Diligence</SelectItem>
                <SelectItem value="closing">Closing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Days in Current Stage</Label>
            <Input value={formData.daysInStage} onChange={(e) => setFormData({ ...formData, daysInStage: e.target.value })} placeholder="21" />
          </div>
          <div className="space-y-2">
            <Label>Last Activity Date</Label>
            <Input type="date" value={formData.lastActivity} onChange={(e) => setFormData({ ...formData, lastActivity: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Client Engagement Level</Label>
          <Select value={formData.clientEngagement} onValueChange={(v) => setFormData({ ...formData, clientEngagement: v })}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High - Responsive and engaged</SelectItem>
              <SelectItem value="medium">Medium - Some delays in response</SelectItem>
              <SelectItem value="low">Low - Hard to reach</SelectItem>
              <SelectItem value="gone-dark">Gone Dark - No response</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Competition</Label>
          <Textarea value={formData.competitionInfo} onChange={(e) => setFormData({ ...formData, competitionInfo: e.target.value })} placeholder="Other brokers involved, competing offers, etc..." />
        </div>
        <div className="space-y-2">
          <Label>Known Obstacles</Label>
          <Textarea value={formData.obstacles} onChange={(e) => setFormData({ ...formData, obstacles: e.target.value })} placeholder="Financing issues, inspection concerns, price gap..." />
        </div>
        <div className="space-y-2">
          <Label>Key Stakeholders</Label>
          <Textarea value={formData.stakeholders} onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })} placeholder="Decision makers, influencers, blockers..." />
        </div>
        <div className="space-y-2">
          <Label>Timeline Pressure</Label>
          <Textarea value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} placeholder="Deadlines, expiring terms, client urgency..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default DealRiskAssessmentGenerator;
