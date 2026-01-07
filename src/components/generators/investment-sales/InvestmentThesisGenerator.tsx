import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const InvestmentThesisGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "", propertyType: "", askingPrice: "", noi: "", capRate: "",
    marketArea: "", valueAddOpportunities: "", targetBuyer: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an investment sales analyst creating a compelling investment thesis.

Property: ${data.propertyAddress}
Type: ${data.propertyType}
Asking Price: ${data.askingPrice}
NOI: ${data.noi}
Cap Rate: ${data.capRate}
Market: ${data.marketArea}
Value-Add Opportunities: ${data.valueAddOpportunities}
Target Buyer Profile: ${data.targetBuyer}

Create a compelling investment thesis including:
1. EXECUTIVE SUMMARY (2-3 sentences)
2. INVESTMENT HIGHLIGHTS (5-7 bullet points)
3. MARKET POSITION (location advantages, demographics)
4. VALUE CREATION OPPORTUNITY (upside potential)
5. FINANCIAL OVERVIEW (key metrics, returns)
6. RISK CONSIDERATIONS (with mitigants)
7. CONCLUSION (why buy now)

Make it persuasive but factual. Use professional investment language.
`;

  return (
    <GeneratorShell
      id="investment-thesis" title="Investment Thesis"
      description="Generate compelling investment rationale for buyers"
      icon={Lightbulb} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.propertyAddress && formData.propertyType)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <AddressAutocomplete value={formData.propertyAddress}
            onChange={(value) => setFormData({ ...formData, propertyAddress: value })}
            onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress, marketArea: addr.neighborhood || addr.city || formData.marketArea })}
            placeholder="Start typing an address..." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Property Type *</Label>
            <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="multifamily">Multifamily</SelectItem>
                <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Asking Price</Label>
            <Input placeholder="$5,000,000" value={formData.askingPrice}
              onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>NOI</Label>
            <Input placeholder="$250,000" value={formData.noi}
              onChange={(e) => setFormData({ ...formData, noi: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Cap Rate</Label>
            <Input placeholder="5.0%" value={formData.capRate}
              onChange={(e) => setFormData({ ...formData, capRate: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Market Area</Label>
          <Input placeholder="Brooklyn, NY" value={formData.marketArea}
            onChange={(e) => setFormData({ ...formData, marketArea: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Value-Add Opportunities</Label>
          <Textarea placeholder="Rent upside, renovations, repositioning..." value={formData.valueAddOpportunities}
            onChange={(e) => setFormData({ ...formData, valueAddOpportunities: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Target Buyer Profile</Label>
          <Input placeholder="Value-add investor, 1031 buyer, etc." value={formData.targetBuyer}
            onChange={(e) => setFormData({ ...formData, targetBuyer: e.target.value })} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default InvestmentThesisGenerator;
