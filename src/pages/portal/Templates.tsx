import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateActionCard, TemplateFillDialog } from "@/components/templates";
import { useAgentTemplates } from "@/hooks/useAgentTemplates";
import { useUserDivision } from "@/hooks/useDivisionGuard";
import type { AgentTemplate } from "@/types/templates";

const divisions = [
  { id: "investment-sales", label: "Investment Sales", icon: "📈" },
  { id: "commercial-leasing", label: "Commercial", icon: "🏢" },
  { id: "residential", label: "Residential", icon: "🏠" },
  { id: "marketing", label: "Marketing", icon: "📣" },
];

const Templates = () => {
  const { data: userDivision, isLoading: isDivisionLoading } = useUserDivision();
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fillTemplate, setFillTemplate] = useState<AgentTemplate | null>(null);
  
  // Set default division once user data loads
  useEffect(() => {
    if (userDivision?.division && !selectedDivision) {
      setSelectedDivision(userDivision.division);
    }
  }, [userDivision?.division, selectedDivision]);
  
  // Active division for fetching templates
  const activeDivision = selectedDivision || userDivision?.division || "investment-sales";
  
  const { data: templates, isLoading: isTemplatesLoading } = useAgentTemplates(activeDivision);

  // Filter templates by search
  const filteredTemplates = templates?.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine which tabs to show (admin sees all, agents see their division + marketing)
  const visibleDivisions = userDivision?.isAdmin 
    ? divisions 
    : divisions.filter(d => d.id === userDivision?.division || d.id === "marketing");

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 md:pb-8 lg:px-8">
        {/* Back Link */}
        <Link
          to="/portal/tools"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extralight text-foreground md:text-4xl lg:text-5xl">
              Templates
            </h1>
            <p className="mt-1 font-light text-muted-foreground">
              Fill in or download document templates
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Division Tabs */}
        {isDivisionLoading ? (
          <Skeleton className="mb-6 h-12 w-full max-w-md" />
        ) : (
          <Tabs
            value={activeDivision}
            onValueChange={setSelectedDivision}
            className="mb-6"
          >
            <TabsList className="h-auto flex-wrap">
              {visibleDivisions.map((div) => (
                <TabsTrigger
                  key={div.id}
                  value={div.id}
                  className="gap-1.5 px-3 py-2"
                >
                  <span>{div.icon}</span>
                  <span className="hidden sm:inline">{div.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Templates Grid */}
        {isTemplatesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : !filteredTemplates?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {searchQuery
                ? "No templates match your search."
                : "No templates available in this division."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateActionCard
                key={template.id}
                template={template}
                onFill={setFillTemplate}
              />
            ))}
          </div>
        )}

        {/* Fill Dialog */}
        <TemplateFillDialog
          template={fillTemplate}
          open={!!fillTemplate}
          onOpenChange={(open) => !open && setFillTemplate(null)}
        />
      </div>
    </div>
  );
};

export default Templates;
