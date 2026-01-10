import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wand2, Image as ImageIcon, Mail, FileText, Presentation, Star, Loader2 } from "lucide-react";
import { useMarketingTemplate } from "@/hooks/marketing/useMarketingTemplates";
import { useCreateMarketingProject } from "@/hooks/marketing/useMarketingProjects";
import { cn } from "@/lib/utils";
import type { Json } from "@/integrations/supabase/types";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const projectTypes = [
  { value: "social-post", label: "Social Media", description: "Instagram, Facebook, LinkedIn", icon: ImageIcon, color: "bg-pink-500/20 text-pink-400" },
  { value: "email", label: "Email", description: "Newsletters and campaigns", icon: Mail, color: "bg-blue-500/20 text-blue-400" },
  { value: "flyer", label: "Flyer / Print", description: "Property flyers, brochures", icon: FileText, color: "bg-emerald-500/20 text-emerald-400" },
  { value: "presentation", label: "Presentation", description: "Pitch decks, proposals", icon: Presentation, color: "bg-violet-500/20 text-violet-400" },
];

const CreateProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const templateId = searchParams.get("template") || "";
  
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState(initialType);
  
  const { data: template, isLoading: templateLoading } = useMarketingTemplate(templateId);
  const createProject = useCreateMarketingProject();
  
  // If template is loaded, use its type
  const effectiveType = template?.type || projectType;

  const handleCreateProject = async () => {
    if (!projectName || !effectiveType) return;
    
    try {
      const result = await createProject.mutateAsync({
        name: projectName,
        type: effectiveType,
        template_id: templateId || undefined,
        design_data: template?.design_data as Json | undefined,
      });
      
      // Navigate to edit page
      navigate(`/portal/marketing/edit/${result.id}`);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <MarketingLayout breadcrumbs={[{ label: "Projects", href: "/portal/marketing/projects" }, { label: "Create" }]}>
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">Create Project</h1>
        <p className="text-sm text-muted-foreground font-normal">
          {template ? `Starting from "${template.name}"` : "Start from scratch or choose a template"}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name"
                  placeholder="e.g., Spring Listing Campaign"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              
              {/* Project Type Selection - Visual Cards */}
              {!template && (
                <div className="space-y-3">
                  <Label>Project Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {projectTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = projectType === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setProjectType(type.value)}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all",
                            isSelected 
                              ? "border-primary bg-primary/5 ring-1 ring-primary" 
                              : "border-border hover:bg-muted/50"
                          )}
                        >
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-2", type.color)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="font-medium text-foreground text-sm">{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Template Info if selected */}
              {template && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-foreground">Template</p>
                    {template.is_featured && (
                      <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-foreground">{template.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {template.category} • {template.type.replace('-', ' ')}
                  </p>
                  {template.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {template.description}
                    </p>
                  )}
                </div>
              )}

              <Button 
                className="w-full gap-2" 
                disabled={!projectName || (!effectiveType && !template) || createProject.isPending}
                onClick={handleCreateProject}
              >
                {createProject.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Start Designing
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {!templateId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Or Choose a Template</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/portal/marketing/media">
                    Browse Template Library
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Preview Area */}
        <Card className="lg:min-h-[500px]">
          {templateLoading ? (
            <CardContent className="flex flex-col items-center justify-center h-full py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading template...</p>
            </CardContent>
          ) : template ? (
            <CardContent className="p-0 h-full flex flex-col">
              {/* Template Preview */}
              <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center relative">
                {template.thumbnail_url ? (
                  <img 
                    src={template.thumbnail_url} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Template Preview</p>
                  </div>
                )}
                {template.is_featured && (
                  <Badge className="absolute top-3 right-3 bg-amber-500/90">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-medium text-foreground mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground capitalize mb-4">
                  {template.category} • {template.type.replace('-', ' ')}
                </p>
                {template.description && (
                  <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                )}
                <div className="mt-auto">
                  <p className="text-xs text-muted-foreground">
                    Enter a project name and click "Start Designing" to begin customizing this template.
                  </p>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center mb-4">
                <Wand2 className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Design Editor
              </h3>
              <p className="text-muted-foreground max-w-sm mb-4">
                {projectType 
                  ? "Enter a project name to get started with the visual editor."
                  : "Select a project type to see available customization options."}
              </p>
              <p className="text-xs text-muted-foreground/70">
                Visual editor coming soon
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default CreateProject;