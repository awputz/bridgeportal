import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface OMOutputDisplayProps {
  content: string;
  isGenerating: boolean;
}

export const OMOutputDisplay = ({ content, isGenerating }: OMOutputDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("full");

  // Parse sections from the full content
  const parseSections = (text: string) => {
    const sections: Record<string, string> = {
      executiveSummary: "",
      investmentHighlights: "",
      propertyDescription: "",
      locationOverview: "",
      financialSummary: "",
      marketAnalysis: "",
      valueCreation: "",
      investmentThesis: "",
    };

    if (!text) return sections;

    // Try to split by ## headers
    const sectionRegex = /##\s*(Executive Summary|Investment Highlights|Property Description|Location Overview|Financial Summary|Market Analysis|Value Creation|Investment Thesis)\s*\n([\s\S]*?)(?=##\s*[A-Z]|$)/gi;
    
    let match;
    while ((match = sectionRegex.exec(text)) !== null) {
      const sectionName = match[1].toLowerCase().replace(/\s+/g, "");
      const sectionContent = match[2].trim();
      
      // Map to our section keys
      if (sectionName.includes("executive")) sections.executiveSummary = sectionContent;
      else if (sectionName.includes("highlight")) sections.investmentHighlights = sectionContent;
      else if (sectionName.includes("property")) sections.propertyDescription = sectionContent;
      else if (sectionName.includes("location")) sections.locationOverview = sectionContent;
      else if (sectionName.includes("financial")) sections.financialSummary = sectionContent;
      else if (sectionName.includes("market")) sections.marketAnalysis = sectionContent;
      else if (sectionName.includes("value")) sections.valueCreation = sectionContent;
      else if (sectionName.includes("thesis")) sections.investmentThesis = sectionContent;
    }

    return sections;
  };

  const sections = parseSections(content);
  const hasSections = Object.values(sections).some(s => s.length > 0);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const tabItems = [
    { id: "full", label: "Full OM" },
    { id: "executiveSummary", label: "Summary" },
    { id: "investmentHighlights", label: "Highlights" },
    { id: "propertyDescription", label: "Property" },
    { id: "locationOverview", label: "Location" },
    { id: "financialSummary", label: "Financials" },
    { id: "marketAnalysis", label: "Market" },
    { id: "valueCreation", label: "Value-Add" },
    { id: "investmentThesis", label: "Thesis" },
  ];

  if (!content && !isGenerating) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="text-sm">Fill in the property details and click generate</p>
        <p className="text-xs mt-2 opacity-70">The more details you provide, the better the output</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <div className="relative">
          <Sparkles className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
        </div>
        <p className="text-sm">Generating your Offering Memorandum...</p>
        <p className="text-xs mt-2 opacity-70">This may take 15-30 seconds</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasSections ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="text-xs px-2 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                disabled={tab.id !== "full" && !sections[tab.id as keyof typeof sections]}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex justify-end mb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(activeTab === "full" ? content : sections[activeTab as keyof typeof sections])}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Copy</span>
            </Button>
          </div>

          <TabsContent value="full" className="mt-0">
            <div className="prose prose-invert prose-sm max-w-none max-h-[600px] overflow-y-auto pr-2">
              <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                {content}
              </div>
            </div>
          </TabsContent>

          {Object.entries(sections).map(([key, value]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="prose prose-invert prose-sm max-w-none max-h-[600px] overflow-y-auto pr-2">
                <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                  {value || "This section was not generated. Try regenerating the full OM."}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div>
          <div className="flex justify-end mb-2">
            <Button size="sm" variant="outline" onClick={() => handleCopy(content)}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Copy</span>
            </Button>
          </div>
          <div className="prose prose-invert prose-sm max-w-none max-h-[600px] overflow-y-auto pr-2">
            <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
