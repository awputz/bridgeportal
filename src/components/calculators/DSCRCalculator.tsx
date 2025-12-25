import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export const DSCRCalculator = () => {
  const [noi, setNoi] = useState<number>(150000);
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [targetDSCR, setTargetDSCR] = useState<number>(1.25);

  const [results, setResults] = useState({
    annualDebtService: 0,
    dscr: 0,
    maxLoanAmount: 0,
    cashFlowAfterDebt: 0,
    isQualified: false,
  });

  useEffect(() => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const annualDebtService = monthlyPayment * 12;
    const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
    const cashFlowAfterDebt = noi - annualDebtService;
    
    // Calculate max loan at target DSCR
    const maxAnnualDebtService = noi / targetDSCR;
    const maxMonthlyPayment = maxAnnualDebtService / 12;
    const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
                         (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));

    setResults({
      annualDebtService: isNaN(annualDebtService) ? 0 : annualDebtService,
      dscr: isNaN(dscr) ? 0 : dscr,
      maxLoanAmount: isNaN(maxLoanAmount) ? 0 : maxLoanAmount,
      cashFlowAfterDebt: isNaN(cashFlowAfterDebt) ? 0 : cashFlowAfterDebt,
      isQualified: dscr >= targetDSCR,
    });
  }, [noi, loanAmount, interestRate, loanTerm, targetDSCR]);

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
              Debt Service Coverage Ratio (DSCR)
            </CardTitle>
            <CardDescription>
              Analyze loan qualification based on property income
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Property Income</h3>
              <div className="space-y-2">
                <Label htmlFor="noi">Net Operating Income (NOI)</Label>
                <Input
                  id="noi"
                  type="number"
                  value={noi}
                  onChange={(e) => setNoi(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Loan Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </div>
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
                <div className="space-y-2">
                  <Label htmlFor="targetDSCR">Target DSCR</Label>
                  <Input
                    id="targetDSCR"
                    type="number"
                    step="0.05"
                    value={targetDSCR}
                    onChange={(e) => setTargetDSCR(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className={results.isQualified ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {results.isQualified ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              DSCR Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Calculated DSCR</span>
              <p className={`text-3xl font-light ${results.isQualified ? "text-green-500" : "text-red-500"}`}>
                {results.dscr.toFixed(2)}x
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Status</span>
              <p className={`text-sm ${results.isQualified ? "text-green-500" : "text-red-500"}`}>
                {results.isQualified ? "Meets lender requirements" : "Below target DSCR"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Annual Debt Service</span>
              <span className="font-medium">{formatCurrency(results.annualDebtService)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cash Flow After Debt</span>
              <span className={`font-medium ${results.cashFlowAfterDebt >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(results.cashFlowAfterDebt)}
              </span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Max Loan at {targetDSCR}x</span>
              <span className="font-medium">{formatCurrency(results.maxLoanAmount)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
