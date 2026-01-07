import { useState } from "react";
import { LineChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const DispositionStrategyGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "", ownershipDuration: "", currentPerformance: "", ownerGoals: "", marketConditions: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are an exit strategy advisor for a property owner.

Property: ${data.propertyAddress}
Ownership Duration: ${data.ownershipDuration}
Current Performance: ${data.currentPerformance}
Owner Goals: ${data.ownerGoals}
Market Conditions: ${data.marketConditions}

Create a disposition strategy memo including:
1. SITUATION ANALYSIS (current position, performance)
2. TIMING CONSIDERATIONS (market cycle, tax implications)
3. EXIT OPTIONS (outright sale, refinance, 1031, hold)
4. RECOMMENDED STRATEGY (with rationale)
5. EXECUTION PLAN (timeline, marketing approach)
6. VALUE MAXIMIZATION TACTICS
7. RISK FACTORS AND MITIGANTS

Be strategic and consider all angles including tax, timing, and market factors.
`;

  return (
    <GeneratorShell
      id="disposition-strategy" title="Disposition Strategy"
      description="Exit strategy recommendations for owners"
      icon={LineChart} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.propertyAddress && formData.ownerGoals)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <AddressAutocomplete value={formData.propertyAddress}
            onChange={(value) => setFormData({ ...formData, propertyAddress: value })}
            onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress })}
            placeholder="Start typing an address..." />
        </div>
        <div className="space-y-2">
          <Label>Ownership Duration</Label>
          <Input placeholder="Purchased in 2018, held for 6 years"
            value={formData.ownershipDuration} onChange={(e) => setFormData({ ...formData, ownershipDuration: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Current Performance</Label>
          <Textarea placeholder="NOI, occupancy, recent improvements..."
            value={formData.currentPerformance} onChange={(e) => setFormData({ ...formData, currentPerformance: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Owner Goals *</Label>
          <Textarea placeholder="Maximize proceeds, minimize taxes, 1031 into larger asset..."
            value={formData.ownerGoals} onChange={(e) => setFormData({ ...formData, ownerGoals: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Market Conditions</Label>
          <Input placeholder="Strong buyer demand, rising rates, etc."
            value={formData.marketConditions} onChange={(e) => setFormData({ ...formData, marketConditions: e.target.value })} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default DispositionStrategyGenerator;
