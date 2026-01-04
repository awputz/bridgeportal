import { useState } from "react";
import { Megaphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const SellerPitchDeckGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "", ownerName: "", marketConditions: "", comparableDeals: "", valueProposition: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are preparing a listing presentation pitch deck outline.

Property: ${data.propertyAddress}
Owner: ${data.ownerName}
Market Conditions: ${data.marketConditions}
Comparable Deals: ${data.comparableDeals}
Your Value Proposition: ${data.valueProposition}

Create a pitch deck outline with talking points for each slide:
1. COVER SLIDE (property + your branding)
2. ABOUT YOU/YOUR TEAM (credentials, track record)
3. MARKET OVERVIEW (current conditions, trends)
4. PROPERTY ANALYSIS (value drivers, opportunities)
5. COMPARABLE SALES (pricing support)
6. MARKETING STRATEGY (how you'll expose the property)
7. BUYER POOL (who will want this)
8. TIMELINE & PROCESS
9. PRICING RECOMMENDATION
10. WHY CHOOSE US

Provide 3-4 bullet points per slide with key talking points.
`;

  return (
    <GeneratorShell
      id="seller-pitch-deck" title="Seller Pitch Outline"
      description="Presentation outlines for seller listing meetings"
      icon={Megaphone} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.propertyAddress && formData.ownerName)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Owner Name *</Label>
          <Input value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Market Conditions</Label>
          <Textarea placeholder="Current market trends, buyer activity..."
            value={formData.marketConditions} onChange={(e) => setFormData({ ...formData, marketConditions: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Comparable Deals</Label>
          <Textarea placeholder="Recent sales to reference..."
            value={formData.comparableDeals} onChange={(e) => setFormData({ ...formData, comparableDeals: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Your Value Proposition</Label>
          <Textarea placeholder="Why should they list with you?"
            value={formData.valueProposition} onChange={(e) => setFormData({ ...formData, valueProposition: e.target.value })} rows={2} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default SellerPitchDeckGenerator;
