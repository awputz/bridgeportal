import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Home } from "lucide-react";
import { ResidentialListingData } from "@/hooks/useExclusiveSubmissions";

interface ResidentialSpecsStepProps {
  data: ResidentialListingData;
  onChange: (updates: Partial<ResidentialListingData>) => void;
}

export function ResidentialSpecsStep({ data, onChange }: ResidentialSpecsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          Property Specifications
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the property details and specifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Unit Details</CardTitle>
          <CardDescription>
            Physical specifications of the property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select
                value={data.bedrooms?.toString() || ""}
                onValueChange={(v) => onChange({ bedrooms: parseInt(v) })}
              >
                <SelectTrigger id="bedrooms" className="h-12">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1 BR</SelectItem>
                  <SelectItem value="2">2 BR</SelectItem>
                  <SelectItem value="3">3 BR</SelectItem>
                  <SelectItem value="4">4 BR</SelectItem>
                  <SelectItem value="5">5+ BR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select
                value={data.bathrooms?.toString() || ""}
                onValueChange={(v) => onChange({ bathrooms: parseFloat(v) })}
              >
                <SelectTrigger id="bathrooms" className="h-12">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 BA</SelectItem>
                  <SelectItem value="1.5">1.5 BA</SelectItem>
                  <SelectItem value="2">2 BA</SelectItem>
                  <SelectItem value="2.5">2.5 BA</SelectItem>
                  <SelectItem value="3">3 BA</SelectItem>
                  <SelectItem value="3.5">3.5+ BA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sqft">Square Footage</Label>
              <Input
                id="sqft"
                type="number"
                value={data.square_footage || ""}
                onChange={(e) => onChange({ square_footage: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 850"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                value={data.floor || ""}
                onChange={(e) => onChange({ floor: e.target.value })}
                placeholder="e.g., 4th"
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Listing Type</CardTitle>
          <CardDescription>
            Is this a rental or sale?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_rental" className="text-base">Rental Property</Label>
              <p className="text-sm text-muted-foreground">
                Toggle off for sales listings
              </p>
            </div>
            <Switch
              id="is_rental"
              checked={data.is_rental ?? true}
              onCheckedChange={(checked) => onChange({ is_rental: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available_date">Available Date</Label>
            <Input
              id="available_date"
              type="date"
              value={data.available_date || ""}
              onChange={(e) => onChange({ available_date: e.target.value })}
              className="h-12"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
