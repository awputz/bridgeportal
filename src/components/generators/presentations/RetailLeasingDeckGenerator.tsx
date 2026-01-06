import { useState } from "react";
import { Presentation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const RetailLeasingDeckGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    availableSF: "",
    askingRent: "",
    frontage: "",
    ceilingHeight: "",
    demographics: "",
    coTenants: "",
    highlights: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an expert retail real estate broker creating a professional retail leasing presentation.

Create a detailed slide-by-slide presentation for:

PROPERTY DETAILS:
- Property: ${data.propertyName}
- Address: ${data.address}
- Available SF: ${Number(data.availableSF).toLocaleString()} SF
- Asking Rent: $${data.askingRent}/SF
- Frontage: ${data.frontage || "N/A"}
- Ceiling Height: ${data.ceilingHeight || "N/A"}

DEMOGRAPHICS:
${data.demographics || "High-traffic retail corridor"}

CO-TENANTS / NEIGHBORS:
${data.coTenants || "N/A"}

KEY HIGHLIGHTS:
${data.highlights}

Create the following slides:

1. COVER SLIDE - Property name, address, hero image description

2. EXECUTIVE SUMMARY - Opportunity overview, key selling points

3. SPACE DETAILS - SF, frontage, ceiling height, configuration

4. LOCATION ANALYSIS - Trade area, visibility, accessibility

5. DEMOGRAPHICS - Population, income, spending patterns, traffic counts

6. RETAIL ENVIRONMENT - Co-tenants, nearby retail, competition

7. SITE PLAN / FLOOR PLAN - Layout, entrance, signage opportunities

8. TRAFFIC & VISIBILITY - Pedestrian counts, vehicle traffic, visibility

9. LEASE TERMS - Base rent, NNN, TI allowance, signage rights

10. CONTACT & NEXT STEPS - Broker info, tour scheduling

Format each slide with title, bullet points, visual suggestions, and presenter notes.
`;

  const isFormValid = formData.propertyName && formData.address && formData.availableSF;

  return (
    <GeneratorShell
      id="retail-leasing-deck"
      title="Retail Leasing Deck"
      description="Create a professional retail space presentation for tenants"
      icon={Presentation}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Property Name *</Label>
            <Input
              placeholder="SoHo Retail Center"
              value={formData.propertyName}
              onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Address *</Label>
            <Input
              placeholder="123 Broadway, New York, NY 10012"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Available SF *</Label>
            <Input
              type="number"
              placeholder="3500"
              value={formData.availableSF}
              onChange={(e) => setFormData({ ...formData, availableSF: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Asking Rent ($/SF)</Label>
            <Input
              placeholder="150"
              value={formData.askingRent}
              onChange={(e) => setFormData({ ...formData, askingRent: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Frontage (ft)</Label>
            <Input
              placeholder="25 ft"
              value={formData.frontage}
              onChange={(e) => setFormData({ ...formData, frontage: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Ceiling Height</Label>
            <Input
              placeholder="14 ft"
              value={formData.ceilingHeight}
              onChange={(e) => setFormData({ ...formData, ceilingHeight: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Demographics</Label>
          <Textarea
            placeholder="Average HH income $150K+, 50,000 daily foot traffic, tourist destination..."
            value={formData.demographics}
            onChange={(e) => setFormData({ ...formData, demographics: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Co-Tenants / Nearby Retailers</Label>
          <Textarea
            placeholder="Apple Store, Nike, Sephora, Whole Foods..."
            value={formData.coTenants}
            onChange={(e) => setFormData({ ...formData, coTenants: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Key Highlights</Label>
          <Textarea
            placeholder="Corner location, excellent signage, high visibility, recently renovated..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default RetailLeasingDeckGenerator;
