import { useState } from "react";
import { Presentation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const OfficeLeasingDeckGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    buildingName: "",
    address: "",
    availableSF: "",
    askingRent: "",
    floorPlate: "",
    amenities: "",
    highlights: "",
    targetTenant: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an expert commercial real estate broker creating a professional office leasing presentation.

Create a detailed slide-by-slide presentation for:

PROPERTY DETAILS:
- Building: ${data.buildingName}
- Address: ${data.address}
- Available SF: ${Number(data.availableSF).toLocaleString()} SF
- Asking Rent: $${data.askingRent}/SF
- Floor Plate: ${data.floorPlate || "N/A"}

AMENITIES:
${data.amenities}

KEY HIGHLIGHTS:
${data.highlights}

TARGET TENANT:
${data.targetTenant || "Professional services firms"}

Create the following slides:

1. COVER SLIDE - Building name, address, hero image description

2. BUILDING OVERVIEW - Class, specs, ownership, management quality

3. AVAILABLE SPACE - Floor plans, SF breakdown, configuration options

4. BUILDING AMENITIES - Lobby, common areas, parking, technology

5. FLOOR PLANS & SPECS - Ceiling heights, column spacing, HVAC, power

6. LOCATION & ACCESS - Transit, parking, walkability, neighborhood

7. NEIGHBORHOOD AMENITIES - Dining, retail, hotels, services nearby

8. COMPARABLE SPACES - How this compares to alternatives

9. LEASE TERMS OVERVIEW - Base rent, escalations, TI, free rent

10. CONTACT & NEXT STEPS - Broker info, tour scheduling

Format each slide with title, bullet points, visual suggestions, and presenter notes.
`;

  const isFormValid = formData.buildingName && formData.address && formData.availableSF;

  return (
    <GeneratorShell
      id="office-leasing-deck"
      title="Office Leasing Deck"
      description="Create a professional office space presentation for tenants"
      icon={Presentation}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Building Name *</Label>
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
            <Label>Floor Plate Size</Label>
            <Input
              placeholder="25,000 SF per floor"
              value={formData.floorPlate}
              onChange={(e) => setFormData({ ...formData, floorPlate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Building Amenities</Label>
          <Textarea
            placeholder="Renovated lobby, conference center, fitness center, rooftop terrace..."
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Key Highlights</Label>
          <Textarea
            placeholder="Recently renovated, Class A finishes, 24/7 access, great views..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Target Tenant</Label>
          <Input
            placeholder="Law firms, financial services, tech companies"
            value={formData.targetTenant}
            onChange={(e) => setFormData({ ...formData, targetTenant: e.target.value })}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default OfficeLeasingDeckGenerator;
