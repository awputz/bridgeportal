import { useState } from "react";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const BuildingAmenityGuideGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    buildingName: "",
    buildingAddress: "",
    buildingType: "",
    yearBuilt: "",
    totalUnits: "",
    amenities: "",
    services: "",
    uniqueFeatures: "",
    neighborhood: "",
    transportation: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a comprehensive building amenity guide for prospective buyers or renters.

Building: ${data.buildingName}
Address: ${data.buildingAddress}
Type: ${data.buildingType}
Year Built: ${data.yearBuilt}
Total Units: ${data.totalUnits}

Amenities: ${data.amenities}
Services: ${data.services}
Unique Features: ${data.uniqueFeatures}
Neighborhood: ${data.neighborhood}
Transportation: ${data.transportation}

Generate an engaging building guide that includes:
1. Building overview and history
2. Architecture and design highlights
3. Detailed amenity descriptions with hours/access info
4. Building services and staff
5. Unique features that set it apart
6. Common charges and what they include
7. Pet policy and other building rules
8. Neighborhood highlights
9. Transportation and accessibility
10. "Living here" lifestyle narrative

Write in a marketing-friendly but informative tone that helps buyers envision the lifestyle.`;

  const isFormValid = !!formData.buildingName && !!formData.amenities;

  return (
    <GeneratorShell
      id="building-amenity-guide"
      title="Building Amenity Guide"
      description="Create detailed guides highlighting building features and amenities."
      icon={Building}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Building Guide"
      outputDescription="Your comprehensive building overview"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Building Name *</Label>
          <Input value={formData.buildingName} onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })} placeholder="The Paramount" />
        </div>
        <div className="space-y-2">
          <Label>Building Address</Label>
          <AddressAutocomplete value={formData.buildingAddress} onChange={(value) => setFormData({ ...formData, buildingAddress: value })} onAddressSelect={(addr) => setFormData({ ...formData, buildingAddress: addr.fullAddress, neighborhood: addr.neighborhood || formData.neighborhood })} placeholder="Start typing an address..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Building Type</Label>
            <Select value={formData.buildingType} onValueChange={(v) => setFormData({ ...formData, buildingType: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="coop">Co-op</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="condop">Condop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year Built</Label>
            <Input value={formData.yearBuilt} onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })} placeholder="2018" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Total Units</Label>
          <Input value={formData.totalUnits} onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })} placeholder="150" />
        </div>
        <div className="space-y-2">
          <Label>Amenities *</Label>
          <Textarea value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} placeholder="24-hour doorman, fitness center, roof deck, children's playroom, resident lounge, bike room..." className="min-h-[100px]" />
        </div>
        <div className="space-y-2">
          <Label>Building Services</Label>
          <Textarea value={formData.services} onChange={(e) => setFormData({ ...formData, services: e.target.value })} placeholder="Concierge, package room, valet parking, dry cleaning pickup..." />
        </div>
        <div className="space-y-2">
          <Label>Unique Features</Label>
          <Textarea value={formData.uniqueFeatures} onChange={(e) => setFormData({ ...formData, uniqueFeatures: e.target.value })} placeholder="LEED certified, celebrity architect, private garden, pet spa..." />
        </div>
        <div className="space-y-2">
          <Label>Neighborhood</Label>
          <Input value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} placeholder="Murray Hill" />
        </div>
        <div className="space-y-2">
          <Label>Transportation</Label>
          <Textarea value={formData.transportation} onChange={(e) => setFormData({ ...formData, transportation: e.target.value })} placeholder="Subway lines, bus routes, distance to Grand Central..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default BuildingAmenityGuideGenerator;
