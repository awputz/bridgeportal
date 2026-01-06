import { useState } from "react";
import { Presentation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const SellerPitchDeckGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    sellerName: "",
    propertyAddress: "",
    propertyType: "",
    estimatedValue: "",
    agentName: "",
    firmName: "",
    marketConditions: "",
    comparableDeals: "",
    valueProposition: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an expert real estate agent creating a compelling listing presentation to win an exclusive listing.

Create a detailed slide-by-slide presentation for:

CLIENT: ${data.sellerName}
PROPERTY: ${data.propertyAddress}
TYPE: ${data.propertyType}
ESTIMATED VALUE: $${Number(data.estimatedValue).toLocaleString()}
AGENT: ${data.agentName}
FIRM: ${data.firmName}

MARKET CONDITIONS:
${data.marketConditions || "Current market conditions"}

COMPARABLE DEALS:
${data.comparableDeals || "Recent comparable sales"}

VALUE PROPOSITION:
${data.valueProposition || "Why choose us"}

Create the following slides:

1. COVER SLIDE - Agent name, firm, "Marketing Proposal for [Property]"

2. ABOUT ME/US - Agent credentials, experience, track record

3. MARKET ANALYSIS - Current conditions, trends, timing

4. COMPARABLE SALES - Recent sales, pricing analysis

5. PRICING STRATEGY - Recommended list price, rationale

6. MARKETING PLAN - Photography, staging, digital marketing, open houses

7. DIGITAL PRESENCE - Online listing syndication, social media, email

8. PRINT & COLLATERAL - Flyers, brochures, mailers

9. TIMELINE & PROCESS - Week-by-week marketing schedule

10. OUR COMMITMENT - Communication cadence, reporting, guarantees

11. TESTIMONIALS - Client success stories, reviews

12. NEXT STEPS - Listing agreement, getting started

Format each slide with title, bullet points, visual suggestions, and presenter notes.
Focus on demonstrating expertise, building trust, and differentiating from competition.
`;

  const isFormValid = formData.sellerName && formData.propertyAddress && formData.agentName;

  return (
    <GeneratorShell
      id="seller-pitch-deck"
      title="Seller Pitch Deck"
      description="Create a compelling listing presentation to win sellers"
      icon={Presentation}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Seller Name *</Label>
            <Input
              placeholder="John & Jane Smith"
              value={formData.sellerName}
              onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Input
              placeholder="3BR Condo, Multifamily, Office Building..."
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            />
          </div>

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
            <Label>Estimated Value</Label>
            <Input
              type="number"
              placeholder="1500000"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Your Name *</Label>
            <Input
              placeholder="Sarah Johnson"
              value={formData.agentName}
              onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Firm Name</Label>
            <Input
              placeholder="Bridge Advisory Group"
              value={formData.firmName}
              onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Current Market Conditions</Label>
          <Textarea
            placeholder="Low inventory, strong buyer demand, interest rates stabilizing..."
            value={formData.marketConditions}
            onChange={(e) => setFormData({ ...formData, marketConditions: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Comparable Deals</Label>
          <Textarea
            placeholder="123 Oak St sold for $1.2M (3 months ago), 456 Elm Ave sold for $1.35M..."
            value={formData.comparableDeals}
            onChange={(e) => setFormData({ ...formData, comparableDeals: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Your Value Proposition</Label>
          <Textarea
            placeholder="15 years experience, 50+ deals in neighborhood, premium marketing, dedicated service..."
            value={formData.valueProposition}
            onChange={(e) => setFormData({ ...formData, valueProposition: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default SellerPitchDeckGenerator;
