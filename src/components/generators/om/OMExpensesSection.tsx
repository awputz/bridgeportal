import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OMExpenses } from "@/types/om-generator";

interface OMExpensesSectionProps {
  data: OMExpenses;
  onChange: (data: OMExpenses) => void;
}

export const OMExpensesSection = ({ data, onChange }: OMExpensesSectionProps) => {
  const update = (field: keyof OMExpenses, value: string) => {
    onChange({ ...data, [field]: value });
  };

  // Calculate total expenses
  const calculateTotal = () => {
    const fields = ['realEstateTaxes', 'insurance', 'utilities', 'payroll', 'repairsMaintenance', 'professionalFees', 'marketing', 'capexReserves'] as const;
    const total = fields.reduce((sum, field) => {
      const val = parseFloat(data[field]) || 0;
      return sum + val;
    }, 0);
    return total;
  };

  const totalExpenses = calculateTotal();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="realEstateTaxes">RE Taxes ($)</Label>
          <Input
            id="realEstateTaxes"
            type="number"
            value={data.realEstateTaxes}
            onChange={(e) => update("realEstateTaxes", e.target.value)}
            placeholder="50,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance">Insurance ($)</Label>
          <Input
            id="insurance"
            type="number"
            value={data.insurance}
            onChange={(e) => update("insurance", e.target.value)}
            placeholder="15,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="utilities">Utilities ($)</Label>
          <Input
            id="utilities"
            type="number"
            value={data.utilities}
            onChange={(e) => update("utilities", e.target.value)}
            placeholder="30,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="managementFee">Mgmt Fee (%)</Label>
          <Input
            id="managementFee"
            type="number"
            step="0.1"
            value={data.managementFee}
            onChange={(e) => update("managementFee", e.target.value)}
            placeholder="4"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payroll">Payroll ($)</Label>
          <Input
            id="payroll"
            type="number"
            value={data.payroll}
            onChange={(e) => update("payroll", e.target.value)}
            placeholder="25,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repairsMaintenance">R&M ($)</Label>
          <Input
            id="repairsMaintenance"
            type="number"
            value={data.repairsMaintenance}
            onChange={(e) => update("repairsMaintenance", e.target.value)}
            placeholder="20,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="professionalFees">Prof. Fees ($)</Label>
          <Input
            id="professionalFees"
            type="number"
            value={data.professionalFees}
            onChange={(e) => update("professionalFees", e.target.value)}
            placeholder="5,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capexReserves">CapEx Reserve ($)</Label>
          <Input
            id="capexReserves"
            type="number"
            value={data.capexReserves}
            onChange={(e) => update("capexReserves", e.target.value)}
            placeholder="10,000"
          />
        </div>
      </div>

      {/* Auto-calculated total */}
      <div className="p-3 bg-muted/30 rounded-lg border border-border/50 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Calculated Total Expenses</span>
        <span className="font-medium">
          {totalExpenses > 0 
            ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(totalExpenses)
            : "—"
          }
        </span>
      </div>
    </div>
  );
};
