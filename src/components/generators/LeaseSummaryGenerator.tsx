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

interface LeaseSummaryGeneratorProps {
  onBack: () => void;
}

export const LeaseSummaryGenerator = ({ onBack }: LeaseSummaryGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    propertyAddress: "",
    tenantName: "",
    spaceType: "retail",
    squareFootage: "",
    baseRent: "",
    leaseTerm: "",
    startDate: "",
    escalations: "",
    tiAllowance: "",
    freeRent: "",
    options: "",
    specialTerms: "",
  });

  const handleGenerate = async () => {
    if (!formData.propertyAddress || !formData.tenantName) {
      toast.error("Property address and tenant name are required");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `Generate a professional lease summary document for this commercial lease:

Property Address: ${formData.propertyAddress}
Tenant: ${formData.tenantName}
Space Type: ${formData.spaceType}
Square Footage: ${formData.squareFootage || "N/A"} SF
Base Rent: ${formData.baseRent ? `$${formData.baseRent}/SF/year` : "Not specified"}
Lease Term: ${formData.leaseTerm || "N/A"} months
Commencement Date: ${formData.startDate || "TBD"}
Escalations: ${formData.escalations || "None specified"}
TI Allowance: ${formData.tiAllowance ? `$${formData.tiAllowance}` : "None"}
Free Rent: ${formData.freeRent || "None"}
Options: ${formData.options || "None"}
Special Terms: ${formData.specialTerms || "None"}

Please generate:
1. Executive Summary (2-3 sentences)
2. Key Business Terms table format
3. Financial Summary (annual rent, total lease value, effective rent)
4. Important Dates timeline
5. Notable Terms & Conditions

Format this as a clean, professional lease summary suitable for client presentation.`
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
              Lease Summary Generator
            </h1>
            <p className="text-muted-foreground">Generate executive lease summaries from deal terms</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="font-light">Lease Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Property Address *</Label>
                  <Input
                    id="address"
                    value={formData.propertyAddress}
                    onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                    placeholder="123 Broadway"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant Name *</Label>
                  <Input
                    id="tenant"
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    placeholder="ABC Company"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Space Type</Label>
                  <Select
                    value={formData.spaceType}
                    onValueChange={(v) => setFormData({ ...formData, spaceType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sf">Square Footage</Label>
                  <Input
                    id="sf"
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                    placeholder="5,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Base Rent ($/SF/Year)</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={formData.baseRent}
                    onChange={(e) => setFormData({ ...formData, baseRent: e.target.value })}
                    placeholder="75"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term">Lease Term (Months)</Label>
                  <Input
                    id="term"
                    type="number"
                    value={formData.leaseTerm}
                    onChange={(e) => setFormData({ ...formData, leaseTerm: e.target.value })}
                    placeholder="120"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Commencement Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ti">TI Allowance ($)</Label>
                  <Input
                    id="ti"
                    type="number"
                    value={formData.tiAllowance}
                    onChange={(e) => setFormData({ ...formData, tiAllowance: e.target.value })}
                    placeholder="100,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="escalations">Escalations</Label>
                  <Input
                    id="escalations"
                    value={formData.escalations}
                    onChange={(e) => setFormData({ ...formData, escalations: e.target.value })}
                    placeholder="3% annual"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeRent">Free Rent</Label>
                  <Input
                    id="freeRent"
                    value={formData.freeRent}
                    onChange={(e) => setFormData({ ...formData, freeRent: e.target.value })}
                    placeholder="3 months"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="options">Renewal Options</Label>
                <Input
                  id="options"
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder="2x5-year options at market"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special">Special Terms</Label>
                <Textarea
                  id="special"
                  value={formData.specialTerms}
                  onChange={(e) => setFormData({ ...formData, specialTerms: e.target.value })}
                  placeholder="Any special conditions or terms..."
                  rows={2}
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
                    Generate Lease Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-light">Generated Summary</CardTitle>
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
                  <p>Fill in the lease terms and click generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
