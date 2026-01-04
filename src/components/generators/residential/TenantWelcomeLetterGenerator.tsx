import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const TenantWelcomeLetterGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    tenantName: "",
    propertyAddress: "",
    moveInDate: "",
    landlordName: "",
    managementContact: "",
    emergencyContact: "",
    importantInfo: "",
    buildingRules: "",
    localRecommendations: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a warm, informative welcome letter for a new tenant.

Tenant: ${data.tenantName}
Property: ${data.propertyAddress}
Move-In Date: ${data.moveInDate}
Landlord/Manager: ${data.landlordName}
Management Contact: ${data.managementContact}
Emergency Contact: ${data.emergencyContact}
Important Information: ${data.importantInfo}
Building Rules: ${data.buildingRules}
Local Recommendations: ${data.localRecommendations}

Generate a comprehensive welcome letter that includes:
1. Warm welcome and congratulations
2. Key contact information
3. Move-in day logistics and tips
4. Important building information (trash, mail, packages)
5. Utility setup reminders
6. Building rules and etiquette
7. Emergency procedures
8. Maintenance request process
9. Local neighborhood recommendations
10. Closing with helpful attitude

Keep the tone friendly and helpful - make them feel at home!`;

  const isFormValid = !!formData.tenantName && !!formData.propertyAddress;

  return (
    <GeneratorShell
      id="tenant-welcome-letter"
      title="Tenant Welcome Letter"
      description="Create welcoming move-in packages for new tenants."
      icon={Mail}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Welcome Letter"
      outputDescription="Your tenant welcome package"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Tenant Name *</Label>
          <Input value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })} placeholder="Jennifer Williams" />
        </div>
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="123 Elm Street, Apt 3B" />
        </div>
        <div className="space-y-2">
          <Label>Move-In Date</Label>
          <Input type="date" value={formData.moveInDate} onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Landlord/Manager Name</Label>
          <Input value={formData.landlordName} onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })} placeholder="ABC Property Management" />
        </div>
        <div className="space-y-2">
          <Label>Management Contact Info</Label>
          <Textarea value={formData.managementContact} onChange={(e) => setFormData({ ...formData, managementContact: e.target.value })} placeholder="Phone, email, office hours..." />
        </div>
        <div className="space-y-2">
          <Label>Emergency Contact</Label>
          <Input value={formData.emergencyContact} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} placeholder="24/7 emergency line" />
        </div>
        <div className="space-y-2">
          <Label>Important Building Info</Label>
          <Textarea value={formData.importantInfo} onChange={(e) => setFormData({ ...formData, importantInfo: e.target.value })} placeholder="Trash days, mail delivery, package room, laundry hours..." />
        </div>
        <div className="space-y-2">
          <Label>Building Rules</Label>
          <Textarea value={formData.buildingRules} onChange={(e) => setFormData({ ...formData, buildingRules: e.target.value })} placeholder="Quiet hours, guest policies, common area rules..." />
        </div>
        <div className="space-y-2">
          <Label>Local Recommendations</Label>
          <Textarea value={formData.localRecommendations} onChange={(e) => setFormData({ ...formData, localRecommendations: e.target.value })} placeholder="Nearby restaurants, grocery stores, dry cleaners..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default TenantWelcomeLetterGenerator;
