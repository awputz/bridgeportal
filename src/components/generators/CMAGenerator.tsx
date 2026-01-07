import { useState } from "react";
import { ArrowLeft, Loader2, Copy, Check, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CMAGeneratorProps {
  onBack: () => void;
}

export const CMAGenerator = ({ onBack }: CMAGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    subjectAddress: "",
    propertyType: "multifamily",
    borough: "Manhattan",
    neighborhood: "",
    units: "",
    squareFootage: "",
    askingPrice: "",
    comparables: "",
  });

  const handleGenerate = async () => {
    if (!formData.subjectAddress || !formData.neighborhood) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional Comparative Market Analysis (CMA) for the following property:

Subject Property:
- Address: ${formData.subjectAddress}
- Property Type: ${formData.propertyType}
- Location: ${formData.neighborhood}, ${formData.borough}
- Units: ${formData.units || "N/A"}
- Square Footage: ${formData.squareFootage || "N/A"}
- Asking Price: ${formData.askingPrice ? `$${formData.askingPrice}` : "To be determined"}

${formData.comparables ? `Comparable Properties Notes:\n${formData.comparables}` : ""}

Please provide:
1. Executive Summary with market position
2. Subject Property Analysis
3. Market Overview for ${formData.neighborhood}
4. Comparable Properties Analysis (suggest 3-5 relevant comps)
5. Pricing Recommendation with justification
6. Key Market Trends affecting value
7. Conclusion with recommended price range

Format the output professionally for a client presentation.`;

      const response = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          agent_context: { division: "investment-sales" },
        },
      });

      if (response.error) throw response.error;

      // Handle streaming response
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

      toast.success("CMA generated successfully");
    } catch (error) {
      console.error("Error generating CMA:", error);
      toast.error("Failed to generate CMA");
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
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extralight text-foreground">
              CMA Generator
            </h1>
            <p className="text-muted-foreground text-sm">
              Generate professional Comparative Market Analysis reports
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Subject Property Address *</Label>
                <AddressAutocomplete
                  value={formData.subjectAddress}
                  onChange={(value) => setFormData({ ...formData, subjectAddress: value })}
                  onAddressSelect={(addr) => setFormData({ ...formData, subjectAddress: addr.fullAddress, neighborhood: addr.neighborhood || formData.neighborhood, borough: addr.borough || formData.borough })}
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
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Borough</Label>
                  <Select
                    value={formData.borough}
                    onValueChange={(value) => setFormData({ ...formData, borough: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manhattan">Manhattan</SelectItem>
                      <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                      <SelectItem value="Queens">Queens</SelectItem>
                      <SelectItem value="Bronx">Bronx</SelectItem>
                      <SelectItem value="Staten Island">Staten Island</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Neighborhood *</Label>
                <Input
                  placeholder="e.g., Upper East Side, Williamsburg"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Units</Label>
                  <Input
                    placeholder="12"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Square Footage</Label>
                  <Input
                    placeholder="15,000"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Asking Price</Label>
                <Input
                  placeholder="5,000,000"
                  value={formData.askingPrice}
                  onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Comparable Properties Notes (optional)</Label>
                <Textarea
                  placeholder="Add any known comparable sales or relevant market data..."
                  value={formData.comparables}
                  onChange={(e) => setFormData({ ...formData, comparables: e.target.value })}
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
                    Generating CMA...
                  </>
                ) : (
                  "Generate CMA"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-foreground">Generated CMA</Label>
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
                    Your generated CMA will appear here...
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
