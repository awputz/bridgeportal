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

export const InvestmentSalesOMDeckGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "",
    askingPrice: "",
    squareFootage: "",
    unitCount: "",
    noi: "",
    capRate: "",
    yearBuilt: "",
    highlights: "",
    targetBuyer: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an expert commercial real estate analyst creating a professional Offering Memorandum presentation deck.

Create a detailed slide-by-slide presentation for:

PROPERTY DETAILS:
- Address: ${data.propertyAddress}
- Property Type: ${data.propertyType}
- Asking Price: $${Number(data.askingPrice).toLocaleString()}
- Square Footage: ${Number(data.squareFootage).toLocaleString()} SF
- Units: ${data.unitCount || "N/A"}
- NOI: $${Number(data.noi).toLocaleString()}
- Cap Rate: ${data.capRate}%
- Year Built: ${data.yearBuilt || "N/A"}

KEY HIGHLIGHTS:
${data.highlights}

TARGET BUYER PROFILE:
${data.targetBuyer || "Institutional and private investors"}

Create the following slides with detailed content:

1. COVER SLIDE
   - Property name/address, hero image description, key stats teaser

2. EXECUTIVE SUMMARY
   - Investment highlights, key metrics, opportunity overview

3. PROPERTY OVERVIEW
   - Physical description, building specs, condition assessment

4. FINANCIAL SUMMARY
   - Income breakdown, expense analysis, NOI calculation, returns

5. RENT ROLL / TENANT OVERVIEW
   - Tenant mix, lease terms, income diversification

6. MARKET ANALYSIS
   - Submarket overview, demographics, comparable sales

7. LOCATION HIGHLIGHTS
   - Neighborhood amenities, transportation, growth drivers

8. INVESTMENT THESIS
   - Why invest now, value-add opportunities, exit strategy

9. CONTACT / NEXT STEPS
   - Broker contact info, process timeline, call to action

Format each slide with:
- Slide title
- Key bullet points (3-5 per slide)
- Suggested visuals/graphics
- Speaking notes for presenter
`;

  const isFormValid = formData.propertyAddress && formData.propertyType && formData.askingPrice && formData.noi;

  return (
    <GeneratorShell
      id="investment-sales-om-deck"
      title="Investment Sales OM Deck"
      description="Create a professional offering memorandum presentation"
      icon={Presentation}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Presentation Deck"
      outputDescription="Slide-by-slide content for your OM presentation"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Property Address *</Label>
            <Input
              placeholder="123 Main Street, New York, NY 10001"
              value={formData.propertyAddress}
              onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Property Type *</Label>
            <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multifamily">Multifamily</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="mixed-use">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Year Built</Label>
            <Input
              type="number"
              placeholder="1985"
              value={formData.yearBuilt}
              onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
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

          <div className="space-y-2">
            <Label>NOI *</Label>
            <Input
              type="number"
              placeholder="350000"
              value={formData.noi}
              onChange={(e) => setFormData({ ...formData, noi: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Cap Rate (%)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="6.5"
              value={formData.capRate}
              onChange={(e) => setFormData({ ...formData, capRate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Property Highlights *</Label>
          <Textarea
            placeholder="Prime location, fully occupied, recent renovations, strong tenant mix..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Target Buyer Profile</Label>
          <Input
            placeholder="Institutional investors, private equity, 1031 buyers"
            value={formData.targetBuyer}
            onChange={(e) => setFormData({ ...formData, targetBuyer: e.target.value })}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default InvestmentSalesOMDeckGenerator;
