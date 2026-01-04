import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const ShowingFeedbackSummaryGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    listingPrice: "",
    daysOnMarket: "",
    totalShowings: "",
    feedbackEntries: "",
    commonPositives: "",
    commonConcerns: "",
    offerActivity: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a comprehensive showing feedback summary for the seller.

Property: ${data.propertyAddress}
Listing Price: $${data.listingPrice}
Days on Market: ${data.daysOnMarket}
Total Showings: ${data.totalShowings}

Feedback from Showings:
${data.feedbackEntries}

Common Positives Mentioned: ${data.commonPositives}
Common Concerns: ${data.commonConcerns}
Offer Activity: ${data.offerActivity}

Generate a professional showing feedback report that includes:
1. Executive summary of showing activity
2. Overall market response assessment
3. Breakdown of positive feedback themes
4. Analysis of concerns and objections
5. Price perception from buyers/agents
6. Comparison to similar listings
7. Actionable recommendations
8. Suggested next steps

Be honest but diplomatic - help the seller understand market reality while maintaining their confidence.`;

  const isFormValid = !!formData.propertyAddress && !!formData.feedbackEntries;

  return (
    <GeneratorShell
      id="showing-feedback-summary"
      title="Showing Feedback Summary"
      description="Compile and summarize buyer feedback from property showings for sellers."
      icon={MessageSquare}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Feedback Report"
      outputDescription="Your comprehensive feedback summary"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="123 Main Street" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Listing Price</Label>
            <Input value={formData.listingPrice} onChange={(e) => setFormData({ ...formData, listingPrice: e.target.value })} placeholder="1,200,000" />
          </div>
          <div className="space-y-2">
            <Label>Days on Market</Label>
            <Input value={formData.daysOnMarket} onChange={(e) => setFormData({ ...formData, daysOnMarket: e.target.value })} placeholder="21" />
          </div>
          <div className="space-y-2">
            <Label>Total Showings</Label>
            <Input value={formData.totalShowings} onChange={(e) => setFormData({ ...formData, totalShowings: e.target.value })} placeholder="12" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Showing Feedback *</Label>
          <Textarea 
            value={formData.feedbackEntries} 
            onChange={(e) => setFormData({ ...formData, feedbackEntries: e.target.value })} 
            placeholder="Enter feedback from each showing...&#10;&#10;Showing 1 (Jan 15): Loved the kitchen, concerned about price&#10;Showing 2 (Jan 16): Great layout, street noise mentioned..."
            className="min-h-[150px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Common Positives</Label>
          <Textarea value={formData.commonPositives} onChange={(e) => setFormData({ ...formData, commonPositives: e.target.value })} placeholder="Location, natural light, updated kitchen..." />
        </div>
        <div className="space-y-2">
          <Label>Common Concerns</Label>
          <Textarea value={formData.commonConcerns} onChange={(e) => setFormData({ ...formData, commonConcerns: e.target.value })} placeholder="Price, lack of outdoor space, dated bathrooms..." />
        </div>
        <div className="space-y-2">
          <Label>Offer Activity</Label>
          <Textarea value={formData.offerActivity} onChange={(e) => setFormData({ ...formData, offerActivity: e.target.value })} placeholder="Any offers received, second showings scheduled..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default ShowingFeedbackSummaryGenerator;
