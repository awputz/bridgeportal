import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OMMarketData } from "@/types/om-generator";

interface OMMarketDataSectionProps {
  data: OMMarketData;
  onChange: (data: OMMarketData) => void;
}

export const OMMarketDataSection = ({ data, onChange }: OMMarketDataSectionProps) => {
  const update = (field: keyof OMMarketData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marketCapRate">Market Cap Rate (%)</Label>
          <Input
            id="marketCapRate"
            type="number"
            step="0.01"
            value={data.marketCapRate}
            onChange={(e) => update("marketCapRate", e.target.value)}
            placeholder="5.0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rentGrowthRate">Rent Growth Rate (%)</Label>
          <Input
            id="rentGrowthRate"
            type="number"
            step="0.1"
            value={data.rentGrowthRate}
            onChange={(e) => update("rentGrowthRate", e.target.value)}
            placeholder="3.5"
          />
        </div>
      </div>

      {/* Comp 1 */}
      <div className="p-3 bg-muted/20 rounded-lg space-y-3">
        <Label className="text-xs text-muted-foreground">Comparable Sale #1</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2">
            <Input
              value={data.comp1Address}
              onChange={(e) => update("comp1Address", e.target.value)}
              placeholder="Address"
            />
          </div>
          <Input
            type="number"
            value={data.comp1Price}
            onChange={(e) => update("comp1Price", e.target.value)}
            placeholder="Price"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              value={data.comp1CapRate}
              onChange={(e) => update("comp1CapRate", e.target.value)}
              placeholder="Cap %"
              className="w-20"
            />
            <Input
              type="date"
              value={data.comp1Date}
              onChange={(e) => update("comp1Date", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Comp 2 */}
      <div className="p-3 bg-muted/20 rounded-lg space-y-3">
        <Label className="text-xs text-muted-foreground">Comparable Sale #2</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2">
            <Input
              value={data.comp2Address}
              onChange={(e) => update("comp2Address", e.target.value)}
              placeholder="Address"
            />
          </div>
          <Input
            type="number"
            value={data.comp2Price}
            onChange={(e) => update("comp2Price", e.target.value)}
            placeholder="Price"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              value={data.comp2CapRate}
              onChange={(e) => update("comp2CapRate", e.target.value)}
              placeholder="Cap %"
              className="w-20"
            />
            <Input
              type="date"
              value={data.comp2Date}
              onChange={(e) => update("comp2Date", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Comp 3 */}
      <div className="p-3 bg-muted/20 rounded-lg space-y-3">
        <Label className="text-xs text-muted-foreground">Comparable Sale #3</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2">
            <Input
              value={data.comp3Address}
              onChange={(e) => update("comp3Address", e.target.value)}
              placeholder="Address"
            />
          </div>
          <Input
            type="number"
            value={data.comp3Price}
            onChange={(e) => update("comp3Price", e.target.value)}
            placeholder="Price"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              value={data.comp3CapRate}
              onChange={(e) => update("comp3CapRate", e.target.value)}
              placeholder="Cap %"
              className="w-20"
            />
            <Input
              type="date"
              value={data.comp3Date}
              onChange={(e) => update("comp3Date", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
