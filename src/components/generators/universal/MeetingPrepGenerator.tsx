import { useState } from "react";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface MeetingPrepGeneratorProps {
  onBack: () => void;
}

export const MeetingPrepGenerator = ({ onBack }: MeetingPrepGeneratorProps) => {
  const [formData, setFormData] = useState({
    meetingType: "",
    clientName: "",
    clientBackground: "",
    propertyAddress: "",
    objectives: "",
    concerns: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a senior real estate advisor preparing a meeting brief.

Create a comprehensive meeting preparation brief with:
- Meeting Type: ${data.meetingType}
- Client: ${data.clientName}
- Client Background: ${data.clientBackground}
- Property (if applicable): ${data.propertyAddress}
- Meeting Objectives: ${data.objectives}
- Known Concerns/Issues: ${data.concerns}

Generate:
1. MEETING AGENDA (suggested flow and timing)
2. KEY TALKING POINTS (3-5 main points to cover)
3. QUESTIONS TO ASK (important questions to gather information)
4. ANTICIPATED OBJECTIONS (with suggested responses)
5. MATERIALS TO PREPARE (documents, comps, etc.)
6. FOLLOW-UP ACTIONS (next steps after meeting)

Keep it actionable and concise.
`;

  const isFormValid = formData.meetingType && formData.clientName && formData.objectives;

  return (
    <GeneratorShell
      id="meeting-prep"
      title="Meeting Prep Brief"
      description="AI-generated meeting preparation and talking points"
      icon={Briefcase}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Meeting Brief"
      outputDescription="Your preparation guide"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Meeting Type *</Label>
          <Select value={formData.meetingType} onValueChange={(v) => setFormData({ ...formData, meetingType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select meeting type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="listing-presentation">Listing Presentation</SelectItem>
              <SelectItem value="buyer-consultation">Buyer Consultation</SelectItem>
              <SelectItem value="tenant-requirements">Tenant Requirements</SelectItem>
              <SelectItem value="property-tour">Property Tour</SelectItem>
              <SelectItem value="price-negotiation">Price Negotiation</SelectItem>
              <SelectItem value="lease-negotiation">Lease Negotiation</SelectItem>
              <SelectItem value="closing-prep">Closing Preparation</SelectItem>
              <SelectItem value="investor-pitch">Investor Pitch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Client Name *</Label>
          <Input
            placeholder="Client or company name"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Client Background</Label>
          <Textarea
            placeholder="What you know about the client, their business, preferences..."
            value={formData.clientBackground}
            onChange={(e) => setFormData({ ...formData, clientBackground: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Property Address</Label>
          <Input
            placeholder="If discussing a specific property"
            value={formData.propertyAddress}
            onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Meeting Objectives *</Label>
          <Textarea
            placeholder="What do you want to accomplish in this meeting?"
            value={formData.objectives}
            onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Known Concerns/Issues</Label>
          <Textarea
            placeholder="Any concerns or objections you anticipate?"
            value={formData.concerns}
            onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default MeetingPrepGenerator;
