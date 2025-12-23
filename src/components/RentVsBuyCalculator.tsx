import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Key, TrendingUp, DollarSign, Scale } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface YearComparison {
  year: number;
  rentCost: number;
  rentCumulative: number;
  buyCost: number;
  buyCumulative: number;
  homeEquity: number;
  rentNetWorth: number;
  buyNetWorth: number;
}

export const RentVsBuyCalculator = () => {
  const [monthlyRent, setMonthlyRent] = useState<number>(3500);
  const [annualRentIncrease, setAnnualRentIncrease] = useState<number>(3);
  const [homePrice, setHomePrice] = useState<number>(750000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [mortgageRate, setMortgageRate] = useState<number>(6.5);
  const [mortgageTerm, setMortgageTerm] = useState<number>(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.2);
  const [homeInsurance, setHomeInsurance] = useState<number>(2400);
  const [hoaFees, setHoaFees] = useState<number>(0);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(1);
  const [homeAppreciation, setHomeAppreciation] = useState<number>(3);
  const [investmentReturn, setInvestmentReturn] = useState<number>(7);
  const [timeHorizon, setTimeHorizon] = useState<number>(10);

  const [comparisons, setComparisons] = useState<YearComparison[]>([]);
  const [summary, setSummary] = useState({
    totalRentCost: 0,
    totalBuyCost: 0,
    rentNetWorth: 0,
    buyNetWorth: 0,
    breakEvenYear: 0,
    recommendation: "",
    advantage: 0,
  });

  useEffect(() => {
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = mortgageRate / 100 / 12;
    const numberOfPayments = mortgageTerm * 12;
    
    // Monthly mortgage payment
    const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const yearlyComparisons: YearComparison[] = [];
    
    let rentCumulative = 0;
    let buyCumulative = 0;
    let rentInvestmentBalance = downPayment; // Renter invests the down payment
    let breakEvenYear = 0;
    let loanBalance = loanAmount;

    for (let year = 1; year <= timeHorizon; year++) {
      // Rent calculations
      const currentMonthlyRent = monthlyRent * Math.pow(1 + annualRentIncrease / 100, year - 1);
      const yearlyRent = currentMonthlyRent * 12;
      rentCumulative += yearlyRent;
      
      // Renter's investment grows
      rentInvestmentBalance *= (1 + investmentReturn / 100);
      
      // Buy calculations
      const currentHomeValue = homePrice * Math.pow(1 + homeAppreciation / 100, year);
      const yearlyPropertyTax = currentHomeValue * (propertyTaxRate / 100);
      const yearlyMaintenance = currentHomeValue * (maintenanceRate / 100);
      const yearlyMortgage = monthlyMortgage * 12;
      const yearlyHOA = hoaFees * 12;
      
      // Total buying costs for the year
      const yearlyBuyCost = yearlyMortgage + yearlyPropertyTax + homeInsurance + yearlyMaintenance + yearlyHOA;
      buyCumulative += yearlyBuyCost;
      
      // Calculate loan balance at end of year
      for (let month = 0; month < 12; month++) {
        const interestPayment = loanBalance * monthlyRate;
        const principalPayment = monthlyMortgage - interestPayment;
        loanBalance -= principalPayment;
      }
      
      // Home equity
      const homeEquity = currentHomeValue - Math.max(0, loanBalance);
      
      // Net worth comparison
      const rentNetWorth = rentInvestmentBalance;
      const buyNetWorth = homeEquity;
      
      // Check for break-even
      if (breakEvenYear === 0 && buyNetWorth > rentNetWorth) {
        breakEvenYear = year;
      }

      yearlyComparisons.push({
        year,
        rentCost: yearlyRent,
        rentCumulative,
        buyCost: yearlyBuyCost,
        buyCumulative,
        homeEquity,
        rentNetWorth,
        buyNetWorth,
      });
    }

    const finalYear = yearlyComparisons[timeHorizon - 1];
    const rentAdvantage = finalYear.rentNetWorth - finalYear.buyNetWorth;
    const recommendation = rentAdvantage > 0 
      ? "Renting appears more financially advantageous" 
      : "Buying appears more financially advantageous";

    setComparisons(yearlyComparisons);
    setSummary({
      totalRentCost: rentCumulative,
      totalBuyCost: buyCumulative,
      rentNetWorth: finalYear.rentNetWorth,
      buyNetWorth: finalYear.buyNetWorth,
      breakEvenYear: breakEvenYear || timeHorizon + 1,
      recommendation,
      advantage: Math.abs(rentAdvantage),
    });
  }, [monthlyRent, annualRentIncrease, homePrice, downPaymentPercent, mortgageRate, mortgageTerm, propertyTaxRate, homeInsurance, hoaFees, maintenanceRate, homeAppreciation, investmentReturn, timeHorizon]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-accent" />
                Rent vs Buy Calculator
              </CardTitle>
              <CardDescription>
                Compare the financial outcomes of renting versus buying a home
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rent Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Renting Scenario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rvb-monthlyRent">Monthly Rent</Label>
                    <Input
                      id="rvb-monthlyRent"
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-rentIncrease">Annual Rent Increase (%)</Label>
                    <Input
                      id="rvb-rentIncrease"
                      type="number"
                      step="0.1"
                      value={annualRentIncrease}
                      onChange={(e) => setAnnualRentIncrease(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Buy Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Buying Scenario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rvb-homePrice">Home Price</Label>
                    <Input
                      id="rvb-homePrice"
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-downPayment">Down Payment (%)</Label>
                    <Input
                      id="rvb-downPayment"
                      type="number"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-mortgageRate">Mortgage Rate (%)</Label>
                    <Input
                      id="rvb-mortgageRate"
                      type="number"
                      step="0.1"
                      value={mortgageRate}
                      onChange={(e) => setMortgageRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-mortgageTerm">Mortgage Term (years)</Label>
                    <Input
                      id="rvb-mortgageTerm"
                      type="number"
                      value={mortgageTerm}
                      onChange={(e) => setMortgageTerm(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-propertyTax">Property Tax Rate (%)</Label>
                    <Input
                      id="rvb-propertyTax"
                      type="number"
                      step="0.1"
                      value={propertyTaxRate}
                      onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-insurance">Annual Insurance</Label>
                    <Input
                      id="rvb-insurance"
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-hoa">Monthly HOA</Label>
                    <Input
                      id="rvb-hoa"
                      type="number"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-maintenance">Maintenance (%/yr)</Label>
                    <Input
                      id="rvb-maintenance"
                      type="number"
                      step="0.1"
                      value={maintenanceRate}
                      onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Growth Assumptions */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Assumptions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rvb-appreciation">Home Appreciation (%/yr)</Label>
                    <Input
                      id="rvb-appreciation"
                      type="number"
                      step="0.1"
                      value={homeAppreciation}
                      onChange={(e) => setHomeAppreciation(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-investmentReturn">Investment Return (%/yr)</Label>
                    <Input
                      id="rvb-investmentReturn"
                      type="number"
                      step="0.1"
                      value={investmentReturn}
                      onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Return on renter's invested savings</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rvb-timeHorizon">Time Horizon (years)</Label>
                    <Input
                      id="rvb-timeHorizon"
                      type="number"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(Math.min(30, Math.max(1, Number(e.target.value))))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <Card className={`border-2 ${summary.buyNetWorth > summary.rentNetWorth ? 'bg-green-500/5 border-green-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
            <CardHeader>
              <CardTitle className="text-lg">Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium">{summary.recommendation}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Advantage</span>
                </div>
                <p className="text-2xl font-light">{formatCurrency(summary.advantage)}</p>
                <p className="text-xs text-muted-foreground">Over {timeHorizon} years</p>
              </div>
              {summary.breakEvenYear <= timeHorizon && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Break-even Year</span>
                  <p className="text-xl font-light">Year {summary.breakEvenYear}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-4 w-4" />
                Rent Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Rent Paid</span>
                <span className="font-medium">{formatCurrency(summary.totalRentCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Investment Value</span>
                <span className="font-medium text-green-500">{formatCurrency(summary.rentNetWorth)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="h-4 w-4" />
                Buy Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Housing Costs</span>
                <span className="font-medium">{formatCurrency(summary.totalBuyCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Home Equity</span>
                <span className="font-medium text-green-500">{formatCurrency(summary.buyNetWorth)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Year-by-Year Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Rent Cost</TableHead>
                  <TableHead className="text-right">Rent Cumulative</TableHead>
                  <TableHead className="text-right">Buy Cost</TableHead>
                  <TableHead className="text-right">Buy Cumulative</TableHead>
                  <TableHead className="text-right">Renter Net Worth</TableHead>
                  <TableHead className="text-right">Buyer Net Worth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisons.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.rentCost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.rentCumulative)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.buyCost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.buyCumulative)}</TableCell>
                    <TableCell className={`text-right ${row.rentNetWorth > row.buyNetWorth ? 'text-green-500' : ''}`}>
                      {formatCurrency(row.rentNetWorth)}
                    </TableCell>
                    <TableCell className={`text-right ${row.buyNetWorth > row.rentNetWorth ? 'text-green-500' : ''}`}>
                      {formatCurrency(row.buyNetWorth)}
                    </TableCell>
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
