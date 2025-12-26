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
  FileSpreadsheet,
  BarChart3,
  Target,
  TrendingUp,
  MessageSquare,
  Layers,
  MapPin,
  DollarSign,
  AlertTriangle,
  Users,
  Zap,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OMGenerator } from "@/components/generators/OMGenerator";
import { LeaseSummaryGenerator } from "@/components/generators/LeaseSummaryGenerator";
import { EmailGenerator } from "@/components/generators/EmailGenerator";
import { PropertyDescriptionGenerator } from "@/components/generators/PropertyDescriptionGenerator";
import { CMAGenerator } from "@/components/generators/CMAGenerator";
import { FollowUpEmailGenerator } from "@/components/generators/FollowUpEmailGenerator";
import { DealSummaryGenerator } from "@/components/generators/DealSummaryGenerator";
import { ListingTeaserGenerator } from "@/components/generators/ListingTeaserGenerator";

interface GeneratorItem {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  status: "live" | "coming-soon";
  category: "documents" | "communication" | "marketing" | "crm" | "analytics";
}

const generators: GeneratorItem[] = [
  // Live Generators
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
    id: "cma-generator",
    name: "CMA Generator",
    description: "Generate Comparative Market Analysis reports",
    icon: BarChart3,
    status: "live",
    category: "documents",
  },
  {
    id: "follow-up-email",
    name: "Follow-up Email Generator",
    description: "AI-crafted follow-up emails for leads and clients",
    icon: Mail,
    status: "live",
    category: "communication",
  },
  {
    id: "deal-summary",
    name: "Deal Summary Generator",
    description: "Create one-page deal summaries for transactions",
    icon: FileText,
    status: "live",
    category: "documents",
  },
  {
    id: "listing-teaser",
    name: "Listing Teaser Generator",
    description: "Create social media teasers for listings",
    icon: PenTool,
    status: "live",
    category: "marketing",
  },
  // Coming Soon Generators
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
  {
    id: "lead-scoring",
    name: "Lead Scoring Tool",
    description: "AI-analyzed lead prioritization based on activity",
    icon: Target,
    status: "coming-soon",
    category: "crm",
  },
  {
    id: "pipeline-forecast",
    name: "Pipeline Forecast",
    description: "Predict which deals will close and when",
    icon: TrendingUp,
    status: "coming-soon",
    category: "analytics",
  },
  {
    id: "negotiation-script",
    name: "Negotiation Script",
    description: "AI scripts for handling price objections",
    icon: MessageSquare,
    status: "coming-soon",
    category: "communication",
  },
  {
    id: "portfolio-analyzer",
    name: "Portfolio Analyzer",
    description: "Multi-property portfolio analysis and recommendations",
    icon: Layers,
    status: "coming-soon",
    category: "analytics",
  },
  {
    id: "neighborhood-report",
    name: "Neighborhood Report",
    description: "AI-generated area insights and demographics",
    icon: MapPin,
    status: "coming-soon",
    category: "documents",
  },
  {
    id: "commission-projection",
    name: "Commission Projection",
    description: "Projected annual earnings based on pipeline",
    icon: DollarSign,
    status: "coming-soon",
    category: "analytics",
  },
  {
    id: "risk-assessment",
    name: "Deal Risk Assessment",
    description: "Identify at-risk deals with recommendations",
    icon: AlertTriangle,
    status: "coming-soon",
    category: "crm",
  },
  {
    id: "client-matching",
    name: "Client Matching",
    description: "Match properties to buyer preferences automatically",
    icon: Users,
    status: "coming-soon",
    category: "crm",
  },
  {
    id: "auto-follow-up",
    name: "Auto Follow-up Scheduler",
    description: "AI-suggested follow-up timing and messaging",
    icon: Zap,
    status: "coming-soon",
    category: "crm",
  },
  {
    id: "call-simulator",
    name: "Client Call Simulator",
    description: "Practice scenarios with AI-powered roleplay",
    icon: Bot,
    status: "coming-soon",
    category: "communication",
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
      case "cma-generator":
        return <CMAGenerator onBack={() => setActiveGenerator(null)} />;
      case "follow-up-email":
        return <FollowUpEmailGenerator onBack={() => setActiveGenerator(null)} />;
      case "deal-summary":
        return <DealSummaryGenerator onBack={() => setActiveGenerator(null)} />;
      case "listing-teaser":
        return <ListingTeaserGenerator onBack={() => setActiveGenerator(null)} />;
      default:
        return null;
    }
  };

  if (activeGenerator) {
    return renderActiveGenerator();
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Back to Tools */}
        <Link 
          to="/portal/tools" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          ← Back to Tools
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extralight text-foreground mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              AI Generators
            </h1>
            <p className="text-muted-foreground font-light">
              AI-powered tools to supercharge your productivity
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search generators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>

        {/* Live Generators */}
        <div className="mb-8">
          <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Available Now ({liveGenerators.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {liveGenerators.map((generator) => {
              const Icon = generator.icon;
              return (
                <Card
                  key={generator.id}
                  className="glass-card border-white/10 cursor-pointer hover:bg-white/10 transition-all group"
                  onClick={() => setActiveGenerator(generator.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-base font-light text-foreground mb-1">{generator.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{generator.description}</p>
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
              Coming Soon ({comingSoonGenerators.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {comingSoonGenerators.map((generator) => {
                const Icon = generator.icon;
                return (
                  <Card
                    key={generator.id}
                    className="glass-card border-white/10 opacity-60"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-muted/20 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                      </div>
                      <h3 className="text-base font-light text-foreground mb-1">{generator.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{generator.description}</p>
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
