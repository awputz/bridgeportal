import { useState } from "react";
import { Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const LinkedInDealPostGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    dealType: "",
    propertyType: "",
    address: "",
    dealValue: "",
    clientRole: "",
    achievement: "",
    lessonsLearned: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create a professional LinkedIn post announcing a closed deal:

DEAL TYPE: ${data.dealType}
PROPERTY TYPE: ${data.propertyType}
LOCATION: ${data.address}
DEAL VALUE: $${Number(data.dealValue).toLocaleString()}
MY ROLE: ${data.clientRole}
ACHIEVEMENT: ${data.achievement}
INSIGHTS: ${data.lessonsLearned}

Create:

1. LINKEDIN POST (200-300 words)
   - Professional, thoughtful tone
   - Start with attention-grabbing opening (not "Excited to announce...")
   - Share the deal details professionally
   - Include market insight or lesson learned
   - Thank collaborators (attorneys, other brokers, etc.)
   - End with industry reflection or market commentary
   - Include subtle call-to-action

2. HASHTAGS (5-7 professional hashtags)
   - Industry-relevant (#commercialrealestate, #investmentsales)
   - Location-specific
   - Deal-type specific

LinkedIn audience is professional - be insightful, not salesy.
Show expertise and market knowledge.
`;

  const isFormValid = formData.dealType && formData.address;

  return (
    <GeneratorShell
      id="linkedin-deal-post"
      title="LinkedIn Deal Post"
      description="Create professional closed deal announcements for LinkedIn"
      icon={Linkedin}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Deal Type *</Label>
            <Select value={formData.dealType} onValueChange={(v) => setFormData({ ...formData, dealType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="acquisition">Acquisition</SelectItem>
                <SelectItem value="lease">Lease</SelectItem>
                <SelectItem value="refinance">Refinance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Input
              placeholder="Multifamily, Office, Retail..."
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Property/Location *</Label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(v) => setFormData({ ...formData, address: v })}
              onAddressSelect={(addr) => setFormData({ ...formData, address: addr.fullAddress })}
              placeholder="Start typing an address..."
            />
          </div>

          <div className="space-y-2">
            <Label>Deal Value</Label>
            <Input
              type="number"
              placeholder="5000000"
              value={formData.dealValue}
              onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Your Role</Label>
            <Input
              placeholder="Represented the seller, Exclusive listing agent..."
              value={formData.clientRole}
              onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Key Achievement</Label>
          <Textarea
            placeholder="Record price for the submarket, competitive bidding, off-market deal..."
            value={formData.achievement}
            onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Market Insight / Lesson Learned</Label>
          <Textarea
            placeholder="What this deal says about the market, what you learned..."
            value={formData.lessonsLearned}
            onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default LinkedInDealPostGenerator;
