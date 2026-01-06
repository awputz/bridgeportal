import { useState } from "react";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const ResidentialJustListedFlyerGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    address: "",
    askingPrice: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    neighborhood: "",
    highlights: "",
    openHouseDate: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create compelling "Just Listed" flyer copy for a residential property:

ADDRESS: ${data.address}
PRICE: $${Number(data.askingPrice).toLocaleString()}
BEDROOMS: ${data.bedrooms}
BATHROOMS: ${data.bathrooms}
SIZE: ${Number(data.squareFeet).toLocaleString()} SF
NEIGHBORHOOD: ${data.neighborhood}

HIGHLIGHTS: ${data.highlights}
OPEN HOUSE: ${data.openHouseDate || "By appointment"}

Create flyer content including:

1. HEADLINE - "JUST LISTED" with attention-grabbing property hook
2. HERO DESCRIPTION - 1 compelling sentence about lifestyle
3. KEY STATS - Beds, Baths, SF, Price (formatted attractively)
4. PROPERTY HIGHLIGHTS - 5-6 compelling bullet points
5. NEIGHBORHOOD PERKS - 3-4 location benefits
6. OPEN HOUSE INFO - Date/time or "Private showings available"
7. CALL TO ACTION - Schedule a showing
8. AGENT CONTACT - Placeholder for agent details

Use aspirational, lifestyle-focused language. Make buyers feel excited!
`;

  const isFormValid = formData.address && formData.askingPrice;

  return (
    <GeneratorShell
      id="residential-just-listed-flyer"
      title="Just Listed Flyer"
      description="Create an eye-catching new listing announcement flyer"
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
            <Label>Asking Price *</Label>
            <Input
              type="number"
              placeholder="2500000"
              value={formData.askingPrice}
              onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
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

          <div className="space-y-2">
            <Label>Square Feet</Label>
            <Input
              type="number"
              placeholder="1850"
              value={formData.squareFeet}
              onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Open House Date</Label>
            <Input
              placeholder="Sunday, January 15th, 12-2pm"
              value={formData.openHouseDate}
              onChange={(e) => setFormData({ ...formData, openHouseDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Property Highlights</Label>
          <Textarea
            placeholder="Renovated kitchen, Central Park views, washer/dryer, 24-hr doorman..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default ResidentialJustListedFlyerGenerator;
