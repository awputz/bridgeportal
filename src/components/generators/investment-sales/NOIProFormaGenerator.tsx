import { useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props { onBack: () => void; }

export const NOIProFormaGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "", currentIncome: "", currentExpenses: "", projectedRents: "",
    expenseAssumptions: "", holdPeriod: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a real estate financial analyst creating a pro forma narrative.

Property: ${data.propertyAddress}
Current Income: ${data.currentIncome}
Current Expenses: ${data.currentExpenses}
Projected Rent Increases: ${data.projectedRents}
Expense Assumptions: ${data.expenseAssumptions}
Hold Period: ${data.holdPeriod}

Generate a pro forma narrative including:
1. CURRENT PERFORMANCE SUMMARY
2. INCOME ASSUMPTIONS (rent growth, vacancy, other income)
3. EXPENSE ASSUMPTIONS (operating costs, capex reserves)
4. PROJECTED NOI (year-by-year summary)
5. VALUE CREATION ANALYSIS
6. KEY SENSITIVITIES (what moves the needle)

Present clearly with supporting rationale for each assumption.
`;

  return (
    <GeneratorShell
      id="noi-pro-forma" title="NOI Pro Forma"
      description="AI-assisted NOI projections and pro forma narratives"
      icon={Calculator} onBack={onBack} promptBuilder={promptBuilder} formData={formData}
      isFormValid={!!(formData.propertyAddress && formData.currentIncome)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Current Income *</Label>
          <Textarea placeholder="Gross rent, other income, vacancy..." value={formData.currentIncome}
            onChange={(e) => setFormData({ ...formData, currentIncome: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Current Expenses</Label>
          <Textarea placeholder="RE taxes, insurance, utilities, management..." value={formData.currentExpenses}
            onChange={(e) => setFormData({ ...formData, currentExpenses: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Projected Rent Increases</Label>
          <Input placeholder="3% annual, mark-to-market opportunity..." value={formData.projectedRents}
            onChange={(e) => setFormData({ ...formData, projectedRents: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Expense Assumptions</Label>
          <Input placeholder="2% annual increase, capex reserves..." value={formData.expenseAssumptions}
            onChange={(e) => setFormData({ ...formData, expenseAssumptions: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Hold Period</Label>
          <Input placeholder="5 years" value={formData.holdPeriod}
            onChange={(e) => setFormData({ ...formData, holdPeriod: e.target.value })} />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default NOIProFormaGenerator;
