import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDivision, type Division } from "@/contexts/DivisionContext";
import { 
  generatorRegistry, 
  getGeneratorsForDivision,
  getAllCategories,
  getCategoryLabel,
  type GeneratorDefinition,
  type GeneratorCategory,
} from "@/lib/generatorRegistry";

// Import existing live generators
import { OMGenerator } from "@/components/generators/OMGenerator";
import { LeaseSummaryGenerator } from "@/components/generators/LeaseSummaryGenerator";
import { EmailGenerator } from "@/components/generators/EmailGenerator";
import { CMAGenerator } from "@/components/generators/CMAGenerator";
import { FollowUpEmailGenerator } from "@/components/generators/FollowUpEmailGenerator";
import { DealSummaryGenerator } from "@/components/generators/DealSummaryGenerator";

// Universal
import { ClientThankYouGenerator } from "@/components/generators/universal/ClientThankYouGenerator";
import { MeetingPrepGenerator } from "@/components/generators/universal/MeetingPrepGenerator";
import { ObjectionHandlerGenerator } from "@/components/generators/universal/ObjectionHandlerGenerator";
import { ColdCallScriptGenerator } from "@/components/generators/universal/ColdCallScriptGenerator";
import { MarketUpdateEmailGenerator } from "@/components/generators/universal/MarketUpdateEmailGenerator";

// Investment Sales
import { BuyerMatchLetterGenerator } from "@/components/generators/investment-sales/BuyerMatchLetterGenerator";
import { DueDiligenceChecklistGenerator } from "@/components/generators/investment-sales/DueDiligenceChecklistGenerator";

// New Generators - Presentations
import { InvestmentSalesOMDeckGenerator } from "@/components/generators/presentations/InvestmentSalesOMDeckGenerator";
import { OfficeLeasingDeckGenerator } from "@/components/generators/presentations/OfficeLeasingDeckGenerator";
import { RetailLeasingDeckGenerator } from "@/components/generators/presentations/RetailLeasingDeckGenerator";
import { ResidentialListingDeckGenerator } from "@/components/generators/presentations/ResidentialListingDeckGenerator";
import { SellerPitchDeckGenerator } from "@/components/generators/presentations/SellerPitchDeckGenerator";

// New Generators - Flyers
import { InvestmentSalesFlyerGenerator } from "@/components/generators/flyers/InvestmentSalesFlyerGenerator";
import { OfficeSpaceFlyerGenerator } from "@/components/generators/flyers/OfficeSpaceFlyerGenerator";
import { RetailSpaceFlyerGenerator } from "@/components/generators/flyers/RetailSpaceFlyerGenerator";
import { ResidentialJustListedFlyerGenerator } from "@/components/generators/flyers/ResidentialJustListedFlyerGenerator";
import { ResidentialOpenHouseFlyerGenerator } from "@/components/generators/flyers/ResidentialOpenHouseFlyerGenerator";
import { IndustrialWarehouseFlyerGenerator } from "@/components/generators/flyers/IndustrialWarehouseFlyerGenerator";

// New Generators - Social Media
import { InstagramJustListedGenerator } from "@/components/generators/social-media/InstagramJustListedGenerator";
import { InstagramJustSoldGenerator } from "@/components/generators/social-media/InstagramJustSoldGenerator";
import { LinkedInDealPostGenerator } from "@/components/generators/social-media/LinkedInDealPostGenerator";
import { InstagramOpenHouseStoryGenerator } from "@/components/generators/social-media/InstagramOpenHouseStoryGenerator";

// New Generators - Documents & Scripts
import { InvestmentAnalysisReportGenerator } from "@/components/generators/documents/InvestmentAnalysisReportGenerator";
import { SellerPricingScriptGenerator } from "@/components/generators/scripts/SellerPricingScriptGenerator";

type DivisionFilter = Division | "all";

const generatorComponents: Record<string, React.ComponentType<{ onBack: () => void }>> = {
  // Documents
  "om-generator": OMGenerator,
  "deal-summary": DealSummaryGenerator,
  "cma-generator": CMAGenerator,
  "lease-summary": LeaseSummaryGenerator,
  "meeting-prep": MeetingPrepGenerator,
  "buyer-match-letter": BuyerMatchLetterGenerator,
  "due-diligence-checklist": DueDiligenceChecklistGenerator,
  "investment-analysis-report": InvestmentAnalysisReportGenerator,
  // Emails
  "email-generator": EmailGenerator,
  "follow-up-email": FollowUpEmailGenerator,
  "market-update-email": MarketUpdateEmailGenerator,
  "client-thank-you": ClientThankYouGenerator,
  // Scripts
  "cold-call-script": ColdCallScriptGenerator,
  "objection-handler": ObjectionHandlerGenerator,
  "seller-pricing-script": SellerPricingScriptGenerator,
  // Presentations
  "investment-sales-om-deck": InvestmentSalesOMDeckGenerator,
  "office-leasing-deck": OfficeLeasingDeckGenerator,
  "retail-leasing-deck": RetailLeasingDeckGenerator,
  "residential-listing-deck": ResidentialListingDeckGenerator,
  "seller-pitch-deck": SellerPitchDeckGenerator,
  // Flyers
  "investment-sales-flyer": InvestmentSalesFlyerGenerator,
  "office-space-flyer": OfficeSpaceFlyerGenerator,
  "retail-space-flyer": RetailSpaceFlyerGenerator,
  "residential-just-listed-flyer": ResidentialJustListedFlyerGenerator,
  "residential-open-house-flyer": ResidentialOpenHouseFlyerGenerator,
  "industrial-warehouse-flyer": IndustrialWarehouseFlyerGenerator,
  // Social Media
  "instagram-just-listed": InstagramJustListedGenerator,
  "instagram-just-sold": InstagramJustSoldGenerator,
  "linkedin-deal-post": LinkedInDealPostGenerator,
  "instagram-open-house-story": InstagramOpenHouseStoryGenerator,
};

