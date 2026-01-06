import { useEffect } from "react";
import { Car, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

// IRS standard mileage rate for 2025
const IRS_MILEAGE_RATE_2025 = 0.70;

interface MileageCalculatorProps {
  fromAddress: string;
  toAddress: string;
  distance: number | undefined;
  onFromAddressChange: (value: string) => void;
  onToAddressChange: (value: string) => void;
  onDistanceChange: (value: number | undefined) => void;
  onAmountChange: (amount: number) => void;
}

export const MileageCalculator = ({
  fromAddress,
  toAddress,
  distance,
  onFromAddressChange,
  onToAddressChange,
  onDistanceChange,
  onAmountChange,
}: MileageCalculatorProps) => {
  // Auto-calculate amount when distance changes
  useEffect(() => {
    if (distance && distance > 0) {
      const calculatedAmount = Number((distance * IRS_MILEAGE_RATE_2025).toFixed(2));
      onAmountChange(calculatedAmount);
    }
  }, [distance, onAmountChange]);

  const calculatedAmount = distance ? (distance * IRS_MILEAGE_RATE_2025).toFixed(2) : "0.00";

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Car className="h-4 w-4" />
        <span>Mileage Calculator</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>From Address</Label>
          <AddressAutocomplete
            value={fromAddress}
            onChange={onFromAddressChange}
            placeholder="Starting location..."
          />
        </div>

        <div className="space-y-2">
          <Label>To Address</Label>
          <AddressAutocomplete
            value={toAddress}
            onChange={onToAddressChange}
            placeholder="Destination..."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2 flex-1 min-w-[140px]">
          <Label>Distance (miles)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={distance || ""}
            onChange={(e) => onDistanceChange(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>

        <div className="flex items-center gap-2 text-muted-foreground pb-2">
          <span className="text-sm">×</span>
          <span className="text-sm font-medium">${IRS_MILEAGE_RATE_2025}/mi</span>
          <ArrowRight className="h-4 w-4" />
        </div>

        <div className="space-y-2 flex-1 min-w-[140px]">
          <Label>Calculated Amount</Label>
          <div className="h-10 px-3 py-2 rounded-md border bg-muted/50 flex items-center">
            <span className="text-lg font-semibold text-foreground">${calculatedAmount}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        IRS standard mileage rate for 2025: ${IRS_MILEAGE_RATE_2025} per mile
      </p>
    </div>
  );
};
