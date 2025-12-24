import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NetEffectiveRentCalculatorProps {
  defaultLeaseTerm?: number;
  defaultMonthlyRent?: number;
  defaultFreeMonths?: number;
  defaultFlatAmountOff?: number;
}

const NetEffectiveRentCalculator = ({
  defaultLeaseTerm = 12,
  defaultMonthlyRent = 3000,
  defaultFreeMonths = 0,
  defaultFlatAmountOff = 0,
}: NetEffectiveRentCalculatorProps) => {
  const [leaseTerm, setLeaseTerm] = useState(defaultLeaseTerm);
  const [monthlyRent, setMonthlyRent] = useState(defaultMonthlyRent);
  const [freeMonths, setFreeMonths] = useState(defaultFreeMonths);
  const [flatAmountOff, setFlatAmountOff] = useState(defaultFlatAmountOff);

  const calculations = useMemo(() => {
    const grossLeaseValue = monthlyRent * leaseTerm;
    const freeRentValue = monthlyRent * freeMonths;
    const totalConcessions = freeRentValue + flatAmountOff;
    const netLeaseValue = grossLeaseValue - totalConcessions;
    const netEffectiveRent = leaseTerm > 0 ? netLeaseValue / leaseTerm : 0;
    const savings = monthlyRent - netEffectiveRent;

    return {
      grossLeaseValue,
      freeRentValue,
      totalConcessions,
      netLeaseValue,
      netEffectiveRent,
      savings,
    };
  }, [leaseTerm, monthlyRent, freeMonths, flatAmountOff]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <TooltipProvider>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Enter Lease Details</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="leaseTerm">Lease Term (months)</Label>
              <Input
                id="leaseTerm"
                type="number"
                min={1}
                max={60}
                value={leaseTerm}
                onChange={(e) => setLeaseTerm(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
              <Input
                id="monthlyRent"
                type="number"
                min={0}
                step={100}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="freeMonths">Free Months</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Number of months offered free as a concession (e.g., "1 month free")</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="freeMonths"
                type="number"
                min={0}
                max={leaseTerm}
                value={freeMonths}
                onChange={(e) => setFreeMonths(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="flatAmountOff">Flat Amount Off ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>One-time discount or credit applied to the lease</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="flatAmountOff"
                type="number"
                min={0}
                step={100}
                value={flatAmountOff}
                onChange={(e) => setFlatAmountOff(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <h3 className="text-lg font-semibold mb-6">Your Net Effective Rent</h3>
          
          {/* Main Result */}
          <div className="text-center py-6 mb-6 bg-background/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Rent After Specials</p>
            <p className="text-4xl font-bold text-accent">
              {formatCurrency(calculations.netEffectiveRent)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">per month</p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Monthly Rent</span>
              <span className="font-medium">{formatCurrency(monthlyRent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Lease Value ({leaseTerm} months)</span>
              <span className="font-medium">{formatCurrency(calculations.grossLeaseValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Free Rent Value ({freeMonths} months)</span>
              <span className="font-medium text-green-600">-{formatCurrency(calculations.freeRentValue)}</span>
            </div>
            {flatAmountOff > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flat Amount Off</span>
                <span className="font-medium text-green-600">-{formatCurrency(flatAmountOff)}</span>
              </div>
            )}
            <div className="border-t border-border pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Lease Value</span>
                <span className="font-medium">{formatCurrency(calculations.netLeaseValue)}</span>
              </div>
            </div>
            {calculations.savings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Monthly Savings</span>
                <span className="font-semibold">{formatCurrency(calculations.savings)}/mo</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default NetEffectiveRentCalculator;
