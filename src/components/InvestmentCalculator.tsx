import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";

export const InvestmentCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(2000000);
  const [downPayment, setDownPayment] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [grossIncome, setGrossIncome] = useState<number>(180000);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(72000);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  const [results, setResults] = useState({
    monthlyPayment: 0,
    cashOnCash: 0,
    capRate: 0,
    roi: 0,
    noi: 0,
    downPaymentAmount: 0,
    loanAmount: 0,
    effectiveGrossIncome: 0,
  });

  useEffect(() => {
    // Calculate results
    const downPaymentAmount = purchasePrice * (downPayment / 100);
    const loanAmount = purchasePrice - downPaymentAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Monthly payment calculation
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // NOI calculation
    const effectiveGrossIncome = grossIncome * (1 - vacancyRate / 100);
    const noi = effectiveGrossIncome - operatingExpenses;
    
    // Cap Rate
    const capRate = (noi / purchasePrice) * 100;
    
    // Annual debt service
    const annualDebtService = monthlyPayment * 12;
    
    // Cash flow
    const annualCashFlow = noi - annualDebtService;
    
    // Cash on Cash Return
    const cashOnCash = (annualCashFlow / downPaymentAmount) * 100;
    
    // ROI (simplified)
    const roi = ((noi - annualDebtService) / downPaymentAmount) * 100;

    setResults({
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      cashOnCash: isNaN(cashOnCash) ? 0 : cashOnCash,
      capRate: isNaN(capRate) ? 0 : capRate,
      roi: isNaN(roi) ? 0 : roi,
      noi: isNaN(noi) ? 0 : noi,
      downPaymentAmount,
      loanAmount,
      effectiveGrossIncome,
    });
  }, [purchasePrice, downPayment, interestRate, loanTerm, grossIncome, operatingExpenses, vacancyRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-accent" />
              Investment Calculator
            </CardTitle>
            <CardDescription>
              Calculate returns and analyze investment property performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purchase Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Purchase Details</h3>
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
                  <Label htmlFor="downPayment">Down Payment (%)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Financing */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Financing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Loan Term (years)</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Income & Expenses */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Income & Expenses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grossIncome">Annual Gross Income</Label>
                  <Input
                    id="grossIncome"
                    type="number"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operatingExpenses">Annual Operating Expenses</Label>
                  <Input
                    id="operatingExpenses"
                    type="number"
                    value={operatingExpenses}
                    onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
                  <Input
                    id="vacancyRate"
                    type="number"
                    step="0.1"
                    value={vacancyRate}
                    onChange={(e) => setVacancyRate(Number(e.target.value))}
                  />
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
            <CardTitle className="text-lg">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="h-4 w-4" />
                <span>Cap Rate</span>
              </div>
              <p className="text-2xl font-light">{formatPercent(results.capRate)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Cash on Cash</span>
              </div>
              <p className="text-2xl font-light">{formatPercent(results.cashOnCash)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>NOI</span>
              </div>
              <p className="text-2xl font-light">{formatCurrency(results.noi)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financing Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Down Payment</span>
              <span className="font-medium">{formatCurrency(results.downPaymentAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Loan Amount</span>
              <span className="font-medium">{formatCurrency(results.loanAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Payment</span>
              <span className="font-medium">{formatCurrency(results.monthlyPayment)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Effective Gross Income</span>
              <span className="font-medium">{formatCurrency(results.effectiveGrossIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Operating Expenses</span>
              <span className="font-medium">{formatCurrency(operatingExpenses)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
