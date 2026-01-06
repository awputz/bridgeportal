import { useState } from "react";
import { Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const BuyerMatchLetterGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    buyerName: "", buyerCriteria: "", propertyAddress: "", propertyHighlights: "", whyMatch: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an investment sales broker writing a personalized property pitch.

Buyer: ${data.buyerName}
Buyer Criteria: ${data.buyerCriteria}
Property: ${data.propertyAddress}
Property Highlights: ${data.propertyHighlights}
Why This Matches: ${data.whyMatch}

Write a compelling match letter that:
1. Opens with personalized reference to their criteria
2. Introduces the property as a potential fit
3. Highlights key features that match their needs
4. Addresses potential concerns proactively
5. Creates urgency without being pushy
6. Includes clear call to action

Keep it concise and personalized. Avoid generic marketing language.
`;

  return (
    <GeneratorShell
      id="buyer-match-letter" title="Buyer Match Letter"
      description="Match property to buyer criteria with personalized pitch"
      icon={Target} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.buyerName && formData.propertyAddress)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Buyer Name *</Label>
          <Input value={formData.buyerName} onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Buyer Criteria</Label>
          <Textarea placeholder="What are they looking for? Size, location, price, type..."
            value={formData.buyerCriteria} onChange={(e) => setFormData({ ...formData, buyerCriteria: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <AddressAutocomplete
            value={formData.propertyAddress}
            onChange={(v) => setFormData({ ...formData, propertyAddress: v })}
            onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress })}
            placeholder="Start typing an address..."
          />
        </div>
        <div className="space-y-2">
          <Label>Property Highlights</Label>
          <Textarea placeholder="Key features, price, cap rate, upside..."
            value={formData.propertyHighlights} onChange={(e) => setFormData({ ...formData, propertyHighlights: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Why This Matches</Label>
          <Textarea placeholder="Specific reasons this fits their criteria..."
            value={formData.whyMatch} onChange={(e) => setFormData({ ...formData, whyMatch: e.target.value })} rows={2} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default BuyerMatchLetterGenerator;
