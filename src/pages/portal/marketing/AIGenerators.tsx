import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Image, 
  Mail, 
  FileText, 
  Presentation, 
  Loader2, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft,
  Wand2,
  FolderPlus 
} from "lucide-react";
import { toast } from "sonner";
import { useCreateMarketingProject } from "@/hooks/marketing/useMarketingProjects";
import { SaveProjectDialog } from "@/components/marketing/SaveProjectDialog";
import { 
  SocialPostForm, 
  SocialPostFormData,
  FlyerForm, 
  FlyerFormData,
  EmailForm, 
  EmailFormData,
  PresentationForm, 
  PresentationFormData,
  isSocialPostFormValid,
  isFlyerFormValid,
  isEmailFormValid,
  isPresentationFormValid,
} from "@/components/marketing/forms";
import { getPromptForProjectType, MARKETING_SYSTEM_PROMPT } from "@/lib/marketingPrompts";

type GeneratorType = "social-post" | "email" | "flyer" | "presentation";

interface Generator {
  id: GeneratorType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const generators: Generator[] = [
  { id: "social-post", name: "Social Media", description: "Generate engaging social posts", icon: Image, color: "bg-pink-500/20 text-pink-400" },
  { id: "email", name: "Email", description: "Create professional emails", icon: Mail, color: "bg-violet-500/20 text-violet-400" },
  { id: "flyer", name: "Flyer", description: "Design property marketing", icon: FileText, color: "bg-indigo-500/20 text-indigo-400" },
  { id: "presentation", name: "Presentation", description: "Build pitch decks", icon: Presentation, color: "bg-cyan-500/20 text-cyan-400" },
];

type FormDataMap = {
  "social-post": Partial<SocialPostFormData>;
  email: Partial<EmailFormData>;
  flyer: Partial<FlyerFormData>;
  presentation: Partial<PresentationFormData>;
};

type GeneratedContentMap = {
  [K in GeneratorType]: string;
};

const AIGenerators = () => {
  const navigate = useNavigate();
  const createProject = useCreateMarketingProject();
  
  const [activeTab, setActiveTab] = useState<GeneratorType>("social-post");
  const [formData, setFormData] = useState<FormDataMap>({
    "social-post": {},
    email: {},
    flyer: {},
    presentation: {},
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentMap>({
    "social-post": "",
    email: "",
    flyer: "",
    presentation: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSaveAsProject = async (name: string) => {
    try {
      const project = await createProject.mutateAsync({
        name,
        type: activeTab,
        design_data: {
          formData: formData[activeTab],
          generatedContent: generatedContent[activeTab],
        },
      });
      
      toast.success("Project saved successfully!");
      setSaveDialogOpen(false);
      navigate(`/portal/marketing/edit/${project.id}`);
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  const updateFormData = <T extends GeneratorType>(type: T, data: FormDataMap[T]) => {
    setFormData(prev => ({ ...prev, [type]: data }));
  };

  const isFormValid = (): boolean => {
    switch (activeTab) {
      case "social-post":
        return isSocialPostFormValid(formData["social-post"] as SocialPostFormData);
      case "email":
        return isEmailFormValid(formData.email as EmailFormData);
      case "flyer":
        return isFlyerFormValid(formData.flyer as FlyerFormData);
      case "presentation":
        return isPresentationFormValid(formData.presentation as PresentationFormData);
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(prev => ({ ...prev, [activeTab]: "" }));

    try {
      abortControllerRef.current = new AbortController();
      
      const prompt = getPromptForProjectType(activeTab, formData[activeTab]);
      
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
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please wait a moment and try again.");
          return;
        }
        if (response.status === 402) {
          toast.error("AI credits exhausted. Please add more credits.");
          return;
        }
        throw new Error("Failed to generate content");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              setGeneratedContent(prev => ({ ...prev, [activeTab]: fullContent }));
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      toast.success("Content generated successfully!");
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      console.error("Generation error:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopy = async () => {
    const content = generatedContent[activeTab];
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const content = generatedContent[activeTab];
    if (!content) return;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-content.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully!");
  };

  const renderForm = () => {
    switch (activeTab) {
      case "social-post":
        return (
          <SocialPostForm
            data={formData["social-post"] as SocialPostFormData}
            onChange={(data) => updateFormData("social-post", data)}
          />
        );
      case "email":
        return (
          <EmailForm
            data={formData.email as EmailFormData}
            onChange={(data) => updateFormData("email", data)}
          />
        );
      case "flyer":
        return (
          <FlyerForm
            data={formData.flyer as FlyerFormData}
            onChange={(data) => updateFormData("flyer", data)}
          />
        );
      case "presentation":
        return (
          <PresentationForm
            data={formData.presentation as PresentationFormData}
            onChange={(data) => updateFormData("presentation", data)}
          />
        );
      default:
        return null;
    }
  };

  const currentContent = generatedContent[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/portal/marketing">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-purple-400" />
            AI Generators
          </h1>
          <p className="text-muted-foreground text-sm">
            Create professional marketing content with AI
          </p>
        </div>
      </div>

      {/* Generator Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {generators.map((generator) => {
          const Icon = generator.icon;
          const isActive = activeTab === generator.id;
          return (
            <Card
              key={generator.id}
              className={`cursor-pointer transition-all duration-200 hover:border-white/20 ${
                isActive ? "border-white/30 bg-white/5" : "border-white/10"
              }`}
              onClick={() => setActiveTab(generator.id)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`p-2 rounded-lg ${generator.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{generator.name}</p>
                  <p className="text-xs text-muted-foreground hidden md:block">
                    {generator.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <Card className="border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              {(() => {
                const gen = generators.find(g => g.id === activeTab);
                const Icon = gen?.icon || Sparkles;
                return (
                  <>
                    <Icon className="h-5 w-5" />
                    {gen?.name} Details
                  </>
                );
              })()}
            </CardTitle>
            <CardDescription>
              Fill in the details to generate your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              {renderForm()}
            </ScrollArea>
            
            <Button
              onClick={handleGenerate}
              disabled={!isFormValid() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Generated Content */}
        <Card className="border-white/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Generated Content</CardTitle>
                <CardDescription>
                  Your AI-generated marketing content
                </CardDescription>
              </div>
              {currentContent && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSaveDialogOpen(true)}
                    className="gap-1.5"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    Save as Project
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[440px]">
              {isGenerating ? (
                <div className="space-y-3">
                  {currentContent ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {currentContent}
                      <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mb-3 text-purple-400" />
                      <p className="text-sm">Generating your content...</p>
                    </div>
                  )}
                </div>
              ) : currentContent ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {currentContent}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-sm text-center">
                    Fill in the form and click "Generate with AI" to create your content
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <SaveProjectDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveAsProject}
        defaultName={`${generators.find(g => g.id === activeTab)?.name} - ${new Date().toLocaleDateString()}`}
        isLoading={createProject.isPending}
      />
    </div>
  );
};

export default AIGenerators;
