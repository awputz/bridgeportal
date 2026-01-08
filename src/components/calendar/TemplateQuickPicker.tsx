import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, Clock, MapPin } from "lucide-react";
import { useCalendarTemplates, useIncrementTemplateUsage, TemplateData } from "@/hooks/useCalendarTemplates";

interface TemplateQuickPickerProps {
  onSelect: (template: TemplateData & { name: string }) => void;
}

export function TemplateQuickPicker({ onSelect }: TemplateQuickPickerProps) {
  const { data: templates, isLoading } = useCalendarTemplates();
  const incrementUsage = useIncrementTemplateUsage();
  const [open, setOpen] = useState(false);

  const handleSelect = (template: { id: string; name: string; template_data: TemplateData }) => {
    incrementUsage.mutate(template.id);
    onSelect({ ...template.template_data, name: template.name });
    setOpen(false);
  };

  const getEventTypeColor = (eventType?: string) => {
    switch (eventType) {
      case "focus_time": return "bg-purple-500";
      case "meeting": return "bg-blue-500";
      case "showing": return "bg-cyan-500";
      case "call": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Use Template
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Quick Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading templates...
          </div>
        ) : templates && templates.length > 0 ? (
          templates.slice(0, 6).map((template) => (
            <DropdownMenuItem
              key={template.id}
              onClick={() => handleSelect(template)}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <div
                className={`w-3 h-3 rounded-full mt-1 shrink-0 ${getEventTypeColor(template.template_data.event_type)}`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{template.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  {template.template_data.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {template.template_data.duration} min
                    </span>
                  )}
                  {template.template_data.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {template.template_data.location}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No templates available
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
