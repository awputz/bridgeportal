import { useState } from "react";
import { Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const InstagramOpenHouseStoryGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    address: "",
    date: "",
    time: "",
    highlights: "",
    neighborhood: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
Create Instagram Story content for an upcoming Open House:

PROPERTY: ${data.address}
DATE: ${data.date}
TIME: ${data.time}
NEIGHBORHOOD: ${data.neighborhood}
HIGHLIGHTS: ${data.highlights}

Create a sequence of 4-5 Instagram Stories:

STORY 1 - COUNTDOWN/ANNOUNCEMENT
- "OPEN HOUSE" header
- Date prominently featured
- Create excitement
- Emoji usage

STORY 2 - PROPERTY TEASER
- One stunning feature highlight
- Create curiosity
- "Wait until you see..."

STORY 3 - KEY DETAILS
- Address
- Time
- Quick stats (beds/baths)

STORY 4 - NEIGHBORHOOD HIGHLIGHT
- Why this location is special
- Local amenities tease

STORY 5 - CTA
- "See you there!"
- How to RSVP/get more info
- Swipe up or DM prompt

Keep each story caption SHORT (2-3 lines max).
Use engaging emojis throughout.
Create FOMO and excitement!
`;

  const isFormValid = formData.address && formData.date;

  return (
    <GeneratorShell
      id="instagram-open-house-story"
      title="Instagram Open House Story"
      description="Create a Story sequence for open house events"
      icon={Instagram}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Property Address *</Label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(v) => setFormData({ ...formData, address: v })}
              onAddressSelect={(addr) => setFormData({ 
                ...formData, 
                address: addr.fullAddress,
                neighborhood: addr.neighborhood || formData.neighborhood 
              })}
              placeholder="Start typing an address..."
            />
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Input
              placeholder="This Sunday, Jan 15"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              placeholder="12-2pm"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Neighborhood</Label>
            <Input
              placeholder="Upper East Side"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Property Highlights</Label>
          <Textarea
            placeholder="Stunning Central Park views, chef's kitchen, private terrace..."
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default InstagramOpenHouseStoryGenerator;
