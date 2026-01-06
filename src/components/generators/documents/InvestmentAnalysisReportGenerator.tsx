import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const InvestmentAnalysisReportGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "",
    askingPrice: "",
    noi: "",
    capRate: "",
    financingAssumptions: "",
    holdPeriod: "",
    exitCapRate: "",
    valueAddOpportunities: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create a comprehensive Investment Analysis Report:

PROPERTY: ${data.propertyAddress}
TYPE: ${data.propertyType}
ASKING PRICE: $${Number(data.askingPrice).toLocaleString()}
CURRENT NOI: $${Number(data.noi).toLocaleString()}
CAP RATE: ${data.capRate}%
FINANCING: ${data.financingAssumptions || "70% LTV at 6.5%"}
HOLD PERIOD: ${data.holdPeriod || "5 years"}
EXIT CAP: ${data.exitCapRate || "5.5%"}

VALUE-ADD OPPORTUNITIES:
${data.valueAddOpportunities}

Create a detailed investment analysis including:

1. EXECUTIVE SUMMARY
   - Investment thesis in 2-3 sentences
   - Key return metrics
   - Risk/reward assessment

2. ACQUISITION ANALYSIS
   - Purchase price breakdown
   - Price per unit/SF
   - Cap rate analysis vs. market

3. FINANCING STRUCTURE
   - Loan terms and assumptions
   - Equity requirement
   - Debt service coverage

4. CASH FLOW PROJECTIONS
   - Year 1-5 NOI projections
   - Cash-on-cash returns by year
   - Cumulative cash flow

5. VALUE-ADD ANALYSIS
   - Improvement costs
   - Pro forma rent increases
   - ROI on improvements

6. EXIT ANALYSIS
   - Projected sale price
   - IRR calculation
   - Equity multiple

7. SENSITIVITY ANALYSIS
   - Impact of cap rate changes
   - Rent growth scenarios
   - Interest rate sensitivity

8. RISK FACTORS
   - Market risks
   - Property-specific risks
   - Mitigation strategies

9. RECOMMENDATION
   - Buy/Pass recommendation
   - Key conditions for success
`;

  const isFormValid = formData.propertyAddress && formData.askingPrice && formData.noi;

  return (
    <GeneratorShell
      id="investment-analysis-report"
      title="Investment Analysis Report"
      description="Create detailed investment analysis with returns projections"
      icon={TrendingUp}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <Label>Property Type</Label>
            <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multifamily">Multifamily</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="mixed-use">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Asking Price *</Label>
            <Input
              type="number"
              placeholder="5000000"
              value={formData.askingPrice}
              onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Current NOI *</Label>
            <Input
              type="number"
              placeholder="350000"
              value={formData.noi}
              onChange={(e) => setFormData({ ...formData, noi: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Cap Rate (%)</Label>
            <Input
              placeholder="6.5"
              value={formData.capRate}
              onChange={(e) => setFormData({ ...formData, capRate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Hold Period (years)</Label>
            <Input
              placeholder="5"
              value={formData.holdPeriod}
              onChange={(e) => setFormData({ ...formData, holdPeriod: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Exit Cap Rate (%)</Label>
            <Input
              placeholder="5.5"
              value={formData.exitCapRate}
              onChange={(e) => setFormData({ ...formData, exitCapRate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Financing Assumptions</Label>
          <Input
            placeholder="70% LTV at 6.5%, 30-year amortization"
            value={formData.financingAssumptions}
            onChange={(e) => setFormData({ ...formData, financingAssumptions: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Value-Add Opportunities</Label>
          <Textarea
            placeholder="Rent upside, expense reduction, unit renovations, operational improvements..."
            value={formData.valueAddOpportunities}
            onChange={(e) => setFormData({ ...formData, valueAddOpportunities: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default InvestmentAnalysisReportGenerator;
