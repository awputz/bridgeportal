import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OMValueAdd } from "@/types/om-generator";

interface OMValueAddSectionProps {
  data: OMValueAdd;
  onChange: (data: OMValueAdd) => void;
}

export const OMValueAddSection = ({ data, onChange }: OMValueAddSectionProps) => {
  const update = (field: keyof OMValueAdd, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="upsideNarrative">Value-Add Narrative</Label>
        <Textarea
          id="upsideNarrative"
          value={data.upsideNarrative}
          onChange={(e) => update("upsideNarrative", e.target.value)}
          placeholder="Describe the upside story: below-market rents, renovation potential, operational improvements, etc..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="renovationBudget">Renovation Budget ($)</Label>
          <Input
            id="renovationBudget"
            type="number"
            value={data.renovationBudget}
            onChange={(e) => update("renovationBudget", e.target.value)}
            placeholder="500,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expectedRentIncrease">Expected Rent Increase (%)</Label>
          <Input
            id="expectedRentIncrease"
            type="number"
            step="0.1"
            value={data.expectedRentIncrease}
            onChange={(e) => update("expectedRentIncrease", e.target.value)}
            placeholder="25"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expenseSavings">Annual Expense Savings ($)</Label>
          <Input
            id="expenseSavings"
            type="number"
            value={data.expenseSavings}
            onChange={(e) => update("expenseSavings", e.target.value)}
            placeholder="15,000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalIncomeOpportunities">Additional Income Opportunities</Label>
        <Textarea
          id="additionalIncomeOpportunities"
          value={data.additionalIncomeOpportunities}
          onChange={(e) => update("additionalIncomeOpportunities", e.target.value)}
          placeholder="e.g., Add laundry income, monetize rooftop, convert basement to storage..."
          rows={2}
        />
      </div>
    </div>
  );
};
