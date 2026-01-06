import { useState } from "react";
import { ArrowLeft, Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailGeneratorProps {
  onBack: () => void;
}

const emailTypes = [
  { value: "intro", label: "Introduction / Prospecting" },
  { value: "follow-up", label: "Follow Up" },
  { value: "offer", label: "Offer Presentation" },
  { value: "listing", label: "New Listing Announcement" },
  { value: "market-update", label: "Market Update" },
  { value: "thank-you", label: "Thank You" },
  { value: "meeting-request", label: "Meeting Request" },
  { value: "counter-offer", label: "Counter Offer" },
];

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "urgent", label: "Urgent" },
];

export const EmailGenerator = ({ onBack }: EmailGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    emailType: "intro",
    tone: "professional",
    recipientName: "",
    recipientCompany: "",
    propertyAddress: "",
    keyPoints: "",
    agentName: "",
    callToAction: "",
  });

  const handleGenerate = async () => {
    if (!formData.recipientName) {
      toast.error("Recipient name is required");
      return;
    }

    setIsGenerating(true);

    try {
      const emailTypeLabel = emailTypes.find(t => t.value === formData.emailType)?.label || formData.emailType;
      const toneLabel = toneOptions.find(t => t.value === formData.tone)?.label || formData.tone;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `Generate a professional real estate email with the following details:

Email Type: ${emailTypeLabel}
Tone: ${toneLabel}
Recipient Name: ${formData.recipientName}
Recipient Company: ${formData.recipientCompany || "N/A"}
Property Address: ${formData.propertyAddress || "N/A"}
Key Points to Include: ${formData.keyPoints || "None specified"}
Agent Name: ${formData.agentName || "The Agent"}
Call to Action: ${formData.callToAction || "Schedule a call or meeting"}

Please generate:
1. A compelling subject line
2. The complete email body with proper greeting and sign-off
3. A brief PS line if appropriate

Keep it concise, ${toneLabel.toLowerCase()}, and focused on the recipient's needs. Make it sound natural and not AI-generated.`
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
              Email Generator
            </h1>
            <p className="text-muted-foreground">Draft professional emails in seconds</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="font-light">Email Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Type</Label>
                  <Select
                    value={formData.emailType}
                    onValueChange={(v) => setFormData({ ...formData, emailType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(v) => setFormData({ ...formData, tone: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Name *</Label>
                  <Input
                    id="recipient"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Recipient Company</Label>
                  <Input
                    id="company"
                    value={formData.recipientCompany}
                    onChange={(e) => setFormData({ ...formData, recipientCompany: e.target.value })}
                    placeholder="ABC Properties"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property">Property Address (if relevant)</Label>
                <AddressAutocomplete
                  value={formData.propertyAddress}
                  onChange={(v) => setFormData({ ...formData, propertyAddress: v })}
                  onAddressSelect={(addr) => setFormData({ ...formData, propertyAddress: addr.fullAddress })}
                  placeholder="Start typing an address..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Key Points to Include</Label>
                <Textarea
                  id="points"
                  value={formData.keyPoints}
                  onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                  placeholder="- Recent price reduction&#10;- Strong cap rate&#10;- Motivated seller"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agent">Your Name</Label>
                  <Input
                    id="agent"
                    value={formData.agentName}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta">Call to Action</Label>
                  <Input
                    id="cta"
                    value={formData.callToAction}
                    onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
                    placeholder="Schedule a call"
                  />
                </div>
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
                    Generate Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-light">Generated Email</CardTitle>
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
                  <p>Fill in the details and click generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
