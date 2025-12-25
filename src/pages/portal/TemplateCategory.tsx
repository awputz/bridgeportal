import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TemplateCard } from "@/components/portal/TemplateCard";
import { DivisionSelector, divisions } from "@/components/portal/DivisionSelector";
import { useAgentTemplates } from "@/hooks/useAgentTemplates";
import { Skeleton } from "@/components/ui/skeleton";

const TemplateCategory = () => {
  const { division } = useParams<{ division: string }>();
  const { data: templates, isLoading } = useAgentTemplates(division);
  
  const currentDivision = divisions.find(d => d.id === division);
  const divisionName = currentDivision?.name || "Templates";

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Back Link */}
        <Link 
          to="/portal/templates"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-light mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          All Templates
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            {divisionName}
          </h1>
          <p className="text-muted-foreground font-light">
            {currentDivision?.description || "Essential documents and templates"}
          </p>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[160px] rounded-xl" />
            ))}
          </div>
        ) : templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                name={template.name}
                description={template.description || undefined}
                fileUrl={template.file_url}
                fileType={template.file_type || "pdf"}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center mb-16">
            <p className="text-muted-foreground font-light">
              No templates available for this division yet.
            </p>
          </div>
        )}

        {/* Other Divisions */}
        <div className="border-t border-border pt-8">
          <h2 className="text-lg md:text-xl font-light text-foreground mb-4">
            Other Divisions
          </h2>
          <DivisionSelector activeDivision={division} />
        </div>
      </div>
    </div>
  );
};

export default TemplateCategory;
