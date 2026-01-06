import { useState } from "react";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const ResidentialOpenHouseFlyerGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    address: "",
    askingPrice: "",
    bedrooms: "",
    bathrooms: "",
    openHouseDate: "",
    openHouseTime: "",
    highlights: "",
    refreshments: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create an exciting Open House flyer:

ADDRESS: ${data.address}
PRICE: $${Number(data.askingPrice).toLocaleString()}
BEDROOMS: ${data.bedrooms}
BATHROOMS: ${data.bathrooms}

OPEN HOUSE DATE: ${data.openHouseDate}
TIME: ${data.openHouseTime}

HIGHLIGHTS: ${data.highlights}
REFRESHMENTS: ${data.refreshments || "Light refreshments served"}

Create flyer content including:

1. HEADLINE - "OPEN HOUSE" with date prominently featured
2. ADDRESS - Large, clear property address
3. DATE & TIME - Bold, can't-miss formatting
4. PROPERTY TEASER - 2 sentences to create excitement
5. KEY STATS - Beds, Baths, Price
6. TOP HIGHLIGHTS - 4-5 compelling bullet points
7. WHAT TO EXPECT - Refreshments, agent availability
8. DIRECTIONS NOTE - Easy parking/transit info
9. RSVP/CONTACT - Agent details

Create urgency and excitement. Make people want to attend!
`;

  const isFormValid = formData.address && formData.openHouseDate;

  return (
    <GeneratorShell
      id="residential-open-house-flyer"
      title="Open House Flyer"
      description="Create an exciting open house event flyer"
      icon={Image}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Property Address *</Label>
            <Input
              placeholder="123 Park Avenue, Unit 15A"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Open House Date *</Label>
            <Input
              placeholder="Sunday, January 15th"
              value={formData.openHouseDate}
              onChange={(e) => setFormData({ ...formData, openHouseDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              placeholder="12:00 PM - 2:00 PM"
              value={formData.openHouseTime}
              onChange={(e) => setFormData({ ...formData, openHouseTime: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Asking Price</Label>
            <Input
              type="number"
              placeholder="2500000"
              value={formData.askingPrice}
              onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
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

          <div className="space-y-2 col-span-2">
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
            placeholder="Stunning views, chef's kitchen, private terrace..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Refreshments / Special Notes</Label>
          <Input
            placeholder="Champagne and light bites served"
            value={formData.refreshments}
            onChange={(e) => setFormData({ ...formData, refreshments: e.target.value })}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default ResidentialOpenHouseFlyerGenerator;
