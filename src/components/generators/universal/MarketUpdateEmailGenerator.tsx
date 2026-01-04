import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface MarketUpdateEmailGeneratorProps {
  onBack: () => void;
}

export const MarketUpdateEmailGenerator = ({ onBack }: MarketUpdateEmailGeneratorProps) => {
  const [formData, setFormData] = useState({
    marketArea: "",
    propertyType: "",
    timeframe: "",
    keyTrends: "",
    notableDeals: "",
    outlook: "",
    agentName: "",
    audienceType: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a real estate market analyst writing an email newsletter.

Create a market update email with:
- Market Area: ${data.marketArea}
- Property Type Focus: ${data.propertyType}
- Timeframe: ${data.timeframe}
- Key Trends: ${data.keyTrends}
- Notable Deals: ${data.notableDeals}
- Market Outlook: ${data.outlook}
- From: ${data.agentName}
- Audience: ${data.audienceType}

Generate:
1. SUBJECT LINE (compelling and specific)
2. PREVIEW TEXT (for email clients)
3. OPENING (hook the reader)
4. MARKET OVERVIEW (2-3 paragraphs with key stats)
5. NOTABLE TRANSACTIONS (if provided)
6. OUTLOOK & OPPORTUNITIES
7. CALL TO ACTION (schedule a call, reply, etc.)
8. SIGN-OFF

Keep it informative but scannable. Use bullet points and bold for key stats.
`;

  const isFormValid = formData.marketArea && formData.propertyType && formData.agentName;

  return (
    <GeneratorShell
      id="market-update-email"
      title="Market Update Email"
      description="Market update newsletters for your client base"
      icon={TrendingUp}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Market Newsletter"
      outputDescription="Complete email with subject line"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Market Area *</Label>
            <Input
              placeholder="Manhattan, Brooklyn, etc."
              value={formData.marketArea}
              onChange={(e) => setFormData({ ...formData, marketArea: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Property Type *</Label>
            <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multifamily">Multifamily</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="all-sectors">All Sectors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Select value={formData.timeframe} onValueChange={(v) => setFormData({ ...formData, timeframe: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly Update</SelectItem>
                <SelectItem value="quarterly">Quarterly Update</SelectItem>
                <SelectItem value="year-end">Year-End Review</SelectItem>
                <SelectItem value="mid-year">Mid-Year Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Audience Type</Label>
            <Select value={formData.audienceType} onValueChange={(v) => setFormData({ ...formData, audienceType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investors">Investors</SelectItem>
                <SelectItem value="owners">Property Owners</SelectItem>
                <SelectItem value="tenants">Tenants</SelectItem>
                <SelectItem value="general">General Contacts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Key Trends</Label>
          <Textarea
            placeholder="Cap rate compression, rent growth, absorption rates..."
            value={formData.keyTrends}
            onChange={(e) => setFormData({ ...formData, keyTrends: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Notable Deals</Label>
          <Textarea
            placeholder="Recent significant transactions to highlight..."
            value={formData.notableDeals}
            onChange={(e) => setFormData({ ...formData, notableDeals: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Market Outlook</Label>
          <Input
            placeholder="Bullish, cautiously optimistic, neutral..."
            value={formData.outlook}
            onChange={(e) => setFormData({ ...formData, outlook: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Your Name *</Label>
          <Input
            placeholder="Your name"
            value={formData.agentName}
            onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default MarketUpdateEmailGenerator;
