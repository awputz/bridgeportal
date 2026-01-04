import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const BuyerNeedsAnalysisGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    buyerName: "",
    propertyType: "",
    budgetMin: "",
    budgetMax: "",
    neighborhoods: "",
    bedrooms: "",
    bathrooms: "",
    mustHaves: "",
    niceToHaves: "",
    dealBreakers: "",
    timeline: "",
    financing: "",
    additionalNotes: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a comprehensive buyer needs analysis document for a real estate client.

Buyer Information:
- Name: ${data.buyerName}
- Property Type: ${data.propertyType}
- Budget Range: $${data.budgetMin} - $${data.budgetMax}
- Preferred Neighborhoods: ${data.neighborhoods}
- Bedrooms: ${data.bedrooms}
- Bathrooms: ${data.bathrooms}
- Timeline: ${data.timeline}
- Financing: ${data.financing}

Requirements:
Must-Haves: ${data.mustHaves}
Nice-to-Haves: ${data.niceToHaves}
Deal Breakers: ${data.dealBreakers}

Additional Notes: ${data.additionalNotes}

Generate a structured buyer needs analysis including:
1. Executive summary of buyer profile
2. Prioritized requirements matrix
3. Recommended search criteria
4. Market reality check (budget vs. expectations)
5. Suggested neighborhoods based on criteria
6. Next steps and action items`;

  const isFormValid = !!formData.buyerName && !!formData.propertyType && !!formData.budgetMax;

  return (
    <GeneratorShell
      id="buyer-needs-analysis"
      title="Buyer Needs Analysis"
      description="Document and analyze buyer requirements to find the perfect property match."
      icon={ClipboardList}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Buyer Analysis"
      outputDescription="Your comprehensive buyer needs analysis"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Buyer Name *</Label>
          <Input value={formData.buyerName} onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })} placeholder="John & Jane Smith" />
        </div>
        <div className="space-y-2">
          <Label>Property Type *</Label>
          <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="coop">Co-op</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="single-family">Single Family</SelectItem>
              <SelectItem value="multi-family">Multi-Family</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Min Budget</Label>
            <Input value={formData.budgetMin} onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })} placeholder="500,000" />
          </div>
          <div className="space-y-2">
            <Label>Max Budget *</Label>
            <Input value={formData.budgetMax} onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })} placeholder="750,000" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Preferred Neighborhoods</Label>
          <Input value={formData.neighborhoods} onChange={(e) => setFormData({ ...formData, neighborhoods: e.target.value })} placeholder="Upper West Side, Park Slope" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Input value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })} placeholder="2-3" />
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Input value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })} placeholder="2+" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Must-Haves</Label>
          <Textarea value={formData.mustHaves} onChange={(e) => setFormData({ ...formData, mustHaves: e.target.value })} placeholder="Doorman, laundry in unit, outdoor space..." />
        </div>
        <div className="space-y-2">
          <Label>Nice-to-Haves</Label>
          <Textarea value={formData.niceToHaves} onChange={(e) => setFormData({ ...formData, niceToHaves: e.target.value })} placeholder="Gym, roof deck, storage..." />
        </div>
        <div className="space-y-2">
          <Label>Deal Breakers</Label>
          <Textarea value={formData.dealBreakers} onChange={(e) => setFormData({ ...formData, dealBreakers: e.target.value })} placeholder="Walk-up, no pets allowed..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Timeline</Label>
            <Input value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} placeholder="3-6 months" />
          </div>
          <div className="space-y-2">
            <Label>Financing</Label>
            <Select value={formData.financing} onValueChange={(v) => setFormData({ ...formData, financing: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="conventional">Conventional Mortgage</SelectItem>
                <SelectItem value="fha">FHA</SelectItem>
                <SelectItem value="pre-approved">Pre-Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea value={formData.additionalNotes} onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })} placeholder="Any other relevant information..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default BuyerNeedsAnalysisGenerator;
