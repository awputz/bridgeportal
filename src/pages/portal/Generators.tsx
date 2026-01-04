import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles,
  Clock,
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
import { PropertyDescriptionGenerator } from "@/components/generators/PropertyDescriptionGenerator";
import { CMAGenerator } from "@/components/generators/CMAGenerator";
import { FollowUpEmailGenerator } from "@/components/generators/FollowUpEmailGenerator";
import { DealSummaryGenerator } from "@/components/generators/DealSummaryGenerator";
import { ListingTeaserGenerator } from "@/components/generators/ListingTeaserGenerator";

// Import shell generators (will be created)
// Universal
import { ClientThankYouGenerator } from "@/components/generators/universal/ClientThankYouGenerator";
import { MeetingPrepGenerator } from "@/components/generators/universal/MeetingPrepGenerator";
import { ObjectionHandlerGenerator } from "@/components/generators/universal/ObjectionHandlerGenerator";
import { SocialMediaPostGenerator } from "@/components/generators/universal/SocialMediaPostGenerator";
import { ColdCallScriptGenerator } from "@/components/generators/universal/ColdCallScriptGenerator";
import { AgentBioGenerator } from "@/components/generators/universal/AgentBioGenerator";
import { MarketUpdateEmailGenerator } from "@/components/generators/universal/MarketUpdateEmailGenerator";

// Investment Sales
import { InvestmentThesisGenerator } from "@/components/generators/investment-sales/InvestmentThesisGenerator";
import { CompNarrativeGenerator } from "@/components/generators/investment-sales/CompNarrativeGenerator";
import { NOIProFormaGenerator } from "@/components/generators/investment-sales/NOIProFormaGenerator";
import { RentRollAnalyzerGenerator } from "@/components/generators/investment-sales/RentRollAnalyzerGenerator";
import { Exchange1031BriefGenerator } from "@/components/generators/investment-sales/Exchange1031BriefGenerator";
import { BuyerMatchLetterGenerator } from "@/components/generators/investment-sales/BuyerMatchLetterGenerator";
import { SellerPitchDeckGenerator } from "@/components/generators/investment-sales/SellerPitchDeckGenerator";
import { DueDiligenceChecklistGenerator } from "@/components/generators/investment-sales/DueDiligenceChecklistGenerator";
import { InvestmentComparisonGenerator } from "@/components/generators/investment-sales/InvestmentComparisonGenerator";
import { CapRateJustificationGenerator } from "@/components/generators/investment-sales/CapRateJustificationGenerator";
import { PortfolioAnalysisGenerator } from "@/components/generators/investment-sales/PortfolioAnalysisGenerator";
import { DispositionStrategyGenerator } from "@/components/generators/investment-sales/DispositionStrategyGenerator";

// Commercial Leasing
import { LOIGenerator } from "@/components/generators/commercial-leasing/LOIGenerator";
import { TenantProposalGenerator } from "@/components/generators/commercial-leasing/TenantProposalGenerator";
import { SpaceComparisonGenerator } from "@/components/generators/commercial-leasing/SpaceComparisonGenerator";
import { LeaseAbstractGenerator } from "@/components/generators/commercial-leasing/LeaseAbstractGenerator";
import { TIScopeGenerator } from "@/components/generators/commercial-leasing/TIScopeGenerator";
import { LandlordPitchGenerator } from "@/components/generators/commercial-leasing/LandlordPitchGenerator";
import { TourConfirmationGenerator } from "@/components/generators/commercial-leasing/TourConfirmationGenerator";
import { LeaseRenewalProposalGenerator } from "@/components/generators/commercial-leasing/LeaseRenewalProposalGenerator";
import { SubleaseBlurbGenerator } from "@/components/generators/commercial-leasing/SubleaseBlurbGenerator";
import { EscalationExplainerGenerator } from "@/components/generators/commercial-leasing/EscalationExplainerGenerator";
import { CAMSummaryGenerator } from "@/components/generators/commercial-leasing/CAMSummaryGenerator";
import { SpaceProgrammingGenerator } from "@/components/generators/commercial-leasing/SpaceProgrammingGenerator";

