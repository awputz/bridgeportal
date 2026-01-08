import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Trash2, Clock, BarChart2 } from "lucide-react";
import {
  useCalendarTemplates,
  useCreateCalendarTemplate,
  useUpdateCalendarTemplate,
  useDeleteCalendarTemplate,
  CalendarTemplate,
  TemplateData,
} from "@/hooks/useCalendarTemplates";
import { cn } from "@/lib/utils";

interface TemplatesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplatesSheet({ open, onOpenChange }: TemplatesSheetProps) {
  const { data: templates, isLoading } = useCalendarTemplates();
  const createTemplate = useCreateCalendarTemplate();
  const updateTemplate = useUpdateCalendarTemplate();
  const deleteTemplate = useDeleteCalendarTemplate();

  const [editingTemplate, setEditingTemplate] = useState<CalendarTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    title_pattern: "",
    duration: 60,
    event_type: "meeting",
    color: "#039be5",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      title_pattern: "",
      duration: 60,
      event_type: "meeting",
      color: "#039be5",
    });
    setEditingTemplate(null);
    setIsCreating(false);
  };

  const handleEdit = (template: CalendarTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      title_pattern: template.template_data.title_pattern || "",
      duration: template.template_data.duration || 60,
      event_type: template.template_data.event_type || "meeting",
      color: template.template_data.color || "#039be5",
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    const templateData: TemplateData = {
      title_pattern: formData.title_pattern,
      duration: formData.duration,
      event_type: formData.event_type,
      color: formData.color,
    };

    if (editingTemplate) {
      await updateTemplate.mutateAsync({
        id: editingTemplate.id,
        name: formData.name,
        description: formData.description,
        template_data: templateData,
      });
    } else {
      await createTemplate.mutateAsync({
        name: formData.name,
        description: formData.description,
        template_data: templateData,
      });
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteTemplate.mutateAsync(id);
  };

  const eventTypes = [
    { value: "meeting", label: "Meeting" },
    { value: "showing", label: "Property Showing" },
    { value: "call", label: "Call" },
    { value: "focus_time", label: "Focus Time" },
    { value: "other", label: "Other" },
  ];

  const durations = [15, 30, 45, 60, 90, 120];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Event Templates</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isCreating ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Client Meeting"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Title Pattern</Label>
                <Input
                  value={formData.title_pattern}
                  onChange={(e) => setFormData({ ...formData, title_pattern: e.target.value })}
                  placeholder="e.g., Meeting with {client}"
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{client}"}, {"{property}"} as placeholders
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(v) => setFormData({ ...formData, duration: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d} min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(v) => setFormData({ ...formData, event_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {["#039be5", "#7986cb", "#33b679", "#8e24aa", "#f6bf26", "#e67c73"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        formData.color === color ? "border-foreground scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={!formData.name}>
                  {editingTemplate ? "Update" : "Create"} Template
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button onClick={() => setIsCreating(true)} className="w-full mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>

              <Separator className="my-4" />

              <ScrollArea className="h-[calc(100vh-300px)]">
                {isLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    Loading templates...
                  </div>
                ) : templates && templates.length > 0 ? (
                  <div className="space-y-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div
                          className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: template.template_data.color || "#039be5" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{template.name}</span>
                            {template.is_shared && (
                              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                Shared
                              </span>
                            )}
                          </div>
                          {template.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {template.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {template.template_data.duration || 60} min
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart2 className="h-3 w-3" />
                              Used {template.usage_count}x
                            </span>
                          </div>
                        </div>
                        {!template.is_shared && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(template)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDelete(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No templates yet
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
