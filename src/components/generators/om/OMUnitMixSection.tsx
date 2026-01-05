import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OMUnitType } from "@/types/om-generator";

interface OMUnitMixSectionProps {
  data: OMUnitType[];
  onChange: (data: OMUnitType[]) => void;
}

const unitTypeOptions = [
  "Studio",
  "1BR",
  "2BR",
  "3BR",
  "4BR+",
  "Retail",
  "Office",
  "Storage",
  "Parking",
];

export const OMUnitMixSection = ({ data, onChange }: OMUnitMixSectionProps) => {
  const updateUnit = (id: string, field: keyof OMUnitType, value: string) => {
    onChange(
      data.map((unit) => (unit.id === id ? { ...unit, [field]: value } : unit))
    );
  };

  const addUnit = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        unitType: "1BR",
        count: "",
        avgRent: "",
        marketRent: "",
      },
    ]);
  };

  const removeUnit = (id: string) => {
    if (data.length > 1) {
      onChange(data.filter((unit) => unit.id !== id));
    }
  };

  // Calculate totals
  const totalUnits = data.reduce((sum, unit) => sum + (parseFloat(unit.count) || 0), 0);
  const avgRent = data.reduce((sum, unit) => {
    const count = parseFloat(unit.count) || 0;
    const rent = parseFloat(unit.avgRent) || 0;
    return sum + (count * rent);
  }, 0) / (totalUnits || 1);

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium">
        <div className="col-span-3">Unit Type</div>
        <div className="col-span-2">Count</div>
        <div className="col-span-3">Avg Rent ($)</div>
        <div className="col-span-3">Market Rent ($)</div>
        <div className="col-span-1"></div>
      </div>

      {/* Unit rows */}
      {data.map((unit) => (
        <div key={unit.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-3">
            <Select
              value={unit.unitType}
              onValueChange={(v) => updateUnit(unit.id, "unitType", v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              className="h-9"
              value={unit.count}
              onChange={(e) => updateUnit(unit.id, "count", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="col-span-3">
            <Input
              type="number"
              className="h-9"
              value={unit.avgRent}
              onChange={(e) => updateUnit(unit.id, "avgRent", e.target.value)}
              placeholder="2,500"
            />
          </div>
          <div className="col-span-3">
            <Input
              type="number"
              className="h-9"
              value={unit.marketRent}
              onChange={(e) => updateUnit(unit.id, "marketRent", e.target.value)}
              placeholder="3,000"
            />
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => removeUnit(unit.id)}
              disabled={data.length <= 1}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      ))}

      {/* Add button */}
      <Button variant="outline" size="sm" onClick={addUnit} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Unit Type
      </Button>

      {/* Summary */}
      <div className="p-3 bg-muted/30 rounded-lg border border-border/50 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total Units:</span>
          <span className="ml-2 font-medium">{totalUnits || "—"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Avg Rent:</span>
          <span className="ml-2 font-medium">
            {avgRent > 0
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(avgRent)
              : "—"
            }
          </span>
        </div>
      </div>
    </div>
  );
};
