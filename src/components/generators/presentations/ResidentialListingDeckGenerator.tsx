import { useState } from "react";
import { Presentation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const ResidentialListingDeckGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    address: "",
    propertyType: "",
    askingPrice: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    highlights: "",
    neighborhood: "",
    amenities: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an expert residential real estate agent creating a beautiful listing presentation.

Create a detailed slide-by-slide presentation for:

PROPERTY DETAILS:
- Address: ${data.address}
- Type: ${data.propertyType}
- Asking Price: $${Number(data.askingPrice).toLocaleString()}
- Bedrooms: ${data.bedrooms}
- Bathrooms: ${data.bathrooms}
- Square Feet: ${Number(data.squareFeet).toLocaleString()} SF
- Neighborhood: ${data.neighborhood}

HIGHLIGHTS:
${data.highlights}

AMENITIES:
${data.amenities}

Create the following slides:

1. COVER SLIDE - Hero image description, address, price, key stats

2. PROPERTY OVERVIEW - Quick facts, condition, style, unique features

3. INTERIOR HIGHLIGHTS - Living spaces, kitchen, primary suite details

4. ADDITIONAL SPACES - Bedrooms, bathrooms, storage, bonus rooms

5. OUTDOOR SPACES - Terrace, garden, views, outdoor features

6. BUILDING AMENITIES - Doorman, gym, rooftop, laundry, storage

7. NEIGHBORHOOD - Dining, shopping, parks, schools, transit

8. FLOOR PLAN - Layout description, room flow, square footage

9. COMPARABLE SALES - Recent sales, price justification

10. NEXT STEPS - Open house info, showing scheduling, contact

Format each slide with title, bullet points, visual suggestions, and presenter notes. 
Use aspirational, lifestyle-focused language that helps buyers envision living there.
`;

  const isFormValid = formData.address && formData.propertyType && formData.askingPrice;

  return (
    <GeneratorShell
      id="residential-listing-deck"
      title="Residential Listing Deck"
      description="Create a beautiful home listing presentation"
      icon={Presentation}
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
              placeholder="123 Park Avenue, Unit 15A, New York, NY 10028"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Property Type *</Label>
            <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="co-op">Co-op</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="single-family">Single Family</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
              </SelectContent>
            </Select>
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
            <Label>Bedrooms</Label>
            <Input
              type="number"
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
            <Label>Neighborhood</Label>
            <Input
              placeholder="Upper East Side"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Property Highlights</Label>
          <Textarea
            placeholder="Renovated chef's kitchen, 10-ft ceilings, Central Park views, washer/dryer..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Building Amenities</Label>
          <Textarea
            placeholder="24-hr doorman, gym, rooftop terrace, bike room, storage..."
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default ResidentialListingDeckGenerator;
