import { useState } from "react";
import { ArrowLeft, Loader2, Copy, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FollowUpEmailGeneratorProps {
  onBack: () => void;
}

export const FollowUpEmailGenerator = ({ onBack }: FollowUpEmailGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientType: "buyer",
    lastContactType: "showing",
    daysSinceContact: "7",
    propertyAddress: "",
    additionalContext: "",
    tone: "professional",
  });

  const handleGenerate = async () => {
    if (!formData.recipientName) {
      toast.error("Please enter recipient name");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Write a professional follow-up email for a real estate agent.

Recipient Details:
- Name: ${formData.recipientName}
- Type: ${formData.recipientType}
- Last Contact: ${formData.lastContactType} (${formData.daysSinceContact} days ago)
${formData.propertyAddress ? `- Property: ${formData.propertyAddress}` : ""}
${formData.additionalContext ? `- Additional Context: ${formData.additionalContext}` : ""}

Tone: ${formData.tone}

Generate a compelling follow-up email that:
1. References the previous interaction appropriately
2. Adds value (market update, new listing, helpful info)
3. Includes a clear but soft call-to-action
4. Feels personal, not templated
5. Is concise (under 150 words)

Provide the email with Subject line and body. Make it feel genuine and helpful, not salesy.`;

      const response = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          agent_context: { division: "residential" },
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

      toast.success("Follow-up email generated");
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error("Failed to generate email");
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
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extralight text-foreground">
              Follow-up Email Generator
            </h1>
            <p className="text-muted-foreground text-sm">
              Create personalized follow-up emails for leads and clients
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Recipient Name *</Label>
                <Input
                  placeholder="John Smith"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recipient Type</Label>
                  <Select
                    value={formData.recipientType}
                    onValueChange={(value) => setFormData({ ...formData, recipientType: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="landlord">Landlord</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Last Contact Type</Label>
                  <Select
                    value={formData.lastContactType}
                    onValueChange={(value) => setFormData({ ...formData, lastContactType: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="showing">Property Showing</SelectItem>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">In-Person Meeting</SelectItem>
                      <SelectItem value="open-house">Open House</SelectItem>
                      <SelectItem value="inquiry">Initial Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Days Since Contact</Label>
                  <Select
                    value={formData.daysSinceContact}
                    onValueChange={(value) => setFormData({ ...formData, daysSinceContact: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                      <SelectItem value="60">2 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Property Address (optional)</Label>
                <Input
                  placeholder="123 Main Street, Apt 4A"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Additional Context (optional)</Label>
                <Textarea
                  placeholder="Any specific details about the client or situation..."
                  value={formData.additionalContext}
                  onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
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
                  "Generate Follow-up Email"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-foreground">Generated Email</Label>
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
                    Your follow-up email will appear here...
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
