import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OMLocation } from "@/types/om-generator";

interface OMLocationSectionProps {
  data: OMLocation;
  onChange: (data: OMLocation) => void;
}

export const OMLocationSection = ({ data, onChange }: OMLocationSectionProps) => {
  const update = (field: keyof OMLocation, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input
            id="neighborhood"
            value={data.neighborhood}
            onChange={(e) => update("neighborhood", e.target.value)}
            placeholder="Williamsburg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="submarket">Submarket</Label>
          <Input
            id="submarket"
            value={data.submarket}
            onChange={(e) => update("submarket", e.target.value)}
            placeholder="North Brooklyn"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="borough">Borough</Label>
          <Input
            id="borough"
            value={data.borough}
            onChange={(e) => update("borough", e.target.value)}
            placeholder="Brooklyn"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={data.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="New York"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="walkScore">Walk Score</Label>
          <Input
            id="walkScore"
            type="number"
            value={data.walkScore}
            onChange={(e) => update("walkScore", e.target.value)}
            placeholder="95"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transitScore">Transit Score</Label>
          <Input
            id="transitScore"
            type="number"
            value={data.transitScore}
            onChange={(e) => update("transitScore", e.target.value)}
            placeholder="92"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nearbyTransit">Nearby Transit</Label>
        <Input
          id="nearbyTransit"
          value={data.nearbyTransit}
          onChange={(e) => update("nearbyTransit", e.target.value)}
          placeholder="L, G trains at Bedford Ave; J, M, Z at Marcy Ave..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyAmenities">Key Nearby Amenities</Label>
        <Textarea
          id="keyAmenities"
          value={data.keyAmenities}
          onChange={(e) => update("keyAmenities", e.target.value)}
          placeholder="McCarren Park, Bedford Ave retail corridor, Whole Foods, etc..."
          rows={2}
        />
      </div>
    </div>
  );
};
