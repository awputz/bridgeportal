import { useState } from "react";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const OfficeSpaceFlyerGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    buildingName: "",
    address: "",
    availableSF: "",
    askingRent: "",
    floorNumber: "",
    amenities: "",
    highlights: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create compelling marketing flyer copy for office space:

BUILDING: ${data.buildingName}
ADDRESS: ${data.address}
AVAILABLE: ${Number(data.availableSF).toLocaleString()} SF
ASKING RENT: $${data.askingRent}/SF
FLOOR: ${data.floorNumber || "Multiple floors available"}

AMENITIES: ${data.amenities}
HIGHLIGHTS: ${data.highlights}

Create flyer content including:

1. HEADLINE - Professional 5-8 word headline
2. SUBHEADLINE - Location or building class callout
3. KEY STATS BOX - SF, Rent, Floor, Possession
4. SPACE DESCRIPTION - 2-3 sentences about the opportunity
5. BUILDING FEATURES - 4-6 bullet points
6. LOCATION BENEFITS - 3-4 bullet points
7. FLOOR PLAN NOTE - Mention floor plan available
8. CALL TO ACTION - Schedule a tour

Format for a professional one-page flyer.
`;

  const isFormValid = formData.address && formData.availableSF;

  return (
    <GeneratorShell
      id="office-space-flyer"
      title="Office Space Flyer"
      description="Create professional office leasing flyer copy"
      icon={Image}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Building Name</Label>
            <Input
              placeholder="One Liberty Plaza"
              value={formData.buildingName}
              onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Address *</Label>
            <Input
              placeholder="165 Broadway, New York, NY 10006"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Available SF *</Label>
            <Input
              type="number"
              placeholder="15000"
              value={formData.availableSF}
              onChange={(e) => setFormData({ ...formData, availableSF: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Asking Rent ($/SF)</Label>
            <Input
              placeholder="65"
              value={formData.askingRent}
              onChange={(e) => setFormData({ ...formData, askingRent: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Floor Number</Label>
            <Input
              placeholder="15th Floor"
              value={formData.floorNumber}
              onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Building Amenities</Label>
          <Textarea
            placeholder="Renovated lobby, conference center, fitness center..."
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Space Highlights</Label>
          <Textarea
            placeholder="Corner office, city views, pre-built, move-in ready..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default OfficeSpaceFlyerGenerator;
