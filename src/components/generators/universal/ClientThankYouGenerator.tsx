import { useState } from "react";
import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface ClientThankYouGeneratorProps {
  onBack: () => void;
}

const occasions = [
  "Closed Deal",
  "Successful Lease Signing",
  "Referral Received",
  "Meeting/Tour",
  "Partnership/Collaboration",
  "Holiday/Season",
  "General Appreciation",
];

export const ClientThankYouGenerator = ({ onBack }: ClientThankYouGeneratorProps) => {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientType: "",
    occasion: "",
    specificDetails: "",
    personalTouch: "",
    agentName: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a professional real estate agent writing a heartfelt thank you note.

Write a personalized thank you note with these details:
- Recipient: ${data.recipientName} (${data.recipientType})
- Occasion: ${data.occasion}
- Specific Details: ${data.specificDetails}
- Personal Touch to Include: ${data.personalTouch}
- From: ${data.agentName}

Guidelines:
- Keep it warm, genuine, and professional
- Reference specific details from the interaction
- Express sincere gratitude
- Include a forward-looking statement about the relationship
- Keep it concise (3-4 paragraphs)
- End with a professional sign-off
`;

  const isFormValid = formData.recipientName && formData.occasion && formData.agentName;

  return (
    <GeneratorShell
      id="client-thank-you"
      title="Client Thank You"
      description="Generate personalized thank you notes for clients and partners"
      icon={Heart}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Thank You Note"
      outputDescription="Your personalized thank you message"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Recipient Name *</Label>
            <Input
              placeholder="John Smith"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Recipient Type</Label>
            <Select value={formData.recipientType} onValueChange={(v) => setFormData({ ...formData, recipientType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="referral-partner">Referral Partner</SelectItem>
                <SelectItem value="attorney">Attorney</SelectItem>
                <SelectItem value="broker">Co-Broker</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Occasion *</Label>
          <Select value={formData.occasion} onValueChange={(v) => setFormData({ ...formData, occasion: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              {occasions.map((occ) => (
                <SelectItem key={occ} value={occ}>{occ}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Specific Details</Label>
          <Textarea
            placeholder="Property address, deal terms, what made this special..."
            value={formData.specificDetails}
            onChange={(e) => setFormData({ ...formData, specificDetails: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Personal Touch</Label>
          <Input
            placeholder="Something personal to mention (hobby, family, etc.)"
            value={formData.personalTouch}
            onChange={(e) => setFormData({ ...formData, personalTouch: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Your Name *</Label>
          <Input
            placeholder="Your name"
            value={formData.agentName}
            onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default ClientThankYouGenerator;
