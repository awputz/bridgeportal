import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OMPropertyBasics } from "@/types/om-generator";

interface OMPropertySectionProps {
  data: OMPropertyBasics;
  onChange: (data: OMPropertyBasics) => void;
}

export const OMPropertySection = ({ data, onChange }: OMPropertySectionProps) => {
  const update = (field: keyof OMPropertyBasics, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Property Address *</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="123 Main Street, New York, NY"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="propertyName">Property Name</Label>
          <Input
            id="propertyName"
            value={data.propertyName}
            onChange={(e) => update("propertyName", e.target.value)}
            placeholder="The Williamsburg Collection"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select value={data.propertyType} onValueChange={(v) => update("propertyType", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multifamily">Multifamily</SelectItem>
              <SelectItem value="mixed-use">Mixed Use</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="development">Development Site</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Building Class</Label>
          <Select value={data.buildingClass} onValueChange={(v) => update("buildingClass", v)}>
            <SelectTrigger>
              <SelectValue />
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
          <Label htmlFor="yearBuilt">Year Built</Label>
          <Input
            id="yearBuilt"
            type="number"
            value={data.yearBuilt}
            onChange={(e) => update("yearBuilt", e.target.value)}
            placeholder="1920"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearRenovated">Year Renovated</Label>
          <Input
            id="yearRenovated"
            type="number"
            value={data.yearRenovated}
            onChange={(e) => update("yearRenovated", e.target.value)}
            placeholder="2020"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalUnits">Total Units</Label>
          <Input
            id="totalUnits"
            type="number"
            value={data.totalUnits}
            onChange={(e) => update("totalUnits", e.target.value)}
            placeholder="20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grossSF">Gross SF</Label>
          <Input
            id="grossSF"
            type="number"
            value={data.grossSF}
            onChange={(e) => update("grossSF", e.target.value)}
            placeholder="15,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lotSize">Lot Size (SF)</Label>
          <Input
            id="lotSize"
            type="number"
            value={data.lotSize}
            onChange={(e) => update("lotSize", e.target.value)}
            placeholder="2,500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zoning">Zoning</Label>
          <Input
            id="zoning"
            value={data.zoning}
            onChange={(e) => update("zoning", e.target.value)}
            placeholder="R7A"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="far">FAR</Label>
          <Input
            id="far"
            value={data.far}
            onChange={(e) => update("far", e.target.value)}
            placeholder="4.0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="airRights">Air Rights (SF)</Label>
          <Input
            id="airRights"
            value={data.airRights}
            onChange={(e) => update("airRights", e.target.value)}
            placeholder="5,000"
          />
        </div>
      </div>
    </div>
  );
};
