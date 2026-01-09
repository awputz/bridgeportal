import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface EmailFormData {
  emailType: string;
  subject: string;
  recipientType: string;
  propertyAddress: string;
  keyPoints: string;
  callToAction: string;
  senderName: string;
}

interface EmailFormProps {
  data: EmailFormData;
  onChange: (data: EmailFormData) => void;
}

const defaultData: EmailFormData = {
  emailType: "just-listed",
  subject: "",
  recipientType: "buyers",
  propertyAddress: "",
  keyPoints: "",
  callToAction: "schedule-showing",
  senderName: "",
};

export const EmailForm = ({ data, onChange }: EmailFormProps) => {
  useEffect(() => {
    if (!data.emailType) {
      onChange({ ...defaultData, ...data });
    }
  }, []);

  const handleChange = (field: keyof EmailFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="emailType">Email Type</Label>
        <Select
          value={data.emailType || "just-listed"}
          onValueChange={(value) => handleChange("emailType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="just-listed">Just Listed Announcement</SelectItem>
            <SelectItem value="open-house">Open House Invitation</SelectItem>
            <SelectItem value="price-reduced">Price Reduction Alert</SelectItem>
            <SelectItem value="market-update">Market Update</SelectItem>
            <SelectItem value="follow-up">Client Follow-up</SelectItem>
            <SelectItem value="newsletter">Monthly Newsletter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="recipientType">Target Audience</Label>
        <Select
          value={data.recipientType || "buyers"}
          onValueChange={(value) => handleChange("recipientType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyers">Potential Buyers</SelectItem>
            <SelectItem value="sellers">Potential Sellers</SelectItem>
            <SelectItem value="investors">Investors</SelectItem>
            <SelectItem value="past-clients">Past Clients</SelectItem>
            <SelectItem value="brokers">Other Brokers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Subject Line (optional)</Label>
        <Input
          id="subject"
          placeholder="Leave blank for AI to generate"
          value={data.subject || ""}
          onChange={(e) => handleChange("subject", e.target.value)}
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
        <Label htmlFor="keyPoints">Key Points to Include</Label>
        <Textarea
          id="keyPoints"
          placeholder="New listing at $1.5M, 4 bed/3 bath, renovated kitchen, great schools nearby..."
          value={data.keyPoints || ""}
          onChange={(e) => handleChange("keyPoints", e.target.value)}
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="callToAction">Call to Action</Label>
        <Select
          value={data.callToAction || "schedule-showing"}
          onValueChange={(value) => handleChange("callToAction", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select CTA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="schedule-showing">Schedule a Showing</SelectItem>
            <SelectItem value="contact-agent">Contact Agent</SelectItem>
            <SelectItem value="view-listing">View Full Listing</SelectItem>
            <SelectItem value="request-info">Request More Info</SelectItem>
            <SelectItem value="attend-open-house">Attend Open House</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="senderName">Your Name</Label>
        <Input
          id="senderName"
          placeholder="John Smith"
          value={data.senderName || ""}
          onChange={(e) => handleChange("senderName", e.target.value)}
        />
      </div>
    </div>
  );
};

export const isEmailFormValid = (data: EmailFormData): boolean => {
  return !!(data.emailType && data.recipientType && (data.propertyAddress || data.keyPoints));
};
