import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Home, AlertTriangle } from "lucide-react";

export const RentAffordabilityCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState<number>(100000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(500);
  const [targetRent, setTargetRent] = useState<number>(3000);

  const [results, setResults] = useState({
    maxRent40x: 0,
    maxRent30Percent: 0,
    incomeRequired: 0,
    debtToIncomeRatio: 0,
    meetsRequirement: false,
    monthlyIncome: 0,
  });

  useEffect(() => {
    const monthlyIncome = annualIncome / 12;
    
    // NYC 40x rule: Annual income must be 40x monthly rent
    const maxRent40x = annualIncome / 40;
    
    // Standard 30% rule
    const maxRent30Percent = monthlyIncome * 0.30;
    
    // Income required for target rent
    const incomeRequired = targetRent * 40;
    
    // Debt to income ratio (housing + other debts)
    const totalMonthlyPayments = targetRent + monthlyDebts;
    const debtToIncomeRatio = (totalMonthlyPayments / monthlyIncome) * 100;
    
    // Check if meets 40x requirement
    const meetsRequirement = annualIncome >= incomeRequired;

    setResults({
      maxRent40x,
      maxRent30Percent,
      incomeRequired,
      debtToIncomeRatio,
      meetsRequirement,
      monthlyIncome,
    });
  }, [annualIncome, monthlyDebts, targetRent]);

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
              Rent Affordability (40x Rule)
            </CardTitle>
            <CardDescription>
              Calculate maximum rent based on NYC's 40x income requirement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Income</Label>
                <Input
                  id="annualIncome"
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyDebts">Other Monthly Debts</Label>
                <Input
                  id="monthlyDebts"
                  type="number"
                  value={monthlyDebts}
                  onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetRent">Target Monthly Rent</Label>
                <Input
                  id="targetRent"
                  type="number"
                  value={targetRent}
                  onChange={(e) => setTargetRent(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className={results.meetsRequirement ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {results.meetsRequirement ? (
                <Home className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              40x Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Max Rent (40x Rule)</span>
              <p className="text-2xl font-light">{formatCurrency(results.maxRent40x)}/mo</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Status for {formatCurrency(targetRent)}</span>
              <p className={`text-sm ${results.meetsRequirement ? "text-green-500" : "text-red-500"}`}>
                {results.meetsRequirement 
                  ? "Qualifies under 40x rule" 
                  : `Needs ${formatCurrency(results.incomeRequired)} annual income`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Income</span>
              <span className="font-medium">{formatCurrency(results.monthlyIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Max (30% Rule)</span>
              <span className="font-medium">{formatCurrency(results.maxRent30Percent)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Debt-to-Income</span>
              <span className={`font-medium ${results.debtToIncomeRatio > 50 ? "text-red-500" : "text-green-500"}`}>
                {results.debtToIncomeRatio.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
