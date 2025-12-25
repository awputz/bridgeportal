import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, Users, Building2 } from "lucide-react";

export const InvestmentSalesCommissionCalculator = () => {
  const [salePrice, setSalePrice] = useState<number>(5000000);
  const [commissionRate, setCommissionRate] = useState<number>(4);
  const [representationType, setRepresentationType] = useState<string>("seller");
  const [coBroke, setCoBroke] = useState<boolean>(false);
  const [coBrokeSplit, setCoBrokeSplit] = useState<number>(50);
  const [houseSplit, setHouseSplit] = useState<number>(50);
  const [numAgents, setNumAgents] = useState<number>(1);

  const [results, setResults] = useState({
    grossCommission: 0,
    sideCommission: 0,
    houseShare: 0,
    agentGross: 0,
    perAgentShare: 0,
  });

  useEffect(() => {
    const grossCommission = salePrice * (commissionRate / 100);
    const sideCommission = coBroke ? grossCommission * (coBrokeSplit / 100) : grossCommission;
    const houseShare = sideCommission * (houseSplit / 100);
    const agentGross = sideCommission - houseShare;
    const perAgentShare = numAgents > 0 ? agentGross / numAgents : 0;

    setResults({ grossCommission, sideCommission, houseShare, agentGross, perAgentShare });
  }, [salePrice, commissionRate, representationType, coBroke, coBrokeSplit, houseSplit, numAgents]);

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
              <TrendingUp className="h-5 w-5 text-accent" />
              Investment Sales Commission
            </CardTitle>
            <CardDescription>
              Calculate commissions for multifamily, mixed-use, and commercial property sales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Select value={commissionRate.toString()} onValueChange={(v) => setCommissionRate(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3% (Large deals)</SelectItem>
                    <SelectItem value="4">4% (Standard)</SelectItem>
                    <SelectItem value="5">5% (Mid-market)</SelectItem>
                    <SelectItem value="6">6% (Smaller deals)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="representationType">Representation</Label>
                <Select value={representationType} onValueChange={setRepresentationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seller">Seller Rep (Exclusive)</SelectItem>
                    <SelectItem value="buyer">Buyer Rep</SelectItem>
                    <SelectItem value="dual">Dual Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="houseSplit">House Split (%)</Label>
                <Select value={houseSplit.toString()} onValueChange={(v) => setHouseSplit(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50% House</SelectItem>
                    <SelectItem value="45">45% House</SelectItem>
                    <SelectItem value="40">40% House</SelectItem>
                    <SelectItem value="35">35% House (Top Producer)</SelectItem>
                    <SelectItem value="30">30% House (Elite)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={coBroke}
                    onChange={(e) => setCoBroke(e.target.checked)}
                    className="rounded"
                  />
                  Co-Broke with Outside Broker
                </Label>
                {coBroke && (
                  <Select value={coBrokeSplit.toString()} onValueChange={(v) => setCoBrokeSplit(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50/50 Split</SelectItem>
                      <SelectItem value="60">60/40 (We get 60%)</SelectItem>
                      <SelectItem value="40">40/60 (We get 40%)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numAgents">Agents on Deal</Label>
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
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Your Commission
            </CardTitle>
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
                <span>Gross Commission</span>
              </div>
              <p className="text-xl font-light">{formatCurrency(results.grossCommission)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deal Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gross Commission</span>
              <span className="font-medium">{formatCurrency(results.grossCommission)}</span>
            </div>
            {coBroke && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Our Side ({coBrokeSplit}%)</span>
                <span className="font-medium">{formatCurrency(results.sideCommission)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">House Share ({houseSplit}%)</span>
              <span className="font-medium">{formatCurrency(results.houseShare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Agent Pool</span>
              <span className="font-medium">{formatCurrency(results.agentGross)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per SF</span>
              <span className="font-medium">${(salePrice / 10000).toFixed(0)}/SF (est.)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
