import { useState } from "react";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const WeeklyActivityDigestGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    weekEnding: "",
    callsMade: "",
    emailsSent: "",
    showingsConducted: "",
    meetingsHeld: "",
    proposalsSent: "",
    dealsAdvanced: "",
    newLeads: "",
    notableWins: "",
    challenges: "",
    nextWeekFocus: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a weekly activity digest with insights and recommendations.

Week Ending: ${data.weekEnding}

Activity Metrics:
- Calls Made: ${data.callsMade}
- Emails Sent: ${data.emailsSent}
- Showings Conducted: ${data.showingsConducted}
- Meetings Held: ${data.meetingsHeld}
- Proposals Sent: ${data.proposalsSent}
- Deals Advanced: ${data.dealsAdvanced}
- New Leads: ${data.newLeads}

Highlights:
- Notable Wins: ${data.notableWins}
- Challenges: ${data.challenges}

Next Week Focus: ${data.nextWeekFocus}

Generate a comprehensive weekly digest including:
1. Week at a glance summary
2. Activity scorecard vs. targets
3. Conversion analysis (calls to meetings, showings to offers, etc.)
4. Top accomplishments
5. Challenges and how to address them
6. Pipeline movement summary
7. Time allocation analysis
8. Productivity patterns identified
9. Specific recommendations for improvement
10. Priority actions for next week

Provide constructive, actionable insights - be a helpful coach.`;

  const isFormValid = !!formData.weekEnding && (!!formData.callsMade || !!formData.emailsSent || !!formData.showingsConducted);

  return (
    <GeneratorShell
      id="weekly-activity-digest"
      title="Weekly Activity Digest"
      description="Summarize your weekly activities and identify patterns for improvement."
      icon={Calendar}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Weekly Digest"
      outputDescription="Your activity summary and insights"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Week Ending *</Label>
          <Input type="date" value={formData.weekEnding} onChange={(e) => setFormData({ ...formData, weekEnding: e.target.value })} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Calls Made</Label>
            <Input value={formData.callsMade} onChange={(e) => setFormData({ ...formData, callsMade: e.target.value })} placeholder="45" />
          </div>
          <div className="space-y-2">
            <Label>Emails Sent</Label>
            <Input value={formData.emailsSent} onChange={(e) => setFormData({ ...formData, emailsSent: e.target.value })} placeholder="120" />
          </div>
          <div className="space-y-2">
            <Label>Showings</Label>
            <Input value={formData.showingsConducted} onChange={(e) => setFormData({ ...formData, showingsConducted: e.target.value })} placeholder="8" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Meetings</Label>
            <Input value={formData.meetingsHeld} onChange={(e) => setFormData({ ...formData, meetingsHeld: e.target.value })} placeholder="12" />
          </div>
          <div className="space-y-2">
            <Label>Proposals Sent</Label>
            <Input value={formData.proposalsSent} onChange={(e) => setFormData({ ...formData, proposalsSent: e.target.value })} placeholder="3" />
          </div>
          <div className="space-y-2">
            <Label>New Leads</Label>
            <Input value={formData.newLeads} onChange={(e) => setFormData({ ...formData, newLeads: e.target.value })} placeholder="15" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Deals Advanced This Week</Label>
          <Textarea value={formData.dealsAdvanced} onChange={(e) => setFormData({ ...formData, dealsAdvanced: e.target.value })} placeholder="Which deals moved forward and to what stage..." />
        </div>
        <div className="space-y-2">
          <Label>Notable Wins</Label>
          <Textarea value={formData.notableWins} onChange={(e) => setFormData({ ...formData, notableWins: e.target.value })} placeholder="Closed deals, signed listings, key meetings secured..." />
        </div>
        <div className="space-y-2">
          <Label>Challenges Faced</Label>
          <Textarea value={formData.challenges} onChange={(e) => setFormData({ ...formData, challenges: e.target.value })} placeholder="What didn't go well or needs attention..." />
        </div>
        <div className="space-y-2">
          <Label>Next Week Focus</Label>
          <Textarea value={formData.nextWeekFocus} onChange={(e) => setFormData({ ...formData, nextWeekFocus: e.target.value })} placeholder="What you want to accomplish next week..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default WeeklyActivityDigestGenerator;
