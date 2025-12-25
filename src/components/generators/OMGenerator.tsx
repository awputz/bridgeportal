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

interface OMGeneratorProps {
  onBack: () => void;
}

export const OMGenerator = ({ onBack }: OMGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "multifamily",
    askingPrice: "",
    units: "",
    grossSF: "",
    yearBuilt: "",
    noi: "",
    neighborhood: "",
    highlights: "",
  });

  const handleGenerate = async () => {
    if (!formData.propertyAddress) {
      toast.error("Property address is required");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `Generate a professional Offering Memorandum executive summary for this investment property:

Property Address: ${formData.propertyAddress}
Property Type: ${formData.propertyType}
Asking Price: ${formData.askingPrice ? `$${formData.askingPrice}` : "Not specified"}
Units: ${formData.units || "N/A"}
Gross SF: ${formData.grossSF || "N/A"}
Year Built: ${formData.yearBuilt || "N/A"}
NOI: ${formData.noi ? `$${formData.noi}` : "Not specified"}
Neighborhood: ${formData.neighborhood || "Not specified"}
Key Highlights: ${formData.highlights || "None provided"}

Please generate:
1. An executive summary (2-3 paragraphs) highlighting the investment opportunity
2. Key investment highlights (4-5 bullet points)
3. Property description (1-2 paragraphs)
4. Location overview (1 paragraph)

Format the response in a professional, compelling way suitable for an institutional investor.`
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
              OM Generator
            </h1>
            <p className="text-muted-foreground">Create professional Offering Memorandum content</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="font-light">Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Property Address *</Label>
                <Input
                  id="address"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  placeholder="123 Main Street, New York, NY"
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
                      <SelectItem value="multifamily">Multifamily</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="development">Development Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Asking Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.askingPrice}
                    onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                    placeholder="5,000,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="units">Units</Label>
                  <Input
                    id="units"
                    type="number"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sf">Gross SF</Label>
                  <Input
                    id="sf"
                    type="number"
                    value={formData.grossSF}
                    onChange={(e) => setFormData({ ...formData, grossSF: e.target.value })}
                    placeholder="15,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year Built</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                    placeholder="1920"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noi">NOI ($)</Label>
                  <Input
                    id="noi"
                    type="number"
                    value={formData.noi}
                    onChange={(e) => setFormData({ ...formData, noi: e.target.value })}
                    placeholder="300,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Williamsburg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlights">Key Highlights</Label>
                <Textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Recently renovated, below market rents, prime location..."
                  rows={3}
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
                    Generate OM Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-light">Generated Content</CardTitle>
              {generatedContent && (
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                    {generatedContent}
                  </div>
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
