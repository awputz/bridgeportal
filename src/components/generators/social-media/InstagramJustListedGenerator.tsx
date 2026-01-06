import { useState } from "react";
import { Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const InstagramJustListedGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    highlights: "",
    neighborhood: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create an engaging Instagram "Just Listed" post caption:

PROPERTY: ${data.address}
PRICE: $${Number(data.price).toLocaleString()}
BEDROOMS: ${data.bedrooms}
BATHROOMS: ${data.bathrooms}
NEIGHBORHOOD: ${data.neighborhood}
HIGHLIGHTS: ${data.highlights}

Create:

1. CAPTION (150-200 characters)
   - Start with attention-grabbing hook or emoji
   - Include key selling points
   - Create excitement and urgency
   - End with call-to-action

2. HASHTAGS (15-20 relevant hashtags)
   - Mix of broad (#realestate, #justlisted)
   - Location-specific (#${data.neighborhood?.replace(/\s/g, '') || 'NYC'}realestate)
   - Property-specific (#luxurycondo, #newhome)

3. STORY CAPTION (shorter version for Stories)
   - 2-3 lines max
   - Swipe up CTA or "DM for details"

Keep the tone aspirational, professional, and engaging.
Use relevant emojis strategically (🏠 ✨ 🔑 📍).
`;

  const isFormValid = formData.address && formData.price;

  return (
    <GeneratorShell
      id="instagram-just-listed"
      title="Instagram Just Listed Post"
      description="Create engaging Instagram captions for new listings"
      icon={Instagram}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Property Address *</Label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(v) => setFormData({ ...formData, address: v })}
              onAddressSelect={(addr) => setFormData({ 
                ...formData, 
                address: addr.fullAddress,
                neighborhood: addr.neighborhood || formData.neighborhood 
              })}
              placeholder="Start typing an address..."
            />
          </div>

          <div className="space-y-2">
            <Label>Price *</Label>
            <Input
              type="number"
              placeholder="2500000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Neighborhood</Label>
            <Input
              placeholder="Upper East Side"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Input
              placeholder="3"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Input
              placeholder="2.5"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Property Highlights</Label>
          <Textarea
            placeholder="Stunning views, renovated kitchen, private terrace..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default InstagramJustListedGenerator;
