import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface ObjectionHandlerGeneratorProps {
  onBack: () => void;
}

export const ObjectionHandlerGenerator = ({ onBack }: ObjectionHandlerGeneratorProps) => {
  const [formData, setFormData] = useState({
    objectionType: "",
    specificObjection: "",
    context: "",
    clientType: "",
    propertyDetails: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an expert real estate negotiation coach.

Create scripts for handling this objection:
- Objection Category: ${data.objectionType}
- Specific Objection: "${data.specificObjection}"
- Context: ${data.context}
- Client Type: ${data.clientType}
- Property/Deal Details: ${data.propertyDetails}

Generate:
1. ACKNOWLEDGE (empathize with their concern)
2. CLARIFY (questions to understand the real issue)
3. RESPOND (2-3 different response approaches)
4. REDIRECT (how to move the conversation forward)
5. SUPPORTING POINTS (facts/data to reinforce your position)

Keep responses conversational and natural. Avoid being pushy or salesy.
`;

  const isFormValid = formData.objectionType && formData.specificObjection;

  return (
    <GeneratorShell
      id="objection-handler"
      title="Objection Handler"
      description="Scripts for handling common client objections"
      icon={MessageSquare}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Objection Response Scripts"
      outputDescription="Multiple approaches to handle the objection"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Objection Category *</Label>
          <Select value={formData.objectionType} onValueChange={(v) => setFormData({ ...formData, objectionType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-too-high">Price Too High</SelectItem>
              <SelectItem value="price-too-low">Price Too Low (Seller)</SelectItem>
              <SelectItem value="commission">Commission/Fees</SelectItem>
              <SelectItem value="timing">Timing/Not Ready</SelectItem>
              <SelectItem value="competition">Using Another Broker</SelectItem>
              <SelectItem value="location">Location Concerns</SelectItem>
              <SelectItem value="condition">Property Condition</SelectItem>
              <SelectItem value="need-to-think">Need to Think About It</SelectItem>
              <SelectItem value="market-conditions">Market Conditions</SelectItem>
              <SelectItem value="terms">Deal Terms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Specific Objection *</Label>
          <Textarea
            placeholder="Exactly what the client said..."
            value={formData.specificObjection}
            onChange={(e) => setFormData({ ...formData, specificObjection: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Client Type</Label>
          <Select value={formData.clientType} onValueChange={(v) => setFormData({ ...formData, clientType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="landlord">Landlord</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Context</Label>
          <Textarea
            placeholder="Background on the situation, relationship, deal stage..."
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Property/Deal Details</Label>
          <Input
            placeholder="Relevant property or deal information"
            value={formData.propertyDetails}
            onChange={(e) => setFormData({ ...formData, propertyDetails: e.target.value })}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default ObjectionHandlerGenerator;
