import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OMPricingReturns } from "@/types/om-generator";
import { formatCurrency } from "@/types/om-generator";

interface OMPricingSectionProps {
  data: OMPricingReturns;
  onChange: (data: OMPricingReturns) => void;
  calculatedMetrics: {
    pricePerUnit: number;
    pricePerSF: number;
    capRate: number;
  };
}

export const OMPricingSection = ({ data, onChange, calculatedMetrics }: OMPricingSectionProps) => {
  const update = (field: keyof OMPricingReturns, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="askingPrice">Asking Price ($)</Label>
          <Input
            id="askingPrice"
            type="number"
            value={data.askingPrice}
            onChange={(e) => update("askingPrice", e.target.value)}
            placeholder="5,000,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentNOI">Current NOI ($)</Label>
          <Input
            id="currentNOI"
            type="number"
            value={data.currentNOI}
            onChange={(e) => update("currentNOI", e.target.value)}
            placeholder="300,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proFormaNOI">Pro Forma NOI ($)</Label>
          <Input
            id="proFormaNOI"
            type="number"
            value={data.proFormaNOI}
            onChange={(e) => update("proFormaNOI", e.target.value)}
            placeholder="375,000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentCapRate">Current Cap Rate (%)</Label>
          <Input
            id="currentCapRate"
            type="number"
            step="0.01"
            value={data.currentCapRate}
            onChange={(e) => update("currentCapRate", e.target.value)}
            placeholder="5.25"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proFormaCapRate">Pro Forma Cap Rate (%)</Label>
          <Input
            id="proFormaCapRate"
            type="number"
            step="0.01"
            value={data.proFormaCapRate}
            onChange={(e) => update("proFormaCapRate", e.target.value)}
            placeholder="6.50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupancyRate">Occupancy Rate (%)</Label>
          <Input
            id="occupancyRate"
            type="number"
            step="0.1"
            value={data.occupancyRate}
            onChange={(e) => update("occupancyRate", e.target.value)}
            placeholder="95"
          />
        </div>
      </div>

      {/* Auto-calculated metrics */}
      <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg border border-border/50">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Price/Unit</p>
          <p className="font-medium text-sm">
            {calculatedMetrics.pricePerUnit > 0 ? formatCurrency(calculatedMetrics.pricePerUnit.toString()) : "—"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Price/SF</p>
          <p className="font-medium text-sm">
            {calculatedMetrics.pricePerSF > 0 ? formatCurrency(calculatedMetrics.pricePerSF.toString()) : "—"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Calc'd Cap Rate</p>
          <p className="font-medium text-sm">
            {calculatedMetrics.capRate > 0 ? `${calculatedMetrics.capRate.toFixed(2)}%` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};