const divisionLabels: Record<DivisionFilter, string> = {
  all: "All Generators",
  "investment-sales": "Investment Sales",
  "commercial-leasing": "Commercial Leasing",
  residential: "Residential",
};

const Generators = () => {
  const { division: currentDivision } = useDivision();
  const [activeGenerator, setActiveGenerator] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<DivisionFilter>(currentDivision);
  const [categoryFilter, setCategoryFilter] = useState<GeneratorCategory | "all">("all");

  // Get filtered generators
  const filteredGenerators = useMemo(() => {
    let generators = divisionFilter === "all" 
      ? generatorRegistry 
      : getGeneratorsForDivision(divisionFilter);

    // Filter by category
    if (categoryFilter !== "all") {
      generators = generators.filter((g) => g.category === categoryFilter);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      generators = generators.filter(
        (g) =>
          g.name.toLowerCase().includes(searchLower) ||
          g.description.toLowerCase().includes(searchLower)
      );
    }

    // Remove duplicates (some generators appear in multiple divisions)
    const seen = new Set<string>();
    generators = generators.filter((g) => {
      if (seen.has(g.id)) return false;
      seen.add(g.id);
      return true;
    });

    return generators;
  }, [divisionFilter, categoryFilter, search]);

  const liveGenerators = filteredGenerators.filter((g) => g.status === "live");
  const underConstructionGenerators = filteredGenerators.filter((g) => g.status === "under-construction");

  // Recommended for current division
  const recommendedGenerators = useMemo(() => {
    return getGeneratorsForDivision(currentDivision)
      .filter((g) => g.status === "live")
      .slice(0, 4);
  }, [currentDivision]);

  const renderActiveGenerator = () => {
    if (!activeGenerator) return null;
    const GeneratorComponent = generatorComponents[activeGenerator];
    if (!GeneratorComponent) {
      return (
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => setActiveGenerator(null)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              ← Back to Generators
            </button>
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-light mb-2">Under Construction</h2>
              <p className="text-muted-foreground">
                This generator is being upgraded. Check back soon!
              </p>
            </div>
          </div>
        </div>
      );
    }
    return <GeneratorComponent onBack={() => setActiveGenerator(null)} />;
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
              {liveGenerators.length} AI-powered tools ready to use
            </p>
          </div>
        </div>

        {/* Division Tabs */}
        <Tabs value={divisionFilter} onValueChange={(v) => setDivisionFilter(v as DivisionFilter)} className="mb-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="investment-sales">Investment Sales</TabsTrigger>
            <TabsTrigger value="commercial-leasing">Commercial Leasing</TabsTrigger>
            <TabsTrigger value="residential">Residential</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search generators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={categoryFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("all")}
              className="gap-1"
            >
              <Filter className="h-3 w-3" />
              All
            </Button>
            {getAllCategories().map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
              >
                {getCategoryLabel(cat)}
              </Button>
            ))}
          </div>
        </div>

        {/* Recommended Section (only when viewing "all") */}
        {divisionFilter === "all" && !search && categoryFilter === "all" && (
          <div className="mb-8">
            <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Recommended for {divisionLabels[currentDivision]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedGenerators.map((generator) => (
                <GeneratorCard 
                  key={generator.id} 
                  generator={generator} 
                  onClick={() => setActiveGenerator(generator.id)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Live Generators */}
        {liveGenerators.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Available Now ({liveGenerators.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {liveGenerators.map((generator) => (
                <GeneratorCard 
                  key={generator.id} 
                  generator={generator} 
                  onClick={() => setActiveGenerator(generator.id)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Under Construction Generators */}
        {underConstructionGenerators.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-500" />
              Under Construction ({underConstructionGenerators.length})
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              These generators are being upgraded with enhanced prompts and features. Check back soon!
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {underConstructionGenerators.map((generator) => (
                <GeneratorCard 
                  key={generator.id} 
                  generator={generator}
                  disabled
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredGenerators.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-light mb-2">No generators found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Generator Card Component
interface GeneratorCardProps {
  generator: GeneratorDefinition;
  onClick?: () => void;
  disabled?: boolean;
}

const GeneratorCard = ({ generator, onClick, disabled }: GeneratorCardProps) => {
  const Icon = generator.icon;
  const isUnderConstruction = generator.status === "under-construction";

  return (
    <Card
      className={`glass-card border-white/10 transition-all ${
        disabled || isUnderConstruction
          ? "opacity-60 cursor-not-allowed" 
          : "cursor-pointer hover:bg-white/10 group"
      }`}
      onClick={disabled || isUnderConstruction ? undefined : onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
            disabled || isUnderConstruction ? "bg-muted/20" : "bg-primary/20"
          }`}>
            <Icon className={`h-5 w-5 ${
              disabled || isUnderConstruction ? "text-muted-foreground" : "text-primary"
            }`} />
          </div>
          {isUnderConstruction ? (
            <Badge variant="secondary" className="text-xs gap-1">
              <Wrench className="h-3 w-3" />
              Upgrading
            </Badge>
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          )}
        </div>
        <h3 className="text-base font-light text-foreground mb-1">{generator.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{generator.description}</p>
        <div className="mt-3">
          <Badge variant="outline" className="text-xs capitalize">
            {getCategoryLabel(generator.category)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default Generators;
