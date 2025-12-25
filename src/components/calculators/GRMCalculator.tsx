import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";

export const GRMCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(2000000);
  const [grossRent, setGrossRent] = useState<number>(180000);
  const [targetGRM, setTargetGRM] = useState<number>(12);

  const [results, setResults] = useState({
    grm: 0,
    impliedValue: 0,
    monthlyRent: 0,
    targetMaxPrice: 0,
  });

  useEffect(() => {
    const grm = grossRent > 0 ? purchasePrice / grossRent : 0;
    const impliedValue = grossRent * targetGRM;
    const monthlyRent = grossRent / 12;
    const targetMaxPrice = grossRent * targetGRM;

    setResults({ grm, impliedValue, monthlyRent, targetMaxPrice });
  }, [purchasePrice, grossRent, targetGRM]);

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
              Gross Rent Multiplier (GRM)
            </CardTitle>
            <CardDescription>
              Quick property valuation based on gross rental income
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grossRent">Annual Gross Rent</Label>
                <Input
                  id="grossRent"
                  type="number"
                  value={grossRent}
                  onChange={(e) => setGrossRent(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetGRM">Target GRM</Label>
                <Input
                  id="targetGRM"
                  type="number"
                  step="0.5"
                  value={targetGRM}
                  onChange={(e) => setTargetGRM(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Actual GRM</span>
              </div>
              <p className="text-2xl font-light">{results.grm.toFixed(2)}x</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Monthly Rent</span>
              </div>
              <p className="text-2xl font-light">{formatCurrency(results.monthlyRent)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Target Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">At {targetGRM}x GRM</span>
              <span className="font-medium">{formatCurrency(results.targetMaxPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">vs. Asking</span>
              <span className={results.targetMaxPrice >= purchasePrice ? "text-green-500" : "text-red-500"}>
                {formatCurrency(results.targetMaxPrice - purchasePrice)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
