import { useState } from "react";
import { Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const OpenHouseFollowUpGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    visitorName: "",
    propertyAddress: "",
    openHouseDate: "",
    interestLevel: "",
    specificInterests: "",
    concerns: "",
    agentName: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Write a personalized open house follow-up email.

Visitor: ${data.visitorName}
Property: ${data.propertyAddress}
Open House Date: ${data.openHouseDate}
Interest Level: ${data.interestLevel}
What They Liked: ${data.specificInterests}
Concerns Mentioned: ${data.concerns}
Agent Name: ${data.agentName}

Generate a warm, professional follow-up email that:
1. Thanks them for attending
2. References specific things they showed interest in
3. Addresses any concerns they mentioned
4. Provides next steps based on their interest level
5. Includes a soft call-to-action
6. Feels personal, not templated

Keep the tone friendly and helpful, not pushy.`;

  const isFormValid = !!formData.visitorName && !!formData.propertyAddress;

  return (
    <GeneratorShell
      id="open-house-follow-up"
      title="Open House Follow-Up"
      description="Generate personalized follow-up emails for open house attendees."
      icon={Home}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Follow-Up Email"
      outputDescription="Your personalized follow-up message"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Visitor Name *</Label>
          <Input value={formData.visitorName} onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })} placeholder="Sarah Johnson" />
        </div>
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="123 Main Street, Apt 4B" />
        </div>
        <div className="space-y-2">
          <Label>Open House Date</Label>
          <Input type="date" value={formData.openHouseDate} onChange={(e) => setFormData({ ...formData, openHouseDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Interest Level</Label>
          <Select value={formData.interestLevel} onValueChange={(v) => setFormData({ ...formData, interestLevel: v })}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="very-interested">Very Interested - Ready to make offer</SelectItem>
              <SelectItem value="interested">Interested - Wants second showing</SelectItem>
              <SelectItem value="considering">Considering - Still looking</SelectItem>
              <SelectItem value="just-looking">Just Looking - Early stage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>What They Liked</Label>
          <Textarea value={formData.specificInterests} onChange={(e) => setFormData({ ...formData, specificInterests: e.target.value })} placeholder="Natural light, kitchen renovation, closet space..." />
        </div>
        <div className="space-y-2">
          <Label>Concerns Mentioned</Label>
          <Textarea value={formData.concerns} onChange={(e) => setFormData({ ...formData, concerns: e.target.value })} placeholder="Price, maintenance fees, street noise..." />
        </div>
        <div className="space-y-2">
          <Label>Your Name</Label>
          <Input value={formData.agentName} onChange={(e) => setFormData({ ...formData, agentName: e.target.value })} placeholder="Your name" />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default OpenHouseFollowUpGenerator;
