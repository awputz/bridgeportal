import { useState } from "react";
import { Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const RentalListingGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    neighborhood: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    monthlyRent: "",
    squareFeet: "",
    availableDate: "",
    features: "",
    buildingAmenities: "",
    petPolicy: "",
    requirements: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Write an engaging rental listing description that attracts quality tenants.

Property: ${data.propertyAddress}
Neighborhood: ${data.neighborhood}
Type: ${data.propertyType}
Bedrooms: ${data.bedrooms} | Bathrooms: ${data.bathrooms}
Monthly Rent: $${data.monthlyRent}
Square Feet: ${data.squareFeet}
Available: ${data.availableDate}
Unit Features: ${data.features}
Building Amenities: ${data.buildingAmenities}
Pet Policy: ${data.petPolicy}
Requirements: ${data.requirements}

Generate a compelling rental listing that:
1. Opens with an attention-grabbing headline
2. Highlights the best features prominently
3. Describes the layout and flow of the space
4. Emphasizes neighborhood benefits
5. Lists building amenities and conveniences
6. Clearly states terms and requirements
7. Creates urgency without being pushy
8. Ends with clear call-to-action

Write in an inviting, professional tone that appeals to quality tenants.`;

  const isFormValid = !!formData.propertyAddress && !!formData.bedrooms && !!formData.monthlyRent;

  return (
    <GeneratorShell
      id="rental-listing"
      title="Rental Listing Description"
      description="Generate compelling rental listing copy that attracts quality tenants."
      icon={Home}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Listing Description"
      outputDescription="Your rental listing copy"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="456 Park Avenue, Unit 5A" />
        </div>
        <div className="space-y-2">
          <Label>Neighborhood</Label>
          <Input value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} placeholder="Upper East Side" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="coop">Co-op</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="loft">Loft</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Monthly Rent *</Label>
            <Input value={formData.monthlyRent} onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })} placeholder="4,500" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Bedrooms *</Label>
            <Input value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })} placeholder="2" />
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Input value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })} placeholder="1.5" />
          </div>
          <div className="space-y-2">
            <Label>Sq Ft</Label>
            <Input value={formData.squareFeet} onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })} placeholder="950" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Available Date</Label>
          <Input type="date" value={formData.availableDate} onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Unit Features</Label>
          <Textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Renovated kitchen, hardwood floors, W/D in unit, private balcony..." />
        </div>
        <div className="space-y-2">
          <Label>Building Amenities</Label>
          <Textarea value={formData.buildingAmenities} onChange={(e) => setFormData({ ...formData, buildingAmenities: e.target.value })} placeholder="Doorman, gym, roof deck, package room, bike storage..." />
        </div>
        <div className="space-y-2">
          <Label>Pet Policy</Label>
          <Select value={formData.petPolicy} onValueChange={(v) => setFormData({ ...formData, petPolicy: v })}>
            <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pets-allowed">Pets Allowed</SelectItem>
              <SelectItem value="cats-only">Cats Only</SelectItem>
              <SelectItem value="small-dogs">Small Dogs OK</SelectItem>
              <SelectItem value="case-by-case">Case by Case</SelectItem>
              <SelectItem value="no-pets">No Pets</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tenant Requirements</Label>
          <Textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="40x income, credit check, references required..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default RentalListingGenerator;
