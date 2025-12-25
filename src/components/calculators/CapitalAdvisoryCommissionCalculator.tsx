import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, DollarSign, Users, Percent } from "lucide-react";

export const CapitalAdvisoryCommissionCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(10000000);
  const [loanType, setLoanType] = useState<string>("permanent");
  const [commissionRate, setCommissionRate] = useState<number>(1);
  const [houseSplit, setHouseSplit] = useState<number>(50);
  const [numAgents, setNumAgents] = useState<number>(1);

  const [results, setResults] = useState({
    grossCommission: 0,
    houseShare: 0,
    agentGross: 0,
    perAgentShare: 0,
    basisPoints: 0,
  });

  useEffect(() => {
    const grossCommission = loanAmount * (commissionRate / 100);
    const houseShare = grossCommission * (houseSplit / 100);
    const agentGross = grossCommission - houseShare;
    const perAgentShare = numAgents > 0 ? agentGross / numAgents : 0;
    const basisPoints = commissionRate * 100;

    setResults({ grossCommission, houseShare, agentGross, perAgentShare, basisPoints });
  }, [loanAmount, loanType, commissionRate, houseSplit, numAgents]);

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
              <Landmark className="h-5 w-5 text-accent" />
              Capital Advisory Commission
            </CardTitle>
            <CardDescription>
              Calculate mortgage brokerage and debt placement fees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loan Amount</Label>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Loan Type</Label>
                <Select value={loanType} onValueChange={setLoanType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent Financing</SelectItem>
                    <SelectItem value="bridge">Bridge Loan</SelectItem>
                    <SelectItem value="construction">Construction Loan</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                    <SelectItem value="mezz">Mezzanine Debt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Commission Rate (%)</Label>
                <Select value={commissionRate.toString()} onValueChange={(v) => setCommissionRate(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.50% (50 bps) - Large loans</SelectItem>
                    <SelectItem value="0.75">0.75% (75 bps)</SelectItem>
                    <SelectItem value="1">1.00% (100 bps) - Standard</SelectItem>
                    <SelectItem value="1.25">1.25% (125 bps)</SelectItem>
                    <SelectItem value="1.5">1.50% (150 bps) - Smaller/Complex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>House Split (%)</Label>
                <Select value={houseSplit.toString()} onValueChange={(v) => setHouseSplit(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50% House</SelectItem>
                    <SelectItem value="40">40% House</SelectItem>
                    <SelectItem value="30">30% House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Agents on Deal</Label>
                <Input
                  type="number"
                  min="1"
                  value={numAgents}
                  onChange={(e) => setNumAgents(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Typical Fee Ranges</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>• $50M+ loans: 25-50 bps</div>
                <div>• $20-50M loans: 50-75 bps</div>
                <div>• $5-20M loans: 75-100 bps</div>
                <div>• Under $5M: 100-150 bps</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Your Commission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Per Agent ({numAgents})</span>
              </div>
              <p className="text-3xl font-light text-green-500">{formatCurrency(results.perAgentShare)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Gross Fee</span>
              </div>
              <p className="text-xl font-light">{formatCurrency(results.grossCommission)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Loan Amount</span>
              <span className="font-medium">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee Rate</span>
              <span className="font-medium">{results.basisPoints} bps</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gross Fee</span>
              <span className="font-medium">{formatCurrency(results.grossCommission)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">House Share ({houseSplit}%)</span>
              <span className="font-medium">{formatCurrency(results.houseShare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Agent Pool</span>
              <span className="font-medium">{formatCurrency(results.agentGross)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
