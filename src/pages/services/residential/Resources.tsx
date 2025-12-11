import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useBridgeResources } from "@/hooks/useBridgeResources";
import { FileText, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Resources = () => {
  const { data: resources, isLoading } = useBridgeResources();

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Resources</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Resources & Legal
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Everything you need to know about renting, buying, or selling in New York City.
        </p>
      </div>
    </section>
  );

  const applicationResources = resources?.filter(r => r.category === 'application') || [];
  const legalResources = resources?.filter(r => r.category === 'legal') || [];
  const tenantResources = resources?.filter(r => r.category === 'tenant') || [];
  const landlordResources = resources?.filter(r => r.category === 'landlord') || [];
  const buyerResources = resources?.filter(r => r.category === 'buyer') || [];

  const ResourceCard = ({ resource }: { resource: typeof resources extends (infer T)[] | undefined ? T : never }) => (
    <div className="bg-secondary/20 rounded-lg p-6 border border-border">
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
          {resource.short_description && (
            <p className="text-sm text-muted-foreground mb-4">{resource.short_description}</p>
          )}
          {resource.body_content && (
            <div className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
              {resource.body_content}
            </div>
          )}
          {resource.external_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                View Resource <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Application Requirements */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Application Requirements
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Standard requirements for rental applications in New York City.
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {applicationResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}

          {/* Quick Requirements List */}
          <div className="mt-12 bg-primary/5 rounded-lg p-8 border border-primary/20">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Standard Requirements
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Combined household income of 40x monthly rent",
                "Credit score of 700+ preferred",
                "Government-issued photo ID",
                "Two most recent pay stubs",
                "Two most recent bank statements",
                "Employment verification letter",
                "Previous landlord references",
                "Completed rental application",
              ].map((req) => (
                <div key={req} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  {req}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclosures */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Legal Disclosures
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Important legal information and disclosures for NYC real estate transactions.
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {legalResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Checklists */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Helpful Checklists
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Step-by-step guides for renters, buyers, and landlords.
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {[...tenantResources, ...buyerResources, ...landlordResources].map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Resources;
