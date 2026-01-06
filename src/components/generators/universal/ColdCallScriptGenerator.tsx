import { useState } from "react";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface ColdCallScriptGeneratorProps {
  onBack: () => void;
}

export const ColdCallScriptGenerator = ({ onBack }: ColdCallScriptGeneratorProps) => {
  const [formData, setFormData] = useState({
    prospectType: "",
    prospectName: "",
    propertyAddress: "",
    reason: "",
    valueProposition: "",
    knownInfo: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a cold calling coach for real estate professionals.

Create a cold call script for:
- Prospect Type: ${data.prospectType}
- Prospect Name: ${data.prospectName}
- Property: ${data.propertyAddress}
- Reason for Call: ${data.reason}
- Value Proposition: ${data.valueProposition}
- Known Information: ${data.knownInfo}

Generate:
1. OPENING (get past the gatekeeper if needed, introduce yourself)
2. HOOK (why they should listen - 10 seconds max)
3. QUALIFYING QUESTIONS (understand their situation)
4. VALUE STATEMENT (what you can do for them)
5. OBJECTION RESPONSES (common pushbacks)
6. CLOSE (specific ask for next step)
7. VOICEMAIL SCRIPT (if they don't answer)

Keep it natural and conversational. Avoid sounding scripted or pushy.
`;

  const isFormValid = formData.prospectType && formData.reason;

  return (
    <GeneratorShell
      id="cold-call-script"
      title="Cold Call Script"
      description="Cold outreach scripts tailored to your prospect"
      icon={Phone}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Call Script"
      outputDescription="Complete script with objection handlers"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Prospect Type *</Label>
          <Select value={formData.prospectType} onValueChange={(v) => setFormData({ ...formData, prospectType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select prospect type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="property-owner">Property Owner</SelectItem>
              <SelectItem value="expired-listing">Expired Listing</SelectItem>
              <SelectItem value="fsbo">FSBO</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="business-owner">Business Owner (Tenant)</SelectItem>
              <SelectItem value="landlord">Landlord</SelectItem>
              <SelectItem value="referral-lead">Referral Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Prospect Name</Label>
          <Input
            placeholder="Name of person you're calling"
            value={formData.prospectName}
            onChange={(e) => setFormData({ ...formData, prospectName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Property Address</Label>
          <AddressAutocomplete
            value={formData.propertyAddress}
            onChange={(v) => setFormData({ ...formData, propertyAddress: v })}
            onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress })}
            placeholder="If calling about a specific property"
          />
        </div>

        <div className="space-y-2">
          <Label>Reason for Call *</Label>
          <Textarea
            placeholder="Why are you reaching out? What's the opportunity?"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Your Value Proposition</Label>
          <Textarea
            placeholder="What unique value can you offer this prospect?"
            value={formData.valueProposition}
            onChange={(e) => setFormData({ ...formData, valueProposition: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Known Information</Label>
          <Textarea
            placeholder="What do you know about this prospect? (ownership history, recent activity, etc.)"
            value={formData.knownInfo}
            onChange={(e) => setFormData({ ...formData, knownInfo: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default ColdCallScriptGenerator;
