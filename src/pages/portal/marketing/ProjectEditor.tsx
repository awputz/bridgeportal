import { useState, useEffect, useCallback } from "react";
import type { Json } from "@/integrations/supabase/types";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Loader2, Copy, Check, Sparkles, MoreVertical, Trash2, Copy as DuplicateIcon, Download, Send, FileText, CalendarClock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  useMarketingProject, 
  useUpdateMarketingProject, 
  useDeleteMarketingProject,
  useDuplicateProject 
} from "@/hooks/marketing/useMarketingProjects";
import { useLogGeneration } from "@/hooks/marketing/useAIGenerationHistory";
import { 
  SocialPostForm, 
  FlyerForm, 
  EmailForm, 
  PresentationForm,
  isSocialPostFormValid,
  isFlyerFormValid,
  isEmailFormValid,
  isPresentationFormValid,
} from "@/components/marketing/forms";
import type { SocialPostFormData } from "@/components/marketing/forms/SocialPostForm";
import type { FlyerFormData } from "@/components/marketing/forms/FlyerForm";
import type { EmailFormData } from "@/components/marketing/forms/EmailForm";
import type { PresentationFormData } from "@/components/marketing/forms/PresentationForm";
import { getPromptForProjectType, MARKETING_SYSTEM_PROMPT } from "@/lib/marketingPrompts";
import { SchedulePostDialog } from "@/components/marketing/SchedulePostDialog";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

type FormData = SocialPostFormData | FlyerFormData | EmailFormData | PresentationFormData;

const ProjectEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: project, isLoading: projectLoading } = useMarketingProject(id || "");
  const updateProject = useUpdateMarketingProject();
  const deleteProject = useDeleteMarketingProject();
  const duplicateProject = useDuplicateProject();
  const logGeneration = useLogGeneration();
  
  const [projectName, setProjectName] = useState("");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  // Initialize form data from project
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      const designData = project.design_data as Record<string, unknown> | null;
      setFormData(designData?.formData as Record<string, unknown> || {});
      setGeneratedContent((designData?.generatedContent as string) || "");
    }
  }, [project]);

  // Auto-save debounced
  const saveProject = useCallback(async () => {
    if (!id || !project) return;
    
    setIsSaving(true);
    try {
      const newDesignData = {
        ...((project.design_data as Record<string, unknown>) || {}),
        formData,
        generatedContent,
      };
      await updateProject.mutateAsync({
        id,
        name: projectName,
        design_data: newDesignData as Json,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  }, [id, project, projectName, formData, generatedContent, updateProject]);

  // Auto-save on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (project && (projectName !== project.name || Object.keys(formData).length > 0)) {
        saveProject();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [projectName, formData, generatedContent]);

  const handleGenerate = async () => {
    if (!project) return;
    
    setIsGenerating(true);
    setGeneratedContent("");
    const startTime = Date.now();

    try {
      const prompt = getPromptForProjectType(project.type, formData);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: MARKETING_SYSTEM_PROMPT },
              { role: "user", content: prompt },
            ],
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment and try again.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to generate content");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                accumulated += content;
                setGeneratedContent(accumulated);
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      toast({
        title: "Content generated!",
        description: "Your marketing content is ready.",
      });

      // Log generation to history
      if (accumulated) {
        logGeneration.mutate({
          project_id: id,
          generator_type: project.type,
          prompt_used: prompt,
          form_data: formData,
          generated_content: accumulated,
          generation_time_ms: Date.now() - startTime,
        });
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: "Unable to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject.mutateAsync(id);
      toast({ title: "Project deleted" });
      navigate("/portal/marketing/projects");
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async () => {
    if (!id) return;
    
    try {
      const newProject = await duplicateProject.mutateAsync(id);
      toast({ title: "Project duplicated!" });
      navigate(`/portal/marketing/edit/${newProject.id}`);
    } catch (error) {
      toast({
        title: "Failed to duplicate",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkComplete = async () => {
    if (!id) return;
    
    try {
      await updateProject.mutateAsync({
        id,
        status: "completed",
      });
      toast({ title: "Project marked as complete!" });
    } catch (error) {
      toast({
        title: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    
    try {
      await updateProject.mutateAsync({
        id,
        status: "published",
      });
      toast({ title: "Project published!", description: "Your content is now live." });
    } catch (error) {
      toast({
        title: "Failed to publish",
        variant: "destructive",
      });
    }
  };

  const handleExport = (format: "txt" | "md") => {
    if (!generatedContent) return;
    
    const filename = `${projectName || "marketing-content"}.${format}`;
    let content = generatedContent;
    
    if (format === "md") {
      content = `# ${projectName}\n\n${generatedContent}`;
    }
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: `Downloaded as ${format.toUpperCase()}` });
  };

  const isFormValid = (): boolean => {
    if (!project) return false;
    switch (project.type) {
      case "social-post":
        return isSocialPostFormValid(formData as unknown as SocialPostFormData);
      case "flyer":
        return isFlyerFormValid(formData as unknown as FlyerFormData);
      case "email":
        return isEmailFormValid(formData as unknown as EmailFormData);
      case "presentation":
        return isPresentationFormValid(formData as unknown as PresentationFormData);
      default:
        return true;
    }
  };

  const renderForm = () => {
    if (!project) return null;

    const handleFormChange = (data: FormData) => {
      setFormData(data as unknown as Record<string, unknown>);
    };

    switch (project.type) {
      case "social-post":
        return (
          <SocialPostForm
            data={formData as unknown as SocialPostFormData}
            onChange={handleFormChange}
          />
        );
      case "flyer":
        return (
          <FlyerForm
            data={formData as unknown as FlyerFormData}
            onChange={handleFormChange}
          />
        );
      case "email":
        return (
          <EmailForm
            data={formData as unknown as EmailFormData}
            onChange={handleFormChange}
          />
        );
      case "presentation":
        return (
          <PresentationForm
            data={formData as unknown as PresentationFormData}
            onChange={handleFormChange}
          />
        );
      default:
        return (
          <p className="text-muted-foreground">
            Form not available for this project type.
          </p>
        );
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "social-post": "Social Media Post",
      flyer: "Property Flyer",
      email: "Email Campaign",
      presentation: "Presentation",
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "published":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found.</p>
        <Button
          variant="link"
          onClick={() => navigate("/portal/marketing/projects")}
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <MarketingLayout breadcrumbs={[{ label: "Projects", href: "/portal/marketing/projects" }, { label: project.name }]}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-xl font-light bg-transparent border-none px-0 h-auto focus-visible:ring-0 max-w-md"
            placeholder="Project Name"
          />
          
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isSaving && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveProject} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleMarkComplete}>
                <Check className="h-4 w-4 mr-2" />
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePublish}>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <DuplicateIcon className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              {project?.type === "social-post" && generatedContent && (
                <DropdownMenuItem onClick={() => setScheduleDialogOpen(true)}>
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Schedule to Social
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport("txt")} disabled={!generatedContent}>
                <Download className="h-4 w-4 mr-2" />
                Download as TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("md")} disabled={!generatedContent}>
                <FileText className="h-4 w-4 mr-2" />
                Download as Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              {getTypeLabel(project.type)}
              <Badge variant="outline" className="font-normal">
                {project.template_id ? "From Template" : "Custom"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderForm()}

            <Button
              onClick={handleGenerate}
              disabled={!isFormValid() || isGenerating}
              className="w-full gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right Panel - Output */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Generated Content</CardTitle>
            {generatedContent && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={!isFormValid() || isGenerating}
                  className="gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Re-generate
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <ScrollArea className="h-[500px] w-full">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
                    {generatedContent}
                  </pre>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Ready to Generate
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Fill in the form on the left and click "Generate with AI" to create
                  your marketing content.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schedule Post Dialog */}
      {project?.type === "social-post" && (
        <SchedulePostDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          initialContent={generatedContent}
          projectId={id}
        />
      )}
    </MarketingLayout>
  );
};

export default ProjectEditor;
