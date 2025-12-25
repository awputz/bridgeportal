import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Mail, 
  Building2, 
  FileCheck, 
  PenTool,
  Sparkles,
  Clock,
  ChevronRight,
  Search,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { OMGenerator } from "@/components/generators/OMGenerator";
import { LeaseSummaryGenerator } from "@/components/generators/LeaseSummaryGenerator";
import { EmailGenerator } from "@/components/generators/EmailGenerator";
import { PropertyDescriptionGenerator } from "@/components/generators/PropertyDescriptionGenerator";

interface GeneratorItem {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  status: "live" | "coming-soon";
  category: "documents" | "communication" | "marketing";
}

const generators: GeneratorItem[] = [
  {
    id: "om-generator",
    name: "OM Generator",
    description: "Create professional Offering Memorandums with AI-powered content",
    icon: FileText,
    status: "live",
    category: "documents",
  },
  {
    id: "lease-summary",
    name: "Lease Summary Generator",
    description: "Generate executive lease summaries from deal terms",
    icon: FileCheck,
    status: "live",
    category: "documents",
  },
  {
    id: "email-generator",
    name: "Email Generator",
    description: "Draft professional emails for any situation",
    icon: Mail,
    status: "live",
    category: "communication",
  },
  {
    id: "property-description",
    name: "Property Description",
    description: "Create compelling listing descriptions for properties",
    icon: Building2,
    status: "live",
    category: "marketing",
  },
  {
    id: "comp-narrative",
    name: "Comp Narrative",
    description: "Generate market analysis narratives from comparable sales",
    icon: PenTool,
    status: "coming-soon",
    category: "documents",
  },
  {
    id: "market-report",
    name: "Market Report",
    description: "AI-powered market research and analysis reports",
    icon: FileSpreadsheet,
    status: "coming-soon",
    category: "documents",
  },
];

const Generators = () => {
  const [activeGenerator, setActiveGenerator] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredGenerators = generators.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
  );

  const liveGenerators = filteredGenerators.filter((g) => g.status === "live");
  const comingSoonGenerators = filteredGenerators.filter((g) => g.status === "coming-soon");

  const renderActiveGenerator = () => {
    switch (activeGenerator) {
      case "om-generator":
        return <OMGenerator onBack={() => setActiveGenerator(null)} />;
      case "lease-summary":
        return <LeaseSummaryGenerator onBack={() => setActiveGenerator(null)} />;
      case "email-generator":
        return <EmailGenerator onBack={() => setActiveGenerator(null)} />;
      case "property-description":
        return <PropertyDescriptionGenerator onBack={() => setActiveGenerator(null)} />;
      default:
        return null;
    }
  };

  if (activeGenerator) {
    return renderActiveGenerator();
  }

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              AI Generators
            </h1>
            <p className="text-muted-foreground font-light">
              AI-powered tools to supercharge your productivity
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search generators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>

        {/* Live Generators */}
        <div className="mb-12">
          <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Available Now
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveGenerators.map((generator) => {
              const Icon = generator.icon;
              return (
                <Card
                  key={generator.id}
                  className="glass-card border-white/10 cursor-pointer hover:bg-white/10 transition-all group"
                  onClick={() => setActiveGenerator(generator.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-light text-foreground mb-2">{generator.name}</h3>
                    <p className="text-sm text-muted-foreground">{generator.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        {comingSoonGenerators.length > 0 && (
          <div>
            <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Coming Soon
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comingSoonGenerators.map((generator) => {
                const Icon = generator.icon;
                return (
                  <Card
                    key={generator.id}
                    className="glass-card border-white/10 opacity-60"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-muted/20 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                      </div>
                      <h3 className="text-lg font-light text-foreground mb-2">{generator.name}</h3>
                      <p className="text-sm text-muted-foreground">{generator.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generators;
