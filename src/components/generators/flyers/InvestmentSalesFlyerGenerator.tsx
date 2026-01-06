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

export const InvestmentSalesFlyerGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "",
    askingPrice: "",
    noi: "",
    capRate: "",
    squareFootage: "",
    unitCount: "",
    highlights: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create compelling marketing flyer copy for an investment property:

PROPERTY: ${data.propertyAddress}
TYPE: ${data.propertyType}
ASKING PRICE: $${Number(data.askingPrice).toLocaleString()}
NOI: $${Number(data.noi).toLocaleString()}
CAP RATE: ${data.capRate}%
SIZE: ${Number(data.squareFootage).toLocaleString()} SF
UNITS: ${data.unitCount || "N/A"}

HIGHLIGHTS: ${data.highlights}

Create flyer content including:

1. HEADLINE - Attention-grabbing 5-8 word headline
2. SUBHEADLINE - Supporting value proposition
3. KEY STATS BOX - Price, Cap Rate, NOI, Units, SF (formatted for visual display)
4. PROPERTY DESCRIPTION - 2-3 compelling sentences
5. INVESTMENT HIGHLIGHTS - 4-6 bullet points
6. LOCATION HIGHLIGHTS - 3-4 bullet points about the area
7. CALL TO ACTION - "Contact for details" with urgency
8. LEGAL DISCLAIMER - Standard investment disclaimer

Format for a professional one-page flyer layout.
`;

  const isFormValid = formData.propertyAddress && formData.askingPrice;

  return (
    <GeneratorShell
      id="investment-sales-flyer"
      title="Investment Sales Flyer"
      description="Create professional investment property flyer copy"
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
              value={formData.propertyAddress}
              onChange={(v) => setFormData({ ...formData, propertyAddress: v })}
              onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress })}
              placeholder="Start typing an address..."
            />
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Input
              placeholder="Multifamily, Office, Retail..."
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Asking Price *</Label>
            <Input
              type="number"
              placeholder="5000000"
              value={formData.askingPrice}
              onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>NOI</Label>
            <Input
              type="number"
              placeholder="350000"
              value={formData.noi}
              onChange={(e) => setFormData({ ...formData, noi: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Cap Rate (%)</Label>
            <Input
              placeholder="6.5"
              value={formData.capRate}
              onChange={(e) => setFormData({ ...formData, capRate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Square Footage</Label>
            <Input
              type="number"
              placeholder="25000"
              value={formData.squareFootage}
              onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Unit Count</Label>
            <Input
              type="number"
              placeholder="24"
              value={formData.unitCount}
              onChange={(e) => setFormData({ ...formData, unitCount: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Property Highlights</Label>
          <Textarea
            placeholder="Prime location, fully occupied, recent renovations, strong tenant mix..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default InvestmentSalesFlyerGenerator;
