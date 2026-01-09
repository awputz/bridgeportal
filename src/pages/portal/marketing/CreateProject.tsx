import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Wand2, Image, Mail, FileText, Presentation } from "lucide-react";

const projectTypes = [
  { value: "social-post", label: "Social Media Post", icon: Image },
  { value: "email", label: "Email Campaign", icon: Mail },
  { value: "flyer", label: "Flyer / Print", icon: FileText },
  { value: "presentation", label: "Presentation", icon: Presentation },
];

const CreateProject = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const templateId = searchParams.get("template");
  
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState(initialType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/portal/marketing/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extralight text-foreground">Create Project</h1>
          <p className="text-sm text-muted-foreground">
            {templateId ? "Starting from template" : "Start from scratch or choose a template"}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name"
                  placeholder="e.g., Spring Listing Campaign"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Project Type</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full gap-2" disabled={!projectName || !projectType}>
                <Wand2 className="h-4 w-4" />
                Start Designing
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
          <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center mb-4">
              <Wand2 className="h-8 w-8 text-pink-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Design Editor
            </h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              The visual editor will appear here. Configure your project details to get started.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Coming in Phase 3
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProject;
