import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, DollarSign, Percent, BarChart3 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface YearProjection {
  year: number;
  grossIncome: number;
  effectiveIncome: number;
  operatingExpenses: number;
  noi: number;
  debtService: number;
  cashFlow: number;
  cumulativeCashFlow: number;
  propertyValue: number;
}

export const CashFlowAnalyzer = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(2000000);
  const [downPayment, setDownPayment] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [monthlyRent, setMonthlyRent] = useState<number>(15000);
  const [vacancyRate, setVacancyRate] = useState<number>(5);
  const [operatingExpenseRatio, setOperatingExpenseRatio] = useState<number>(35);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(10);
  const [rentGrowth, setRentGrowth] = useState<number>(3);
  const [expenseGrowth, setExpenseGrowth] = useState<number>(2);
  const [appreciation, setAppreciation] = useState<number>(3);

  const [projections, setProjections] = useState<YearProjection[]>([]);
  const [summary, setSummary] = useState({
    totalCashFlow: 0,
    averageCashOnCash: 0,
    irr: 0,
    totalROI: 0,
    dscr: 0,
    breakEvenOccupancy: 0,
    exitValue: 0,
    totalEquity: 0,
  });

  useEffect(() => {
    const downPaymentAmount = purchasePrice * (downPayment / 100);
    const loanAmount = purchasePrice - downPaymentAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Monthly payment calculation
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const annualDebtService = monthlyPayment * 12;

    // Generate year-by-year projections
    const yearlyProjections: YearProjection[] = [];
    let cumulativeCashFlow = 0;
    const cashFlows: number[] = [-downPaymentAmount]; // Initial investment

    for (let year = 1; year <= holdingPeriod; year++) {
      const rentMultiplier = Math.pow(1 + rentGrowth / 100, year - 1);
      const expenseMultiplier = Math.pow(1 + expenseGrowth / 100, year - 1);
      const valueMultiplier = Math.pow(1 + appreciation / 100, year);

      const grossIncome = monthlyRent * 12 * rentMultiplier;
      const effectiveIncome = grossIncome * (1 - vacancyRate / 100);
      const operatingExpenses = grossIncome * (operatingExpenseRatio / 100) * expenseMultiplier;
      const noi = effectiveIncome - operatingExpenses;
      const cashFlow = noi - annualDebtService;
      cumulativeCashFlow += cashFlow;
      const propertyValue = purchasePrice * valueMultiplier;

      yearlyProjections.push({
        year,
        grossIncome,
        effectiveIncome,
        operatingExpenses,
        noi,
        debtService: annualDebtService,
        cashFlow,
        cumulativeCashFlow,
        propertyValue,
      });

      cashFlows.push(cashFlow);
    }

    // Add exit value to last year cash flow for IRR calculation
    const exitValue = yearlyProjections[holdingPeriod - 1]?.propertyValue || 0;
    const remainingLoanBalance = calculateRemainingBalance(loanAmount, monthlyRate, numberOfPayments, holdingPeriod * 12);
    const netSaleProceeds = exitValue * 0.94 - remainingLoanBalance; // 6% selling costs
    cashFlows[holdingPeriod] += netSaleProceeds;

    // Calculate IRR
    const irr = calculateIRR(cashFlows);

    // Year 1 metrics for DSCR
    const year1NOI = yearlyProjections[0]?.noi || 0;
    const dscr = year1NOI / annualDebtService;

    // Break-even occupancy
    const year1GrossIncome = monthlyRent * 12;
    const year1OpEx = year1GrossIncome * (operatingExpenseRatio / 100);
    const breakEvenOccupancy = ((year1OpEx + annualDebtService) / year1GrossIncome) * 100;

    // Summary metrics
    const totalCashFlow = yearlyProjections.reduce((sum, y) => sum + y.cashFlow, 0);
    const avgCashOnCash = (totalCashFlow / holdingPeriod) / downPaymentAmount * 100;
    const totalROI = ((totalCashFlow + netSaleProceeds - downPaymentAmount) / downPaymentAmount) * 100;
    const totalEquity = netSaleProceeds + totalCashFlow;

    setProjections(yearlyProjections);
    setSummary({
      totalCashFlow: isNaN(totalCashFlow) ? 0 : totalCashFlow,
      averageCashOnCash: isNaN(avgCashOnCash) ? 0 : avgCashOnCash,
      irr: isNaN(irr) ? 0 : irr * 100,
      totalROI: isNaN(totalROI) ? 0 : totalROI,
      dscr: isNaN(dscr) ? 0 : dscr,
      breakEvenOccupancy: isNaN(breakEvenOccupancy) ? 0 : breakEvenOccupancy,
      exitValue,
      totalEquity: isNaN(totalEquity) ? 0 : totalEquity,
    });
  }, [purchasePrice, downPayment, interestRate, loanTerm, monthlyRent, vacancyRate, operatingExpenseRatio, holdingPeriod, rentGrowth, expenseGrowth, appreciation]);

  // Calculate remaining loan balance
  const calculateRemainingBalance = (principal: number, monthlyRate: number, totalPayments: number, paymentsMade: number) => {
    if (monthlyRate === 0) return principal * (1 - paymentsMade / totalPayments);
    const balance = principal * (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, paymentsMade)) / 
                   (Math.pow(1 + monthlyRate, totalPayments) - 1);
    return Math.max(0, balance);
  };

  // Simple IRR calculation using Newton-Raphson method
  const calculateIRR = (cashFlows: number[]): number => {
    let rate = 0.1;
    for (let i = 0; i < 100; i++) {
      let npv = 0;
      let dnpv = 0;
      for (let j = 0; j < cashFlows.length; j++) {
        npv += cashFlows[j] / Math.pow(1 + rate, j);
        dnpv -= j * cashFlows[j] / Math.pow(1 + rate, j + 1);
      }
      const newRate = rate - npv / dnpv;
      if (Math.abs(newRate - rate) < 0.0001) {
        return newRate;
      }
      rate = newRate;
    }
    return rate;
  };

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
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Cash Flow Analyzer
              </CardTitle>
              <CardDescription>
                Detailed rental property ROI projections with year-by-year analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Purchase & Financing */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Purchase & Financing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cf-purchasePrice">Purchase Price</Label>
                    <Input
                      id="cf-purchasePrice"
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf-downPayment">Down Payment (%)</Label>
                    <Input
                      id="cf-downPayment"
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf-interestRate">Interest Rate (%)</Label>
                    <Input
                      id="cf-interestRate"
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf-loanTerm">Loan Term (years)</Label>
                    <Input
                      id="cf-loanTerm"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cf-monthlyRent">Monthly Rent</Label>
                    <Input
                      id="cf-monthlyRent"
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf-vacancyRate">Vacancy Rate (%)</Label>
                    <Input
                      id="cf-vacancyRate"
                      type="number"
                      step="0.1"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf-opex">Operating Expense Ratio (%)</Label>
                    <Input
                      id="cf-opex"
                      type="number"
                      value={operatingExpenseRatio}
                      onChange={(e) => setOperatingExpenseRatio(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Growth Assumptions */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Growth Assumptions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cf-holdingPeriod">Holding Period (years)</Label>
                    <Input
                      id="cf-holdingPeriod"
                      type="number"
                      value={holdingPeriod}
                      onChange={(e) => setHoldingPeriod(Math.min(20, Math.max(1, Number(e.target.value))))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf-rentGrowth">Rent Growth (%/yr)</Label>
                    <Input
                      id="cf-rentGrowth"
                      type="number"
                      step="0.1"
                      value={rentGrowth}
                      onChange={(e) => setRentGrowth(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf-expenseGrowth">Expense Growth (%/yr)</Label>
                    <Input
                      id="cf-expenseGrowth"
                      type="number"
                      step="0.1"
                      value={expenseGrowth}
                      onChange={(e) => setExpenseGrowth(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf-appreciation">Appreciation (%/yr)</Label>
                    <Input
                      id="cf-appreciation"
                      type="number"
                      step="0.1"
                      value={appreciation}
                      onChange={(e) => setAppreciation(Number(e.target.value))}
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
              <CardTitle className="text-lg">Investment Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>IRR</span>
                </div>
                <p className="text-2xl font-light">{formatPercent(summary.irr)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Percent className="h-4 w-4" />
                  <span>Avg Cash on Cash</span>
                </div>
                <p className="text-2xl font-light">{formatPercent(summary.averageCashOnCash)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Total Cash Flow</span>
                </div>
                <p className="text-2xl font-light">{formatCurrency(summary.totalCashFlow)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Total Equity at Exit</span>
                </div>
                <p className="text-2xl font-light">{formatCurrency(summary.totalEquity)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">DSCR</span>
                <span className="font-medium">{summary.dscr.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Break-even Occupancy</span>
                <span className="font-medium">{formatPercent(summary.breakEvenOccupancy)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exit Value</span>
                <span className="font-medium">{formatCurrency(summary.exitValue)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Projections Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Year-by-Year Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Gross Income</TableHead>
                  <TableHead className="text-right">NOI</TableHead>
                  <TableHead className="text-right">Debt Service</TableHead>
                  <TableHead className="text-right">Cash Flow</TableHead>
                  <TableHead className="text-right">Cumulative</TableHead>
                  <TableHead className="text-right">Property Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projections.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.grossIncome)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.noi)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.debtService)}</TableCell>
                    <TableCell className={`text-right ${row.cashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(row.cashFlow)}
                    </TableCell>
                    <TableCell className={`text-right ${row.cumulativeCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(row.cumulativeCashFlow)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(row.propertyValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
