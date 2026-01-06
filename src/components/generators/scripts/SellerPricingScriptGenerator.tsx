import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const SellerPricingScriptGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    sellerExpectation: "",
    recommendedPrice: "",
    comparableSales: "",
    marketConditions: "",
    propertyCondition: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create a script for justifying pricing to a seller:

PROPERTY: ${data.propertyAddress}
SELLER'S EXPECTATION: $${Number(data.sellerExpectation).toLocaleString()}
RECOMMENDED PRICE: $${Number(data.recommendedPrice).toLocaleString()}
GAP: $${Math.abs(Number(data.sellerExpectation) - Number(data.recommendedPrice)).toLocaleString()}

COMPARABLE SALES:
${data.comparableSales}

MARKET CONDITIONS:
${data.marketConditions}

PROPERTY CONDITION:
${data.propertyCondition}

Create a conversational script that:

1. OPENING - Acknowledge their goals
   - "I understand you're hoping to achieve..."
   - Build rapport and show you're on their side

2. MARKET CONTEXT
   - Current market conditions
   - Buyer behavior and expectations
   - Days on market trends

3. COMPARABLE ANALYSIS
   - Walk through relevant comps
   - Explain adjustments
   - Show how you arrived at recommendation

4. PRICE POSITIONING STRATEGY
   - Benefits of pricing correctly
   - Risks of overpricing (DOM, price reductions, stigma)
   - Psychology of buyer perception

5. ADDRESSING THE GAP
   - If there's a gap between expectation and recommendation
   - Tactful ways to bridge the conversation
   - What the market will and won't support

6. SUGGESTED RESPONSES TO OBJECTIONS
   - "But my neighbor got $X..."
   - "Zillow says it's worth..."
   - "I'm not in a hurry..."
   - "Let's just try it at my price first..."

7. CLOSING - Get agreement
   - Summarize recommendation
   - Next steps
   - Build confidence in your expertise

Keep the tone professional but conversational. 
Be empathetic but data-driven.
`;

  const isFormValid = formData.propertyAddress && formData.recommendedPrice;

  return (
    <GeneratorShell
      id="seller-pricing-script"
      title="Seller Pricing Script"
      description="Scripts to justify pricing with market data"
      icon={DollarSign}
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
              placeholder="123 Main Street, New York, NY"
              value={formData.propertyAddress}
              onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Seller's Price Expectation</Label>
            <Input
              type="number"
              placeholder="1500000"
              value={formData.sellerExpectation}
              onChange={(e) => setFormData({ ...formData, sellerExpectation: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Your Recommended Price *</Label>
            <Input
              type="number"
              placeholder="1350000"
              value={formData.recommendedPrice}
              onChange={(e) => setFormData({ ...formData, recommendedPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Comparable Sales</Label>
          <Textarea
            placeholder="123 Oak St: $1.3M (similar size, sold 2 months ago)&#10;456 Elm Ave: $1.4M (renovated, sold 1 month ago)..."
            value={formData.comparableSales}
            onChange={(e) => setFormData({ ...formData, comparableSales: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Current Market Conditions</Label>
          <Textarea
            placeholder="Buyer demand, inventory levels, interest rates, days on market trends..."
            value={formData.marketConditions}
            onChange={(e) => setFormData({ ...formData, marketConditions: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Property Condition Notes</Label>
          <Textarea
            placeholder="Needs updates, dated kitchen, deferred maintenance, or recently renovated..."
            value={formData.propertyCondition}
            onChange={(e) => setFormData({ ...formData, propertyCondition: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default SellerPricingScriptGenerator;
