import { useState } from "react";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const RetailSpaceFlyerGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    address: "",
    availableSF: "",
    askingRent: "",
    frontage: "",
    coTenants: "",
    highlights: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create compelling marketing flyer copy for retail space:

ADDRESS: ${data.address}
AVAILABLE: ${Number(data.availableSF).toLocaleString()} SF
ASKING RENT: $${data.askingRent}/SF
FRONTAGE: ${data.frontage || "N/A"}

CO-TENANTS: ${data.coTenants}
HIGHLIGHTS: ${data.highlights}

Create flyer content including:

1. HEADLINE - Exciting 5-8 word headline emphasizing location/opportunity
2. SUBHEADLINE - Neighborhood or traffic callout
3. KEY STATS BOX - SF, Rent, Frontage, Possession
4. SPACE DESCRIPTION - 2-3 sentences about the opportunity
5. RETAIL FEATURES - 4-6 bullet points
6. DEMOGRAPHICS - 3-4 key stats (foot traffic, income, population)
7. CO-TENANCY - Nearby retailers and attractions
8. CALL TO ACTION - Schedule a tour

Format for a professional one-page retail flyer.
`;

  const isFormValid = formData.address && formData.availableSF;

  return (
    <GeneratorShell
      id="retail-space-flyer"
      title="Retail Space Flyer"
      description="Create professional retail leasing flyer copy"
      icon={Image}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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

          <div className="space-y-2 col-span-2">
            <Label>Frontage</Label>
            <Input
              placeholder="25 ft of frontage on Broadway"
              value={formData.frontage}
              onChange={(e) => setFormData({ ...formData, frontage: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Co-Tenants / Nearby Retailers</Label>
          <Textarea
            placeholder="Apple Store, Nike, Whole Foods, Starbucks..."
            value={formData.coTenants}
            onChange={(e) => setFormData({ ...formData, coTenants: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Space Highlights</Label>
          <Textarea
            placeholder="Corner location, excellent signage, high visibility, recently renovated..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default RetailSpaceFlyerGenerator;
