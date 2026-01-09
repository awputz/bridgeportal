import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Plus, ImageIcon, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRecentProjects, useCreateMarketingProject, useAddImageToProject } from "@/hooks/marketing/useMarketingProjects";
import { format } from "date-fns";

interface UseInProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageName?: string;
}

const PROJECT_TYPES = [
  { value: "social-post", label: "Social Media Post" },
  { value: "flyer", label: "Property Flyer" },
  { value: "email", label: "Email Campaign" },
  { value: "presentation", label: "Presentation" },
];

export function UseInProjectDialog({
  open,
  onOpenChange,
  imageUrl,
  imageName,
}: UseInProjectDialogProps) {
  const navigate = useNavigate();
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectType, setNewProjectType] = useState<string>("social-post");
  
  const { data: recentProjects, isLoading } = useRecentProjects(8);
  const createProject = useCreateMarketingProject();
  const addImageToProject = useAddImageToProject();

  const handleAddToExisting = async (projectId: string) => {
    try {
      await addImageToProject.mutateAsync({
        projectId,
        imageUrl,
      });
      onOpenChange(false);
      navigate(`/portal/marketing/edit/${projectId}`);
    } catch (error) {
      console.error("Failed to add image to project:", error);
    }
  };

  const handleCreateNew = async () => {
    if (!newProjectName.trim()) return;

    try {
      const project = await createProject.mutateAsync({
        name: newProjectName.trim(),
        type: newProjectType,
        design_data: {
          featured_image: imageUrl,
          staged_image: imageUrl,
        },
      });
      onOpenChange(false);
      navigate(`/portal/marketing/edit/${project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Use in Marketing Project
          </DialogTitle>
          <DialogDescription>
            Add this staged image to an existing project or create a new one
          </DialogDescription>
        </DialogHeader>

        {/* Image Preview */}
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className="w-16 h-16 rounded-md overflow-hidden bg-background border">
            <img
              src={imageUrl}
              alt={imageName || "Staged image"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {imageName || "Staged Image"}
            </p>
            <p className="text-xs text-muted-foreground">
              Ready to use in marketing materials
            </p>
          </div>
        </div>

        {/* Existing Projects */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Add to Existing Project</Label>
          <ScrollArea className="h-[140px] rounded-md border">
            {isLoading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : recentProjects && recentProjects.length > 0 ? (
              <div className="p-2 space-y-1">
                {recentProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleAddToExisting(project.id)}
                    disabled={addImageToProject.isPending}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {project.type.replace("-", " ")} • {format(new Date(project.updated_at), "MMM d")}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No existing projects
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            Or create new
          </span>
        </div>

        {/* Create New Project */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="project-type" className="text-xs">Type</Label>
              <Select value={newProjectType} onValueChange={setNewProjectType}>
                <SelectTrigger id="project-type" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="project-name" className="text-xs">Name</Label>
              <Input
                id="project-name"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            disabled={!newProjectName.trim() || createProject.isPending}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {createProject.isPending ? "Creating..." : "Create & Add Image"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
