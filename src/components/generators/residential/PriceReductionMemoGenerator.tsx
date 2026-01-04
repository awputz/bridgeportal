import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const PriceReductionMemoGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    currentPrice: "",
    recommendedPrice: "",
    daysOnMarket: "",
    showingsCount: "",
    marketData: "",
    competitorPricing: "",
    feedbackSummary: "",
    urgencyFactors: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a professional price reduction recommendation memo for the seller.

Property: ${data.propertyAddress}
Current List Price: $${data.currentPrice}
Recommended Price: $${data.recommendedPrice}
Days on Market: ${data.daysOnMarket}
Number of Showings: ${data.showingsCount}

Market Data: ${data.marketData}
Competitor Pricing: ${data.competitorPricing}
Buyer Feedback Summary: ${data.feedbackSummary}
Urgency Factors: ${data.urgencyFactors}

Generate a diplomatic, data-driven price reduction memo that:
1. Opens with appreciation for the seller's partnership
2. Presents current market conditions objectively
3. Summarizes showing activity and feedback
4. Compares to active and sold competition
5. Explains the psychology of pricing in the market
6. Makes a clear price recommendation with rationale
7. Projects impact of the price adjustment
8. Outlines next steps and timeline
9. Maintains confidence in ultimate success

Be honest but supportive - help the seller see the opportunity in adjusting price.`;

  const isFormValid = !!formData.propertyAddress && !!formData.currentPrice && !!formData.recommendedPrice;

  return (
    <GeneratorShell
      id="price-reduction-memo"
      title="Price Reduction Memo"
      description="Create persuasive price adjustment recommendations for sellers."
      icon={TrendingDown}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Price Reduction Memo"
      outputDescription="Your recommendation document"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="123 Main Street" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Current List Price *</Label>
            <Input value={formData.currentPrice} onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })} placeholder="1,200,000" />
          </div>
          <div className="space-y-2">
            <Label>Recommended Price *</Label>
            <Input value={formData.recommendedPrice} onChange={(e) => setFormData({ ...formData, recommendedPrice: e.target.value })} placeholder="1,095,000" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Days on Market</Label>
            <Input value={formData.daysOnMarket} onChange={(e) => setFormData({ ...formData, daysOnMarket: e.target.value })} placeholder="45" />
          </div>
          <div className="space-y-2">
            <Label>Total Showings</Label>
            <Input value={formData.showingsCount} onChange={(e) => setFormData({ ...formData, showingsCount: e.target.value })} placeholder="18" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Market Data</Label>
          <Textarea value={formData.marketData} onChange={(e) => setFormData({ ...formData, marketData: e.target.value })} placeholder="Recent sales, average DOM, inventory levels..." />
        </div>
        <div className="space-y-2">
          <Label>Competitor Pricing</Label>
          <Textarea value={formData.competitorPricing} onChange={(e) => setFormData({ ...formData, competitorPricing: e.target.value })} placeholder="Similar active listings and their prices..." />
        </div>
        <div className="space-y-2">
          <Label>Feedback Summary</Label>
          <Textarea value={formData.feedbackSummary} onChange={(e) => setFormData({ ...formData, feedbackSummary: e.target.value })} placeholder="Key themes from buyer feedback..." />
        </div>
        <div className="space-y-2">
          <Label>Urgency Factors</Label>
          <Textarea value={formData.urgencyFactors} onChange={(e) => setFormData({ ...formData, urgencyFactors: e.target.value })} placeholder="Seasonal factors, seller timeline, market shifts..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default PriceReductionMemoGenerator;
