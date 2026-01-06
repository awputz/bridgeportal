import { useState } from "react";
import { Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { GeneratorShell } from "../GeneratorShell";

interface SocialMediaPostGeneratorProps {
  onBack: () => void;
}

export const SocialMediaPostGenerator = ({ onBack }: SocialMediaPostGeneratorProps) => {
  const [formData, setFormData] = useState({
    platform: "",
    postType: "",
    content: "",
    propertyAddress: "",
    achievement: "",
    tone: "",
  });

  const promptBuilder = (data: Record<string, any>) => `
You are a social media expert for real estate professionals.

Create a ${data.platform} post with these details:
- Post Type: ${data.postType}
- Content/Topic: ${data.content}
- Property (if applicable): ${data.propertyAddress}
- Achievement/Milestone: ${data.achievement}
- Tone: ${data.tone}

Generate:
1. MAIN POST (optimized for ${data.platform})
2. HASHTAGS (relevant and trending)
3. CALL TO ACTION
4. ALTERNATIVE VERSION (different approach)

Guidelines:
- For LinkedIn: Professional but personable, tell a story
- For Instagram: Visual-focused, engaging, use emojis appropriately
- Include line breaks for readability
- Keep within platform character limits
`;

  const isFormValid = formData.platform && formData.postType && formData.content;

  return (
    <GeneratorShell
      id="social-media-post"
      title="Social Media Post"
      description="LinkedIn and Instagram captions for listings and wins"
      icon={Linkedin}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Social Media Content"
      outputDescription="Ready-to-post content with hashtags"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Platform *</Label>
            <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Post Type *</Label>
            <Select value={formData.postType} onValueChange={(v) => setFormData({ ...formData, postType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-listing">New Listing</SelectItem>
                <SelectItem value="just-sold">Just Sold/Closed</SelectItem>
                <SelectItem value="just-leased">Just Leased</SelectItem>
                <SelectItem value="market-update">Market Update</SelectItem>
                <SelectItem value="milestone">Personal Milestone</SelectItem>
                <SelectItem value="testimonial">Client Testimonial</SelectItem>
                <SelectItem value="educational">Educational Content</SelectItem>
                <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content/Topic *</Label>
          <Textarea
            placeholder="What's the main message or story?"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Property Address</Label>
          <AddressAutocomplete
            value={formData.propertyAddress}
            onChange={(v) => setFormData({ ...formData, propertyAddress: v })}
            onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress })}
            placeholder="If posting about a specific property"
          />
        </div>

        <div className="space-y-2">
          <Label>Achievement/Milestone</Label>
          <Input
            placeholder="Sale price, # of deals, years in business..."
            value={formData.achievement}
            onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={formData.tone} onValueChange={(v) => setFormData({ ...formData, tone: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="celebratory">Celebratory</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="casual">Casual/Friendly</SelectItem>
              <SelectItem value="inspirational">Inspirational</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </GeneratorShell>
  );
};

export default SocialMediaPostGenerator;
