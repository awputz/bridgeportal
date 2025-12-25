import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calculator, DollarSign, Building2 } from "lucide-react";

export const TransferTaxCalculator = () => {
  const [salePrice, setSalePrice] = useState<number>(2000000);
  const [isResidential, setIsResidential] = useState<boolean>(true);
  const [isNewConstruction, setIsNewConstruction] = useState<boolean>(false);

  const [results, setResults] = useState({
    nycTransferTax: 0,
    nysTransferTax: 0,
    mansionTax: 0,
    totalTax: 0,
    effectiveRate: 0,
  });

  useEffect(() => {
    // NYC Transfer Tax: 1% if <= $500k, 1.425% if > $500k (residential)
    // For commercial: 1.425% if <= $500k, 2.625% if > $500k
    let nycRate: number;
    if (isResidential) {
      nycRate = salePrice <= 500000 ? 0.01 : 0.01425;
    } else {
      nycRate = salePrice <= 500000 ? 0.01425 : 0.02625;
    }
    const nycTransferTax = salePrice * nycRate;

    // NYS Transfer Tax: 0.4% (plus 0.25% mansion tax on portion over $1M if >= $1M)
    const nysTransferTax = salePrice * 0.004;

    // Mansion Tax (tiered for >= $1M)
    let mansionTax = 0;
    if (salePrice >= 1000000) {
      if (salePrice < 2000000) mansionTax = salePrice * 0.01;
      else if (salePrice < 3000000) mansionTax = salePrice * 0.0125;
      else if (salePrice < 5000000) mansionTax = salePrice * 0.015;
      else if (salePrice < 10000000) mansionTax = salePrice * 0.0175;
      else if (salePrice < 15000000) mansionTax = salePrice * 0.0225;
      else if (salePrice < 20000000) mansionTax = salePrice * 0.0275;
      else if (salePrice < 25000000) mansionTax = salePrice * 0.0325;
      else mansionTax = salePrice * 0.039;
    }

    const totalTax = nycTransferTax + nysTransferTax + mansionTax;
    const effectiveRate = (totalTax / salePrice) * 100;

    setResults({ nycTransferTax, nysTransferTax, mansionTax, totalTax, effectiveRate });
  }, [salePrice, isResidential, isNewConstruction]);

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
              NYC Transfer Tax Calculator
            </CardTitle>
            <CardDescription>
              Calculate NYC and NYS transfer taxes including mansion tax
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Property Type</Label>
                  <p className="text-sm text-muted-foreground">
                    {isResidential ? "Residential" : "Commercial"}
                  </p>
                </div>
                <Switch
                  checked={isResidential}
                  onCheckedChange={setIsResidential}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Total Transfer Taxes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Total Tax Due</span>
              </div>
              <p className="text-2xl font-light">{formatCurrency(results.totalTax)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Effective Rate</span>
              <p className="text-lg font-light">{results.effectiveRate.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tax Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">NYC Transfer Tax</span>
              <span className="font-medium">{formatCurrency(results.nycTransferTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">NYS Transfer Tax</span>
              <span className="font-medium">{formatCurrency(results.nysTransferTax)}</span>
            </div>
            {results.mansionTax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mansion Tax</span>
                <span className="font-medium">{formatCurrency(results.mansionTax)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
