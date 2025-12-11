import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeaseCalculatorProps {
  config?: {
    title?: string;
    subtitle?: string;
    defaults?: {
      rentPerSF?: number;
      squareFeet?: number;
      leaseTerm?: number;
      escalation?: number;
      freeRentMonths?: number;
    };
  };
}

export default function LeaseCalculator({ config }: LeaseCalculatorProps) {
  const defaults = config?.defaults || {};
  const [rentPerSF, setRentPerSF] = useState<number>(defaults.rentPerSF ?? 50);
  const [squareFeet, setSquareFeet] = useState<number>(defaults.squareFeet ?? 2000);
  const [leaseTerm, setLeaseTerm] = useState<number>(defaults.leaseTerm ?? 5);
  const [escalation, setEscalation] = useState<number>(defaults.escalation ?? 3);
  const [freeRentMonths, setFreeRentMonths] = useState<number>(defaults.freeRentMonths ?? 0);

  const calculations = useMemo(() => {
    const yearlyBreakdown: { year: number; annualRent: number; monthlyRent: number }[] = [];
    let totalLeaseValue = 0;
    let currentRentPerSF = rentPerSF;

    for (let year = 1; year <= leaseTerm; year++) {
      if (year > 1) {
        currentRentPerSF = currentRentPerSF * (1 + escalation / 100);
      }
      const annualRent = currentRentPerSF * squareFeet;
      const monthlyRent = annualRent / 12;
      
      yearlyBreakdown.push({
        year,
        annualRent,
        monthlyRent,
      });
      
      totalLeaseValue += annualRent;
    }

    // Subtract free rent
    const freeRentValue = (rentPerSF * squareFeet / 12) * freeRentMonths;
    const adjustedLeaseValue = totalLeaseValue - freeRentValue;
    const totalMonths = leaseTerm * 12;
    const payingMonths = totalMonths - freeRentMonths;
    const effectiveRentPerSF = payingMonths > 0 ? adjustedLeaseValue / squareFeet / leaseTerm : 0;
    const averageMonthlyPayment = payingMonths > 0 ? adjustedLeaseValue / payingMonths : 0;

    return {
      yearlyBreakdown,
      totalLeaseValue: adjustedLeaseValue,
      effectiveRentPerSF,
      averageMonthlyPayment,
      freeRentValue,
    };
  }, [rentPerSF, squareFeet, leaseTerm, escalation, freeRentMonths]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
          <h3 className="text-lg font-light mb-4">Lease Parameters</h3>
          
          <div className="space-y-2">
            <Label htmlFor="rentPerSF" className="font-light">Rent per SF ($/year)</Label>
            <Input
              id="rentPerSF"
              type="number"
              value={rentPerSF}
              onChange={(e) => setRentPerSF(Number(e.target.value) || 0)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="squareFeet" className="font-light">Square Feet</Label>
            <Input
              id="squareFeet"
              type="number"
              value={squareFeet}
              onChange={(e) => setSquareFeet(Number(e.target.value) || 0)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaseTerm" className="font-light">Lease Term (years)</Label>
            <Input
              id="leaseTerm"
              type="number"
              value={leaseTerm}
              onChange={(e) => setLeaseTerm(Number(e.target.value) || 1)}
              min={1}
              max={20}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalation" className="font-light">Annual Escalation (%)</Label>
            <Input
              id="escalation"
              type="number"
              value={escalation}
              onChange={(e) => setEscalation(Number(e.target.value) || 0)}
              step={0.5}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeRent" className="font-light">Free Rent (months)</Label>
            <Input
              id="freeRent"
              type="number"
              value={freeRentMonths}
              onChange={(e) => setFreeRentMonths(Number(e.target.value) || 0)}
              min={0}
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-sm text-muted-foreground font-light mb-1">Total Lease Value</div>
              <div className="text-2xl font-light">{formatCurrency(calculations.totalLeaseValue)}</div>
            </div>
            <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-sm text-muted-foreground font-light mb-1">Effective Rent/SF</div>
              <div className="text-2xl font-light">{formatCurrency(calculations.effectiveRentPerSF)}</div>
            </div>
            <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-sm text-muted-foreground font-light mb-1">Avg Monthly Payment</div>
              <div className="text-2xl font-light">{formatCurrency(calculations.averageMonthlyPayment)}</div>
            </div>
            <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-sm text-muted-foreground font-light mb-1">Free Rent Value</div>
              <div className="text-2xl font-light">{formatCurrency(calculations.freeRentValue)}</div>
            </div>
          </div>

          {/* Year-by-Year Breakdown */}
          <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg font-light mb-4">Year-by-Year Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left font-light py-2 text-muted-foreground">Year</th>
                    <th className="text-right font-light py-2 text-muted-foreground">Annual Rent</th>
                    <th className="text-right font-light py-2 text-muted-foreground">Monthly</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-b border-white/5">
                      <td className="py-2 font-light">Year {row.year}</td>
                      <td className="py-2 text-right font-light">{formatCurrency(row.annualRent)}</td>
                      <td className="py-2 text-right font-light">{formatCurrency(row.monthlyRent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
