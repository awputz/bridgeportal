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

export const InstagramJustSoldGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    address: "",
    salePrice: "",
    daysOnMarket: "",
    neighborhood: "",
    clientType: "",
    specialNote: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create an engaging Instagram "Just Sold" celebration post:

PROPERTY: ${data.address}
SALE PRICE: $${Number(data.salePrice).toLocaleString()}
DAYS ON MARKET: ${data.daysOnMarket || "N/A"}
NEIGHBORHOOD: ${data.neighborhood}
CLIENT: ${data.clientType || "buyer/seller"}
SPECIAL NOTE: ${data.specialNote}

Create:

1. CAPTION (150-200 characters)
   - Celebrate the successful closing
   - Thank clients (without naming them)
   - Highlight achievement (over asking, quick sale, etc.)
   - Professional but warm tone

2. HASHTAGS (15-20 relevant hashtags)
   - #justsold #closingday #realestate
   - Location-specific hashtags
   - Achievement hashtags (#overasking if applicable)

3. STORY VERSION (shorter)
   - Quick celebration
   - "Another happy client" vibe

Use celebratory emojis (🎉 🔑 🏡 ✨) strategically.
Keep it professional - don't be too salesy.
`;

  const isFormValid = formData.address && formData.salePrice;

  return (
    <GeneratorShell
      id="instagram-just-sold"
      title="Instagram Just Sold Post"
      description="Create celebratory posts for closed deals"
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
            <Label>Sale Price *</Label>
            <Input
              type="number"
              placeholder="2500000"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Days on Market</Label>
            <Input
              placeholder="15"
              value={formData.daysOnMarket}
              onChange={(e) => setFormData({ ...formData, daysOnMarket: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Neighborhood</Label>
            <Input
              placeholder="Tribeca"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Client Type</Label>
            <Input
              placeholder="First-time buyers, Investor, Relocating family..."
              value={formData.clientType}
              onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Special Achievement</Label>
          <Textarea
            placeholder="Sold over asking, Multiple offers, Record price for the building..."
            value={formData.specialNote}
            onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default InstagramJustSoldGenerator;
