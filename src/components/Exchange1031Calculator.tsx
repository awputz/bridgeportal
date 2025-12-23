import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, DollarSign, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Exchange1031Calculator = () => {
  const [relinquishedValue, setRelinquishedValue] = useState<number>(2000000);
  const [adjustedBasis, setAdjustedBasis] = useState<number>(1200000);
  const [sellingCosts, setSellingCosts] = useState<number>(120000);
  const [replacementValue, setReplacementValue] = useState<number>(2500000);
  const [replacementDebt, setReplacementDebt] = useState<number>(1500000);
  const [existingDebt, setExistingDebt] = useState<number>(800000);
  const [capitalGainsRate, setCapitalGainsRate] = useState<number>(20);

  const [results, setResults] = useState({
    capitalGain: 0,
    netProceeds: 0,
    taxDeferred: 0,
    boot: 0,
    equityRequired: 0,
    debtRelief: 0,
  });

  useEffect(() => {
    // Net proceeds from relinquished property
    const netProceeds = relinquishedValue - sellingCosts - existingDebt;
    
    // Capital gain (before exchange)
    const capitalGain = relinquishedValue - adjustedBasis - sellingCosts;
    
    // Equity in relinquished property
    const relinquishedEquity = relinquishedValue - existingDebt - sellingCosts;
    
    // Equity in replacement property
    const replacementEquity = replacementValue - replacementDebt;
    
    // Boot (taxable portion) - occurs if replacement equity is less than relinquished equity
    const cashBoot = Math.max(0, relinquishedEquity - replacementEquity);
    
    // Mortgage boot - if debt relief exceeds new debt
    const mortgageBoot = Math.max(0, existingDebt - replacementDebt);
    
    // Total boot
    const totalBoot = cashBoot + mortgageBoot;
    
    // Tax deferred (on the portion that qualifies)
    const deferredGain = Math.max(0, capitalGain - totalBoot);
    const taxDeferred = deferredGain * (capitalGainsRate / 100);
    
    // Equity required for full deferral
    const equityRequired = Math.max(0, relinquishedEquity);

    setResults({
      capitalGain: isNaN(capitalGain) ? 0 : capitalGain,
      netProceeds: isNaN(netProceeds) ? 0 : netProceeds,
      taxDeferred: isNaN(taxDeferred) ? 0 : taxDeferred,
      boot: isNaN(totalBoot) ? 0 : totalBoot,
      equityRequired: isNaN(equityRequired) ? 0 : equityRequired,
      debtRelief: existingDebt,
    });
  }, [relinquishedValue, adjustedBasis, sellingCosts, replacementValue, replacementDebt, existingDebt, capitalGainsRate]);

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
      {/* Input Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-accent" />
              1031 Exchange Calculator
            </CardTitle>
            <CardDescription>
              Analyze tax-deferred exchange scenarios under Section 1031 of the IRS code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Relinquished Property */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Relinquished Property (Current)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relinquishedValue">Fair Market Value</Label>
                  <Input
                    id="relinquishedValue"
                    type="number"
                    value={relinquishedValue}
                    onChange={(e) => setRelinquishedValue(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adjustedBasis">Adjusted Basis</Label>
                  <Input
                    id="adjustedBasis"
                    type="number"
                    value={adjustedBasis}
                    onChange={(e) => setAdjustedBasis(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Original cost + improvements - depreciation</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingCosts">Selling Costs</Label>
                  <Input
                    id="sellingCosts"
                    type="number"
                    value={sellingCosts}
                    onChange={(e) => setSellingCosts(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Broker fees, closing costs, etc.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="existingDebt">Existing Debt</Label>
                  <Input
                    id="existingDebt"
                    type="number"
                    value={existingDebt}
                    onChange={(e) => setExistingDebt(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Replacement Property */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Replacement Property (New)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="replacementValue">Purchase Price</Label>
                  <Input
                    id="replacementValue"
                    type="number"
                    value={replacementValue}
                    onChange={(e) => setReplacementValue(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replacementDebt">New Mortgage</Label>
                  <Input
                    id="replacementDebt"
                    type="number"
                    value={replacementDebt}
                    onChange={(e) => setReplacementDebt(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Tax Rate */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Tax Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capitalGainsRate">Capital Gains Rate (%)</Label>
                  <Input
                    id="capitalGainsRate"
                    type="number"
                    step="0.1"
                    value={capitalGainsRate}
                    onChange={(e) => setCapitalGainsRate(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Combined federal + state rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Exchange Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Capital Gain</span>
              </div>
              <p className="text-2xl font-light">{formatCurrency(results.capitalGain)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Tax Deferred</span>
              </div>
              <p className="text-2xl font-light text-green-500">{formatCurrency(results.taxDeferred)}</p>
            </div>

            {results.boot > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Boot (Taxable)</span>
                </div>
                <p className="text-2xl font-light text-amber-500">{formatCurrency(results.boot)}</p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Equity Required</span>
              </div>
              <p className="text-2xl font-light">{formatCurrency(results.equityRequired)}</p>
              <p className="text-xs text-muted-foreground">For full tax deferral</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Key Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Identification Period</span>
              <span className="font-medium">45 Days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Exchange Period</span>
              <span className="font-medium">180 Days</span>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This calculator provides estimates only. Consult a qualified tax advisor for specific guidance on 1031 exchanges.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};
