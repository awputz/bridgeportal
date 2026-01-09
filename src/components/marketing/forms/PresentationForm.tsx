import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PresentationFormData {
  presentationType: string;
  clientName: string;
  propertyAddress: string;
  askingPrice: string;
  marketAnalysis: string;
  competitiveAdvantages: string;
  agentExperience: string;
  timeline: string;
}

interface PresentationFormProps {
  data: PresentationFormData;
  onChange: (data: PresentationFormData) => void;
}

const defaultData: PresentationFormData = {
  presentationType: "listing",
  clientName: "",
  propertyAddress: "",
  askingPrice: "",
  marketAnalysis: "",
  competitiveAdvantages: "",
  agentExperience: "",
  timeline: "",
};

export const PresentationForm = ({ data, onChange }: PresentationFormProps) => {
  useEffect(() => {
    if (!data.presentationType) {
      onChange({ ...defaultData, ...data });
    }
  }, []);

  const handleChange = (field: keyof PresentationFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="presentationType">Presentation Type</Label>
        <Select
          value={data.presentationType || "listing"}
          onValueChange={(value) => handleChange("presentationType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="listing">Listing Presentation</SelectItem>
            <SelectItem value="buyer">Buyer Consultation</SelectItem>
            <SelectItem value="investor">Investor Pitch</SelectItem>
            <SelectItem value="market-report">Market Report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          placeholder="Mr. & Mrs. Smith"
          value={data.clientName || ""}
          onChange={(e) => handleChange("clientName", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="propertyAddress">Property Address</Label>
        <Input
          id="propertyAddress"
          placeholder="123 Main Street, City, State"
          value={data.propertyAddress || ""}
          onChange={(e) => handleChange("propertyAddress", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="askingPrice">Suggested Price / Budget</Label>
        <Input
          id="askingPrice"
          placeholder="$1,500,000"
          value={data.askingPrice || ""}
          onChange={(e) => handleChange("askingPrice", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="marketAnalysis">Market Context</Label>
        <Textarea
          id="marketAnalysis"
          placeholder="Recent comparable sales, market trends, neighborhood insights..."
          value={data.marketAnalysis || ""}
          onChange={(e) => handleChange("marketAnalysis", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="competitiveAdvantages">Competitive Advantages</Label>
        <Textarea
          id="competitiveAdvantages"
          placeholder="Why should they choose you? Your unique value proposition..."
          value={data.competitiveAdvantages || ""}
          onChange={(e) => handleChange("competitiveAdvantages", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="agentExperience">Your Experience & Track Record</Label>
        <Textarea
          id="agentExperience"
          placeholder="Years in business, properties sold, client testimonials..."
          value={data.agentExperience || ""}
          onChange={(e) => handleChange("agentExperience", e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="timeline">Proposed Timeline</Label>
        <Input
          id="timeline"
          placeholder="30-60 days to close"
          value={data.timeline || ""}
          onChange={(e) => handleChange("timeline", e.target.value)}
        />
      </div>
    </div>
  );
};

export const isPresentationFormValid = (data: PresentationFormData): boolean => {
  return !!(data.presentationType && data.clientName);
};
