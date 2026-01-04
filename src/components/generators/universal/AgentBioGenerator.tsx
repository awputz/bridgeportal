import { useState } from "react";
import { UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface AgentBioGeneratorProps {
  onBack: () => void;
}

export const AgentBioGenerator = ({ onBack }: AgentBioGeneratorProps) => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    specialization: "",
    experience: "",
    achievements: "",
    background: "",
    personalTouch: "",
    tone: "",
    length: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a professional copywriter specializing in real estate agent bios.

Create a professional bio with these details:
- Name: ${data.name}
- Title: ${data.title}
- Specialization: ${data.specialization}
- Years of Experience: ${data.experience}
- Notable Achievements: ${data.achievements}
- Background: ${data.background}
- Personal Touch: ${data.personalTouch}
- Tone: ${data.tone}
- Length: ${data.length}

Generate:
1. FULL BIO (${data.length === "long" ? "300-400 words" : data.length === "medium" ? "150-200 words" : "75-100 words"})
2. SHORT BIO (2-3 sentences for quick introductions)
3. LINKEDIN HEADLINE
4. EMAIL SIGNATURE LINE

Make it compelling, professional, and differentiated. Avoid clichés like "passionate about real estate."
`;

  const isFormValid = formData.name && formData.specialization;

  return (
    <GeneratorShell
      id="agent-bio"
      title="Agent Bio Writer"
      description="Professional bio for websites and marketing materials"
      icon={UserCheck}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Professional Bio"
      outputDescription="Multiple versions for different uses"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Licensed Real Estate Salesperson"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Specialization *</Label>
          <Input
            placeholder="Investment sales, commercial leasing, luxury residential..."
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Years of Experience</Label>
          <Input
            placeholder="5 years"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Notable Achievements</Label>
          <Textarea
            placeholder="Deal volume, awards, notable transactions..."
            value={formData.achievements}
            onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Background</Label>
          <Textarea
            placeholder="Previous career, education, what brought you to real estate..."
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Personal Touch</Label>
          <Input
            placeholder="Hobbies, community involvement, family..."
            value={formData.personalTouch}
            onChange={(e) => setFormData({ ...formData, personalTouch: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={formData.tone} onValueChange={(v) => setFormData({ ...formData, tone: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="approachable">Approachable</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Length</Label>
            <Select value={formData.length} onValueChange={(v) => setFormData({ ...formData, length: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (75-100 words)</SelectItem>
                <SelectItem value="medium">Medium (150-200 words)</SelectItem>
                <SelectItem value="long">Long (300-400 words)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </GeneratorShell>
  );
};

export default AgentBioGenerator;
