import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OMIncomeDetails } from "@/types/om-generator";

interface OMIncomeSectionProps {
  data: OMIncomeDetails;
  onChange: (data: OMIncomeDetails) => void;
}

export const OMIncomeSection = ({ data, onChange }: OMIncomeSectionProps) => {
  const update = (field: keyof OMIncomeDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grossPotentialRent">Gross Potential Rent ($)</Label>
          <Input
            id="grossPotentialRent"
            type="number"
            value={data.grossPotentialRent}
            onChange={(e) => update("grossPotentialRent", e.target.value)}
            placeholder="500,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effectiveGrossIncome">Effective Gross Income ($)</Label>
          <Input
            id="effectiveGrossIncome"
            type="number"
            value={data.effectiveGrossIncome}
            onChange={(e) => update("effectiveGrossIncome", e.target.value)}
            placeholder="475,000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lossToLease">Loss to Lease (%)</Label>
          <Input
            id="lossToLease"
            type="number"
            step="0.1"
            value={data.lossToLease}
            onChange={(e) => update("lossToLease", e.target.value)}
            placeholder="15"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
          <Input
            id="vacancyRate"
            type="number"
            step="0.1"
            value={data.vacancyRate}
            onChange={(e) => update("vacancyRate", e.target.value)}
            placeholder="5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="otherIncome">Other Income ($)</Label>
          <Input
            id="otherIncome"
            type="number"
            value={data.otherIncome}
            onChange={(e) => update("otherIncome", e.target.value)}
            placeholder="25,000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherIncomeDescription">Other Income Sources</Label>
        <Input
          id="otherIncomeDescription"
          value={data.otherIncomeDescription}
          onChange={(e) => update("otherIncomeDescription", e.target.value)}
          placeholder="Laundry, parking, storage, late fees..."
        />
      </div>
    </div>
  );
};
