import { useState } from "react";
import { Calculator, TrendingUp, DollarSign, Home, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function RentOptimizationCalculator() {
  const [unitCount, setUnitCount] = useState(50);
  const [avgRent, setAvgRent] = useState(3500);
  const [currentVacancy, setCurrentVacancy] = useState(8);
  const [targetVacancy, setTargetVacancy] = useState(3);
  const [operatingExpenseRatio, setOperatingExpenseRatio] = useState(35);

  // Calculations
  const grossPotentialIncome = unitCount * avgRent * 12;
  const currentVacancyLoss = grossPotentialIncome * (currentVacancy / 100);
  const targetVacancyLoss = grossPotentialIncome * (targetVacancy / 100);
  const vacancySavings = currentVacancyLoss - targetVacancyLoss;
  
  const currentEffectiveGross = grossPotentialIncome - currentVacancyLoss;
  const targetEffectiveGross = grossPotentialIncome - targetVacancyLoss;
  
  const currentOperatingExpenses = currentEffectiveGross * (operatingExpenseRatio / 100);
  const targetOperatingExpenses = targetEffectiveGross * (operatingExpenseRatio / 100);
  
  const currentNOI = currentEffectiveGross - currentOperatingExpenses;
  const targetNOI = targetEffectiveGross - targetOperatingExpenses;
  const noiImprovement = targetNOI - currentNOI;
  
  const perUnitNOI = targetNOI / unitCount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="max-w-4xl mx-auto bg-white/[0.02] border-white/10">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Calculator className="h-8 w-8 text-accent" />
          <CardTitle className="text-2xl font-light">Rent Optimization Calculator</CardTitle>
        </div>
        <CardDescription className="font-light">
          Model the impact of vacancy reduction on your portfolio's net operating income
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Property Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="unitCount" className="font-light flex items-center gap-2">
                <Home className="h-4 w-4 text-accent" />
                Number of Units
              </Label>
              <Input
                id="unitCount"
                type="number"
                value={unitCount}
                onChange={(e) => setUnitCount(Number(e.target.value) || 0)}
                className="bg-white/5 border-white/10 font-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgRent" className="font-light flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-accent" />
                Average Monthly Rent
              </Label>
              <Input
                id="avgRent"
                type="number"
                value={avgRent}
                onChange={(e) => setAvgRent(Number(e.target.value) || 0)}
                className="bg-white/5 border-white/10 font-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingExpenseRatio" className="font-light flex items-center gap-2">
                <Percent className="h-4 w-4 text-accent" />
                Operating Expense Ratio: {operatingExpenseRatio}%
              </Label>
              <Slider
                id="operatingExpenseRatio"
                value={[operatingExpenseRatio]}
                onValueChange={(value) => setOperatingExpenseRatio(value[0])}
                min={20}
                max={60}
                step={1}
                className="py-4"
              />
            </div>
          </div>

          {/* Right Column - Vacancy Rates */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="font-light flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Current Vacancy Rate: {currentVacancy}%
              </Label>
              <Slider
                value={[currentVacancy]}
                onValueChange={(value) => setCurrentVacancy(value[0])}
                min={0}
                max={20}
                step={0.5}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-light flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Target Vacancy Rate: {targetVacancy}%
              </Label>
              <Slider
                value={[targetVacancy]}
                onValueChange={(value) => setTargetVacancy(value[0])}
                min={0}
                max={15}
                step={0.5}
                className="py-4"
              />
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground font-light">
                Vacancy Reduction: <span className="text-accent font-medium">{(currentVacancy - targetVacancy).toFixed(1)}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 text-center">
            <p className="text-xs text-muted-foreground font-light mb-1">Gross Potential Income</p>
            <p className="text-xl font-light text-foreground">{formatCurrency(grossPotentialIncome)}</p>
            <p className="text-xs text-muted-foreground font-light">per year</p>
          </div>
          
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 text-center">
            <p className="text-xs text-muted-foreground font-light mb-1">Annual Vacancy Savings</p>
            <p className="text-xl font-light text-accent">{formatCurrency(vacancySavings)}</p>
            <p className="text-xs text-muted-foreground font-light">recovered revenue</p>
          </div>
          
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 text-center">
            <p className="text-xs text-muted-foreground font-light mb-1">NOI Improvement</p>
            <p className="text-xl font-light text-accent">{formatCurrency(noiImprovement)}</p>
            <p className="text-xs text-muted-foreground font-light">annual increase</p>
          </div>
          
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 text-center">
            <p className="text-xs text-muted-foreground font-light mb-1">Target NOI Per Unit</p>
            <p className="text-xl font-light text-foreground">{formatCurrency(perUnitNOI)}</p>
            <p className="text-xs text-muted-foreground font-light">per year</p>
          </div>
        </div>

        {/* Current vs Target Comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-white/10 bg-white/[0.01]">
            <h4 className="text-sm font-light text-muted-foreground mb-3">Current Performance</h4>
            <div className="space-y-2 text-sm font-light">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective Gross Income:</span>
                <span>{formatCurrency(currentEffectiveGross)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Operating Expenses:</span>
                <span>{formatCurrency(currentOperatingExpenses)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-muted-foreground">Net Operating Income:</span>
                <span className="text-foreground">{formatCurrency(currentNOI)}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-accent/30 bg-accent/5">
            <h4 className="text-sm font-light text-accent mb-3">Target Performance</h4>
            <div className="space-y-2 text-sm font-light">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective Gross Income:</span>
                <span>{formatCurrency(targetEffectiveGross)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Operating Expenses:</span>
                <span>{formatCurrency(targetOperatingExpenses)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-accent/20">
                <span className="text-muted-foreground">Net Operating Income:</span>
                <span className="text-accent font-medium">{formatCurrency(targetNOI)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-light text-center">
          This calculator provides estimates for illustrative purposes only. Actual results may vary based on market conditions and property specifics.
        </p>
      </CardContent>
    </Card>
  );
}