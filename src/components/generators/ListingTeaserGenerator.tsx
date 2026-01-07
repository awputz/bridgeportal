import { useState } from "react";
import { ArrowLeft, Loader2, Copy, Check, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ListingTeaserGeneratorProps {
  onBack: () => void;
}

export const ListingTeaserGenerator = ({ onBack }: ListingTeaserGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "multifamily",
    neighborhood: "",
    price: "",
    keyFeatures: "",
    platform: "instagram",
    tone: "professional",
  });

  const handleGenerate = async () => {
    if (!formData.propertyAddress || !formData.neighborhood) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const platformGuidelines = {
        instagram: "Instagram post (max 2200 chars, include relevant hashtags, use emojis sparingly, make it visually descriptive)",
        linkedin: "LinkedIn post (professional tone, 1-2 paragraphs, focus on investment opportunity)",
        email: "Email teaser (short subject line + 3-4 sentence preview)",
        twitter: "Twitter/X post (max 280 chars, punchy and engaging)",
      };

      const prompt = `Create a compelling listing teaser for social media:

Property Details:
- Address: ${formData.propertyAddress}
- Type: ${formData.propertyType}
- Neighborhood: ${formData.neighborhood}
${formData.price ? `- Price: $${formData.price}` : "- Price: Contact for pricing"}
${formData.keyFeatures ? `- Key Features: ${formData.keyFeatures}` : ""}

Platform: ${formData.platform}
Guidelines: ${platformGuidelines[formData.platform as keyof typeof platformGuidelines]}
Tone: ${formData.tone}

Create 3 different versions of the teaser, each with a slightly different angle:
1. Feature-focused (highlighting property attributes)
2. Location-focused (emphasizing neighborhood benefits)
3. Investment-focused (ROI, opportunity angle)

Make each version compelling, authentic, and ready to post. Avoid clichés like "don't miss out" or "once in a lifetime."`;

      const response = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          agent_context: { division: "investment-sales" },
        },
      });

      if (response.error) throw response.error;

      const reader = response.data?.getReader?.();
      if (reader) {
        let content = "";
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  content += text;
                  setGeneratedContent(content);
                }
              } catch {}
            }
          }
        }
      } else if (typeof response.data === "string") {
        setGeneratedContent(response.data);
      }

      toast.success("Listing teasers generated");
    } catch (error) {
      console.error("Error generating teaser:", error);
      toast.error("Failed to generate teaser");
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Generators
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <PenTool className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extralight text-foreground">
              Listing Teaser Generator
            </h1>
            <p className="text-muted-foreground text-sm">
              Create engaging social media teasers for your listings
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Property Address *</Label>
                <AddressAutocomplete
                  value={formData.propertyAddress}
                  onChange={(value) => setFormData({ ...formData, propertyAddress: value })}
                  onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress, neighborhood: addr.neighborhood || formData.neighborhood })}
                  placeholder="Start typing an address..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multifamily">Multifamily</SelectItem>
                      <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="email">Email Teaser</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Neighborhood *</Label>
                <Input
                  placeholder="e.g., Williamsburg, Upper East Side"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (optional)</Label>
                  <Input
                    placeholder="5,000,000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => setFormData({ ...formData, tone: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="exciting">Exciting</SelectItem>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Features (optional)</Label>
                <Textarea
                  placeholder="e.g., Renovated units, rooftop access, close to subway, strong rental income..."
                  value={formData.keyFeatures}
                  onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                  className="bg-white/5 border-white/10 min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Listing Teasers"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-foreground">Generated Teasers</Label>
                {generatedContent && (
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <div className="bg-white/5 rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                {generatedContent ? (
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                    {generatedContent}
                  </pre>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Your listing teasers will appear here...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
