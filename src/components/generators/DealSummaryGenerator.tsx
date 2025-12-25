import { useState } from "react";
import { ArrowLeft, Loader2, Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DealSummaryGeneratorProps {
  onBack: () => void;
}

export const DealSummaryGenerator = ({ onBack }: DealSummaryGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    propertyAddress: "",
    dealType: "sale",
    propertyType: "multifamily",
    purchasePrice: "",
    units: "",
    squareFootage: "",
    capRate: "",
    noi: "",
    keyTerms: "",
    parties: "",
    timeline: "",
  });

  const handleGenerate = async () => {
    if (!formData.propertyAddress || !formData.purchasePrice) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional one-page deal summary for the following transaction:

Property Details:
- Address: ${formData.propertyAddress}
- Deal Type: ${formData.dealType}
- Property Type: ${formData.propertyType}
- Purchase Price: $${formData.purchasePrice}
${formData.units ? `- Units: ${formData.units}` : ""}
${formData.squareFootage ? `- Square Footage: ${formData.squareFootage}` : ""}
${formData.capRate ? `- Cap Rate: ${formData.capRate}%` : ""}
${formData.noi ? `- NOI: $${formData.noi}` : ""}

${formData.keyTerms ? `Key Terms:\n${formData.keyTerms}` : ""}
${formData.parties ? `Parties Involved:\n${formData.parties}` : ""}
${formData.timeline ? `Timeline:\n${formData.timeline}` : ""}

Create a professional deal summary that includes:
1. Executive Summary (2-3 sentences)
2. Property Overview
3. Financial Highlights
4. Key Deal Terms
5. Timeline & Next Steps
6. Important Considerations

Format it cleanly for internal review or client presentation.`;

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

      toast.success("Deal summary generated");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary");
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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extralight text-foreground">
              Deal Summary Generator
            </h1>
            <p className="text-muted-foreground text-sm">
              Create professional one-page deal summaries
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Property Address *</Label>
                <Input
                  placeholder="123 Main Street, New York, NY"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deal Type</Label>
                  <Select
                    value={formData.dealType}
                    onValueChange={(value) => setFormData({ ...formData, dealType: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="acquisition">Acquisition</SelectItem>
                      <SelectItem value="refinance">Refinance</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
              </div>

              <div className="space-y-2">
                <Label>Purchase/Sale Price *</Label>
                <Input
                  placeholder="5,000,000"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cap Rate (%)</Label>
                  <Input
                    placeholder="5.5"
                    value={formData.capRate}
                    onChange={(e) => setFormData({ ...formData, capRate: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>NOI</Label>
                  <Input
                    placeholder="275,000"
                    value={formData.noi}
                    onChange={(e) => setFormData({ ...formData, noi: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Terms (optional)</Label>
                <Textarea
                  placeholder="e.g., All-cash deal, 60-day close, subject to financing..."
                  value={formData.keyTerms}
                  onChange={(e) => setFormData({ ...formData, keyTerms: e.target.value })}
                  className="bg-white/5 border-white/10 min-h-[60px]"
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
                  "Generate Deal Summary"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-foreground">Generated Summary</Label>
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
                    Your deal summary will appear here...
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
