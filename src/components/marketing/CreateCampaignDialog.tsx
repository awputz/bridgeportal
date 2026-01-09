import { useState } from "react";
import { useCreateEmailCampaign } from "@/hooks/marketing/useEmailCampaigns";
import { useMarketingProjects } from "@/hooks/marketing/useMarketingProjects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, FileText } from "lucide-react";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export function CreateCampaignDialog({ open, onOpenChange, projectId }: CreateCampaignDialogProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");

  const { data: projects } = useMarketingProjects();
  const emailProjects = projects?.filter((p) => p.type === "email") || [];
  
  const createMutation = useCreateEmailCampaign();

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    const project = projects?.find((p) => p.id === projectId);
    if (project) {
      setName(project.name);
      const designData = project.design_data as Record<string, unknown> | null;
      if (designData?.subject) {
        setSubject(designData.subject as string);
      }
      if (designData?.generated_content) {
        setContent(designData.generated_content as string);
      }
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    await createMutation.mutateAsync({
      name: name.trim(),
      subject: subject.trim() || undefined,
      content: content.trim() || undefined,
      template_id: undefined,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setSubject("");
    setContent("");
    setSelectedProjectId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Email Campaign</DialogTitle>
          <DialogDescription>
            Start a new email campaign or import content from a marketing project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Import from Project */}
          {emailProjects.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="project">Import from Project (Optional)</Label>
              <Select value={selectedProjectId} onValueChange={handleProjectChange}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project to import" />
                </SelectTrigger>
                <SelectContent>
                  {emailProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Importing will pre-fill the campaign with the project's content
              </p>
            </div>
          )}

          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name *</Label>
            <Input
              id="campaign-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Q1 Newsletter"
            />
          </div>

          {/* Subject Line */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your exciting email subject..."
            />
          </div>

          {/* Content Preview */}
          <div className="space-y-2">
            <Label htmlFor="content">Content Preview</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Email content will appear here..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              You can edit the full content after creating the campaign
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Create Campaign
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
