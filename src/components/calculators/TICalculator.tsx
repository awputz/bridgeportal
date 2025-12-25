import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Building2 } from "lucide-react";

export const TICalculator = () => {
  const [squareFeet, setSquareFeet] = useState<number>(5000);
  const [tiPerSF, setTiPerSF] = useState<number>(50);
  const [leaseTerm, setLeaseTerm] = useState<number>(10);
  const [baseRent, setBaseRent] = useState<number>(65);
  const [freeRent, setFreeRent] = useState<number>(6);

  const [results, setResults] = useState({
    totalTI: 0,
    tiPerMonth: 0,
    tiPerYear: 0,
    totalFreeRent: 0,
    totalConcessions: 0,
    netEffectiveRent: 0,
    landlordCostPerSF: 0,
  });

  useEffect(() => {
    const totalTI = squareFeet * tiPerSF;
    const tiPerYear = totalTI / leaseTerm;
    const tiPerMonth = tiPerYear / 12;
    
    const monthlyRent = squareFeet * baseRent / 12;
    const totalFreeRent = monthlyRent * freeRent;
    
    const totalConcessions = totalTI + totalFreeRent;
    
    const totalLeaseMonths = leaseTerm * 12;
    const paidMonths = totalLeaseMonths - freeRent;
    const totalRentPaid = monthlyRent * paidMonths;
    const netEffectiveRent = ((totalRentPaid - totalTI) / totalLeaseMonths / squareFeet) * 12;
    
    const landlordCostPerSF = totalConcessions / squareFeet;

    setResults({
      totalTI,
      tiPerMonth,
      tiPerYear,
      totalFreeRent,
      totalConcessions,
      netEffectiveRent: Math.max(0, netEffectiveRent),
      landlordCostPerSF,
    });
  }, [squareFeet, tiPerSF, leaseTerm, baseRent, freeRent]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-accent" />
              Tenant Improvement Allowance
            </CardTitle>
            <CardDescription>
              Calculate TI costs and landlord concessions analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Space Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareFeet">Square Feet</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    value={squareFeet}
                    onChange={(e) => setSquareFeet(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiPerSF">TI Allowance ($/SF)</Label>
                  <Input
                    id="tiPerSF"
                    type="number"
                    value={tiPerSF}
                    onChange={(e) => setTiPerSF(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Lease Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leaseTerm">Lease Term (years)</Label>
                  <Input
                    id="leaseTerm"
                    type="number"
                    value={leaseTerm}
                    onChange={(e) => setLeaseTerm(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseRent">Base Rent ($/SF/yr)</Label>
                  <Input
                    id="baseRent"
                    type="number"
                    value={baseRent}
                    onChange={(e) => setBaseRent(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeRent">Free Rent (months)</Label>
                  <Input
                    id="freeRent"
                    type="number"
                    value={freeRent}
                    onChange={(e) => setFreeRent(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">TI Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Total TI Allowance</span>
              </div>
              <p className="text-2xl font-light">{formatCurrency(results.totalTI)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Net Effective Rent</span>
              <p className="text-lg font-light">{formatCurrency(results.netEffectiveRent)}/SF</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Concession Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TI Allowance</span>
              <span className="font-medium">{formatCurrency(results.totalTI)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Free Rent Value</span>
              <span className="font-medium">{formatCurrency(results.totalFreeRent)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Concessions</span>
              <span className="font-medium text-accent">{formatCurrency(results.totalConcessions)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Landlord Cost/SF</span>
              <span className="font-medium">{formatCurrency(results.landlordCostPerSF)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
