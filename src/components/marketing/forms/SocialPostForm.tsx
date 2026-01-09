import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertySelector, PropertyData } from "@/components/marketing/PropertySelector";
import { Separator } from "@/components/ui/separator";
import { useBrandProfile } from "@/hooks/marketing/useBrandProfile";

export interface SocialPostFormData {
  platform: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  highlights: string;
  hashtags: string;
}

interface SocialPostFormProps {
  data: SocialPostFormData;
  onChange: (data: SocialPostFormData) => void;
}

const defaultData: SocialPostFormData = {
  platform: "instagram",
  address: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  highlights: "",
  hashtags: "",
};

export const SocialPostForm = ({ data, onChange }: SocialPostFormProps) => {
  const { data: brandProfile } = useBrandProfile();

  // Initialize with defaults if empty
  useEffect(() => {
    if (!data.platform) {
      onChange({ ...defaultData, ...data });
    }
  }, []);

  // Auto-fill from brand profile
  useEffect(() => {
    if (brandProfile && !data.hashtags) {
      const socialHandle = brandProfile.instagram_handle || brandProfile.twitter_handle;
      if (socialHandle) {
        onChange({
          ...data,
          hashtags: `@${socialHandle.replace('@', '')}`,
        });
      }
    }
  }, [brandProfile]);

  const handleChange = (field: keyof SocialPostFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePropertySelect = (property: PropertyData) => {
    onChange({
      ...data,
      address: property.address,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
    });
  };

  return (
    <div className="space-y-4">
      <PropertySelector onSelect={handlePropertySelect} />
      <Separator className="my-4" />
      <div>
        <Label htmlFor="platform">Platform</Label>
        <Select
          value={data.platform || "instagram"}
          onValueChange={(value) => handleChange("platform", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">Twitter/X</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="address">Property Address</Label>
        <Input
          id="address"
          placeholder="123 Main Street, City, State"
          value={data.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            placeholder="$1,250,000"
            value={data.price || ""}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bedrooms">Beds</Label>
          <Input
            id="bedrooms"
            placeholder="3"
            value={data.bedrooms || ""}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Baths</Label>
          <Input
            id="bathrooms"
            placeholder="2"
            value={data.bathrooms || ""}
            onChange={(e) => handleChange("bathrooms", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="highlights">Property Highlights</Label>
        <Textarea
          id="highlights"
          placeholder="Modern kitchen, hardwood floors, rooftop access..."
          value={data.highlights || ""}
          onChange={(e) => handleChange("highlights", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="hashtags">Custom Hashtags (optional)</Label>
        <Input
          id="hashtags"
          placeholder="#realestate #luxuryhomes"
          value={data.hashtags || ""}
          onChange={(e) => handleChange("hashtags", e.target.value)}
        />
      </div>
    </div>
  );
};

export const isSocialPostFormValid = (data: SocialPostFormData): boolean => {
  return !!(data.platform && data.address && data.price);
};
