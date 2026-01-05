import { useState, useMemo } from "react";
import { ArrowLeft, Sparkles, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { OMFormData, initialOMFormData, calculateMetrics } from "@/types/om-generator";
import { OMPropertySection } from "./om/OMPropertySection";
import { OMPricingSection } from "./om/OMPricingSection";
import { OMIncomeSection } from "./om/OMIncomeSection";
import { OMExpensesSection } from "./om/OMExpensesSection";
import { OMUnitMixSection } from "./om/OMUnitMixSection";
import { OMRentRegulationSection } from "./om/OMRentRegulationSection";
import { OMLocationSection } from "./om/OMLocationSection";
import { OMMarketDataSection } from "./om/OMMarketDataSection";
import { OMValueAddSection } from "./om/OMValueAddSection";
import { OMThesisSection } from "./om/OMThesisSection";
import { OMOutputDisplay } from "./om/OMOutputDisplay";

interface OMGeneratorProps {
  onBack: () => void;
}

type SectionKey = 
  | "property"
  | "pricing"
  | "income"
  | "expenses"
  | "unitMix"
  | "rentRegulation"
  | "location"
  | "market"
  | "valueAdd"
  | "thesis";

interface Section {
  key: SectionKey;
  title: string;
  required?: boolean;
}

const sections: Section[] = [
  { key: "property", title: "Property Basics", required: true },
  { key: "pricing", title: "Pricing & Returns", required: true },
  { key: "income", title: "Income Details" },
  { key: "expenses", title: "Operating Expenses" },
  { key: "unitMix", title: "Unit Mix" },
  { key: "rentRegulation", title: "Rent Regulation (NYC)" },
  { key: "location", title: "Location & Demographics" },
  { key: "market", title: "Market Data & Comps" },
  { key: "valueAdd", title: "Value-Add Opportunities" },
  { key: "thesis", title: "Investment Thesis" },
];

export const OMGenerator = ({ onBack }: OMGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [formData, setFormData] = useState<OMFormData>(initialOMFormData);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set(["property", "pricing"]));

  const calculatedMetrics = useMemo(() => calculateMetrics(formData), [formData]);

  const toggleSection = (key: SectionKey) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(key)) {
      newOpen.delete(key);
    } else {
      newOpen.add(key);
    }
    setOpenSections(newOpen);
  };

  const isFormValid = formData.propertyBasics.address.trim().length > 0;

  const handleGenerate = async () => {
    if (!isFormValid) {
      toast.error("Property address is required");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-om", {
        body: { formData },
      });

      if (error) throw error;
      
      if (data?.content) {
        setGeneratedContent(data.content);
        toast.success("OM generated successfully!");
      } else {
        throw new Error("No content returned");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to generate: " + message);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSectionContent = (key: SectionKey) => {
    switch (key) {
      case "property":
        return (
          <OMPropertySection
            data={formData.propertyBasics}
            onChange={(data) => setFormData({ ...formData, propertyBasics: data })}
          />
        );
      case "pricing":
        return (
          <OMPricingSection
            data={formData.pricingReturns}
            onChange={(data) => setFormData({ ...formData, pricingReturns: data })}
            calculatedMetrics={calculatedMetrics}
          />
        );
      case "income":
        return (
          <OMIncomeSection
            data={formData.incomeDetails}
            onChange={(data) => setFormData({ ...formData, incomeDetails: data })}
          />
        );
      case "expenses":
        return (
          <OMExpensesSection
            data={formData.expenses}
            onChange={(data) => setFormData({ ...formData, expenses: data })}
          />
        );
      case "unitMix":
        return (
          <OMUnitMixSection
            data={formData.unitMix}
            onChange={(data) => setFormData({ ...formData, unitMix: data })}
          />
        );
      case "rentRegulation":
        return (
          <OMRentRegulationSection
            data={formData.rentRegulation}
            onChange={(data) => setFormData({ ...formData, rentRegulation: data })}
          />
        );
      case "location":
        return (
          <OMLocationSection
            data={formData.location}
            onChange={(data) => setFormData({ ...formData, location: data })}
          />
        );
      case "market":
        return (
          <OMMarketDataSection
            data={formData.marketData}
            onChange={(data) => setFormData({ ...formData, marketData: data })}
          />
        );
      case "valueAdd":
        return (
          <OMValueAddSection
            data={formData.valueAdd}
            onChange={(data) => setFormData({ ...formData, valueAdd: data })}
          />
        );
      case "thesis":
        return (
          <OMThesisSection
            data={formData.investmentThesis}
            onChange={(data) => setFormData({ ...formData, investmentThesis: data })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Offering Memorandum Generator
            </h1>
            <p className="text-muted-foreground">Create institutional-quality OM content for investment properties</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <div className="space-y-3">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="font-light text-lg">Property Details</CardTitle>
                <p className="text-xs text-muted-foreground">Fill in as much as you can — more details = better output</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <Collapsible
                    key={section.key}
                    open={openSections.has(section.key)}
                    onOpenChange={() => toggleSection(section.key)}
                  >
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/30 rounded-lg transition-colors border border-border/50">
                        <span className="text-sm font-medium flex items-center gap-2">
                          {section.title}
                          {section.required && (
                            <span className="text-[10px] text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">Required</span>
                          )}
                        </span>
                        {openSections.has(section.key) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 pb-4 px-3">
                      {renderSectionContent(section.key)}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !isFormValid}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating OM...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Full OM
                </>
              )}
            </Button>
          </div>

          {/* Output */}
          <Card className="glass-card border-white/10 h-fit lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="font-light">Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <OMOutputDisplay content={generatedContent} isGenerating={isGenerating} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
