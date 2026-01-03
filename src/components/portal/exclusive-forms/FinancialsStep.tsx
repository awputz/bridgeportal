import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { 
  ExclusiveDivision, 
  ResidentialListingData, 
  InvestmentSalesListingData, 
  CommercialLeasingListingData,
  ListingData 
} from "@/hooks/useExclusiveSubmissions";

interface FinancialsStepProps {
  division: ExclusiveDivision;
  data: ListingData;
  onChange: (updates: Partial<ListingData>) => void;
}

export function FinancialsStep({ division, data, onChange }: FinancialsStepProps) {
  if (division === "residential") {
    const resData = data as ResidentialListingData;
    return <ResidentialFinancials data={resData} onChange={onChange} />;
  }
  
  if (division === "investment-sales") {
    const invData = data as InvestmentSalesListingData;
    return <InvestmentFinancials data={invData} onChange={onChange} />;
  }
  
  if (division === "commercial-leasing") {
    const commData = data as CommercialLeasingListingData;
    return <CommercialFinancials data={commData} onChange={onChange} />;
  }
  
  return null;
}

function ResidentialFinancials({ 
  data, 
  onChange 
}: { 
  data: ResidentialListingData; 
  onChange: (updates: Partial<ResidentialListingData>) => void;
}) {
  const isRental = data.is_rental ?? true;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Financial Details
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the pricing and fee information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRental ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="rent_price">Monthly Rent ($)</Label>
                <Input
                  id="rent_price"
                  type="number"
                  value={data.rent_price || ""}
                  onChange={(e) => onChange({ rent_price: parseFloat(e.target.value) || undefined })}
                  placeholder="e.g., 3500"
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="security_deposit">Security Deposit (months)</Label>
                <Select
                  value={data.security_deposit_months?.toString() || ""}
                  onValueChange={(v) => onChange({ security_deposit_months: parseInt(v) })}
                >
                  <SelectTrigger id="security_deposit" className="h-12">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="2">2 Months</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="sale_price">Sale Price ($)</Label>
              <Input
                id="sale_price"
                type="number"
                value={data.sale_price || ""}
                onChange={(e) => onChange({ sale_price: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 750000"
                className="h-12"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commission Structure</CardTitle>
          <CardDescription>
            How will the commission be handled?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fee_structure">Fee Structure</Label>
            <Select
              value={data.fee_structure || ""}
              onValueChange={(v) => onChange({ fee_structure: v as ResidentialListingData["fee_structure"] })}
            >
              <SelectTrigger id="fee_structure" className="h-12">
                <SelectValue placeholder="Select fee structure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cyof">CYOF (Collect Your Own Fee)</SelectItem>
                <SelectItem value="op">OP (Owner Pays)</SelectItem>
                <SelectItem value="co_broke">Co-Broke</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.fee_structure === "co_broke" && (
            <div className="space-y-2">
              <Label htmlFor="co_broke_percent">Co-Broke Percentage (%)</Label>
              <Input
                id="co_broke_percent"
                type="number"
                step="0.5"
                value={data.co_broke_percent || ""}
                onChange={(e) => onChange({ co_broke_percent: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 50"
                className="h-12"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InvestmentFinancials({ 
  data, 
  onChange 
}: { 
  data: InvestmentSalesListingData; 
  onChange: (updates: Partial<InvestmentSalesListingData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Financial Details
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the income and pricing information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income</CardTitle>
          <CardDescription>
            Current and projected income figures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gpi">Gross Potential Income ($)</Label>
              <Input
                id="gpi"
                type="number"
                value={data.gpi || ""}
                onChange={(e) => onChange({ gpi: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 500000"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="noi">Net Operating Income ($)</Label>
              <Input
                id="noi"
                type="number"
                value={data.noi || ""}
                onChange={(e) => onChange({ noi: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 300000"
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_cap">Current Cap Rate (%)</Label>
              <Input
                id="current_cap"
                type="number"
                step="0.1"
                value={data.current_cap_rate || ""}
                onChange={(e) => onChange({ current_cap_rate: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 5.5"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pro_forma_cap">Pro Forma Cap Rate (%)</Label>
              <Input
                id="pro_forma_cap"
                type="number"
                step="0.1"
                value={data.pro_forma_cap_rate || ""}
                onChange={(e) => onChange({ pro_forma_cap_rate: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 6.5"
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asking_price">Asking Price ($)</Label>
            <Input
              id="asking_price"
              type="number"
              value={data.asking_price || ""}
              onChange={(e) => onChange({ asking_price: parseFloat(e.target.value) || undefined })}
              placeholder="e.g., 5000000"
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_per_unit">Price Per Unit ($)</Label>
              <Input
                id="price_per_unit"
                type="number"
                value={data.price_per_unit || ""}
                onChange={(e) => onChange({ price_per_unit: parseFloat(e.target.value) || undefined })}
                placeholder="Auto-calculated"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_sf">Price Per SF ($)</Label>
              <Input
                id="price_per_sf"
                type="number"
                value={data.price_per_sf || ""}
                onChange={(e) => onChange({ price_per_sf: parseFloat(e.target.value) || undefined })}
                placeholder="Auto-calculated"
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CommercialFinancials({ 
  data, 
  onChange 
}: { 
  data: CommercialLeasingListingData; 
  onChange: (updates: Partial<CommercialLeasingListingData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Lease Terms
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the rental pricing and lease structure
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ppsf">Asking Rent ($/PSF)</Label>
            <Input
              id="ppsf"
              type="number"
              step="0.01"
              value={data.ppsf || ""}
              onChange={(e) => onChange({ ppsf: parseFloat(e.target.value) || undefined })}
              placeholder="e.g., 75.00"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lease_type">Lease Type</Label>
            <Select
              value={data.lease_type || ""}
              onValueChange={(v) => onChange({ lease_type: v as CommercialLeasingListingData["lease_type"] })}
            >
              <SelectTrigger id="lease_type" className="h-12">
                <SelectValue placeholder="Select lease type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nnn">Triple Net (NNN)</SelectItem>
                <SelectItem value="gross">Gross</SelectItem>
                <SelectItem value="modified_gross">Modified Gross</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
