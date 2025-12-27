import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, Calculator, Calendar } from "lucide-react";

interface InvestmentSalesData {
  cap_rate?: string;
  noi?: string;
  building_class?: string;
  unit_count?: string;
  year_built?: string;
  gross_sf?: string;
  asking_price?: string;
  offer_price?: string;
  is_1031_exchange?: boolean;
  financing_type?: string;
  lender_name?: string;
  loan_amount?: string;
  due_diligence_deadline?: string;
  property_type?: string;
  zoning?: string;
}

interface InvestmentSalesDealFieldsProps {
  data: InvestmentSalesData;
  onChange: (data: Partial<InvestmentSalesData>) => void;
}

const buildingClasses = [
  { value: "A", label: "Class A" },
  { value: "B", label: "Class B" },
  { value: "C", label: "Class C" },
  { value: "D", label: "Class D" },
];

const propertyTypes = [
  { value: "multifamily", label: "Multifamily" },
  { value: "mixed-use", label: "Mixed-Use" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "industrial", label: "Industrial" },
  { value: "land", label: "Land" },
  { value: "hotel", label: "Hotel" },
  { value: "special-purpose", label: "Special Purpose" },
];

const financingTypes = [
  { value: "conventional", label: "Conventional" },
  { value: "agency", label: "Agency (Fannie/Freddie)" },
  { value: "bridge", label: "Bridge Loan" },
  { value: "hard-money", label: "Hard Money" },
  { value: "seller-financing", label: "Seller Financing" },
  { value: "all-cash", label: "All Cash" },
  { value: "assumable", label: "Assumable Debt" },
];

export const InvestmentSalesDealFields = ({ data, onChange }: InvestmentSalesDealFieldsProps) => {
  // Calculate derived values
  const calculatePricePerUnit = () => {
    const price = parseFloat(data.asking_price || "0");
    const units = parseInt(data.unit_count || "0");
    if (price && units) return Math.round(price / units);
    return null;
  };

  const calculatePricePerSF = () => {
    const price = parseFloat(data.asking_price || "0");
    const sf = parseInt(data.gross_sf || "0");
    if (price && sf) return Math.round(price / sf);
    return null;
  };

  const pricePerUnit = calculatePricePerUnit();
  const pricePerSF = calculatePricePerSF();

  return (
    <div className="space-y-6">
      {/* Property Details */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <Building2 className="h-4 w-4" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select
                value={data.property_type || ""}
                onValueChange={(v) => onChange({ property_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Building Class</Label>
              <Select
                value={data.building_class || ""}
                onValueChange={(v) => onChange({ building_class: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {buildingClasses.map((cls) => (
                    <SelectItem key={cls.value} value={cls.value}>
                      {cls.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_count">Unit Count</Label>
              <Input
                id="unit_count"
                type="number"
                value={data.unit_count || ""}
                onChange={(e) => onChange({ unit_count: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gross_sf">Gross SF</Label>
              <Input
                id="gross_sf"
                type="number"
                value={data.gross_sf || ""}
                onChange={(e) => onChange({ gross_sf: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                type="number"
                value={data.year_built || ""}
                onChange={(e) => onChange({ year_built: e.target.value })}
                placeholder="1990"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zoning">Zoning</Label>
            <Input
              id="zoning"
              value={data.zoning || ""}
              onChange={(e) => onChange({ zoning: e.target.value })}
              placeholder="e.g., R7-2, C4-4A"
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Details */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <DollarSign className="h-4 w-4" />
            Financial Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asking_price">Asking Price ($)</Label>
              <Input
                id="asking_price"
                type="number"
                value={data.asking_price || ""}
                onChange={(e) => onChange({ asking_price: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer_price">Offer Price ($)</Label>
              <Input
                id="offer_price"
                type="number"
                value={data.offer_price || ""}
                onChange={(e) => onChange({ offer_price: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="noi">NOI ($)</Label>
              <Input
                id="noi"
                type="number"
                value={data.noi || ""}
                onChange={(e) => onChange({ noi: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cap_rate">Cap Rate (%)</Label>
              <Input
                id="cap_rate"
                type="number"
                step="0.01"
                value={data.cap_rate || ""}
                onChange={(e) => onChange({ cap_rate: e.target.value })}
                placeholder="5.5"
              />
            </div>
          </div>

          {/* Calculated Metrics */}
          {(pricePerUnit || pricePerSF) && (
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                {pricePerUnit && (
                  <span className="mr-4">
                    <strong className="text-foreground">${pricePerUnit.toLocaleString()}</strong> / unit
                  </span>
                )}
                {pricePerSF && (
                  <span>
                    <strong className="text-foreground">${pricePerSF.toLocaleString()}</strong> / SF
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financing */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <Calendar className="h-4 w-4" />
            Financing & Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Financing Type</Label>
              <Select
                value={data.financing_type || ""}
                onValueChange={(v) => onChange({ financing_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {financingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan_amount">Loan Amount ($)</Label>
              <Input
                id="loan_amount"
                type="number"
                value={data.loan_amount || ""}
                onChange={(e) => onChange({ loan_amount: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lender_name">Lender</Label>
              <Input
                id="lender_name"
                value={data.lender_name || ""}
                onChange={(e) => onChange({ lender_name: e.target.value })}
                placeholder="Bank / Lender name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_diligence_deadline">Due Diligence Deadline</Label>
              <Input
                id="due_diligence_deadline"
                type="date"
                value={data.due_diligence_deadline || ""}
                onChange={(e) => onChange({ due_diligence_deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is_1031_exchange"
              checked={data.is_1031_exchange || false}
              onCheckedChange={(checked) => onChange({ is_1031_exchange: checked as boolean })}
            />
            <Label htmlFor="is_1031_exchange" className="font-normal">
              1031 Exchange
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentSalesDealFields;
