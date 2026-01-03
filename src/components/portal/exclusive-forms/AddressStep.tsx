import { AddressAutocomplete, AddressComponents } from "@/components/ui/AddressAutocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface AddressStepProps {
  address: string;
  unitNumber?: string;
  addressComponents?: AddressComponents;
  onChange: (updates: {
    property_address?: string;
    unit_number?: string;
    addressComponents?: AddressComponents;
  }) => void;
}

export function AddressStep({ address, unitNumber, addressComponents, onChange }: AddressStepProps) {
  const handleAddressSelect = (components: AddressComponents) => {
    onChange({
      property_address: components.fullAddress,
      addressComponents: components,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Property Address
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the property address. We'll auto-fill location details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Street Address</CardTitle>
          <CardDescription>
            Start typing and select from the suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <AddressAutocomplete
              value={address}
              onChange={(value) => onChange({ property_address: value })}
              onAddressSelect={handleAddressSelect}
              placeholder="Start typing an address..."
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit / Apt # (if applicable)</Label>
            <Input
              id="unit"
              value={unitNumber || ""}
              onChange={(e) => onChange({ unit_number: e.target.value })}
              placeholder="e.g., 4A, Suite 100"
              className="h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Show parsed address details */}
      {addressComponents && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parsed Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {addressComponents.neighborhood && (
                <div>
                  <span className="text-muted-foreground">Neighborhood:</span>
                  <p className="font-medium">{addressComponents.neighborhood}</p>
                </div>
              )}
              {addressComponents.borough && (
                <div>
                  <span className="text-muted-foreground">Borough:</span>
                  <p className="font-medium">{addressComponents.borough}</p>
                </div>
              )}
              {addressComponents.city && (
                <div>
                  <span className="text-muted-foreground">City:</span>
                  <p className="font-medium">{addressComponents.city}</p>
                </div>
              )}
              {addressComponents.state && (
                <div>
                  <span className="text-muted-foreground">State:</span>
                  <p className="font-medium">{addressComponents.state}</p>
                </div>
              )}
              {addressComponents.zipCode && (
                <div>
                  <span className="text-muted-foreground">Zip:</span>
                  <p className="font-medium">{addressComponents.zipCode}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
