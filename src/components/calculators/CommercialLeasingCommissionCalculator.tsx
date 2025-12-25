import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, DollarSign, Users } from "lucide-react";

export const CommercialLeasingCommissionCalculator = () => {
  const [calculationMethod, setCalculationMethod] = useState<string>("total");
  const [totalLeaseValue, setTotalLeaseValue] = useState<number>(500000);
  const [monthlyRent, setMonthlyRent] = useState<number>(10000);
  const [leaseTerm, setLeaseTerm] = useState<number>(60);
  const [squareFeet, setSquareFeet] = useState<number>(2000);
  const [commissionType, setCommissionType] = useState<string>("percentage");
  const [commissionRate, setCommissionRate] = useState<number>(4);
  const [perSfRate, setPerSfRate] = useState<number>(2);
  const [isRenewal, setIsRenewal] = useState<boolean>(false);
  const [coBroke, setCoBroke] = useState<boolean>(false);
  const [houseSplit, setHouseSplit] = useState<number>(50);
  const [numAgents, setNumAgents] = useState<number>(1);

  const [results, setResults] = useState({
    leaseValue: 0,
    grossCommission: 0,
    sideCommission: 0,
    houseShare: 0,
    agentGross: 0,
    perAgentShare: 0,
  });

  useEffect(() => {
    let leaseValue = calculationMethod === "total" ? totalLeaseValue : monthlyRent * leaseTerm;
    
    let grossCommission = 0;
    if (commissionType === "percentage") {
      grossCommission = leaseValue * (commissionRate / 100);
    } else if (commissionType === "firstYear") {
      grossCommission = monthlyRent * 12 * 0.06;
    } else {
      grossCommission = squareFeet * perSfRate;
    }

    if (isRenewal) {
      grossCommission = grossCommission * 0.5;
    }

    const sideCommission = coBroke ? grossCommission * 0.5 : grossCommission;
    const houseShare = sideCommission * (houseSplit / 100);
    const agentGross = sideCommission - houseShare;
    const perAgentShare = numAgents > 0 ? agentGross / numAgents : 0;

    setResults({ leaseValue, grossCommission, sideCommission, houseShare, agentGross, perAgentShare });
  }, [calculationMethod, totalLeaseValue, monthlyRent, leaseTerm, squareFeet, commissionType, commissionRate, perSfRate, isRenewal, coBroke, houseSplit, numAgents]);

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
              <Building2 className="h-5 w-5 text-accent" />
              Commercial Leasing Commission
            </CardTitle>
            <CardDescription>
              Calculate commissions for office, retail, and industrial leases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Calculation Method</Label>
                <Select value={calculationMethod} onValueChange={setCalculationMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Enter Total Lease Value</SelectItem>
                    <SelectItem value="monthly">Calculate from Monthly Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {calculationMethod === "total" ? (
                <div className="space-y-2">
                  <Label>Total Lease Value</Label>
                  <Input
                    type="number"
                    value={totalLeaseValue}
                    onChange={(e) => setTotalLeaseValue(Number(e.target.value))}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Monthly Rent</Label>
                    <Input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lease Term (months)</Label>
                    <Input
                      type="number"
                      value={leaseTerm}
                      onChange={(e) => setLeaseTerm(Number(e.target.value))}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Square Footage</Label>
                <Input
                  type="number"
                  value={squareFeet}
                  onChange={(e) => setSquareFeet(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Commission Structure</Label>
                <Select value={commissionType} onValueChange={setCommissionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">% of Total Lease Value</SelectItem>
                    <SelectItem value="firstYear">6% of First Year Rent</SelectItem>
                    <SelectItem value="perSf">Per Square Foot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {commissionType === "percentage" && (
                <div className="space-y-2">
                  <Label>Commission Rate (%)</Label>
                  <Select value={commissionRate.toString()} onValueChange={(v) => setCommissionRate(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3%</SelectItem>
                      <SelectItem value="4">4% (Standard)</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="6">6%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {commissionType === "perSf" && (
                <div className="space-y-2">
                  <Label>Rate per SF ($)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={perSfRate}
                    onChange={(e) => setPerSfRate(Number(e.target.value))}
                  />
                </div>
              )}

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

              <div className="space-y-4 col-span-full">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" checked={isRenewal} onChange={(e) => setIsRenewal(e.target.checked)} className="rounded" />
                  Renewal (50% of new deal commission)
                </Label>
                <Label className="flex items-center gap-2">
                  <input type="checkbox" checked={coBroke} onChange={(e) => setCoBroke(e.target.checked)} className="rounded" />
                  Co-Broke (50/50 split with outside broker)
                </Label>
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
                <span>Total Lease Value</span>
              </div>
              <p className="text-xl font-light">{formatCurrency(results.leaseValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gross Commission</span>
              <span className="font-medium">{formatCurrency(results.grossCommission)}</span>
            </div>
            {coBroke && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Our Side (50%)</span>
                <span className="font-medium">{formatCurrency(results.sideCommission)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">House Share</span>
              <span className="font-medium">{formatCurrency(results.houseShare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Agent Pool</span>
              <span className="font-medium">{formatCurrency(results.agentGross)}</span>
            </div>
            {isRenewal && (
              <p className="text-xs text-amber-500 mt-2">* Renewal rate applied (50%)</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
