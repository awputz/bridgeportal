import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const Exchange1031BriefGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    clientName: "", relinquishedProperty: "", salePrice: "", timeline: "", exchangeGoals: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a 1031 exchange specialist creating an educational brief.

Client: ${data.clientName}
Relinquished Property: ${data.relinquishedProperty}
Expected Sale Price: ${data.salePrice}
Timeline: ${data.timeline}
Client Goals: ${data.exchangeGoals}

Create an educational 1031 exchange brief including:
1. WHAT IS A 1031 EXCHANGE (brief overview)
2. KEY TIMELINES (45-day identification, 180-day close)
3. IDENTIFICATION RULES (3-property rule, 200% rule)
4. CLIENT'S SITUATION ANALYSIS
5. RECOMMENDED NEXT STEPS
6. IMPORTANT CONSIDERATIONS

Keep it educational but personalized to their situation. Remind them to consult tax/legal advisors.
`;

  return (
    <GeneratorShell
      id="1031-exchange-brief" title="1031 Exchange Brief"
      description="Educational briefs for 1031 exchange clients"
      icon={ArrowRightLeft} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.clientName && formData.relinquishedProperty)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Client Name *</Label>
          <Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Relinquished Property *</Label>
          <Textarea placeholder="Property being sold: address, type, acquisition date..."
            value={formData.relinquishedProperty} onChange={(e) => setFormData({ ...formData, relinquishedProperty: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Expected Sale Price</Label>
          <Input value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Timeline</Label>
          <Input placeholder="When is the sale expected to close?" value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Exchange Goals</Label>
          <Textarea placeholder="What is the client looking to achieve?"
            value={formData.exchangeGoals} onChange={(e) => setFormData({ ...formData, exchangeGoals: e.target.value })} rows={2} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default Exchange1031BriefGenerator;
