import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OMRentRegulation } from "@/types/om-generator";

interface OMRentRegulationSectionProps {
  data: OMRentRegulation;
  onChange: (data: OMRentRegulation) => void;
}

export const OMRentRegulationSection = ({ data, onChange }: OMRentRegulationSectionProps) => {
  const update = (field: keyof OMRentRegulation, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rentStabilizedUnits">Rent Stabilized Units</Label>
          <Input
            id="rentStabilizedUnits"
            type="number"
            value={data.rentStabilizedUnits}
            onChange={(e) => update("rentStabilizedUnits", e.target.value)}
            placeholder="12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="freeMarketUnits">Free Market Units</Label>
          <Input
            id="freeMarketUnits"
            type="number"
            value={data.freeMarketUnits}
            onChange={(e) => update("freeMarketUnits", e.target.value)}
            placeholder="8"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tax Abatement</Label>
          <Select value={data.taxAbatement} onValueChange={(v) => update("taxAbatement", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="421a">421a</SelectItem>
              <SelectItem value="j51">J-51</SelectItem>
              <SelectItem value="icap">ICAP</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxAbatementExpiry">Abatement Expiry</Label>
          <Input
            id="taxAbatementExpiry"
            type="date"
            value={data.taxAbatementExpiry}
            onChange={(e) => update("taxAbatementExpiry", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
