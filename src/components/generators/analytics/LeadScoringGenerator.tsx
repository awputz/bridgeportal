import { useState } from "react";
import { Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const LeadScoringGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    contactsList: "",
    engagementData: "",
    transactionHistory: "",
    recentActivity: "",
    marketFocus: "",
    timeframe: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Analyze and score these leads to help prioritize outreach.

Contacts to Analyze:
${data.contactsList}

Engagement Data:
${data.engagementData}

Transaction History:
${data.transactionHistory}

Recent Activity:
${data.recentActivity}

Market Focus: ${data.marketFocus}
Timeframe: ${data.timeframe}

Generate a lead scoring analysis that includes:
1. Lead scoring methodology explanation
2. Ranked list of contacts with scores (1-100)
3. Scoring breakdown for top 10 leads
4. "Hot leads" - ready to engage now
5. "Warm leads" - nurture for near-term
6. "Cold leads" - long-term cultivation
7. Recommended outreach strategy for each tier
8. Specific talking points for top 5 leads
9. Re-engagement suggestions for dormant contacts
10. Weekly priority call list

Provide specific, actionable recommendations for each high-priority contact.`;

  const isFormValid = !!formData.contactsList;

  return (
    <GeneratorShell
      id="lead-scoring"
      title="Lead Scoring Analysis"
      description="AI-powered prioritization of your contacts based on engagement and potential."
      icon={Target}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Lead Scores"
      outputDescription="Your prioritized contact list"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Contacts to Analyze *</Label>
          <Textarea 
            value={formData.contactsList} 
            onChange={(e) => setFormData({ ...formData, contactsList: e.target.value })} 
            placeholder="List contacts with key info...&#10;&#10;John Smith - Investor, last contact 2 weeks ago, looking for multifamily&#10;Jane Doe - First-time buyer, inquired about 3 listings..."
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Engagement Data</Label>
          <Textarea value={formData.engagementData} onChange={(e) => setFormData({ ...formData, engagementData: e.target.value })} placeholder="Email opens, website visits, property inquiries, showing requests..." />
        </div>
        <div className="space-y-2">
          <Label>Transaction History</Label>
          <Textarea value={formData.transactionHistory} onChange={(e) => setFormData({ ...formData, transactionHistory: e.target.value })} placeholder="Past deals with these contacts, if any..." />
        </div>
        <div className="space-y-2">
          <Label>Recent Activity</Label>
          <Textarea value={formData.recentActivity} onChange={(e) => setFormData({ ...formData, recentActivity: e.target.value })} placeholder="Recent interactions, calls, meetings, emails..." />
        </div>
        <div className="space-y-2">
          <Label>Your Market Focus</Label>
          <Input value={formData.marketFocus} onChange={(e) => setFormData({ ...formData, marketFocus: e.target.value })} placeholder="Investment sales, Brooklyn multifamily" />
        </div>
        <div className="space-y-2">
          <Label>Priority Timeframe</Label>
          <Input value={formData.timeframe} onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })} placeholder="Next 30 days, Q1, etc." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default LeadScoringGenerator;
