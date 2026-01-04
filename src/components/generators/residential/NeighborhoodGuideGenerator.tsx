import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const NeighborhoodGuideGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    neighborhood: "",
    borough: "",
    targetAudience: "",
    focusAreas: "",
    priceRange: "",
    highlights: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create an engaging, comprehensive neighborhood guide for real estate clients.

Neighborhood: ${data.neighborhood}, ${data.borough}
Target Audience: ${data.targetAudience}
Focus Areas: ${data.focusAreas}
Typical Price Range: ${data.priceRange}
Key Highlights to Include: ${data.highlights}

Generate a detailed neighborhood guide including:
1. Neighborhood overview and character
2. Housing stock and typical pricing
3. Transportation options (subway, bus, bike-ability)
4. Dining and nightlife scene
5. Shopping and everyday conveniences
6. Parks, recreation, and outdoor spaces
7. Schools and family-friendliness (if applicable)
8. Safety and community feel
9. Future development and investment potential
10. Pros and cons summary
11. "Best for" recommendation

Write in an engaging, informative style that helps clients envision living there.`;

  const isFormValid = !!formData.neighborhood && !!formData.borough;

  return (
    <GeneratorShell
      id="neighborhood-guide"
      title="Neighborhood Guide"
      description="Create comprehensive neighborhood guides for buyers and renters."
      icon={MapPin}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Neighborhood Guide"
      outputDescription="Your comprehensive area guide"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Neighborhood Name *</Label>
          <Input value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} placeholder="Park Slope" />
        </div>
        <div className="space-y-2">
          <Label>Borough/Area *</Label>
          <Select value={formData.borough} onValueChange={(v) => setFormData({ ...formData, borough: v })}>
            <SelectTrigger><SelectValue placeholder="Select borough" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manhattan">Manhattan</SelectItem>
              <SelectItem value="brooklyn">Brooklyn</SelectItem>
              <SelectItem value="queens">Queens</SelectItem>
              <SelectItem value="bronx">Bronx</SelectItem>
              <SelectItem value="staten-island">Staten Island</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Target Audience</Label>
          <Select value={formData.targetAudience} onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}>
            <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="young-professionals">Young Professionals</SelectItem>
              <SelectItem value="families">Families with Children</SelectItem>
              <SelectItem value="empty-nesters">Empty Nesters</SelectItem>
              <SelectItem value="investors">Investors</SelectItem>
              <SelectItem value="first-time-buyers">First-Time Buyers</SelectItem>
              <SelectItem value="renters">Renters</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Focus Areas</Label>
          <Textarea value={formData.focusAreas} onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })} placeholder="Restaurants, parks, schools, nightlife..." />
        </div>
        <div className="space-y-2">
          <Label>Typical Price Range</Label>
          <Input value={formData.priceRange} onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })} placeholder="$800K - $1.5M for condos" />
        </div>
        <div className="space-y-2">
          <Label>Key Highlights</Label>
          <Textarea value={formData.highlights} onChange={(e) => setFormData({ ...formData, highlights: e.target.value })} placeholder="Prospect Park, brownstones, 7th Ave shopping..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default NeighborhoodGuideGenerator;
