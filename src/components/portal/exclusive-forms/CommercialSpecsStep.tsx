import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Store } from "lucide-react";
import { CommercialLeasingListingData } from "@/hooks/useExclusiveSubmissions";

interface CommercialSpecsStepProps {
  data: CommercialLeasingListingData;
  onChange: (updates: Partial<CommercialLeasingListingData>) => void;
}

export function CommercialSpecsStep({ data, onChange }: CommercialSpecsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Space Specifications
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the commercial space details and characteristics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Space Type & Size</CardTitle>
          <CardDescription>
            Basic space information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property_type">Property Type</Label>
            <Select
              value={data.property_type || ""}
              onValueChange={(v) => onChange({ property_type: v as CommercialLeasingListingData["property_type"] })}
            >
              <SelectTrigger id="property_type" className="h-12">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="flex">Flex Space</SelectItem>
                <SelectItem value="mixed">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_sf">Total SF</Label>
              <Input
                id="total_sf"
                type="number"
                value={data.total_sf || ""}
                onChange={(e) => onChange({ total_sf: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 3500"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="divisible_min_sf">Divisible Min SF</Label>
              <Input
                id="divisible_min_sf"
                type="number"
                value={data.divisible_min_sf || ""}
                onChange={(e) => onChange({ divisible_min_sf: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 1500"
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Physical Characteristics</CardTitle>
          <CardDescription>
            Space dimensions and utilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ceiling_height">Ceiling Height (ft)</Label>
              <Input
                id="ceiling_height"
                type="number"
                step="0.5"
                value={data.ceiling_height_ft || ""}
                onChange={(e) => onChange({ ceiling_height_ft: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 14"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frontage">Frontage (ft)</Label>
              <Input
                id="frontage"
                type="number"
                value={data.frontage_ft || ""}
                onChange={(e) => onChange({ frontage_ft: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 25"
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="electric">Electric (Amps)</Label>
              <Input
                id="electric"
                type="number"
                value={data.electric_amps || ""}
                onChange={(e) => onChange({ electric_amps: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 200"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basement_sf">Basement SF (if any)</Label>
              <Input
                id="basement_sf"
                type="number"
                value={data.basement_sf || ""}
                onChange={(e) => onChange({ basement_sf: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 1000"
                className="h-12"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="has_basement" className="text-base">Has Basement</Label>
              <p className="text-sm text-muted-foreground">
                Does this space include basement access?
              </p>
            </div>
            <Switch
              id="has_basement"
              checked={data.has_basement ?? false}
              onCheckedChange={(checked) => onChange({ has_basement: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lease Terms</CardTitle>
          <CardDescription>
            Basic lease information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lease_term">Lease Term (years)</Label>
              <Select
                value={data.lease_term_years?.toString() || ""}
                onValueChange={(v) => onChange({ lease_term_years: parseInt(v) })}
              >
                <SelectTrigger id="lease_term" className="h-12">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Years</SelectItem>
                  <SelectItem value="5">5 Years</SelectItem>
                  <SelectItem value="7">7 Years</SelectItem>
                  <SelectItem value="10">10 Years</SelectItem>
                  <SelectItem value="15">15 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="possession_date">Possession Date</Label>
              <Input
                id="possession_date"
                type="date"
                value={data.possession_date || ""}
                onChange={(e) => onChange({ possession_date: e.target.value })}
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
