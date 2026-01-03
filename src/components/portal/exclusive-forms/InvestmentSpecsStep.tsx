import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Building2 } from "lucide-react";
import { InvestmentSalesListingData } from "@/hooks/useExclusiveSubmissions";

interface InvestmentSpecsStepProps {
  data: InvestmentSalesListingData;
  onChange: (updates: Partial<InvestmentSalesListingData>) => void;
}

export function InvestmentSpecsStep({ data, onChange }: InvestmentSpecsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Building Specifications
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the building details and physical characteristics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Building Details</CardTitle>
          <CardDescription>
            Core building information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building_class">Building Class</Label>
              <Select
                value={data.building_class || ""}
                onValueChange={(v) => onChange({ building_class: v })}
              >
                <SelectTrigger id="building_class" className="h-12">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Class A</SelectItem>
                  <SelectItem value="B">Class B</SelectItem>
                  <SelectItem value="C">Class C</SelectItem>
                  <SelectItem value="D">Class D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_units">Total Units</Label>
              <Input
                id="total_units"
                type="number"
                value={data.total_units || ""}
                onChange={(e) => onChange({ total_units: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 12"
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gross_sf">Gross SF</Label>
              <Input
                id="gross_sf"
                type="number"
                value={data.gross_sf || ""}
                onChange={(e) => onChange({ gross_sf: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 15000"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot_size">Lot Size (SF)</Label>
              <Input
                id="lot_size"
                type="number"
                value={data.lot_size || ""}
                onChange={(e) => onChange({ lot_size: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 2500"
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                type="number"
                value={data.year_built || ""}
                onChange={(e) => onChange({ year_built: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 1920"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoning">Zoning</Label>
              <Input
                id="zoning"
                value={data.zoning || ""}
                onChange={(e) => onChange({ zoning: e.target.value })}
                placeholder="e.g., R7A, C4-4A"
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tax Information</CardTitle>
          <CardDescription>
            Property tax details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax_class">Tax Class</Label>
              <Select
                value={data.tax_class || ""}
                onValueChange={(v) => onChange({ tax_class: v })}
              >
                <SelectTrigger id="tax_class" className="h-12">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Class 1</SelectItem>
                  <SelectItem value="2">Class 2</SelectItem>
                  <SelectItem value="2A">Class 2A</SelectItem>
                  <SelectItem value="2B">Class 2B</SelectItem>
                  <SelectItem value="4">Class 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual_taxes">Annual Taxes ($)</Label>
              <Input
                id="annual_taxes"
                type="number"
                value={data.annual_taxes || ""}
                onChange={(e) => onChange({ annual_taxes: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 45000"
                className="h-12"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_1031" className="text-base">1031 Exchange</Label>
              <p className="text-sm text-muted-foreground">
                Is this property eligible for 1031 exchange?
              </p>
            </div>
            <Switch
              id="is_1031"
              checked={data.is_1031_exchange ?? false}
              onCheckedChange={(checked) => onChange({ is_1031_exchange: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
