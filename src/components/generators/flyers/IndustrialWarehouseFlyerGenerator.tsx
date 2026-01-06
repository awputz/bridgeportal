import { useState } from "react";
import { Factory } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const IndustrialWarehouseFlyerGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    address: "",
    availableSF: "",
    askingRent: "",
    clearHeight: "",
    dockDoors: "",
    power: "",
    highlights: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create compelling marketing flyer copy for industrial/warehouse space:

ADDRESS: ${data.address}
AVAILABLE: ${Number(data.availableSF).toLocaleString()} SF
ASKING RENT: $${data.askingRent}/SF
CLEAR HEIGHT: ${data.clearHeight}
DOCK DOORS: ${data.dockDoors}
POWER: ${data.power}

HIGHLIGHTS: ${data.highlights}

Create flyer content including:

1. HEADLINE - Industrial-focused 5-8 word headline
2. SUBHEADLINE - Location/access callout
3. KEY SPECS BOX - SF, Clear Height, Doors, Power
4. SPACE DESCRIPTION - 2-3 sentences about the facility
5. BUILDING FEATURES - 5-6 bullet points (loading, access, HVAC, etc.)
6. LOCATION/ACCESS - Highways, ports, transit, last-mile logistics
7. ZONING/PERMITTED USES - Industrial uses allowed
8. CALL TO ACTION - Tour the facility

Format for a professional industrial property flyer.
`;

  const isFormValid = formData.address && formData.availableSF;

  return (
    <GeneratorShell
      id="industrial-warehouse-flyer"
      title="Industrial/Warehouse Flyer"
      description="Create professional industrial space flyer copy"
      icon={Factory}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Address *</Label>
            <Input
              placeholder="100 Industrial Boulevard, Newark, NJ 07105"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Available SF *</Label>
            <Input
              type="number"
              placeholder="50000"
              value={formData.availableSF}
              onChange={(e) => setFormData({ ...formData, availableSF: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Asking Rent ($/SF)</Label>
            <Input
              placeholder="12"
              value={formData.askingRent}
              onChange={(e) => setFormData({ ...formData, askingRent: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Clear Height</Label>
            <Input
              placeholder="32 ft clear"
              value={formData.clearHeight}
              onChange={(e) => setFormData({ ...formData, clearHeight: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Dock Doors</Label>
            <Input
              placeholder="8 dock-high, 2 drive-in"
              value={formData.dockDoors}
              onChange={(e) => setFormData({ ...formData, dockDoors: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Power</Label>
            <Input
              placeholder="3,000 amps, 480V 3-phase"
              value={formData.power}
              onChange={(e) => setFormData({ ...formData, power: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Facility Highlights</Label>
          <Textarea
            placeholder="ESFR sprinklers, LED lighting, 130' truck court, rail access..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default IndustrialWarehouseFlyerGenerator;
