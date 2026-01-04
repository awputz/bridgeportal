import { useState } from "react";
import { ArrowLeft, Copy, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { LucideIcon } from "lucide-react";

export interface GeneratorShellProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onBack: () => void;
  children: React.ReactNode;
  outputTitle?: string;
  outputDescription?: string;
  promptBuilder: (formData: Record<string, any>) => string;
  formData: Record<string, any>;
  isFormValid?: boolean | string;
}

export const GeneratorShell = ({
  id,
  title,
  description,
  icon: Icon,
  onBack,
  children,
  outputTitle = "Generated Content",
  outputDescription = "Your AI-generated content will appear here",
  promptBuilder,
  formData,
  isFormValid = true,
}: GeneratorShellProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const prompt = promptBuilder(formData);

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
        },
      });

      if (error) throw error;

      // Handle streaming response
      if (data) {
        const reader = data.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let content = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(jsonStr);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    content += delta;
                    setGeneratedContent(content);
                  }
                } catch {
                  // Ignore parsing errors for incomplete chunks
                }
              }
            }
          }
          toast.success("Content generated successfully!");
        } else if (typeof data === "string") {
          setGeneratedContent(data);
          toast.success("Content generated successfully!");
        }
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generators
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extralight text-foreground">
              {title}
            </h1>
          </div>
          <p className="text-muted-foreground font-light">{description}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form Card */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-light flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Input Details
              </CardTitle>
              <CardDescription>
                Fill in the details to generate your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {children}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !isFormValid}
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Card */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-light">{outputTitle}</CardTitle>
                  <CardDescription>{outputDescription}</CardDescription>
                </div>
                {generatedContent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="bg-muted/30 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-light leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              ) : (
                <div className="bg-muted/20 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Icon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="font-light">Your generated content will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeneratorShell;
