import { useState } from "react";
import { ArrowLeft, Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PropertyDescriptionGeneratorProps {
  onBack: () => void;
}

const propertyTypes = [
  { value: "apartment", label: "Apartment/Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "retail", label: "Retail Space" },
  { value: "office", label: "Office Space" },
  { value: "multifamily", label: "Multifamily Building" },
  { value: "mixed-use", label: "Mixed Use" },
  { value: "industrial", label: "Industrial" },
];

const audienceOptions = [
  { value: "buyers", label: "Buyers/Investors" },
  { value: "tenants", label: "Tenants" },
  { value: "luxury", label: "Luxury Market" },
  { value: "institutional", label: "Institutional Investors" },
];

export const PropertyDescriptionGenerator = ({ onBack }: PropertyDescriptionGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "apartment",
    audience: "buyers",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    price: "",
    neighborhood: "",
    features: "",
    amenities: "",
    transportation: "",
  });

  const handleGenerate = async () => {
    if (!formData.propertyAddress) {
      toast.error("Property address is required");
      return;
    }

    setIsGenerating(true);

    try {
      const propertyTypeLabel = propertyTypes.find(t => t.value === formData.propertyType)?.label || formData.propertyType;
      const audienceLabel = audienceOptions.find(t => t.value === formData.audience)?.label || formData.audience;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `Generate a compelling real estate listing description for:

Property Address: ${formData.propertyAddress}
Property Type: ${propertyTypeLabel}
Target Audience: ${audienceLabel}
Bedrooms: ${formData.bedrooms || "N/A"}
Bathrooms: ${formData.bathrooms || "N/A"}
Square Footage: ${formData.squareFootage || "N/A"} SF
Price: ${formData.price ? `$${formData.price}` : "N/A"}
Neighborhood: ${formData.neighborhood || "N/A"}
Key Features: ${formData.features || "None specified"}
Amenities: ${formData.amenities || "None specified"}
Transportation: ${formData.transportation || "Not specified"}

Please generate:
1. An attention-grabbing headline
2. A compelling main description (2-3 paragraphs) that sells the lifestyle and value
3. Key features as bullet points
4. A closing call-to-action

Make it engaging, professional, and optimized for the ${audienceLabel.toLowerCase()} audience. Use vivid language that creates an emotional connection.`
            }
          ]
        }
      });

      if (error) throw error;
      setGeneratedContent(data.message || data.content || "");
    } catch (error: any) {
      toast.error("Failed to generate: " + (error.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Property Description Generator
            </h1>
            <p className="text-muted-foreground">Create compelling listing descriptions</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="font-light">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Property Address *</Label>
                <Input
                  id="address"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(v) => setFormData({ ...formData, propertyType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select
                    value={formData.audience}
                    onValueChange={(v) => setFormData({ ...formData, audience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audienceOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beds">Bedrooms</Label>
                  <Input
                    id="beds"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baths">Bathrooms</Label>
                  <Input
                    id="baths"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    placeholder="1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sf">Square Feet</Label>
                  <Input
                    id="sf"
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                    placeholder="1,200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1,500,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Tribeca"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="High ceilings, exposed brick, chef's kitchen, private terrace..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Building Amenities</Label>
                <Textarea
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Doorman, gym, roof deck, laundry..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transport">Transportation</Label>
                <Input
                  id="transport"
                  value={formData.transportation}
                  onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                  placeholder="Steps from A/C/E trains"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Description
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-light">Generated Description</CardTitle>
              {generatedContent && (
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                  {generatedContent}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Fill in the property details and click generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
