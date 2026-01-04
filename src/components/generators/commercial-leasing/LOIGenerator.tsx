import { useState } from "react";
import { ScrollText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";
interface Props { onBack: () => void; }
export const LOIGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({ tenantName: "", propertyAddress: "", terms: "" });
  const promptBuilder = (data: Record<string, any>) => `Generate a Letter of Intent for: Tenant: ${data.tenantName}, Property: ${data.propertyAddress}, Terms: ${data.terms}. Include standard LOI sections.`;
  return (
    <GeneratorShell id="loi-generator" title="LOI Generator" description="Draft Letter of Intent for lease negotiations" icon={ScrollText} onBack={onBack} promptBuilder={promptBuilder} formData={formData} isFormValid={!!(formData.tenantName && formData.propertyAddress)}>
      <div className="space-y-4">
        <div className="space-y-2"><Label>Tenant Name *</Label><Input value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })} /></div>
        <div className="space-y-2"><Label>Property Address *</Label><Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} /></div>
        <div className="space-y-2"><Label>Key Terms</Label><Textarea placeholder="Rent, term, TI, free rent..." value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} rows={4} /></div>
      </div>
    </GeneratorShell>
  );
};
export default LOIGenerator;