// Residential
import BuyerNeedsAnalysisGenerator from "@/components/generators/residential/BuyerNeedsAnalysisGenerator";
import NeighborhoodGuideGenerator from "@/components/generators/residential/NeighborhoodGuideGenerator";
import OpenHouseFollowUpGenerator from "@/components/generators/residential/OpenHouseFollowUpGenerator";
import RentalApplicationSummaryGenerator from "@/components/generators/residential/RentalApplicationSummaryGenerator";
import SellerNetSheetGenerator from "@/components/generators/residential/SellerNetSheetGenerator";
import BuyerOfferLetterGenerator from "@/components/generators/residential/BuyerOfferLetterGenerator";
import RentalListingGenerator from "@/components/generators/residential/RentalListingGenerator";
import TenantWelcomeLetterGenerator from "@/components/generators/residential/TenantWelcomeLetterGenerator";
import LeaseViolationNoticeGenerator from "@/components/generators/residential/LeaseViolationNoticeGenerator";
import ShowingFeedbackSummaryGenerator from "@/components/generators/residential/ShowingFeedbackSummaryGenerator";
import PriceReductionMemoGenerator from "@/components/generators/residential/PriceReductionMemoGenerator";
import BuildingAmenityGuideGenerator from "@/components/generators/residential/BuildingAmenityGuideGenerator";

// Analytics
import PipelineHealthGenerator from "@/components/generators/analytics/PipelineHealthGenerator";
import LeadScoringGenerator from "@/components/generators/analytics/LeadScoringGenerator";
import CommissionForecastGenerator from "@/components/generators/analytics/CommissionForecastGenerator";
import WeeklyActivityDigestGenerator from "@/components/generators/analytics/WeeklyActivityDigestGenerator";
import PerformanceInsightsGenerator from "@/components/generators/analytics/PerformanceInsightsGenerator";
import DealRiskAssessmentGenerator from "@/components/generators/analytics/DealRiskAssessmentGenerator";

type DivisionFilter = Division | "all";

