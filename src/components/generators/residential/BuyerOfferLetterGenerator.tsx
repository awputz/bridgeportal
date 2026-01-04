import { useState } from "react";
import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const BuyerOfferLetterGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    buyerNames: "",
    propertyAddress: "",
    offerAmount: "",
    sellerName: "",
    whatTheyLove: "",
    buyerBackground: "",
    futurePlans: "",
    closingFlexibility: "",
    personalTouch: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Write a compelling buyer offer letter to accompany a purchase offer.

Buyers: ${data.buyerNames}
Property: ${data.propertyAddress}
Offer Amount: $${data.offerAmount}
Seller Name: ${data.sellerName}
What They Love About the Home: ${data.whatTheyLove}
Buyer Background: ${data.buyerBackground}
Future Plans for the Home: ${data.futurePlans}
Closing Flexibility: ${data.closingFlexibility}
Personal Touch: ${data.personalTouch}

Write a heartfelt, genuine letter that:
1. Introduces the buyers personally
2. Expresses genuine appreciation for the home
3. Shares their story and why this home matters
4. Describes how they envision living there
5. Assures the seller the home will be cherished
6. Mentions any flexible terms
7. Closes with warmth and respect

Keep it authentic and personal - not generic or overly sentimental. Make the seller feel good about choosing these buyers.`;

  const isFormValid = !!formData.buyerNames && !!formData.propertyAddress && !!formData.whatTheyLove;

  return (
    <GeneratorShell
      id="buyer-offer-letter"
      title="Buyer Offer Letter"
      description="Create compelling personal letters to accompany purchase offers."
      icon={Heart}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Offer Letter"
      outputDescription="Your heartfelt buyer letter"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Buyer Name(s) *</Label>
          <Input value={formData.buyerNames} onChange={(e) => setFormData({ ...formData, buyerNames: e.target.value })} placeholder="Michael and Sarah Chen" />
        </div>
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="789 Maple Avenue" />
        </div>
        <div className="space-y-2">
          <Label>Offer Amount</Label>
          <Input value={formData.offerAmount} onChange={(e) => setFormData({ ...formData, offerAmount: e.target.value })} placeholder="875,000" />
        </div>
        <div className="space-y-2">
          <Label>Seller Name (if known)</Label>
          <Input value={formData.sellerName} onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })} placeholder="The Johnson Family" />
        </div>
        <div className="space-y-2">
          <Label>What They Love About the Home *</Label>
          <Textarea value={formData.whatTheyLove} onChange={(e) => setFormData({ ...formData, whatTheyLove: e.target.value })} placeholder="The original hardwood floors, the backyard garden, the light-filled kitchen..." />
        </div>
        <div className="space-y-2">
          <Label>Buyer Background</Label>
          <Textarea value={formData.buyerBackground} onChange={(e) => setFormData({ ...formData, buyerBackground: e.target.value })} placeholder="We're a young couple, both teachers, looking for our first home..." />
        </div>
        <div className="space-y-2">
          <Label>Future Plans for the Home</Label>
          <Textarea value={formData.futurePlans} onChange={(e) => setFormData({ ...formData, futurePlans: e.target.value })} placeholder="Raise our family, host holiday gatherings, preserve the character..." />
        </div>
        <div className="space-y-2">
          <Label>Closing Flexibility</Label>
          <Select value={formData.closingFlexibility} onValueChange={(v) => setFormData({ ...formData, closingFlexibility: v })}>
            <SelectTrigger><SelectValue placeholder="Select flexibility" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="very-flexible">Very Flexible - Any timeline works</SelectItem>
              <SelectItem value="flexible">Flexible - Some room to adjust</SelectItem>
              <SelectItem value="standard">Standard 30-60 days</SelectItem>
              <SelectItem value="quick-close">Quick Close Preferred</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Personal Touch</Label>
          <Textarea value={formData.personalTouch} onChange={(e) => setFormData({ ...formData, personalTouch: e.target.value })} placeholder="Any personal connection or special detail to include..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default BuyerOfferLetterGenerator;
