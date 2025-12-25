import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, DollarSign, Users } from "lucide-react";

export const ResidentialCommissionCalculator = () => {
  const [transactionType, setTransactionType] = useState<string>("rental");
  
  // Rental fields
  const [monthlyRent, setMonthlyRent] = useState<number>(4000);
  const [feeType, setFeeType] = useState<string>("op");
  const [feeStructure, setFeeStructure] = useState<string>("oneMonth");
  const [customFeePercent, setCustomFeePercent] = useState<number>(15);
  
  // Sale fields
  const [salePrice, setSalePrice] = useState<number>(1500000);
  const [commissionRate, setCommissionRate] = useState<number>(6);
  
  // Common fields
  const [coBroke, setCoBroke] = useState<boolean>(true);
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
    let grossCommission = 0;
    
    if (transactionType === "rental") {
      if (feeStructure === "oneMonth") {
        grossCommission = monthlyRent;
      } else if (feeStructure === "fifteenPercent") {
        grossCommission = monthlyRent * 12 * 0.15;
      } else {
        grossCommission = monthlyRent * 12 * (customFeePercent / 100);
      }
    } else {
      grossCommission = salePrice * (commissionRate / 100);
    }

    const sideCommission = coBroke ? grossCommission * 0.5 : grossCommission;
    const houseShare = sideCommission * (houseSplit / 100);
    const agentGross = sideCommission - houseShare;
    const perAgentShare = numAgents > 0 ? agentGross / numAgents : 0;

    setResults({ grossCommission, sideCommission, houseShare, agentGross, perAgentShare });
  }, [transactionType, monthlyRent, feeType, feeStructure, customFeePercent, salePrice, commissionRate, coBroke, houseSplit, numAgents]);

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
              <Home className="h-5 w-5 text-accent" />
              Residential Commission
            </CardTitle>
            <CardDescription>
              Calculate commissions for NYC residential rentals and sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={transactionType} onValueChange={setTransactionType}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="rental">Rental</TabsTrigger>
                <TabsTrigger value="sale">Sale</TabsTrigger>
              </TabsList>

              <TabsContent value="rental" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Rent</Label>
                    <Input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fee Type</Label>
                    <Select value={feeType} onValueChange={setFeeType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="op">OP (Owner Pays)</SelectItem>
                        <SelectItem value="tp">TP (Tenant Pays)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fee Structure</Label>
                    <Select value={feeStructure} onValueChange={setFeeStructure}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oneMonth">1 Month Rent</SelectItem>
                        <SelectItem value="fifteenPercent">15% Annual Rent</SelectItem>
                        <SelectItem value="custom">Custom %</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {feeStructure === "custom" && (
                    <div className="space-y-2">
                      <Label>Custom Fee (%)</Label>
                      <Input
                        type="number"
                        value={customFeePercent}
                        onChange={(e) => setCustomFeePercent(Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="sale" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sale Price</Label>
                    <Input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Commission Rate (%)</Label>
                    <Select value={commissionRate.toString()} onValueChange={(v) => setCommissionRate(Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="6">6% (Standard)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" checked={coBroke} onChange={(e) => setCoBroke(e.target.checked)} className="rounded" />
                    REBNY Co-Broke (50/50)
                  </Label>
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
            </Tabs>
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
            <CardTitle className="text-lg">Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Fee</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