const generatorComponents: Record<string, React.ComponentType<{ onBack: () => void }>> = {
  // Existing live generators
  "om-generator": OMGenerator,
  "lease-summary": LeaseSummaryGenerator,
  "email-generator": EmailGenerator,
  "property-description": PropertyDescriptionGenerator,
  "cma-generator": CMAGenerator,
  "follow-up-email": FollowUpEmailGenerator,
  "deal-summary": DealSummaryGenerator,
  "listing-teaser": ListingTeaserGenerator,
  // Universal
  "client-thank-you": ClientThankYouGenerator,
  "meeting-prep": MeetingPrepGenerator,
  "objection-handler": ObjectionHandlerGenerator,
  "social-media-post": SocialMediaPostGenerator,
  "cold-call-script": ColdCallScriptGenerator,
  "agent-bio": AgentBioGenerator,
  "market-update-email": MarketUpdateEmailGenerator,
  // Investment Sales
  "investment-thesis": InvestmentThesisGenerator,
  "comp-narrative": CompNarrativeGenerator,
  "noi-pro-forma": NOIProFormaGenerator,
  "rent-roll-analyzer": RentRollAnalyzerGenerator,
  "1031-exchange-brief": Exchange1031BriefGenerator,
  "buyer-match-letter": BuyerMatchLetterGenerator,
  "seller-pitch-deck": SellerPitchDeckGenerator,
  "due-diligence-checklist": DueDiligenceChecklistGenerator,
  "investment-comparison": InvestmentComparisonGenerator,
  "cap-rate-justification": CapRateJustificationGenerator,
  "portfolio-analysis": PortfolioAnalysisGenerator,
  "disposition-strategy": DispositionStrategyGenerator,
  // Commercial Leasing
  "loi-generator": LOIGenerator,
  "tenant-proposal": TenantProposalGenerator,
  "space-comparison": SpaceComparisonGenerator,
  "lease-abstract": LeaseAbstractGenerator,
  "ti-scope": TIScopeGenerator,
  "landlord-pitch": LandlordPitchGenerator,
  "tour-confirmation": TourConfirmationGenerator,
  "lease-renewal-proposal": LeaseRenewalProposalGenerator,
  "sublease-blurb": SubleaseBlurbGenerator,
  "escalation-explainer": EscalationExplainerGenerator,
  "cam-summary": CAMSummaryGenerator,
  "space-programming": SpaceProgrammingGenerator,
  // Residential
  "buyer-needs-analysis": BuyerNeedsAnalysisGenerator,
  "neighborhood-guide": NeighborhoodGuideGenerator,
  "open-house-follow-up": OpenHouseFollowUpGenerator,
  "rental-application-summary": RentalApplicationSummaryGenerator,
  "seller-net-sheet": SellerNetSheetGenerator,
  "buyer-offer-letter": BuyerOfferLetterGenerator,
  "rental-listing": RentalListingGenerator,
  "tenant-welcome-letter": TenantWelcomeLetterGenerator,
  "lease-violation-notice": LeaseViolationNoticeGenerator,
  "showing-feedback-summary": ShowingFeedbackSummaryGenerator,
  "price-reduction-memo": PriceReductionMemoGenerator,
  "building-amenity-guide": BuildingAmenityGuideGenerator,
  // Analytics
  "pipeline-health": PipelineHealthGenerator,
  "lead-scoring": LeadScoringGenerator,
  "commission-forecast": CommissionForecastGenerator,
  "weekly-activity-digest": WeeklyActivityDigestGenerator,
  "performance-insights": PerformanceInsightsGenerator,
  "deal-risk-assessment": DealRiskAssessmentGenerator,
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
  const shellGenerators = filteredGenerators.filter((g) => g.status === "shell");
  const comingSoonGenerators = filteredGenerators.filter((g) => g.status === "coming-soon");

  // Recommended for current division
  const recommendedGenerators = useMemo(() => {
    return getGeneratorsForDivision(currentDivision)
      .filter((g) => g.status === "live" || g.status === "shell")
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
              <h2 className="text-xl font-light mb-2">Generator Shell</h2>
              <p className="text-muted-foreground">
                This generator is ready to be implemented. Check back soon!
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
              {generatorRegistry.length} AI-powered tools to supercharge your productivity
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

        {/* Shell Generators (Ready to Implement) */}
        {shellGenerators.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-500" />
              Ready to Use ({shellGenerators.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shellGenerators.map((generator) => (
                <GeneratorCard 
                  key={generator.id} 
                  generator={generator} 
                  onClick={() => setActiveGenerator(generator.id)}
                  isShell
                />
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        {comingSoonGenerators.length > 0 && (
          <div>
            <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Coming Soon ({comingSoonGenerators.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {comingSoonGenerators.map((generator) => (
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
  isShell?: boolean;
}

const GeneratorCard = ({ generator, onClick, disabled, isShell }: GeneratorCardProps) => {
  const Icon = generator.icon;

  return (
    <Card
      className={`glass-card border-white/10 transition-all ${
        disabled 
          ? "opacity-60" 
          : "cursor-pointer hover:bg-white/10 group"
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
            disabled ? "bg-muted/20" : isShell ? "bg-yellow-500/20" : "bg-primary/20"
          }`}>
            <Icon className={`h-5 w-5 ${
              disabled ? "text-muted-foreground" : isShell ? "text-yellow-500" : "text-primary"
            }`} />
          </div>
          {disabled ? (
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          ) : isShell ? (
            <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-500">New</Badge>
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
