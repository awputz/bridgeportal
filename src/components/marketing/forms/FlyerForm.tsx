import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertySelector, PropertyData } from "@/components/marketing/PropertySelector";
import { Separator } from "@/components/ui/separator";
import { useBrandProfile } from "@/hooks/marketing/useBrandProfile";

export interface FlyerFormData {
  flyerType: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  features: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  openHouseDate: string;
  openHouseTime: string;
}

interface FlyerFormProps {
  data: FlyerFormData;
  onChange: (data: FlyerFormData) => void;
}

const defaultData: FlyerFormData = {
  flyerType: "just-listed",
  address: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  squareFeet: "",
  features: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
  openHouseDate: "",
  openHouseTime: "",
};

export const FlyerForm = ({ data, onChange }: FlyerFormProps) => {
  const { data: brandProfile } = useBrandProfile();

  useEffect(() => {
    if (!data.flyerType) {
      onChange({ ...defaultData, ...data });
    }
  }, []);

  // Auto-fill agent info from brand profile
  useEffect(() => {
    if (brandProfile) {
      const updates: Partial<FlyerFormData> = {};
      if (!data.agentName && brandProfile.full_name) {
        updates.agentName = brandProfile.full_name;
      }
      if (!data.agentPhone && brandProfile.phone) {
        updates.agentPhone = brandProfile.phone;
      }
      if (!data.agentEmail && brandProfile.email) {
        updates.agentEmail = brandProfile.email;
      }
      if (Object.keys(updates).length > 0) {
        onChange({ ...data, ...updates });
      }
    }
  }, [brandProfile]);

  const handleChange = (field: keyof FlyerFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePropertySelect = (property: PropertyData) => {
    onChange({
      ...data,
      address: property.address,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      squareFeet: property.squareFeet,
    });
  };

  const isOpenHouse = data.flyerType === "open-house";

  return (
    <div className="space-y-4">
      <PropertySelector onSelect={handlePropertySelect} />
      <Separator className="my-4" />

      <div>
        <Label htmlFor="flyerType">Flyer Type</Label>
        <Select
          value={data.flyerType || "just-listed"}
          onValueChange={(value) => handleChange("flyerType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="just-listed">Just Listed</SelectItem>
            <SelectItem value="open-house">Open House</SelectItem>
            <SelectItem value="price-reduced">Price Reduced</SelectItem>
            <SelectItem value="just-sold">Just Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="address">Property Address</Label>
        <Input
          id="address"
          placeholder="123 Main Street, City, State"
          value={data.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="price">Listing Price</Label>
          <Input
            id="price"
            placeholder="$1,250,000"
            value={data.price || ""}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="squareFeet">Square Feet</Label>
          <Input
            id="squareFeet"
            placeholder="2,500"
            value={data.squareFeet || ""}
            onChange={(e) => handleChange("squareFeet", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            placeholder="3"
            value={data.bedrooms || ""}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            placeholder="2"
            value={data.bathrooms || ""}
            onChange={(e) => handleChange("bathrooms", e.target.value)}
          />
        </div>
      </div>

      {isOpenHouse && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="openHouseDate">Open House Date</Label>
            <Input
              id="openHouseDate"
              type="date"
              value={data.openHouseDate || ""}
              onChange={(e) => handleChange("openHouseDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="openHouseTime">Time</Label>
            <Input
              id="openHouseTime"
              placeholder="1PM - 4PM"
              value={data.openHouseTime || ""}
              onChange={(e) => handleChange("openHouseTime", e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="features">Key Features</Label>
        <Textarea
          id="features"
          placeholder="Chef's kitchen, private backyard, finished basement..."
          value={data.features || ""}
          onChange={(e) => handleChange("features", e.target.value)}
          rows={3}
        />
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Agent Information</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="agentName">Agent Name</Label>
            <Input
              id="agentName"
              placeholder="John Smith"
              value={data.agentName || ""}
              onChange={(e) => handleChange("agentName", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="agentPhone">Phone</Label>
              <Input
                id="agentPhone"
                placeholder="(555) 123-4567"
                value={data.agentPhone || ""}
                onChange={(e) => handleChange("agentPhone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="agentEmail">Email</Label>
              <Input
                id="agentEmail"
                placeholder="agent@example.com"
                value={data.agentEmail || ""}
                onChange={(e) => handleChange("agentEmail", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const isFlyerFormValid = (data: FlyerFormData): boolean => {
  return !!(data.flyerType && data.address && data.price);
};
