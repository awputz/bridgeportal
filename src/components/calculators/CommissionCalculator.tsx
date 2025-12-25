import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, Users } from "lucide-react";

export const CommissionCalculator = () => {
  const [dealValue, setDealValue] = useState<number>(2000000);
  const [commissionRate, setCommissionRate] = useState<number>(6);
  const [splitType, setSplitType] = useState<string>("50-50");
  const [houseSplit, setHouseSplit] = useState<number>(50);
  const [numAgents, setNumAgents] = useState<number>(1);

  const [results, setResults] = useState({
    totalCommission: 0,
    houseShare: 0,
    agentGross: 0,
    perAgentShare: 0,
  });

  useEffect(() => {
    const totalCommission = dealValue * (commissionRate / 100);
    const housePercent = splitType === "custom" ? houseSplit : 
                        splitType === "50-50" ? 50 : 
                        splitType === "60-40" ? 40 : 30;
    const houseShare = totalCommission * (housePercent / 100);
    const agentGross = totalCommission - houseShare;
    const perAgentShare = numAgents > 0 ? agentGross / numAgents : 0;

    setResults({ totalCommission, houseShare, agentGross, perAgentShare });
  }, [dealValue, commissionRate, splitType, houseSplit, numAgents]);

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
              Commission Calculator
            </CardTitle>
            <CardDescription>
              Calculate agent and house commission splits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dealValue">Deal Value</Label>
                <Input
                  id="dealValue"
                  type="number"
                  value={dealValue}
                  onChange={(e) => setDealValue(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.25"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="splitType">Split Type</Label>
                <Select value={splitType} onValueChange={setSplitType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50-50">50/50 (Agent/House)</SelectItem>
                    <SelectItem value="60-40">60/40 (Agent/House)</SelectItem>
                    <SelectItem value="70-30">70/30 (Agent/House)</SelectItem>
                    <SelectItem value="custom">Custom Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {splitType === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="houseSplit">House Split (%)</Label>
                  <Input
                    id="houseSplit"
                    type="number"
                    value={houseSplit}
                    onChange={(e) => setHouseSplit(Number(e.target.value))}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="numAgents">Number of Agents Splitting</Label>
                <Input
                  id="numAgents"
                  type="number"
                  min="1"
                  value={numAgents}
                  onChange={(e) => setNumAgents(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Commission Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Total Commission</span>
              </div>
              <p className="text-2xl font-light">{formatCurrency(results.totalCommission)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Per Agent ({numAgents})</span>
              </div>
              <p className="text-2xl font-light text-green-500">{formatCurrency(results.perAgentShare)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Split Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">House Share</span>
              <span className="font-medium">{formatCurrency(results.houseShare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Agent Gross</span>
              <span className="font-medium">{formatCurrency(results.agentGross)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Effective Agent Rate</span>
              <span className="font-medium">
                {((results.perAgentShare / dealValue) * 100).toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
