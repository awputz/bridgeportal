import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";
import { useHREmailTemplates, HREmailTemplate } from "@/hooks/hr/useHREmailTemplates";

interface EmailTemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: HREmailTemplate | null;
}

const MERGE_TAGS = [
  { tag: "{{agent_name}}", label: "Agent Name" },
  { tag: "{{current_brokerage}}", label: "Current Brokerage" },
  { tag: "{{division}}", label: "Division" },
  { tag: "{{company_name}}", label: "Company Name" },
  { tag: "{{sender_name}}", label: "Sender Name" },
  { tag: "{{interview_date}}", label: "Interview Date" },
  { tag: "{{interview_time}}", label: "Interview Time" },
  { tag: "{{interview_location}}", label: "Interview Location" },
  { tag: "{{position}}", label: "Position" },
  { tag: "{{commission_split}}", label: "Commission Split" },
  { tag: "{{start_date}}", label: "Start Date" },
];

const TEMPLATE_TYPES = [
  { value: "outreach", label: "Outreach" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "follow-up", label: "Follow-up" },
  { value: "custom", label: "Custom" },
];

export function EmailTemplateEditor({ open, onOpenChange, template }: EmailTemplateEditorProps) {
  const { createTemplate, updateTemplate } = useHREmailTemplates();
  const isEditing = !!template;

  const [name, setName] = useState(template?.name || "");
  const [subject, setSubject] = useState(template?.subject || "");
  const [body, setBody] = useState(template?.body || "");
  const [templateType, setTemplateType] = useState(template?.template_type || "custom");

  const insertMergeTag = (tag: string, target: "subject" | "body") => {
    if (target === "subject") {
      setSubject((prev) => prev + tag);
    } else {
      setBody((prev) => prev + tag);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !subject.trim() || !body.trim()) return;

    const data = {
      name: name.trim(),
      subject: subject.trim(),
      body: body.trim(),
      template_type: templateType,
    };

    if (isEditing && template) {
      updateTemplate.mutate({ id: template.id, ...data }, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else {
      createTemplate.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
          setName("");
          setSubject("");
          setBody("");
          setTemplateType("custom");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sidebar border-border/40 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-light flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            {isEditing ? "Edit Template" : "Create Email Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Initial Outreach"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject Line</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Email Body</Label>
              <span className="text-xs text-muted-foreground">
                Click tags to insert
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {MERGE_TAGS.map((tag) => (
                <Badge
                  key={tag.tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-500/50 text-xs"
                  onClick={() => insertMergeTag(tag.tag, "body")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag.label}
                </Badge>
              ))}
            </div>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email template here..."
              className="bg-white/5 border-white/10 min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !subject.trim() || !body.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isEditing ? "Save Changes" : "Create Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
